import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { INTEGRATIONS } from "@/lib/integration-data";
import { ArrowRight, Code2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Embed Testimonials: Platform Guides",
  description:
    "Step-by-step guides for embedding high-converting testimonial widgets on any website platform.",
};

export default function EmbedHubPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-32">
        <h1 className="mb-6 text-5xl font-black">How to Embed Testimonials</h1>
        <p className="text-muted-foreground mb-16 max-w-2xl text-xl">
          Everything you need to know about adding social proof to your site, regardless of your
          tech stack.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {INTEGRATIONS.map((i) => (
            <Link
              key={i.slug}
              href={`/embed-testimonials/${i.slug}`}
              className="group hover:border-foreground bg-muted/5 hover:bg-muted/10 rounded-3xl border p-8 transition-all"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="bg-foreground text-background flex h-10 w-10 items-center justify-center rounded-xl">
                  <Code2 className="h-5 w-5" />
                </div>
                <ArrowRight className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <h2 className="mb-4 text-2xl font-bold">{i.name} Integration</h2>
              <p className="text-muted-foreground">{i.heroTitle}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
