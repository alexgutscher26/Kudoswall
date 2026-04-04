"use client";

import { useState, useEffect } from "react";
import { Check, Zap, Timer, Users, Crown, Sparkles } from "lucide-react";
import { Button } from "@my-better-t-app/ui/components/button";

interface Plan {
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  period: string;
  description: string;
  cta: string;
  ctaHref: string;
  highlight: boolean;
  features: string[];
  badge?: string;
}

const PLANS: Plan[] = [
  {
    name: "Starter",
    monthlyPrice: "Free",
    yearlyPrice: "Free",
    period: "",
    description: "Perfect for trying it out and collecting your first reviews.",
    cta: "Get started free",
    ctaHref: "/login",
    highlight: false,
    features: [
      "Up to 10 testimonials",
      "Text reviews only",
      "Basic embeddable widget",
      "1 collection link",
      "TestimonialWall branding",
    ],
  },
  {
    name: "Pro",
    monthlyPrice: "$29",
    yearlyPrice: "$290",
    period: "per month",
    description: "For growing businesses that want unlimited social proof.",
    cta: "Start free trial",
    ctaHref: "/login",
    highlight: true,
    badge: "Most popular",
    features: [
      "Unlimited testimonials",
      "Video + text reviews",
      "Fully customizable widget",
      "Unlimited collection links",
      "Remove TestimonialWall branding",
      "Advanced filtering by use case",
      "Content moderation tools",
    ],
  },
  {
    name: "Business",
    monthlyPrice: "$79",
    yearlyPrice: "$790",
    period: "per month",
    description: "For teams and agencies managing multiple brands.",
    cta: "Contact sales",
    ctaHref: "/login",
    highlight: false,
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "5 brand workspaces",
      "Analytics dashboard",
      "Priority support",
      "Custom domain for collection page",
      "API access",
    ],
  },
];

