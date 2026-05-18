import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IntegrationTemplate from "@/components/integration-template";
import { INTEGRATIONS } from "@/lib/integration-data";

type Params = Promise<{ platform: string }>;

export async function generateStaticParams() {
  return INTEGRATIONS.map((p) => ({ platform: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { platform: slug } = await params;
  const integration = INTEGRATIONS.find((i) => i.slug === slug);
  
  if (!integration) return {};

  const baseUrl = "https://kudoswall.org";

  return {
    title: integration.heroTitle,
    description: integration.heroDescription,
    alternates: {
      canonical: `${baseUrl}/embed-testimonials/${slug}`,
    },
    openGraph: {
      title: integration.heroTitle,
      description: integration.heroDescription,
      url: `${baseUrl}/embed-testimonials/${slug}`,
    },
  };
}

export default async function IntegrationPage({ params }: { params: Params }) {
  const { platform: slug } = await params;
  const integration = INTEGRATIONS.find((i) => i.slug === slug);

  if (!integration) {
    return notFound();
  }

  return <IntegrationTemplate integration={integration} />;
}
