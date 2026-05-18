import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@my-better-t-app/ui/components/button";
import Link from "next/link";
import { Check } from "lucide-react";
import type { IntegrationPageData } from "@/lib/integration-data";

interface IntegrationTemplateProps {
  integration: IntegrationPageData;
}

export default function IntegrationTemplate({ integration }: IntegrationTemplateProps) {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      {/* 1. Hero */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 text-center">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl mb-6">
            {integration.heroTitle}
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {integration.heroDescription}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
               <Button size="lg" className="rounded-full px-10 h-16 text-xl font-bold">
                 Get My Embed Code
               </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Data Points Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold mb-16">Why KudosWall for {integration.name}?</h2>
          <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto">
            {integration.dataPoints.map((point, i) => (
              <div key={i} className="bg-background p-6 rounded-2xl border shadow-sm flex items-start gap-3">
                <Check className="text-green-500 h-5 w-5 shrink-0 mt-1" />
                <span className="font-medium">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Detailed Sections */}
      <section className="py-24">
        <div className="container mx-auto max-w-3xl px-4 space-y-16">
          {integration.sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
              <div className="text-lg text-muted-foreground leading-relaxed">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Social Proof / Trust */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Trusted by {integration.name} Founders</h2>
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto text-left">
             <div className="p-8 border rounded-3xl bg-muted/10">
                <p className="text-lg mb-4 italic">"The setup on {integration.name} was so much faster than I expected. Literally took 2 minutes to have 20 testimonials live."</p>
                <p className="font-bold">— David K., Indie Hacker</p>
             </div>
             <div className="p-8 border rounded-3xl bg-muted/10">
                <p className="text-lg mb-4 italic">"I love the native video support. My {integration.name} site looks so much more professional now."</p>
                <p className="font-bold">— Sarah L., Studio Owner</p>
             </div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="py-32 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to boost your trust?</h2>
          <p className="text-xl mb-12 opacity-80">Start free. 50 testimonials included.</p>
          <Link href="/login">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-12 h-16 text-xl font-bold">
              Join KudosWall Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
