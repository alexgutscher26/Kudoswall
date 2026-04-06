import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | TestimonialWall",
  description: "Read our terms of service to understand our agreement.",
};

export default function TermsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://testimonialwall.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Terms of Service",
        item: "https://testimonialwall.com/terms",
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <h1 className="mb-6 text-4xl font-bold text-neutral-900">Terms of Service</h1>
      <p className="mb-4 text-sm text-neutral-500">Last updated: {new Date().getFullYear()}</p>
      <p className="leading-relaxed text-neutral-600">
        This is a placeholder terms of service for TestimonialWall. Full terms coming soon.
      </p>
    </main>
  );
}
