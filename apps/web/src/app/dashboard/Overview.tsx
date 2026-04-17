import { MessageSquareQuote, Clock, Globe, BarChart2 } from "lucide-react";
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
