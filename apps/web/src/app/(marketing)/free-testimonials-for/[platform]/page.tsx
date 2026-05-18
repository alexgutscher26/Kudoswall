import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FreePlatformTemplate from "@/components/free-platform-template";
import { PLATFORM_PAGES } from "@/lib/platform-pages";

type Params = Promise<{ platform: string }>;

export async function generateStaticParams() {
  return PLATFORM_PAGES.map((p) => ({ platform: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { platform: slug } = await params;
  const platform = PLATFORM_PAGES.find((p) => p.slug === slug);

  if (!platform) return {};

  const baseUrl = "https://kudoswall.org";

  return {
    title: platform.heroTitle,
    description: `Get a free testimonial widget for ${platform.name}. 50 testimonials included, native video support, and 5-minute setup. Best social proof tool for ${platform.name} sites.`,
    alternates: {
      canonical: `${baseUrl}/free-testimonials-for/${slug}`,
    },
    openGraph: {
      title: platform.heroTitle,
      description: `Deep dive into the best free testimonial tool for ${platform.name} users.`,
      url: `${baseUrl}/free-testimonials-for/${slug}`,
    },
  };
}

export default async function FreePlatformPage({ params }: { params: Params }) {
  const { platform: slug } = await params;
  const platform = PLATFORM_PAGES.find((p) => p.slug === slug);

  if (!platform) {
    return notFound();
  }

  return <FreePlatformTemplate platform={platform} />;
}
