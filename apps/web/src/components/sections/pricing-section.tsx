import { Suspense } from "react";
import LTDCard from "./ltd-card";
import PricingGrid from "./pricing-grid";
import { PLANS as CONFIG_PLANS } from "@my-better-t-app/api/config/plans";

interface Plan {
  id: "free" | "plan_1" | "plan_2" | "plan_3" | "ltd";
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
  stripePriceIdMonthly?: string;
  stripePriceIdYearly?: string;
  stripePriceIdLifetime?: string;
}

const UI_PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: "Free",
    yearlyPrice: "Free",
    period: "",
    description: "Start collecting customer proof today with up to 10 video and text reviews.",
    cta: "Get started free",
    ctaHref: "/login",
    highlight: false,
    features: [
      "Up to 10 testimonials",
      "1 Embed widget",
      "1 Project workspace",
      "Text and video testimonials",
      "Grid layout widget",
      "Standard KudosWall badge",
    ],
  },
  {
    id: "plan_1",
    name: "Pro",
    monthlyPrice: "$19",
    yearlyPrice: "$190",
    period: "per month",
    description: "For growing SaaS and creators who want unlimited social proof with zero branding.",
    cta: "Start 14-day free trial",
    ctaHref: "/login",
    highlight: true,
    badge: "Most popular",
    features: [
      "Unlimited testimonials",
      "Unlimited embed widgets",
      "1 Project workspace",
      "High definition video downloads",
      "All 4 widget layout styles",
      "Filter testimonials by tag",
      "Custom branding and colors",
      "Remove powered by badge",
      "Custom collection domain",
      "CSV export and analytics",
      "Priority email support",
    ],
  },
  {
    id: "plan_2",
    name: "Agency",
    monthlyPrice: "$59",
    yearlyPrice: "$590",
    period: "per month",
    description: "Manage multiple client workspaces with complete white label flexibility.",
    cta: "Start agency trial",
    ctaHref: "/login",
    highlight: false,
    features: [
      "Everything in Pro tier",
      "Manage 5 client workspaces",
      "Unlimited embed widgets",
      "Up to 3 team seats",
      "Full white label branding",
      "Priority direct support",
    ],
  },
];

const PLANS = UI_PLANS.map((plan) => {
  const config = CONFIG_PLANS[plan.id as keyof typeof CONFIG_PLANS];
  return {
    ...plan,
    stripePriceIdMonthly: config?.stripePriceIdMonthly,
    stripePriceIdYearly: config?.stripePriceIdYearly,
    stripePriceIdLifetime: config?.stripePriceIdLifetime,
  };
});

export default function PricingSection() {
  return (
    <section id="pricing" className="relative bg-white px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-[680px] text-center">
          <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700">
            Simple transparent pricing
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl [text-wrap:balance]">
            Plans that scale with your growth
          </h2>
          <p className="mt-3 text-base text-neutral-500 sm:text-lg [text-wrap:pretty]">
            Start free with zero commitment. Upgrade when you need unlimited video reviews and custom branding.
          </p>
        </div>

        {/* Lifetime Deal Special Card */}
        <Suspense
          fallback={
            <div className="mb-14 h-96 w-full animate-pulse rounded-2xl bg-neutral-100" />
          }
        >
          <LTDCard ltdPriceId={CONFIG_PLANS.ltd.stripePriceIdLifetime} />
        </Suspense>

        {/* Pricing Grid */}
        <PricingGrid plans={PLANS} />

        {/* Guarantee and Risk Reversal Footer */}
        <p className="mt-10 text-center text-xs font-medium text-neutral-500">
          All paid plans include a 14 day free trial · No credit card required to start · Cancel anytime with one click
        </p>
      </div>
    </section>
  );
}
