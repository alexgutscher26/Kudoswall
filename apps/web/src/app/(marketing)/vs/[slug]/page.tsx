import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import VsPageTemplate from "@/components/vs-page-template";
import { SENJA_COMPARISON, TESTIMONIAL_TO_COMPARISON } from "@/lib/comparisons";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return [{ slug: "senja" }, { slug: "testimonial-to" }];
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const competitor = slug === "senja" ? "Senja" : "Testimonial.to";
  const baseUrl = "https://kudoswall.org";

  return {
    title: `KudosWall vs ${competitor}: Best 2026 Comparison & Alternative`,
    description: `Comparing KudosWall and ${competitor}. Discover which social proof tool offers better automation, high-fidelity text and video testimonials, and faster widgets.`,
    alternates: {
      canonical: `${baseUrl}/vs/${slug}`,
    },
    openGraph: {
      title: `KudosWall vs ${competitor}: Which is Better?`,
      description: `Deep dive comparison into features, pricing, and performance between KudosWall and ${competitor}.`,
      images: [`${baseUrl}/og/vs-${slug}.png`],
      url: `${baseUrl}/vs/${slug}`,
    },
  };
}

export default async function VsPage({ params }: { params: Params }) {
  const { slug } = await params;
  const competitor = slug === "senja" ? "Senja" : "Testimonial.to";
  const baseUrl = "https://kudoswall.org";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `KudosWall vs ${competitor} Comparison`,
    description: `Comparison of KudosWall and ${competitor} social proof tools.`,
    mainEntity: {
      "@type": "Article",
      headline: `KudosWall vs ${competitor}: The Ultimate Comparison`,
      author: {
        "@type": "Organization",
        name: "KudosWall",
      },
    },
  };

  if (slug === "senja") {
    return (
      <>
        <Script
          id="json-ld-vs"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <VsPageTemplate
          competitorName="Senja"
          heroTitle="KudosWall vs Senja: Choose the Best Social Proof Tool"
          heroDescription="Stop overpaying for complexity. KudosWall offers the premium features you need with the simplicity you crave."
          comparisonPoints={SENJA_COMPARISON.points}
          articleContent={SENJA_COMPARISON.content}
          testimonials={SENJA_COMPARISON.testimonials}
        />
      </>
    );
  }

  if (slug === "testimonial-to") {
    return (
      <>
        <Script
          id="json-ld-vs"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <VsPageTemplate
          competitorName="Testimonial.to"
          heroTitle="KudosWall vs Testimonial.to: The Modern Alternative"
          heroDescription="Beyond a Wall of Love. Get automated collection, deeper customization, and professional branding without the video tax."
          comparisonPoints={TESTIMONIAL_TO_COMPARISON.points}
          articleContent={TESTIMONIAL_TO_COMPARISON.content}
          testimonials={TESTIMONIAL_TO_COMPARISON.testimonials}
        />
      </>
    );
  }

  return notFound();
}
