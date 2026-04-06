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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TestimonialWall",
    url: "https://testimonialwall.com",
    logo: "https://testimonialwall.com/favicon.ico",
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
