"use client";

import { useState } from "react";
import {
  TrendingUp,
  MousePointer2,
  MessageSquareQuote,
  Globe,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  LayoutGrid,
  Download,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  accent: string;
  bg: string;
}

interface WidgetPerformance {
  name: string;
  views: number;
  clicks: number;
  ctr: string;
  submissions: number;
  conversionRate: string;
}

interface TopTestimonial {
  author: string;
  company: string;
  views: number;
  clicks: number;
  ctr: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const OVERVIEW_STATS: Stat[] = [
  {
    label: "Total Views",
    value: "14,821",
    change: "+12.5%",
    trend: "up",
    icon: Globe,
    accent: "#e8527a",
    bg: "#fff5f7",
  },
  {
    label: "Widget CTR",
    value: "4.2%",
    change: "-0.8%",
    trend: "down",
    icon: MousePointer2,
    accent: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    label: "New Testimonials",
    value: "18",
    change: "+4",
    trend: "up",
    icon: MessageSquareQuote,
    accent: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    label: "Conversion Rate",
    value: "2.8%",
    change: "+0.3%",
    trend: "up",
    icon: TrendingUp,
    accent: "#0ea5e9",
    bg: "#f0f9ff",
  },
];

const WIDGET_PERFORMANCE: WidgetPerformance[] = [
  {
    name: "Homepage Grid",
    views: 8421,
    clicks: 354,
    ctr: "4.2%",
    submissions: 12,
    conversionRate: "2.8%",
  },
  {
    name: "Pricing Masonry",
    views: 4104,
    clicks: 128,
    ctr: "3.1%",
    submissions: 4,
    conversionRate: "0.19%",
  },
  {
    name: "Feature Carousel",
    views: 2296,
    clicks: 82,
    ctr: "3.5%",
    submissions: 2,
    conversionRate: "0.16%",
  },
];

const TOP_TESTIMONIALS: TopTestimonial[] = [
  {
    author: "Sarah Chen",
    company: "Acme Corp",
    views: 1200,
    clicks: 48,
    ctr: "4.0%",
  },
  {
    author: "James Okafor",
    company: "LaunchPad SaaS",
    views: 950,
    clicks: 32,
    ctr: "3.3%",
  },
  {
    author: "Priya Anand",
    company: "Bloom Studio",
    views: 820,
    clicks: 28,
    ctr: "3.4%",
  },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────

function PerformanceStatCard({ label, value, change, trend, icon: Icon, accent, bg }: Stat) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div
          className="flex size-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: bg }}
        >
          <Icon className="size-5" style={{ color: accent }} />
        </div>
        <div
          className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
            trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          }`}
        >
          {trend === "up" ? (
            <ArrowUpRight className="size-3" />
          ) : (
            <ArrowDownRight className="size-3" />
          )}
          {change}
        </div>
      </div>
      <p className="mb-1.5 text-3xl leading-none font-bold tracking-tight text-neutral-900">
        {value}
      </p>
      <p className="text-[13px] font-medium text-neutral-500">{label}</p>
    </div>
  );
}

// ─── Mock Chart ───────────────────────────────────────────────────────────────

function MockPerformanceChart() {
  return (
    <div className="group relative mt-6 h-[300px] w-full">
      {/* Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between">
        {[...Array(5)].map((_, i) => (
          <div key={`grid-${i}`} className="h-px w-full bg-neutral-50" />
        ))}
      </div>

      {/* SVG Line Chart */}
      <svg
        viewBox="0 0 1000 300"
        className="preserve-3d absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8527a" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#e8527a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path
          d="M0,280 Q100,240 200,260 T400,200 T600,220 T800,140 T1000,100 L1000,300 L0,300 Z"
          fill="url(#gradient)"
        />

        {/* Line */}
        <path
          d="M0,280 Q100,240 200,260 T400,200 T600,220 T800,140 T1000,100"
          fill="none"
          stroke="#e8527a"
          strokeWidth="3"
          strokeLinecap="round"
          className="drop-shadow-sm transition-all duration-300"
        />

        {/* Data points */}
        <circle cx="200" cy="260" r="4" fill="white" stroke="#e8527a" strokeWidth="2" />
        <circle cx="400" cy="200" r="4" fill="white" stroke="#e8527a" strokeWidth="2" />
        <circle cx="600" cy="220" r="4" fill="white" stroke="#e8527a" strokeWidth="2" />
        <circle cx="800" cy="140" r="4" fill="white" stroke="#e8527a" strokeWidth="2" />
        <circle cx="1000" cy="100" r="4" fill="white" stroke="#e8527a" strokeWidth="2" />
      </svg>

      {/* X Axis Labels */}
      <div className="absolute right-0 bottom-[-24px] left-0 flex justify-between px-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <span
            key={day}
            className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase"
          >
            {day}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("Last 7 Days");

  return (
    <div className="mx-auto max-w-6xl space-y-5 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Performance Analytics
          </h1>
          <p className="mt-0.5 text-[13px] text-neutral-400">
            Overview of your testimonial performance across all active widgets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13px] font-semibold text-neutral-700 transition-all hover:bg-neutral-50"
            >
              <Calendar className="size-3.5 text-neutral-400" />
              {timeframe}
              <ChevronDown className="size-3 text-neutral-400" />
            </button>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "#171717" }}
          >
            <Download className="size-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {OVERVIEW_STATS.map((stat) => (
          <PerformanceStatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Chart Section */}
      <div className="rounded-3xl border border-neutral-100 bg-white p-6 sm:p-8">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-neutral-900">
              Widget Views Over Time
            </h3>
            <p className="text-[13px] text-neutral-400">
              Comparing views vs. conversions for this week
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[12px] font-bold text-neutral-600">
              <span className="size-2 rounded-full bg-pink-500" />
              Impressions
            </div>
            <div className="flex items-center gap-2 text-[12px] font-bold text-neutral-400">
              <span className="size-2 rounded-full bg-neutral-200" />
              Submissions
            </div>
          </div>
        </div>
        <MockPerformanceChart />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-3">
        {/* Widget Performance Table */}
        <div className="overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-neutral-50 px-6 py-5">
            <h3 className="text-[15px] font-bold text-neutral-900">Active Widgets Performance</h3>
            <button
              type="button"
              className="text-neutral-400 transition-colors hover:text-neutral-600"
            >
              <LayoutGrid className="size-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-neutral-50/50">
                  <th className="px-6 py-3 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Widget Name
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Views
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    CTR
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    New Subs
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {WIDGET_PERFORMANCE.map((w) => (
                  <tr key={w.name} className="transition-colors hover:bg-neutral-50/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                          <ArrowUpRight className="size-3.5 text-neutral-500" />
                        </div>
                        <span className="text-[13px] font-bold text-neutral-800">{w.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-medium text-neutral-600">
                      {w.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-[13px] font-medium text-neutral-600">
                      {w.clicks.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[12px] font-bold text-neutral-800">
                        {w.ctr}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px] font-bold text-emerald-600">
                      +{w.submissions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Testimonials */}
        <div className="overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-sm xl:col-span-1">
          <div className="border-b border-neutral-50 px-6 py-5">
            <h3 className="text-[15px] font-bold text-neutral-900">Highest Converting</h3>
          </div>
          <div className="space-y-4 p-4">
            {TOP_TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="group flex items-center gap-3 rounded-2xl border border-neutral-50 p-3 transition-all hover:border-pink-100 hover:bg-pink-50/20"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 font-bold text-neutral-500 group-hover:bg-pink-100 group-hover:text-pink-600">
                  {t.author.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] leading-tight font-bold text-neutral-800">
                    {t.author}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-neutral-400">{t.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-[12px] font-bold text-neutral-800">{t.ctr}</p>
                  <p className="text-[10px] font-bold tracking-wider text-neutral-300 uppercase">
                    CTR
                  </p>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 py-3 text-[13px] font-bold text-neutral-400 transition-colors hover:text-neutral-900"
            >
              View all insights
              <ArrowUpRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
