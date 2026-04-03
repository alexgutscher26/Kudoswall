import { Check, Zap } from "lucide-react";
import { Button } from "@my-better-t-app/ui/components/button";

interface Plan {
  name: string;
  price: string;
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
    price: "Free",
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
    price: "$29",
    period: "/ month",
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
    price: "$79",
    period: "/ month",
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

export default function PricingSection() {
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
      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
            style={{ color: "#e8527a", backgroundColor: "#fff5f7" }}
          >
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-neutral-500 text-lg max-w-md mx-auto">
            Start free. Upgrade when you're ready. No hidden fees.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map(({ name, price, period, description, cta, ctaHref, highlight, features, badge }) => (
            <div
              key={name}
              className="rounded-2xl p-7 border flex flex-col gap-6 relative"
              style={{
                backgroundColor: highlight ? "#171717" : "#fafafa",
                borderColor: highlight ? "#171717" : "#e5e7eb",
                boxShadow: highlight ? "0 20px 60px rgba(0,0,0,0.18)" : undefined,
              }}
            >
              {/* Popular badge */}
              {badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1"
                  style={{ backgroundColor: "#e8527a", color: "#ffffff" }}
                >
                  <Zap className="size-3 fill-white" />
                  {badge}
                </div>
              )}

              {/* Plan header */}
              <div>
                <p
                  className="text-sm font-semibold mb-2"
                  style={{ color: highlight ? "rgba(255,255,255,0.6)" : "#6b7280" }}
                >
                  {name}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  <span
                    className="text-4xl font-bold"
                    style={{ color: highlight ? "#ffffff" : "#111827" }}
                  >
                    {price}
                  </span>
                  {period && (
                    <span
                      className="text-sm pb-1"
                      style={{ color: highlight ? "rgba(255,255,255,0.5)" : "#9ca3af" }}
                    >
                      {period}
                    </span>
                  )}
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: highlight ? "rgba(255,255,255,0.55)" : "#6b7280" }}
                >
                  {description}
                </p>
              </div>

              {/* CTA */}
              <a href={ctaHref} className="block">
                <Button
                  className="w-full rounded-full"
                  style={
                    highlight
                      ? { backgroundColor: "#e8527a", color: "#ffffff" }
                      : { backgroundColor: "#171717", color: "#ffffff" }
                  }
                >
                  {cta}
                </Button>
              </a>
              {/* Features */}
              <ul className="flex flex-col gap-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className="size-4 mt-0.5 shrink-0"
                      style={{ color: highlight ? "#e8527a" : "#16a34a" }}
                    />
                    <span style={{ color: highlight ? "rgba(255,255,255,0.75)" : "#374151" }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-neutral-400 mt-10">
          All plans include a 14-day free trial. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
