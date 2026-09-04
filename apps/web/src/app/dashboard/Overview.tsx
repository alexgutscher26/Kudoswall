"use client";

import { Quotes, Clock, Globe, ChartBar, Sparkle } from "@phosphor-icons/react";
import Link from "next/link";
import type { RouterOutputs } from "@/utils/trpc";
import { StatCard } from "./components";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { TestimonialsPanel } from "./TestimonialsPanel";
import { MomentOfJoyModal } from "@/components/modals/MomentOfJoyModal";

type DashboardData = RouterOutputs["dashboard"]["getData"];

interface OverviewProps {
  data: DashboardData;
  workspaceId?: string;
}

export default function Overview({ data, workspaceId }: OverviewProps) {
  const isFree =
    data.permissions?.effectivePlan === "free" ||
    data.workspace.plan === "free" ||
    !data.workspace.plan;
  const hasVideoTestimonial = data.recentTestimonials.some((t) => t.type === "video");

  const stats = [
    {
      label: "Total testimonials",
      value: data.stats.testimonials.toString(),
      sub: data.stats.testimonials > 0 ? "Active in workspace" : "Start collecting today",
      icon: Quotes,
      accent: "#171717",
      bg: "#ffffff",
    },
    {
      label: "Pending approval",
      value: data.stats.pending.toString(),
      sub: data.stats.pending > 0 ? "Awaiting your review" : "All caught up",
      icon: Clock,
      accent: "#171717",
      bg: "#ffffff",
    },
    {
      label: "Widget views",
      value: data.stats.views.toString(),
      sub: data.stats.views > 0 ? "Live edge tracking" : "Embed widget to track",
      icon: Globe,
      accent: "#171717",
      bg: "#ffffff",
      locked: isFree,
    },
    {
      label: "Conversion rate",
      value: data.stats.conversion,
      sub: data.stats.views > 0 ? "Real time visitor lift" : "Requires widget views",
      icon: ChartBar,
      accent: "#171717",
      bg: "#ffffff",
      locked: isFree,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 overflow-x-hidden">
      {/* Contextual Milestone Modals */}
      <MomentOfJoyModal
        workspaceId={workspaceId || data.workspace.id}
        testimonialsCount={data.stats.testimonials}
        hasVideoTestimonial={hasVideoTestimonial}
        permissions={data.permissions}
      />

      {isFree && (
        <div className="relative flex flex-col items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-neutral-900 p-5 text-white shadow-sm sm:flex-row sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
              <Sparkle className="size-5" weight="fill" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white [text-wrap:balance]">
                You are currently on the Free tier (10 testimonials limit)
              </h3>
              <p className="mt-0.5 text-xs text-neutral-300 [text-wrap:pretty]">
                Upgrade to Pro to unlock unlimited testimonials, high definition video downloads, and custom branding.
              </p>
            </div>
          </div>
          <Link
            href={`/dashboard/settings?tab=billing&workspaceId=${workspaceId}` as any}
            className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-neutral-900 shadow-sm transition-all duration-300 hover:bg-neutral-100 active:scale-[0.98]"
          >
            Unlock Pro features
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Main Split Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Testimonials panel */}
        <div className="xl:col-span-2">
          <TestimonialsPanel data={data} workspaceId={workspaceId} />
        </div>

        {/* Right column: Onboarding checklist */}
        <div className="space-y-6 xl:col-span-1">
          {data.onboarding && <OnboardingChecklist status={data.onboarding} />}
        </div>
      </div>
    </div>
  );
}
