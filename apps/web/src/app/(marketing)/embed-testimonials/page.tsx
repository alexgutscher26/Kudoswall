import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { INTEGRATIONS } from "@/lib/integration-data";
import { ArrowRight, Code2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Embed Testimonials: Platform Guides",
  description: "Step-by-step guides for embedding high-converting testimonial widgets on any website platform.",
};

export default function EmbedHubPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-32 max-w-5xl">
        <h1 className="text-5xl font-black mb-6">How to Embed Testimonials</h1>
        <p className="text-xl text-muted-foreground mb-16 max-w-2xl">
          Everything you need to know about adding social proof to your site, regardless of your tech stack.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {INTEGRATIONS.map((i) => (
            <Link 
              key={i.slug} 
              href={`/embed-testimonials/${i.slug}`}
              className="group border rounded-3xl p-8 hover:border-foreground transition-all bg-muted/5 hover:bg-muted/10"
            >
              <div className="flex justify-between items-center mb-6">
                 <div className="bg-foreground text-background w-10 h-10 rounded-xl flex items-center justify-center">
                    <Code2 className="h-5 w-5" />
                 </div>
                 <ArrowRight className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <h2 className="text-2xl font-bold mb-4">{i.name} Integration</h2>
              <p className="text-muted-foreground">
                {i.heroTitle}
              </p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
