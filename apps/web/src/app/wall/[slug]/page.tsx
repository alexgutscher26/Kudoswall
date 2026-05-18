import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import { db } from "@/lib/server-db";
import { project, testimonial } from "@my-better-t-app/db/schema";
import { eq, or, desc } from "drizzle-orm";
import { JsonLd } from "@/components/seo/json-ld";
import Widget from "@/components/widget";

interface WallPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const BASE_URL = "https://kudoswall.org";

export async function generateMetadata({ params }: WallPageProps) {
  const { slug } = await params;
  const projectData = await getProjectData(slug);

  if (!projectData) return {};

  const title = `Wall of Love | ${projectData.name}`;
  const description = `See what people are saying about ${projectData.name}. Real testimonials from real customers.`;
  const canonicalUrl = `${BASE_URL}/wall/${slug}`;
  const ogImageUrl = `${BASE_URL}/api/og?slug=${slug}&type=wall`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Wall of Love for ${projectData.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

const getProjectByCollectionSlug = unstable_cache(
  async (slug: string) => {
    const result = await db.query.project.findFirst({
      where: or(eq(project.collectionSlug, slug), eq(project.slug, slug)),
      with: {
        workspace: {
          with: { organization: true },
        },
        testimonials: {
          where: eq(testimonial.status, "approved"),
          orderBy: [desc(testimonial.createdAt)],
        },
      },
    });

    if (!result) return null;

    const effectivePlan = result.workspace.organization?.plan || result.workspace.plan;
    const isPro = effectivePlan !== "free" && effectivePlan !== null;

    const badgeRemovedUntil = (result.workspace as any).badgeRemovedUntil;
    const isBadgeRemoved = badgeRemovedUntil ? new Date(badgeRemovedUntil) > new Date() : false;

    // Use default widget-like settings for the public wall
    const wallSettings = {
      layout: "masonry" as const,
      theme: "light" as const,
      accentColor: "#e8527a",
      backgroundColor: "transparent",
      showRating: true,
      showReviewerPhoto: true,
      showReviewerCompany: true,
      showDate: true,
      cardBorderRadius: "large" as const,
      cardShadow: "medium" as const,
      columnsOverride: null,
      hideBadge: false,
      animation: "fade" as const,
      truncateText: "off" as const,
      maxItems: 100,
      filterTags: [],
      filterMinRating: 0,
      filterType: "all" as const,
      headerTitle: "Wall of Love",
      headerAutoStats: true,
      hideHeader: false,
    };

    return {
      ...result,
      wallSettings,
      workspace: {
        ...result.workspace,
        isPro,
        isBadgeRemoved,
      },
    };
  },
  ["wall-project"],
  { revalidate: 600, tags: ["collection", "wall"] },
);

async function getProjectData(slug: string) {
  return getProjectByCollectionSlug(slug);
}

export default async function WallPage({ params }: WallPageProps) {
  const { slug } = await params;
  const projectData = await getProjectData(slug);

  if (!projectData) {
    notFound();
  }

  const { testimonials, workspace, wallSettings } = projectData;

  // SEO: Structured Data (Product + Reviews)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: projectData.name,
    description: `Wall of Love for ${projectData.name}. ${testimonials.length} real customer testimonials.`,
    image: workspace.logoUrl,
    brand: {
      "@type": "Brand",
      name: workspace.name,
    },
    aggregateRating:
      testimonials.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: (
              testimonials.reduce((acc, current) => acc + (current.rating || 5), 0) /
              testimonials.length
            ).toFixed(1),
            reviewCount: testimonials.length,
            bestRating: "5",
            worstRating: "1",
          }
        : undefined,
    review: testimonials.map((t) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: t.authorName || "Anonymous",
      },
      datePublished: t.createdAt.toISOString(),
      reviewBody: t.content || "",
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating || 5,
        bestRating: "5",
        worstRating: "1",
      },
      publisher: {
        "@type": "Organization",
        name: workspace.name,
      },
    })),
  };

  // SEO: ItemList Schema
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Testimonials for ${projectData.name}`,
    numberOfItems: testimonials.length,
    itemListElement: testimonials.map((t, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: t.authorName || "Anonymous",
        },
        datePublished: t.createdAt.toISOString(),
        reviewBody: t.content || "",
        reviewRating: {
          "@type": "Rating",
          ratingValue: t.rating || 5,
        },
      },
    })),
  };

  const widgetData = {
    id: `wall-${projectData.id}`,
    name: projectData.name,
    settings: wallSettings,
    isPro: workspace.isPro,
    isBadgeRemoved: workspace.isBadgeRemoved,
    workspaceId: workspace.id,
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={itemListJsonLd} />

      <main className="min-h-screen bg-[#fafafa] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-16 text-center">
            {workspace.logoUrl && (
              <Image
                src={workspace.logoUrl}
                alt={workspace.name}
                width={80}
                height={80}
                className="mx-auto mb-6 h-20 w-20 rounded-3xl border border-neutral-100 bg-white p-2 shadow-sm"
              />
            )}
            <h1 className="text-4xl font-black tracking-tight text-neutral-900 sm:text-6xl">
              Wall of Love
            </h1>
            <p className="mt-4 text-xl font-medium text-neutral-500">
              See why customers choose {projectData.name}
            </p>
          </div>

          {/* Wall Content */}
          <div className="rounded-[40px] border border-neutral-100 bg-white p-8 shadow-xl shadow-neutral-100/50 sm:p-12">
            <Widget data={widgetData as any} testimonials={testimonials as any} />
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-sm font-medium text-neutral-400">
              Want a wall like this for your product?{" "}
              <a href="https://kudoswall.org" className="text-pink-500 hover:underline">
                Get started for free
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
