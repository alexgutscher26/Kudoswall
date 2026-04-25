import { Suspense } from "react";
import LTDCard from "./ltd-card";
import PricingGrid from "./pricing-grid";
import { PLANS as CONFIG_PLANS } from "@my-better-t-app/api/config/plans";

interface Plan {
  id: "free" | "plan_1" | "plan_2" | "ltd";
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
    description: "Perfect for trying it out and collecting your first reviews.",
    cta: "Get started free",
    ctaHref: "/login",
    highlight: false,
    features: [
      "Up to 5 testimonials",
      "1 Workspace",
      "Text testimonials only",
      "Grid layout widget",
      "KudosWall branding",
    ],
  },
  {
    id: "plan_1",
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
      "1 Workspace",
      "Text testimonials", // Video + text reviews (coming soon)
      "All 4 widget layouts",
      "Filter testimonials by tag",
      "Custom branding & colors",
      "Remove 'Powered by' badge",
      "Custom domain for collection",
      "CSV export",
      "Analytics (views & clicks)",
      "Priority email support",
    ],
  },
  {
    id: "plan_2",
    name: "Agency",
    monthlyPrice: "$79",
    yearlyPrice: "$790",
    period: "per month",
    description: "Manage 5 client brands. White-label everything. Look like a pro.",
    cta: "Get started now",
    ctaHref: "/login",
    highlight: false,
    features: [
      "Everything in Pro",
      "Manage 5 client brands",
      "Up to 3 team members",
      "White-label everything",
      "Priority VIP support",
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
    <section
      id="pricing"
      style={{ backgroundColor: "#ffffff" }}
      className="relative overflow-hidden px-4 py-20"
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
        <div className="mb-12 text-center">
          <span
            className="mb-2 inline-block rounded-full px-3 py-1 text-[10px] font-semibold tracking-widest uppercase"
            style={{ color: "#e8527a", backgroundColor: "#fff5f7" }}
          >
            Simple Pricing
          </span>
          <h2 className="text-3xl leading-tight font-black tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
            Plans that scale with you.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-medium text-neutral-500">
            Join businesses turning testimonials into revenue. Start free, upgrade when you're
            ready.
          </p>
        </div>

        {/* Lifetime Deal Section */}
        <Suspense
          fallback={
            <div className="mb-14 h-[400px] w-full animate-pulse rounded-[2.2rem] bg-neutral-100" />
          }
        >
          <LTDCard ltdPriceId={CONFIG_PLANS.ltd.stripePriceIdLifetime} />
        </Suspense>

        {/* Pricing Grid (includes Billing Switcher) */}
        <PricingGrid plans={PLANS} />

        {/* Footer note */}
        <p className="mt-8 text-center text-xs font-medium text-neutral-400">
          Secure, encrypted payments with bank-level security. Switch plans anytime from your
          dashboard.
        </p>
      </div>
    </section>
  );
}
