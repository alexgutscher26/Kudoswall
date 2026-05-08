import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@my-better-t-app/ui/components/button";
import Link from "next/link";
import { Check, Zap, Video, Globe, Smartphone, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Free Testimonial Software with Video: 50 Reviews Forever",
  description:
    "Most 'free' testimonial tools are demos. KudosWall's free tier is a real product: 50 testimonials, video included, custom widget, embed anywhere. Free forever.",
  alternates: {
    canonical: "https://kudoswall.org/free",
  },
};

const FEATURES = [
  {
    title: "50 Testimonials",
    description:
      "3.3x more than Senja, 5x more than Testimonial.to. A real limit for real businesses.",
    icon: Zap,
  },
  {
    title: "Native Video",
    description: "High-fidelity video recording included. No 'video tax' or $50/mo required.",
    icon: Video,
  },
  {
    title: "Embed Anywhere",
    description: "Works with Webflow, Framer, Kajabi, Shopify, or custom Next.js sites.",
    icon: Globe,
  },
  {
    title: "No Credit Card",
    description: "Start collecting reviews in 60 seconds without touching your wallet.",
    icon: Lock,
  },
  {
    title: "Mobile Ready",
    description: "Optimized collection forms that work perfectly on every device.",
    icon: Smartphone,
  },
  {
    title: "Custom Widget",
    description: "Professional grid layout included on the free tier. No ugly placeholders.",
    icon: Check,
  },
];

export default function FreePage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="from-primary/10 via-background to-background absolute top-0 left-1/2 -z-10 h-[600px] w-full -translate-x-1/2 bg-linear-to-b opacity-50" />
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="bg-primary/10 border-primary/20 text-primary mb-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-bold tracking-tight">
            THE MOST GENEROUS FREE TIER
          </div>
          <h1 className="mb-6 text-4xl font-black tracking-tight text-neutral-900 md:text-7xl">
            The free testimonial tool <br className="hidden md:block" />
            <span style={{ color: "#e8527a" }}>that's actually generous.</span>
          </h1>
          <p className="text-muted-foreground mb-10 text-xl leading-relaxed md:text-2xl">
            Most "free" testimonial tools are just demos. KudosWall's free tier is a real product:{" "}
            <strong>50 testimonials, video included, custom widget, embed anywhere.</strong>
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button
                size="lg"
                className="h-16 rounded-full px-10 text-xl font-bold shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started Free — No Credit Card
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-12 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex flex-col gap-4">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl">
                  <feature.icon className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section (Simplified) */}
      <section className="bg-neutral-50 py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-12 text-3xl font-bold tracking-tight md:text-5xl">
            Why founders are switching
          </h2>
          <div className="grid gap-8">
            <div className="rounded-3xl border bg-white p-8 shadow-sm">
              <p className="mb-6 text-xl leading-relaxed font-medium">
                "I was using Senja's free tier and hit the 15-testimonial limit in two weeks.
                KudosWall's 50-testimonial limit is a game-changer for early-stage products. The
                video quality is incredible."
              </p>
              <div className="font-bold text-neutral-900">— Sarah J., Founder at CleanFlow</div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Hook */}
      <section className="py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Stop overpaying for social proof.</h2>
          <p className="text-muted-foreground mb-10 text-lg md:text-xl">
            We don't believe in "Growth Penalties." KudosWall provides 3× the free tier of Senja and
            5× Testimonial.to because we want you to succeed before you pay us.
          </p>
          <Link href="/vs/senja" className="text-primary font-bold hover:underline">
            Read the full Senja vs KudosWall comparison →
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[3rem] bg-neutral-900 p-12 text-white shadow-2xl">
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">Ready to collect your first 50?</h2>
            <p className="mb-10 text-lg text-neutral-400 md:text-xl">
              Free forever. Pay only when you outgrow it.
            </p>
            <Link href="/login">
              <Button
                size="lg"
                className="h-16 rounded-full bg-white px-10 text-xl font-bold text-neutral-900 hover:bg-neutral-100"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
