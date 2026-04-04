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
    <div className="mb-14 relative group max-w-5xl mx-auto w-full">
      {/* Multi-layered Aura Glow */}
      <div 
        className="absolute -inset-1.5 bg-linear-to-r from-[#e8527a] via-[#bf3fbe] to-[#e8527a] rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" 
      />
      
      <div className="relative bg-neutral-900 rounded-[2.2rem] p-6 sm:p-8 md:p-12 flex flex-col lg:flex-row items-center gap-8 sm:gap-12 border border-white/10 shadow-2xl overflow-hidden">
        {/* Background Sparkles */}
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="size-32 text-pink-500 blur-lg" />
        </div>

        <div className="flex-1 space-y-8 z-10">
          <div className="flex flex-wrap items-center gap-4">
            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-[#e8527a]/40 shadow-inner flex items-center gap-2">
              <Crown className="size-4 text-[#e8527a]" />
              <span className="text-[11px] font-black text-[#e8527a] uppercase tracking-[0.2em]">
                Founder's Special: Access for Life
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50 text-xs font-bold uppercase tracking-wider">
              <Users className="size-3.5" />
              <span>Only {seatsRemaining} seats remaining</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.05] tracking-tight">
              Stop paying monthly. <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#e8527a] via-[#ff94b4] to-[#e8527a] animate-gradient-x">
                Own your brand asset.
              </span>
            </h3>
            <p className="text-neutral-400 text-base leading-relaxed max-w-lg">
              Unlock everything forever. Get all future updates, priority support, and white-labeling for a fraction of the long-term cost. No monthly fees, ever.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-2">
            {[
              "Everything in Business",
              "Unlimited video testimonials",
              "Lifetime software updates",
              "100% White-labeling",
              "Founders Direct support",
              "Zero-fee API for life"
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-neutral-200 font-semibold group/item">
                <div className="rounded-full bg-[#e8527a]/10 p-1 group-hover/item:scale-110 transition-transform">
                  <Check className="size-4 text-[#e8527a]" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-[360px] flex flex-col gap-6 sm:gap-8 p-6 sm:p-10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem] items-center text-center relative z-20">
          <div className="space-y-2">
             <div className="flex items-center justify-center gap-2 mb-1">
               <span className="text-[10px] font-black text-[#e8527a] uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full">
                 Founder Discount
               </span>
             </div>
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-5xl sm:text-6xl font-black text-neutral-900 tracking-tighter">$199</span>
              <span className="text-neutral-400 line-through text-xl font-bold">$499</span>
            </div>
            <p className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em]">
              One Payment · Lifetime Access
            </p>
          </div>

          <div className="w-full space-y-3">
            <div className="flex justify-between text-[11px] font-black text-[#e8527a] uppercase tracking-widest">
              <span className="flex items-center gap-1.5 animate-pulse">
                <Timer className="size-3.5" />
                Urgent: {seatsRemaining} Left
              </span>
              <span>Nearly Full</span>
            </div>
            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden border border-neutral-200 shadow-inner">
              <div 
                className="h-full bg-linear-to-r from-[#e8527a] to-[#bf3fbe] transition-all duration-1000 shadow-[0_0_10px_rgba(232,82,122,0.3)]"
                style={{ width: `${(seatsRemaining / 500) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">
               {( (seatsRemaining/500) * 100 ).toFixed(1)}% of Batch 01 Taken
            </p>
          </div>

          <a href="/login" className="w-full group/btn">
            <Button className="w-full h-16 rounded-[1.25rem] bg-[#171717] hover:bg-neutral-800 text-white font-black text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-neutral-200">
              Claim Lifetime Access
              <Zap className="ml-2 size-5 fill-white group-hover:scale-125 transition-transform" />
            </Button>
          </a>
          <p className="text-[11px] text-neutral-400 font-medium">Secure Checkout via Stripe</p>
        </div>
      </div>
    </div>
  );
}

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" style={{ backgroundColor: "#ffffff" }} className="relative overflow-hidden py-24 px-4">
      {/* Dot-grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />
      
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
            style={{ color: "#e8527a", backgroundColor: "#fff5f7" }}
          >
            Simple Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-neutral-900 leading-tight tracking-tight">
            Plans that scale with you.
          </h2>
          <p className="mt-5 text-neutral-500 text-lg max-w-xl mx-auto font-medium">
            Join 1,200+ businesses turning testimonials into revenue. Start free, upgrade when you're ready.
          </p>
        </div>

        {/* Lifetime Deal Section */}
        <LTDSection />

        {/* Billing Switcher */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="flex items-center p-1 bg-neutral-100 rounded-2xl w-fit border border-neutral-200 shadow-inner">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-neutral-900 shadow-md"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-white text-neutral-900 shadow-md"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Yearly
              <span className="text-[10px] bg-pink-100 text-[#e8527a] px-2 py-0.5 rounded-full font-black animate-bounce">
                2 months free
              </span>
            </button>
          </div>
        </div>

        {/* Standard Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-12">
          {PLANS.map(({ name, monthlyPrice, yearlyPrice, period, description, cta, ctaHref, highlight, features, badge }) => (
            <div
              key={name}
              className="rounded-[2.5rem] p-6 sm:p-9 border-2 flex flex-col gap-6 sm:gap-8 relative group transition-all duration-500 hover:scale-[1.01]"
              style={{
                backgroundColor: highlight ? "#171717" : "#fafafa",
                borderColor: highlight ? "#171717" : "#f1f1f1",
                boxShadow: highlight ? "0 30px 70px rgba(0,0,0,0.3)" : "0 10px 40px rgba(0,0,0,0.02)",
              }}
            >
              {/* Popular badge */}
              {badge && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-black px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl shadow-pink-500/20"
                  style={{ backgroundColor: "#e8527a", color: "#ffffff" }}
                >
                  <Zap className="size-3.5 fill-white" />
                  {badge}
                </div>
              )}

              {/* Plan header */}
              <div className="space-y-5">
                <p
                  className="text-xs font-black uppercase tracking-[0.2em]"
                  style={{ color: highlight ? "rgba(255,255,255,0.6)" : "#6b7280" }}
                >
                  {name}
                </p>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-4xl sm:text-5xl font-black tracking-tighter"
                    style={{ color: highlight ? "#ffffff" : "#111827" }}
                  >
                    {billingCycle === "monthly" ? monthlyPrice : yearlyPrice}
                  </span>
                  {period && (
                    <span
                      className="text-sm font-bold uppercase tracking-widest"
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
              <a href={ctaHref} className="block mt-auto pt-2">
                <Button
                  className="w-full h-14 rounded-2xl font-black text-sm transition-transform active:scale-95 shadow-lg group-hover:shadow-pink-500/10"
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
                    <div className="rounded-full bg-neutral-200/20 mt-0.5 shrink-0 flex items-center justify-center">
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
          ))}
        </div>

        {/* Satisfaction Guard */}
        <div className="flex flex-col items-center gap-3 pt-6">
           <div className="flex items-center gap-1">
             {[1,2,3,4,5].map(i => <Sparkles key={i} className="size-4 text-amber-400 fill-amber-400" />)}
           </div>
           <p className="text-center text-sm font-black text-neutral-800">
             100% Satisfaction Guarantee. 14-day full refund policy on all paid plans.
           </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-neutral-400 mt-12 font-medium">
          Secure, encrypted payments with bank-level security. Switch plans anytime from your dashboard.
        </p>
      </div>
    </section>
  );
}
