"use client";

import { useState, useEffect } from "react";
import { Crown, Users, Sparkle, Lightning, CircleNotch, Timer } from "@phosphor-icons/react";
import { Button } from "@my-better-t-app/ui/components/button";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { gooeyToast as toast } from "goey-toast";

interface LTDCardProps {
  ltdPriceId?: string;
}

const LTD_FEATURES = [
  "Everything in Agency tier",
  "Unlimited text testimonials",
  "Lifetime software updates",
  "Full white label branding",
  "Direct founder support",
  "Zero ongoing subscription fees",
];

export default function LTDCard({ ltdPriceId }: LTDCardProps) {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch real count of LTD workspaces
  const { data: ltdCountData, isLoading } = useQuery({
    ...trpc.billing.getLTDCount.queryOptions(),
    refetchInterval: 30000,
  });

  const realSeatsRemaining = ltdCountData ? Math.max(5, 500 - ltdCountData.count) : 500;
  const [displaySeats, setDisplaySeats] = useState(500);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedPricing");
    if (hasVisited) {
      setShowCard(true);
    } else {
      localStorage.setItem("hasVisitedPricing", "true");
      const timer = setTimeout(() => {
        setShowCard(true);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (ltdCountData) {
      setDisplaySeats(realSeatsRemaining);
    }
  }, [ltdCountData?.count, realSeatsRemaining]);

  // Get user's first workspace to start checkout
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
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

  const handleClaim = async () => {
    if (isSessionLoading) return;

    if (!session) {
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname + "?claimLTD=true#pricing")}` as any,
      );
      return;
    }

    if (!ltdPriceId) {
      toast.error("Lifetime billing not configured yet.");
      return;
    }

    const workspace = dashboardData?.workspace;
    if (!workspace || !("id" in workspace)) {
      if (isDashboardLoading) {
        toast("Preparing checkout...", { duration: 2000 });
        return;
      }
      toast.error("No workspace found. Please create one first.");
      router.push("/dashboard");
      return;
    }

    createCheckout.mutate({
      priceId: ltdPriceId,
    });
  };

  useEffect(() => {
    if (
      session &&
      searchParams.get("claimLTD") === "true" &&
      dashboardData?.workspace &&
      !createCheckout.isPending &&
      !createCheckout.isSuccess
    ) {
      handleClaim();
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, "", newUrl);
    }
  }, [session, searchParams, dashboardData?.workspace]);

  if (!showCard) return null;

  return (
    <div className="relative mx-auto mb-14 w-full">
      <div className="flex flex-col items-center justify-between gap-8 rounded-2xl border border-neutral-800 bg-[#181818] p-6 text-white shadow-xl sm:p-8 lg:flex-row">
        {/* Left column details */}
        <div className="flex-1 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs font-semibold text-neutral-200">
              <Crown className="size-3.5 text-amber-400" weight="fill" />
              <span>Founder special: Lifetime access</span>
            </div>
            <div className="inline-flex items-center gap-1 text-xs font-medium text-neutral-400">
              <Users className="size-3.5" />
              <span>{displaySeats} seats remaining</span>
            </div>
          </div>

          <h3 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl [text-wrap:balance]">
            Stop paying recurring monthly fees
          </h3>

          <p className="max-w-lg text-sm leading-relaxed text-neutral-300 [text-wrap:pretty]">
            Get all future updates, priority support, and white label capabilities for a single payment. No subscriptions or hidden fees.
          </p>

          <div className="grid grid-cols-1 gap-2.5 pt-2 sm:grid-cols-2">
            {LTD_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs font-medium text-neutral-200">
                <Sparkle className="size-3.5 shrink-0 text-amber-400" weight="fill" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column checkout card */}
        <div className="w-full rounded-xl border border-neutral-200 bg-white p-6 text-center text-neutral-900 shadow-md sm:w-80 shrink-0">
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-700 uppercase">
            One time payment
          </span>

          <div className="mt-4 flex items-baseline justify-center gap-2">
            <span className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
              $199
            </span>
            <span className="text-sm font-semibold text-neutral-400 line-through">
              $499
            </span>
          </div>

          <p className="mt-1 text-xs font-medium text-neutral-500">
            Lifetime updates included
          </p>

          <div className="mt-5 space-y-2">
            <div className="flex justify-between text-[10px] font-semibold text-neutral-500 uppercase">
              <span className="flex items-center gap-1">
                <Timer className="size-3 text-neutral-700" />
                <span>{displaySeats} left</span>
              </span>
              <span>Limited batch</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full bg-neutral-900 transition-all duration-700"
                style={{ width: `${(displaySeats / 500) * 100}%` }}
              />
            </div>
          </div>

          <Button
            onClick={handleClaim}
            disabled={createCheckout.isPending}
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:bg-neutral-800 active:scale-[0.98]"
          >
            {createCheckout.isPending ? (
              <CircleNotch className="size-4 animate-spin" weight="bold" />
            ) : null}
            <span>Claim lifetime access</span>
            <Lightning className="size-3.5 text-amber-400" weight="fill" />
          </Button>

          <p className="mt-3 text-[10px] font-medium text-neutral-400">
            Secure checkout powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
