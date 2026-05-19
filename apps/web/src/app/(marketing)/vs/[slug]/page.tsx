import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import VsCompetitorTemplate from "@/components/vs-competitor-template";
import { COMPETITORS } from "@/lib/competitor-data";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return COMPETITORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const competitor = COMPETITORS.find((c) => c.slug === slug);

  if (!competitor) return {};

  const baseUrl = "https://kudoswall.org";

  return {
    title: competitor.headline,
    description: `Comparing KudosWall and ${competitor.name}. ${competitor.headline}. Discover why founders are switching for better social proof and 50 free testimonials.`,
    alternates: {
      canonical: `${baseUrl}/vs/${slug}`,
    },
    openGraph: {
      title: competitor.headline,
      description: `Deep dive comparison into features, pricing, and performance between KudosWall and ${competitor.name}.`,
      images: [`${baseUrl}/og/vs-${slug}.png`],
      url: `${baseUrl}/vs/${slug}`,
    },
  };
}

export default async function VsPage({ params }: { params: Params }) {
  const { slug } = await params;
  const competitor = COMPETITORS.find((c) => c.slug === slug);

  if (!competitor) {
    return notFound();
  }

  const baseUrl = "https://kudoswall.org";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `KudosWall vs ${competitor.name} Comparison`,
    description: `Comparison of KudosWall and ${competitor.name} social proof tools.`,
    mainEntity: {
      "@type": "Article",
      headline: competitor.headline,
      author: {
        "@type": "Organization",
        name: "KudosWall",
      },
    },
  };

  const breadcrumbs = [
    { name: "Home", url: baseUrl },
    { name: "Comparisons", url: `${baseUrl}/vs` },
    { name: `KudosWall vs ${competitor.name}`, url: `${baseUrl}/vs/${slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <Script
        id="json-ld-vs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VsCompetitorTemplate competitor={competitor} />
    </>
  );
}
