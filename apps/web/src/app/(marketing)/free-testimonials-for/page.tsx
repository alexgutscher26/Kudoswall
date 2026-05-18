import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { PLATFORM_PAGES } from "@/lib/platform-pages";
import { ArrowRight, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Testimonials for Your Favorite Platforms",
  description:
    "Get 50 free testimonials for Carrd, Beehiiv, Webflow, Notion, and Framer. The most generous social proof tools for every stack.",
};

export default function FreeHubPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-32 text-center">
        <h1 className="mb-6 text-5xl font-black">Free Testimonials for Your Stack</h1>
        <p className="text-muted-foreground mx-auto mb-16 max-w-2xl text-xl">
          We've built dedicated, lightweight integrations for the world's best platforms. Pick yours
          and get 50 testimonials free.
        </p>

        <div className="grid gap-8 text-left md:grid-cols-2 lg:grid-cols-3">
          {PLATFORM_PAGES.map((p) => (
            <Link
              key={p.slug}
              href={`/free-testimonials-for/${p.slug}`}
              className="group hover:border-primary bg-primary/5 hover:bg-primary/10 flex flex-col justify-between rounded-3xl border p-8 transition-all"
            >
              <div>
                <div className="bg-primary/10 text-primary mb-6 flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Zap className="fill-primary" />
                </div>
                <h2 className="mb-4 text-2xl font-bold">For {p.name}</h2>
                <p className="text-muted-foreground mb-8">{p.heroTitle}</p>
              </div>
              <div className="text-primary flex items-center gap-2 font-bold">
                View Setup Guide{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
