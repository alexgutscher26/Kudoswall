import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { PLATFORM_PAGES } from "@/lib/platform-pages";
import { ArrowRight, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Testimonials for Your Favorite Platforms",
  description: "Get 50 free testimonials for Carrd, Beehiiv, Webflow, Notion, and Framer. The most generous social proof tools for every stack.",
};

export default function FreeHubPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-32 max-w-5xl text-center">
        <h1 className="text-5xl font-black mb-6">Free Testimonials for Your Stack</h1>
        <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto">
          We've built dedicated, lightweight integrations for the world's best platforms. Pick yours and get 50 testimonials free.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 text-left">
          {PLATFORM_PAGES.map((p) => (
            <Link 
              key={p.slug} 
              href={`/free-testimonials-for/${p.slug}`}
              className="group border rounded-3xl p-8 hover:border-primary transition-all bg-primary/5 hover:bg-primary/10 flex flex-col justify-between"
            >
              <div>
                 <div className="bg-primary/10 text-primary w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                    <Zap className="fill-primary" />
                 </div>
                 <h2 className="text-2xl font-bold mb-4">For {p.name}</h2>
                 <p className="text-muted-foreground mb-8">
                    {p.heroTitle}
                 </p>
              </div>
              <div className="flex items-center gap-2 font-bold text-primary">
                View Setup Guide <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
