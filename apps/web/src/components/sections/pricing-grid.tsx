"use client";

import { useState } from "react";
import { Check, Lightning, CircleNotch, ShieldCheck } from "@phosphor-icons/react";
import { Button } from "@my-better-t-app/ui/components/button";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { gooeyToast as toast } from "goey-toast";

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

interface PricingGridProps {
  plans: Plan[];
}

export default function PricingGrid({ plans }: PricingGridProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { data: session } = authClient.useSession();
  const router = useRouter();

  // Get user's first workspace to start checkout
  const { data: dashboardData } = useQuery({
    ...trpc.dashboard.getData.queryOptions(),
    enabled: !!session,
  });

  const createCheckout = useMutation({
    ...trpc.billing.createCheckoutSession.mutationOptions(),
    onSuccess: ({ url }: { url: string | null }) => {
      if (url) window.location.href = url;
    },
    onError: (err: any) => {
      toast.error("Failed to start checkout: " + err.message);
    },
  });

  const handleAction = async (plan: Plan) => {
    if (!session) {
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname + "#pricing")}` as any,
      );
      return;
    }

    if (plan.id === "free") {
      router.push("/dashboard");
      return;
    }

    const priceId =
      plan.id === "ltd"
        ? plan.stripePriceIdLifetime
        : billingCycle === "monthly"
          ? plan.stripePriceIdMonthly
          : plan.stripePriceIdYearly;

    if (!priceId) {
      toast.error("Billing not configured for this plan yet.");
      return;
    }

    const workspaceId = dashboardData?.workspace?.id;
    if (!workspaceId) {
      toast.error("No workspace found. Please create one first.");
      router.push("/dashboard");
      return;
    }

    createCheckout.mutate({
      priceId,
    });
  };

  return (
    <>
      {/* Billing Switcher */}
      <div className="mb-10 flex justify-center">
        <div className="flex items-center rounded-full border border-neutral-200 bg-neutral-100 p-1">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`rounded-full px-5 py-1.5 text-xs font-semibold transition-all duration-300 ${
              billingCycle === "monthly"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("yearly")}
            className={`flex items-center gap-1.5 rounded-full px-5 py-1.5 text-xs font-semibold transition-all duration-300 ${
              billingCycle === "yearly"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <span>Yearly</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
              2 months free
            </span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isDark = plan.highlight;
          return (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between rounded-2xl border p-6 sm:p-8 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                isDark
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-xl"
                  : "border-neutral-200 bg-white text-neutral-900 shadow-sm hover:border-neutral-300 hover:shadow-md"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold tracking-wider uppercase ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                    {plan.name}
                  </span>
                  {isDark && (
                    <Lightning className="size-4 text-amber-400" weight="fill" />
                  )}
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className={`text-4xl font-bold tracking-tight sm:text-5xl ${isDark ? "text-white" : "text-neutral-900"}`}>
                    {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  {plan.period && (
                    <span className={`text-xs font-semibold ${isDark ? "text-neutral-400" : "text-neutral-500"}`}>
                      {billingCycle === "monthly" ? "/month" : "/year"}
                    </span>
                  )}
                </div>

                <p className={`mt-3 text-xs leading-relaxed ${isDark ? "text-neutral-300" : "text-neutral-600"} [text-wrap:pretty]`}>
                  {plan.description}
                </p>

                <div className="my-6 border-t border-neutral-100/20" />

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-xs font-medium">
                      <Check
                        className={`mt-0.5 size-3.5 shrink-0 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                        weight="bold"
                      />
                      <span className={isDark ? "text-neutral-200" : "text-neutral-700"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Button
                  onClick={() => handleAction(plan)}
                  disabled={createCheckout.isPending}
                  className={`w-full rounded-xl py-2 px-3.5 text-xs font-semibold transition-all duration-300 active:scale-[0.98] ${
                    isDark
                      ? "bg-white text-neutral-900 hover:bg-neutral-100 shadow-sm"
                      : "bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm"
                  }`}
                >
                  {createCheckout.isPending ? (
                    <CircleNotch className="mr-2 size-4 animate-spin" weight="bold" />
                  ) : null}
                  {plan.cta}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