function LTDSection() {
  const [seatsRemaining, setSeatsRemaining] = useState(487);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeatsRemaining((prev) => {
        if (prev <= 8) return prev;
        if (Math.random() > 0.85) return prev - 1;
        return prev;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="group relative mx-auto mb-14 w-full max-w-5xl">
      {/* Multi-layered Aura Glow */}
      <div className="absolute -inset-1.5 rounded-[2.5rem] bg-linear-to-r from-[#e8527a] via-[#bf3fbe] to-[#e8527a] opacity-20 blur transition duration-1000 group-hover:opacity-40" />

      <div className="relative flex flex-col items-center gap-8 overflow-hidden rounded-[2.2rem] border border-white/10 bg-neutral-900 p-6 shadow-2xl sm:gap-12 sm:p-8 md:p-12 lg:flex-row">
        {/* Background Sparkles */}
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="size-32 text-pink-500 blur-lg" />
        </div>

        <div className="z-10 flex-1 space-y-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-[#e8527a]/40 bg-white/5 px-4 py-1.5 shadow-inner">
              <Crown className="size-4 text-[#e8527a]" />
              <span className="text-[11px] font-black tracking-[0.2em] text-[#e8527a] uppercase">
                Founder's Special: Access for Life
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-white/50 uppercase">
              <Users className="size-3.5" />
              <span>Only {seatsRemaining} seats remaining</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-3xl leading-[1.05] font-black tracking-tight text-white sm:text-4xl md:text-5xl">
              Stop paying monthly. <br />
              <span className="animate-gradient-x bg-linear-to-r from-[#e8527a] via-[#ff94b4] to-[#e8527a] bg-clip-text text-transparent">
                Own your brand asset.
              </span>
            </h3>
            <p className="max-w-lg text-base leading-relaxed text-neutral-400">
              Unlock everything forever. Get all future updates, priority support, and
              white-labeling for a fraction of the long-term cost. No monthly fees, ever.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-4 pt-2 sm:grid-cols-2">
            {[
              "Everything in Business",
              "Unlimited video testimonials",
              "Lifetime software updates",
              "100% White-labeling",
              "Founders Direct support",
              "Zero-fee API for life",
            ].map((f) => (
              <div
                key={f}
                className="group/item flex items-center gap-3 text-sm font-semibold text-neutral-200"
              >
                <div className="rounded-full bg-[#e8527a]/10 p-1 transition-transform group-hover/item:scale-110">
                  <Check className="size-4 text-[#e8527a]" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-20 flex w-full flex-col items-center gap-6 rounded-[2rem] bg-white p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:gap-8 sm:p-10 lg:w-[360px]">
          <div className="space-y-2">
            <div className="mb-1 flex items-center justify-center gap-2">
              <span className="rounded-full bg-pink-50 px-3 py-1 text-[10px] font-black tracking-widest text-[#e8527a] uppercase">
                Founder Discount
              </span>
            </div>
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-5xl font-black tracking-tighter text-neutral-900 sm:text-6xl">
                $199
              </span>
              <span className="text-xl font-bold text-neutral-400 line-through">$499</span>
            </div>
            <p className="text-[11px] font-black tracking-[0.2em] text-neutral-400 uppercase">
              One Payment · Lifetime Access
            </p>
          </div>

          <div className="w-full space-y-3">
            <div className="flex justify-between text-[11px] font-black tracking-widest text-[#e8527a] uppercase">
              <span className="flex animate-pulse items-center gap-1.5">
                <Timer className="size-3.5" />
                Urgent: {seatsRemaining} Left
              </span>
              <span>Nearly Full</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 shadow-inner">
              <div
                className="h-full bg-linear-to-r from-[#e8527a] to-[#bf3fbe] shadow-[0_0_10px_rgba(232,82,122,0.3)] transition-all duration-1000"
                style={{ width: `${(seatsRemaining / 500) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
              {((seatsRemaining / 500) * 100).toFixed(1)}% of Batch 01 Taken
            </p>
          </div>

          <a href="/login" className="group/btn w-full">
            <Button className="h-16 w-full rounded-[1.25rem] bg-[#171717] text-lg font-black text-white shadow-xl shadow-neutral-200 transition-all hover:scale-[1.02] hover:bg-neutral-800 active:scale-[0.98]">
              Claim Lifetime Access
              <Zap className="ml-2 size-5 fill-white transition-transform group-hover:scale-125" />
            </Button>
          </a>
          <p className="text-[11px] font-medium text-neutral-400">Secure Checkout via Stripe</p>
        </div>
      </div>
    </div>
  );
}

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section
      id="pricing"
      style={{ backgroundColor: "#ffffff" }}
      className="relative overflow-hidden px-4 py-24"
    >
      {/* Dot-grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <span
            className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-widest uppercase"
            style={{ color: "#e8527a", backgroundColor: "#fff5f7" }}
          >
            Simple Pricing
          </span>
          <h2 className="text-4xl leading-tight font-black tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
            Plans that scale with you.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg font-medium text-neutral-500">
            Join 1,200+ businesses turning testimonials into revenue. Start free, upgrade when
            you're ready.
          </p>
        </div>

        {/* Lifetime Deal Section */}
        <LTDSection />

        {/* Billing Switcher */}
        <div className="mb-12 flex flex-col items-center gap-4">
          <div className="flex w-fit items-center rounded-2xl border border-neutral-200 bg-neutral-100 p-1 shadow-inner">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-xl px-6 py-2 text-sm font-black transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-neutral-900 shadow-md"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`flex items-center gap-2 rounded-xl px-6 py-2 text-sm font-black transition-all ${
                billingCycle === "yearly"
                  ? "bg-white text-neutral-900 shadow-md"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Yearly
              <span className="animate-bounce rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-black text-[#e8527a]">
                2 months free
              </span>
            </button>
          </div>
        </div>

        {/* Standard Plans Grid */}
        <div className="mb-12 grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
          {PLANS.map(
            ({
              name,
              monthlyPrice,
              yearlyPrice,
              period,
              description,
              cta,
              ctaHref,
              highlight,
              features,
              badge,
            }) => (
              <div
                key={name}
                className="group relative flex flex-col gap-6 rounded-[2.5rem] border-2 p-6 transition-all duration-500 hover:scale-[1.01] sm:gap-8 sm:p-9"
                style={{
                  backgroundColor: highlight ? "#171717" : "#fafafa",
                  borderColor: highlight ? "#171717" : "#f1f1f1",
                  boxShadow: highlight
                    ? "0 30px 70px rgba(0,0,0,0.3)"
                    : "0 10px 40px rgba(0,0,0,0.02)",
                }}
              >
                {/* Popular badge */}
                {badge && (
                  <div
                    className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-black shadow-xl shadow-pink-500/20"
                    style={{ backgroundColor: "#e8527a", color: "#ffffff" }}
                  >
                    <Zap className="size-3.5 fill-white" />
                    {badge}
                  </div>
                )}

                {/* Plan header */}
                <div className="space-y-5">
                  <p
                    className="text-xs font-black tracking-[0.2em] uppercase"
                    style={{ color: highlight ? "rgba(255,255,255,0.6)" : "#6b7280" }}
                  >
                    {name}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-4xl font-black tracking-tighter sm:text-5xl"
                      style={{ color: highlight ? "#ffffff" : "#111827" }}
                    >
                      {billingCycle === "monthly" ? monthlyPrice : yearlyPrice}
                    </span>
                    {period && (
                      <span
                        className="text-sm font-bold tracking-widest uppercase"
                        style={{ color: highlight ? "rgba(255,255,255,0.5)" : "#9ca3af" }}
                      >
                        {billingCycle === "monthly" ? "/month" : "/year"}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-[15px] leading-relaxed font-medium"
                    style={{ color: highlight ? "rgba(255,255,255,0.55)" : "#6b7280" }}
                  >
                    {description}
                  </p>
                </div>

                {/* CTA */}
                <a href={ctaHref} className="mt-auto block pt-2">
                  <Button
                    className="h-14 w-full rounded-2xl text-sm font-black shadow-lg transition-transform group-hover:shadow-pink-500/10 active:scale-95"
                    style={
                      highlight
                        ? { backgroundColor: "#e8527a", color: "#ffffff" }
                        : { backgroundColor: "#171717", color: "#ffffff" }
                    }
                  >
                    {cta}
                  </Button>
                </a>

                {/* Features list */}
                <ul className="flex flex-col gap-4">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-4 text-sm font-bold">
                      <div className="mt-0.5 flex shrink-0 items-center justify-center rounded-full bg-neutral-200/20">
                        <Check
                          className="size-4"
                          style={{ color: highlight ? "#e8527a" : "#16a34a" }}
                        />
                      </div>
                      <span style={{ color: highlight ? "rgba(255,255,255,0.75)" : "#374151" }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>

        {/* Satisfaction Guard */}
        <div className="flex flex-col items-center gap-3 pt-6">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Sparkles key={i} className="size-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-center text-sm font-black text-neutral-800">
            100% Satisfaction Guarantee. 14-day full refund policy on all paid plans.
          </p>
        </div>

        {/* Footer note */}
        <p className="mt-12 text-center text-xs font-medium text-neutral-400">
          Secure, encrypted payments with bank-level security. Switch plans anytime from your
          dashboard.
        </p>
      </div>
    </section>
  );
}
