"use client";

import { useState } from "react";
import { Check, Zap, Sparkles } from "lucide-react";
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
  isComingSoon?: boolean;
}

interface PricingGridProps {
  plans: Plan[];
}

export default function PricingGrid({ plans }: PricingGridProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <>
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

      <div className="mb-12 grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
        {plans.map(
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
            isComingSoon,
          }) => (
            <div
              key={name}
              className="group relative flex flex-col gap-5 rounded-[2.2rem] border-2 p-5 transition-all duration-500 hover:scale-[1.01] sm:gap-6 sm:p-7"
              style={{
                backgroundColor: highlight ? "#171717" : "#fafafa",
                borderColor: highlight ? "#171717" : "#f1f1f1",
                boxShadow: highlight
                  ? "0 30px 70px rgba(0,0,0,0.3)"
                  : "0 10px 40px rgba(0,0,0,0.02)",
              }}
            >
              {badge && (
                <div
                  className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-black shadow-xl shadow-pink-500/20"
                  style={{ backgroundColor: "#e8527a", color: "#ffffff" }}
                >
                  <Zap className="size-3.5 fill-white" />
                  {badge}
                </div>
              )}

              <div className="space-y-3">
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
                    {isComingSoon
                      ? "Coming Soon"
                      : billingCycle === "monthly"
                        ? monthlyPrice
                        : yearlyPrice}
                  </span>
                  {!isComingSoon && period && (
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

              <a href={ctaHref} className="block">
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

              <ul className="flex flex-col gap-3">
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
    </>
  );
}
