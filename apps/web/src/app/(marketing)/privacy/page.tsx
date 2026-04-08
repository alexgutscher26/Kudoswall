import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | KudosWall",
  description: "Read our privacy policy to understand how we handle your data.",
};

export default function PrivacyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://kudoswall.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Privacy Policy",
        item: "https://kudoswall.org/privacy",
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <h1 className="mb-6 text-4xl font-bold text-neutral-900">Privacy Policy</h1>
      <p className="mb-4 text-sm text-neutral-500">Last updated: {new Date().getFullYear()}</p>
      <p className="leading-relaxed text-neutral-600">
        This is a placeholder privacy policy for KudosWall. Full policy coming soon.
      </p>
    </main>
  );
}
