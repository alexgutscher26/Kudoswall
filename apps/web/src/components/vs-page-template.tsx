import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@my-better-t-app/ui/components/button";
import Link from "next/link";
import { Check, X, Quote } from "lucide-react";

interface ComparisonPoint {
  feature: string;
  competitor: string | boolean;
  kudoswall: string | boolean;
}

interface Testimonial {
  name: string;
  role: string;
  avatar?: string;
  content: string;
}

interface VsPageTemplateProps {
  competitorName: string;
  heroTitle: string;
  heroDescription: string;
  articleContent: React.ReactNode;
  comparisonPoints: ComparisonPoint[];
  testimonials?: Testimonial[];
}

export default function VsPageTemplate({
  competitorName,
  heroTitle,
  heroDescription,
  articleContent,
  comparisonPoints,
  testimonials = [],
}: VsPageTemplateProps) {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="from-primary/10 via-background to-background absolute top-0 left-1/2 -z-10 h-[500px] w-full -translate-x-1/2 bg-linear-to-b" />
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="bg-primary/10 border-primary/20 text-primary animate-in fade-in slide-in-from-bottom-4 mb-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium">
            Comparison Guide
          </div>
          <h1 className="from-foreground to-foreground/70 mb-6 bg-linear-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-6xl">
            {heroTitle}
          </h1>
          <p className="text-muted-foreground mb-10 text-xl leading-relaxed md:text-2xl">
            {heroDescription}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button
                size="lg"
                className="shadow-primary/20 h-14 px-8 text-lg font-semibold shadow-xl"
              >
                Get Started for Free
              </Button>
            </Link>
            <Link href="/#features">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold">
                Live Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="bg-background mx-auto max-w-5xl overflow-hidden rounded-2xl border shadow-2xl">
            <div className="bg-muted/50 grid grid-cols-3 border-b p-6 text-lg font-bold">
              <div>Feature</div>
              <div className="text-center">{competitorName}</div>
              <div className="text-primary text-center">KudosWall</div>
            </div>
            {comparisonPoints.map((point, i) => (
              <div
                key={i}
                className="hover:bg-muted/30 grid grid-cols-3 border-b p-6 transition-colors last:border-0"
              >
                <div className="text-sm font-medium md:text-base">{point.feature}</div>
                <div className="flex items-center justify-center">
                  {typeof point.competitor === "boolean" ? (
                    point.competitor ? (
                      <Check className="text-green-500" />
                    ) : (
                      <X className="text-destructive" />
                    )
                  ) : (
                    <span className="text-center text-xs md:text-sm">{point.competitor}</span>
                  )}
                </div>
                <div className="text-primary flex items-center justify-center font-bold">
                  {typeof point.kudoswall === "boolean" ? (
                    point.kudoswall ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <X className="h-6 w-6" />
                    )
                  ) : (
                    <span className="text-center text-xs md:text-sm">{point.kudoswall}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Article Content Section */}
      <section className="py-24">
        <div className="container mx-auto max-w-3xl px-4">
          <article className="text-foreground/90 space-y-8">{articleContent}</article>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="bg-primary/[0.02] border-y py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold">What former {competitorName} users say</h2>
              <p className="text-muted-foreground text-lg italic">Real switchers, real results.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="bg-background group relative overflow-hidden rounded-3xl border p-8 shadow-sm transition-all hover:shadow-md"
                >
                  <Quote className="text-primary/5 group-hover:text-primary/10 absolute -top-4 -right-4 h-24 w-24 transition-colors" />
                  <p className="text-foreground/80 relative z-10 mb-8 text-xl leading-relaxed font-medium italic">
                    "{t.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/20 text-primary flex h-12 w-12 items-center justify-center rounded-full font-bold">
                      {t.avatar ? (
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        t.name[0]
                      )}
                    </div>
                    <div>
                      <div className="font-bold">{t.name}</div>
                      <div className="text-muted-foreground text-sm">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-foreground text-background relative mx-auto max-w-3xl overflow-hidden rounded-[3rem] p-12 shadow-2xl">
            <div className="bg-primary/20 absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">Ready to see the difference?</h2>
            <p className="text-muted-foreground mb-10 text-lg md:text-xl">
              Join hundreds of high-growth founders who moved to KudosWall for better social proof.
            </p>
            <Link href="/login">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-16 rounded-full px-10 text-xl font-bold"
              >
                Start Your 7-Day Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
