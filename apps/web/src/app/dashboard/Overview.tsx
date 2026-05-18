import { MessageSquareQuote, Clock, Globe, BarChart2, Sparkles } from "lucide-react";
import Link from "next/link";
import type { RouterOutputs } from "@/utils/trpc";
import { StatCard } from "./components";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { TestimonialsPanel } from "./TestimonialsPanel";

type DashboardData = RouterOutputs["dashboard"]["getData"];

interface OverviewProps {
  data: DashboardData;
  workspaceId?: string;
}

export default function Overview({ data, workspaceId }: OverviewProps) {
  const isFree = data.workspace.plan === "free" || !data.workspace.plan;

  const stats = [
    {
      label: "Testimonials",
      value: data.stats.testimonials.toString(),
      sub: data.stats.testimonials > 0 ? "Great progress!" : "Start collecting today",
      icon: MessageSquareQuote,
      accent: "#e8527a",
      bg: "#fff5f7",
    },
    {
      label: "Pending Approval",
      value: data.stats.pending.toString(),
      sub: data.stats.pending > 0 ? "New submissions!" : "All clear",
      icon: Clock,
      accent: "#7c3aed",
      bg: "#f5f3ff",
    },
    {
      label: "Widget Views",
      value: data.stats.views.toString(),
      sub: data.stats.views > 0 ? "Tracking live" : "Embed to start tracking",
      icon: Globe,
      accent: "#0ea5e9",
      bg: "#f0f9ff",
      locked: isFree,
    },
    {
      label: "Conversion Rate",
      value: data.stats.conversion,
      sub: data.stats.views > 0 ? "Real-time performance" : "Needs more data",
      icon: BarChart2,
      accent: "#16a34a",
      bg: "#f0fdf4",
      locked: isFree,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-5 overflow-x-hidden sm:space-y-6">
      {isFree && (
        <div className="relative overflow-hidden rounded-2xl border border-pink-100 bg-white p-4 sm:p-5">
          <div className="absolute top-[-50%] right-[-10%] size-48 rounded-full bg-pink-500/5 blur-[60px]" />
          <div className="relative z-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
                <Sparkles className="size-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-[14px] font-bold tracking-tight text-neutral-900">
                  Ready to take your testimonials to the next level?
                </h3>
                <p className="max-w-xl text-[12px] font-medium text-neutral-500">
                  Upgrade to Pro to remove branding, use custom domains, analytics, and more.
                </p>
              </div>
            </div>
            <Link
              href={`/dashboard/settings?tab=billing&workspaceId=${workspaceId}` as any}
              className="rounded-xl bg-neutral-900 px-4 py-2 text-[12px] font-bold text-white transition-all hover:bg-neutral-800 active:scale-[0.98]"
            >
              Unlock Pro Features
            </Link>
          </div>
        </div>
      )}

      {/* Stats grid — 2 cols on mobile, 4 on xl */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-3">
        {/* Testimonials panel (Client Component for interactivity) */}
        <div className="xl:col-span-2">
          <TestimonialsPanel data={data} workspaceId={workspaceId} />
        </div>

        {/* Right column */}
        <div className="space-y-4 sm:space-y-5 xl:col-span-1">
          {data.onboarding && <OnboardingChecklist status={data.onboarding} />}
        </div>
      </div>
    </div>
  );
}
