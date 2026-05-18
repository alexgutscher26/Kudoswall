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
      <section className="pt-32 pb-20 text-center lg:pt-48 lg:pb-32">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
            {integration.heroTitle}
          </h1>
          <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-xl">
            {integration.heroDescription}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-16 rounded-full px-10 text-xl font-bold">
                Get My Embed Code
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Data Points Grid */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-16 text-center text-3xl font-bold">
            Why KudosWall for {integration.name}?
          </h2>
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3 lg:grid-cols-4">
            {integration.dataPoints.map((point, i) => (
              <div
                key={i}
                className="bg-background flex items-start gap-3 rounded-2xl border p-6 shadow-sm"
              >
                <Check className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                <span className="font-medium">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Detailed Sections */}
      <section className="py-24">
        <div className="container mx-auto max-w-3xl space-y-16 px-4">
          {integration.sections.map((section, i) => (
            <div key={i}>
              <h2 className="mb-6 text-3xl font-bold">{section.title}</h2>
              <div className="text-muted-foreground text-lg leading-relaxed">{section.content}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Social Proof / Trust */}
      <section className="border-t py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-12 text-3xl font-bold">Trusted by {integration.name} Founders</h2>
          <div className="mx-auto grid max-w-4xl gap-8 text-left md:grid-cols-2">
            <div className="bg-muted/10 rounded-3xl border p-8">
              <p className="mb-4 text-lg italic">
                "The setup on {integration.name} was so much faster than I expected. Literally took
                2 minutes to have 20 testimonials live."
              </p>
              <p className="font-bold">— David K., Indie Hacker</p>
            </div>
            <div className="bg-muted/10 rounded-3xl border p-8">
              <p className="mb-4 text-lg italic">
                "I love the native video support. My {integration.name} site looks so much more
                professional now."
              </p>
              <p className="font-bold">— Sarah L., Studio Owner</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="bg-foreground text-background py-32">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-8 text-4xl font-bold md:text-6xl">Ready to boost your trust?</h2>
          <p className="mb-12 text-xl opacity-80">Start free. 50 testimonials included.</p>
          <Link href="/login">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-16 rounded-full px-12 text-xl font-bold"
            >
              Join KudosWall Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
