import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "../index.css";

import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://testimonialwall.com"),
  title: "TestimonialWall — Collect & Display Customer Testimonials",
  description:
    "Collect video and text testimonials via a shareable link, then embed a beautiful, customizable widget on any website. No code required.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TestimonialWall — Collect & Display Customer Testimonials",
    description:
      "Collect video and text testimonials via a shareable link, then embed a beautiful, customizable widget on any website.",
    url: "https://testimonialwall.com",
    siteName: "TestimonialWall",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TestimonialWall - Collect Glowing Testimonials",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TestimonialWall — Collect & Display Customer Testimonials",
    description:
      "Collect video and text testimonials via a shareable link, then embed a beautiful, customizable widget.",
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://testimonialwall.com/#organization",
        name: "TestimonialWall",
        url: "https://testimonialwall.com",
        logo: "https://testimonialwall.com/favicon.ico",
        sameAs: [
          "https://twitter.com/testimonialwall",
          "https://linkedin.com/company/testimonialwall",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://testimonialwall.com/#website",
        url: "https://testimonialwall.com",
        name: "TestimonialWall",
        publisher: { "@id": "https://testimonialwall.com/#organization" },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: "https://testimonialwall.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: "TestimonialWall",
        operatingSystem: "Windows, macOS, Linux, Android, iOS",
        applicationCategory: "BusinessApplication",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "1200",
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
