"use client";

import { useState, useEffect } from "react";
import { Timer, Crown, Users, Sparkles, Zap, Loader2 } from "lucide-react";
import { Button } from "@my-better-t-app/ui/components/button";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { gooeyToast as toast } from "goey-toast";

interface LTDCardProps {
  ltdPriceId?: string;
}

export default function LTDCard({ ltdPriceId }: LTDCardProps) {
  const { data: session, isPending: isSessionLoading } = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch real count of LTD workspaces
  const { data: ltdCountData, isLoading } = useQuery({
    ...trpc.billing.getLTDCount.queryOptions(),
    refetchInterval: 30000, // Refresh every 30s
  });

  // Start with 500 if loading, then calculate based on real data
  const realSeatsRemaining = ltdCountData ? Math.max(5, 500 - ltdCountData.count) : 500;
  const [displaySeats, setDisplaySeats] = useState(500);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // Check if they've visited before
    const hasVisited = localStorage.getItem("hasVisitedPricing");
    if (hasVisited) {
      setShowCard(true);
    } else {
      localStorage.setItem("hasVisitedPricing", "true");
      // Show after 30 seconds
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

  // FOMO decrement logic (only runs if we have some baseline count, for effect)
  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      setDisplaySeats((prev) => {
        // Slow down or stop decrement if we're near the real count or at 500
        if (ltdCountData?.count === 0 && prev <= 498) return prev;
        if (prev <= 5) return prev;

        // Randomly decrement to show "activity" if we're below 500
        if (Math.random() > 0.95) return prev - 1;
        return prev;
      });
    }, 45000); // Slower interval (45s instead of 15s)
    return () => clearInterval(interval);
  }, [isLoading, ltdCountData?.count]);

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
      // If data is still loading, wait
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

  // Auto-trigger if returning from login with intent
  useEffect(() => {
    if (
      session &&
      searchParams.get("claimLTD") === "true" &&
      dashboardData?.workspace &&
      !createCheckout.isPending &&
      !createCheckout.isSuccess
    ) {
      handleClaim();
      // Clean up the URL
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, "", newUrl);
    }
  }, [session, searchParams, dashboardData?.workspace]);

  if (!showCard) return null;

  return (
    <div className="group relative mx-auto mb-14 w-full max-w-5xl">
      <div className="absolute -inset-1.5 rounded-[2.5rem] bg-linear-to-r from-[#e8527a] via-[#bf3fbe] to-[#e8527a] opacity-20 blur transition duration-1000 group-hover:opacity-40" />

      <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-[2.2rem] border border-white/10 bg-neutral-900 p-6 shadow-2xl sm:gap-8 md:p-10 lg:flex-row">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="size-32 text-pink-500 blur-lg" />
        </div>

        <div className="z-10 flex-1 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-[#e8527a]/40 bg-white/5 px-3 py-1 shadow-inner">
              <Crown className="size-3.5 text-[#e8527a]" />
              <span className="text-[10px] font-black tracking-[0.2em] text-[#e8527a] uppercase">
                Founder's Special: Access for Life
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-white/50 uppercase">
              <Users className="size-3" />
              <span>Only {displaySeats} seats remaining</span>
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
              "Everything in Agency",
              "Unlimited testimonials", // Video reviews coming soon
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
                  <Sparkles className="size-4 text-[#e8527a]" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-20 flex w-full flex-col items-center gap-5 rounded-[2rem] bg-white p-5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:gap-6 sm:p-8 lg:w-[340px]">
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
                Urgent: {displaySeats} Left
              </span>
              <span>Nearly Full</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 shadow-inner">
              <div
                className="h-full bg-linear-to-r from-[#e8527a] to-[#bf3fbe] shadow-[0_0_10px_rgba(232,82,122,0.3)] transition-all duration-1000"
                style={{ width: `${(displaySeats / 500) * 100}%` }}
              />
            </div>
          </div>

          <Button
            onClick={handleClaim}
            disabled={createCheckout.isPending}
            className="h-16 w-full rounded-[1.25rem] bg-[#171717] text-lg font-black text-white shadow-xl shadow-neutral-200 transition-all hover:scale-[1.02] hover:bg-neutral-800 active:scale-[0.98]"
          >
            {createCheckout.isPending ? <Loader2 className="mr-2 size-5 animate-spin" /> : null}
            Claim Lifetime Access
            <Zap className="ml-2 size-5 fill-white transition-transform group-hover:scale-125" />
          </Button>
          <p className="text-[11px] font-medium text-neutral-400">Secure Checkout via Stripe</p>
        </div>
      </div>
    </div>
  );
}
