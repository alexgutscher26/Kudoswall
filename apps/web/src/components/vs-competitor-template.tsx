import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@my-better-t-app/ui/components/button";
import Link from "next/link";
import { Check, X, Quote, ArrowRight, Zap, Shield, Sparkles } from "lucide-react";

export interface CompetitorData {
  name: string;
  slug: string;
  freeTier: string;
  multiplier?: string;
  headline: string;
  startingPaidPrice: string;
  strengths: string[];
  wedges: { title: string; description: string }[];
  concessions: string[];
  honestAssessment: string;
  honestCompetitorStrengths: string;
  migrationGuide: string;
  testimonials?: {
    name: string;
    role: string;
    avatar?: string;
    content: string;
  }[];
}

interface VsCompetitorTemplateProps {
  competitor: CompetitorData;
}

export default function VsCompetitorTemplate({ competitor }: VsCompetitorTemplateProps) {
  const kudoswallFreeTier = "50 testimonials + video";
  const kudoswallPaidPrice = "$19/mo";

  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="from-primary/10 via-background to-background absolute top-0 left-1/2 -z-10 h-[500px] w-full -translate-x-1/2 bg-linear-to-b" />
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <div className="bg-primary/10 border-primary/20 text-primary animate-in fade-in slide-in-from-bottom-4 mb-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium">
            Comparison Guide: KudosWall vs {competitor.name}
          </div>
          <h1 className="from-foreground to-foreground/70 mb-6 bg-linear-to-r bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-7xl">
            {competitor.headline}
          </h1>
          <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-xl leading-relaxed md:text-2xl">
            Stop overpaying for social proof. Get KudosWall's industry-leading 50-testimonial free tier and have your wall live in 5 minutes.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button
                size="lg"
                className="shadow-primary/20 h-16 rounded-full px-10 text-xl font-bold shadow-xl transition-all hover:scale-105"
              >
                Try Free — 50 Testimonials
              </Button>
            </Link>
            <p className="text-muted-foreground text-sm">No credit card required</p>
          </div>
        </div>
      </section>

      {/* 2. TL;DR Comparison Table */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-3xl font-bold">At a Glance</h2>
            <div className="bg-background overflow-hidden rounded-3xl border shadow-2xl">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="p-6 text-left font-bold">Feature</th>
                    <th className="p-6 text-center font-bold">{competitor.name}</th>
                    <th className="bg-primary/5 text-primary p-6 text-center font-bold">KudosWall</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b transition-colors hover:bg-muted/30">
                    <td className="p-6 font-bold text-primary italic">Free Testimonials</td>
                    <td className="p-6 text-center">{competitor.freeTier}</td>
                    <td className="bg-primary/5 p-6 text-center font-bold">{kudoswallFreeTier}</td>
                  </tr>
                  <tr className="border-b transition-colors hover:bg-muted/30">
                    <td className="p-6 font-medium">Video on Free Tier</td>
                    <td className="p-6 text-center flex justify-center">
                       {competitor.freeTier.toLowerCase().includes("video") ? <Check className="text-green-500" /> : <X className="text-destructive" />}
                    </td>
                    <td className="bg-primary/5 p-6 text-center flex justify-center"><Check className="text-primary" /></td>
                  </tr>
                  <tr className="border-b transition-colors hover:bg-muted/30">
                    <td className="p-6 font-medium">Starting Paid Price</td>
                    <td className="p-6 text-center">{competitor.startingPaidPrice}</td>
                    <td className="bg-primary/5 p-6 text-center font-bold">{kudoswallPaidPrice}</td>
                  </tr>
                  <tr className="border-b transition-colors hover:bg-muted/30">
                    <td className="p-6 font-medium">Setup Time</td>
                    <td className="p-6 text-center">15-20 mins</td>
                    <td className="bg-primary/5 p-6 text-center font-bold text-primary">5 mins</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Free-Tier Difference */}
      <section className="bg-primary/5 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold">The Free-Tier Difference ⭐</h2>
              <p className="text-muted-foreground text-xl">Why wait for a paywall when you can start winning today?</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="bg-background rounded-3xl border p-8 shadow-sm">
                <h3 className="mb-6 text-2xl font-bold">{competitor.name} Free Tier</h3>
                <div className="mb-8 text-4xl font-bold text-muted-foreground opacity-50">{competitor.freeTier}</div>
                <p className="text-muted-foreground mb-6">
                  Most tools use their free tier as a "bait-and-switch" demo. You hit the limit just as your wall starts looking good.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-muted-foreground"><X className="h-4 w-4 text-destructive" /> Limited social proof volume</li>
                  <li className="flex items-center gap-2 text-muted-foreground"><X className="h-4 w-4 text-destructive" /> Often gates video recording</li>
                  <li className="flex items-center gap-2 text-muted-foreground"><X className="h-4 w-4 text-destructive" /> Designed for 14-day activation</li>
                </ul>
              </div>
              <div className="border-primary/50 ring-primary/20 bg-background relative rounded-3xl border-2 p-8 shadow-2xl ring-8">
                <div className="bg-primary text-primary-foreground absolute -top-4 left-8 rounded-full px-4 py-1 text-sm font-bold uppercase tracking-widest">Most Generous</div>
                <h3 className="mb-6 text-2xl font-bold">KudosWall Free Tier</h3>
                <div className="text-primary mb-8 text-4xl font-extrabold">{kudoswallFreeTier}</div>
                <p className="text-muted-foreground mb-6 font-medium">
                  We built our free tier to be a real product, not a demo. It's designed to get your Wall of Love live and converting.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 font-bold"><Check className="h-5 w-5 text-green-500" /> 50 high-fidelity testimonials</li>
                  <li className="flex items-center gap-2 font-bold"><Check className="h-5 w-5 text-green-500" /> Native video recording included</li>
                  <li className="flex items-center gap-2 font-bold"><Check className="h-5 w-5 text-green-500" /> Free forever, no credit card</li>
                  {competitor.multiplier && <li className="text-primary mt-4 font-extrabold flex items-center gap-2"><Zap className="fill-primary h-5 w-5" /> {competitor.multiplier} more free testimonials</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Honest Assessment of Competitor */}
      <section className="py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-3xl font-bold">An Honest Assessment of {competitor.name}</h2>
          <div className="text-muted-foreground space-y-6 text-lg leading-relaxed">
            <p>{competitor.honestAssessment}</p>
            <p>{competitor.honestCompetitorStrengths}</p>
          </div>
        </div>
      </section>

      {/* 5. Where KudosWall Wins (Wedges) */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-16 text-center text-3xl font-bold">Where KudosWall Wins</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {competitor.wedges.map((wedge, i) => (
                <div key={i} className="bg-background group rounded-3xl border p-8 transition-all hover:shadow-xl">
                  <div className="bg-primary/10 text-primary mb-6 flex h-12 w-12 items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                    {i === 0 ? <Zap className="h-6 w-6" /> : i === 1 ? <Shield className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
                  </div>
                  <h3 className="mb-4 text-xl font-bold">{wedge.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{wedge.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Where Competitor Still Wins */}
      <section className="py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="rounded-3xl border bg-muted/10 p-12">
            <h2 className="mb-6 text-2xl font-bold">Being Fair: Where {competitor.name} Still Wins</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              KudosWall isn't for everyone. {competitor.name} is a powerful tool and might be the better choice if you need:
            </p>
            <ul className="grid gap-4 md:grid-cols-2">
              {competitor.concessions.map((concession, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <div className="mt-1 flex-shrink-0"><Check className="h-4 w-4 text-primary" /></div>
                  <span>{concession}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7. Pricing Comparison */}
      <section className="bg-primary/[0.02] border-y py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-12 text-3xl font-bold">Pricing Comparison</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-background rounded-3xl border p-8">
              <h3 className="mb-4 text-xl font-bold font-mono uppercase tracking-tight">{competitor.name} Starter</h3>
              <div className="mb-4 text-4xl font-bold">{competitor.startingPaidPrice}</div>
              <p className="text-muted-foreground">Standard pricing for early-stage teams</p>
            </div>
            <div className="border-primary/50 bg-background rounded-3xl border-2 p-8 shadow-lg">
              <h3 className="text-primary mb-4 text-xl font-bold font-mono uppercase tracking-tight">KudosWall Pro</h3>
              <div className="text-primary mb-4 text-4xl font-extrabold">{kudoswallPaidPrice}</div>
              <p className="text-muted-foreground">More features, lower cost, zero growth penalties.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Migration Guide */}
      <section className="py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="bg-foreground text-background rounded-3xl p-12 shadow-2xl">
            <h2 className="mb-6 text-3xl font-bold">Moving from {competitor.name} to KudosWall</h2>
            <p className="mb-8 text-lg opacity-80">
              Ready to make the switch? We've made the migration process as painless as possible. Most users are fully moved in under 10 minutes.
            </p>
            <div className="space-y-4">
              {competitor.migrationGuide.split('\n').map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">{i + 1}</div>
                  <p className="text-lg">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-12">
              <Link href="/login">
                <Button className="bg-primary text-primary-foreground h-14 px-8 text-lg font-bold">
                  Start Migration Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {competitor.testimonials && competitor.testimonials.length > 0 && (
        <section className="bg-primary/[0.02] border-y py-24">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold">What former {competitor.name} users say</h2>
              <p className="text-muted-foreground text-lg italic">Real switchers, real results.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {competitor.testimonials.map((t, i) => (
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

      {/* 9. Final CTA */}
      <section className="py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-foreground text-background relative mx-auto max-w-3xl overflow-hidden rounded-[3rem] p-12 shadow-2xl">
            <div className="bg-primary/20 absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">Try free — 50 testimonials, no credit card</h2>
            <p className="text-muted-foreground mb-10 text-lg md:text-xl">
              Join hundreds of high-growth founders who moved to KudosWall for better social proof.
            </p>
            <Link href="/login">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-16 rounded-full px-10 text-xl font-bold"
              >
                Get Started for Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
