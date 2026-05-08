import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { COMPETITORS } from "@/lib/competitor-data";
import { ArrowRight, Star } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KudosWall vs Competitors: Compare Testimonial Software",
  description: "See how KudosWall stacks up against Senja, Testimonial.to, Vouch, and more. Transparent comparisons on pricing, features, and limits.",
};

export default function VsHubPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-32 max-w-5xl">
        <h1 className="text-5xl font-black mb-6">KudosWall vs Everyone</h1>
        <p className="text-xl text-muted-foreground mb-16 max-w-2xl">
          We don't hide from competition. Here is an honest look at how we compare to the biggest players in the social proof space.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {COMPETITORS.map((c) => (
            <Link 
              key={c.slug} 
              href={`/vs/${c.slug}`}
              className="group border rounded-3xl p-8 hover:border-primary transition-all bg-muted/10 hover:bg-muted/30"
            >
              <div className="flex justify-between items-start mb-4">
                 <h2 className="text-2xl font-bold">{c.name}</h2>
                 <ArrowRight className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-muted-foreground mb-6 line-clamp-2">
                {c.headline}
              </p>
              <div className="flex items-center gap-4 text-sm font-medium">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">Compare Limits</span>
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
