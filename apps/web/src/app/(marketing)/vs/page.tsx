import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { COMPETITORS } from "@/lib/competitor-data";
import { ArrowRight, Star } from "lucide-react";
import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";

export const metadata: Metadata = {
  title: "KudosWall vs Competitors: Compare Testimonial Software",
  description:
    "See how KudosWall stacks up against Senja, Testimonial.to, Vouch, and more. Transparent comparisons on pricing, features, and limits.",
};

export default function VsHubPage() {
  const baseUrl = "https://kudoswall.org";
  const breadcrumbs = [
    { name: "Home", url: baseUrl },
    { name: "Comparisons", url: `${baseUrl}/vs` },
  ];

  return (
    <div className="bg-background min-h-screen">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-32">
        <h1 className="mb-6 text-5xl font-black">KudosWall vs Everyone</h1>
        <p className="text-muted-foreground mb-16 max-w-2xl text-xl">
          We don't hide from competition. Here is an honest look at how we compare to the biggest
          players in the social proof space.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {COMPETITORS.map((c) => (
            <Link
              key={c.slug}
              href={`/vs/${c.slug}`}
              className="group hover:border-primary bg-muted/10 hover:bg-muted/30 rounded-3xl border p-8 transition-all"
            >
              <div className="mb-4 flex items-start justify-between">
                <h2 className="text-2xl font-bold">{c.name}</h2>
                <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-muted-foreground mb-6 line-clamp-2">{c.headline}</p>
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="bg-primary/10 text-primary rounded-full px-3 py-1">
                  Compare Limits
                </span>
                <span className="text-muted-foreground italic">Honest Assessment</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
