"use client";

import { useState } from "react";
import Link from "next/link";
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
  List,
  Download,
  Loader2,
  Check,
} from "lucide-react";
import { trpc, trpcClient } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { gooeyToast as toast } from "goey-toast";

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

// ─── Performance Chart ────────────────────────────────────────────────────────

function PerformanceChart({ data }: { data: { name: string; views: number }[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-neutral-400">
        No data available for this timeframe.
      </div>
    );
  }

  const maxViews = Math.max(...data.map((d) => d.views), 10);
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 1000;
      const y = 280 - (d.views / maxViews) * 200;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPath = `M0,300 L0,${280 - (data[0].views / maxViews) * 200} ${data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 1000;
      const y = 280 - (d.views / maxViews) * 200;
      return `L${x},${y}`;
    })
    .join(" ")} L1000,300 Z`;

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
            <stop offset="0%" stopColor="#e8527a" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#e8527a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area under the line */}
        <polyline
          fill="url(#gradient)"
          stroke="none"
          points={`0,300 ${data
            .map((d, i) => {
              const x = data.length > 1 ? (i / (data.length - 1)) * 1000 : 500;
              const y = maxViews > 0 ? 280 - (d.views / maxViews) * 200 : 280;
              return `${x},${y}`;
            })
            .join(" ")} ${data.length > 1 ? 1000 : 500},300`}
          className="transition-all duration-700"
        />

        {/* Line */}
        <polyline
          fill="none"
          stroke="#e8527a"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={data
            .map((d, i) => {
              const x = data.length > 1 ? (i / (data.length - 1)) * 1000 : 500;
              const y = maxViews > 0 ? 280 - (d.views / maxViews) * 200 : 280;
              return `${x},${y}`;
            })
            .join(" ")}
          className="drop-shadow-sm transition-all duration-700"
        />

        {/* Data points (only show for smaller sets) */}
        {data.length <= 15 &&
          data.map((d, i) => {
            const x = data.length > 1 ? (i / (data.length - 1)) * 1000 : 500;
            const y = maxViews > 0 ? 280 - (d.views / maxViews) * 200 : 280;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="white"
                stroke="#e8527a"
                strokeWidth="2"
                className="transition-all duration-700"
              />
            );
          })}
      </svg>

      {/* X Axis Labels */}
      <div className="absolute right-0 bottom-[-24px] left-0 flex justify-between px-2">
        {data.map((d, i) => {
          // Only show ~7 labels to avoid clumping
          const skipCount = Math.ceil(data.length / 7);
          if (i % skipCount !== 0 && i !== data.length - 1) return null;

          return (
            <span
              key={d.name + i}
              className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase"
            >
              {d.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d" | "all">("7d");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isExporting, setIsExporting] = useState(false);
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);

  const TIMEFRAME_LABELS = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    all: "All Time",
  };

  const overviewQuery = useQuery(trpc.analytics.getOverview.queryOptions({ timeframe }));
  const chartQuery = useQuery(trpc.analytics.getChartData.queryOptions({ timeframe }));
  const widgetPerformanceQuery = useQuery(
    trpc.analytics.getWidgetPerformance.queryOptions({ timeframe }),
  );
  const topTestimonialsQuery = useQuery(trpc.analytics.getTopTestimonials.queryOptions());

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await trpcClient.analytics.getExportData.query({ timeframe });
      if (!data || data.length === 0) {
        toast.error("No data available to export");
        return;
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(","),
        ...data.map((row: any) =>
          headers
            .map((fieldName) => {
              const value = row[fieldName as keyof typeof row] ?? "";
              const strValue = String(value);
              return strValue.includes(",") ? `"${strValue}"` : strValue;
            })
            .join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `analytics_export_${timeframe}_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Export successful!");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const isLoading =
    overviewQuery.isLoading ||
    chartQuery.isLoading ||
    widgetPerformanceQuery.isLoading ||
    topTestimonialsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <Loader2 className="size-8 animate-spin text-neutral-300" />
        <p className="text-sm font-medium text-neutral-400">Loading your insights...</p>
      </div>
    );
  }

  const overview = overviewQuery.data;
  const chartData = chartQuery.data || [];
  const performance = widgetPerformanceQuery.data || [];
  const topTestimonials = topTestimonialsQuery.data || [];

  const STATS_DATA: Stat[] = [
    {
      label: "Total Views",
      value: overview?.totalViews || "0",
      change: "+0%",
      trend: "up",
      icon: Globe,
      accent: "#e8527a",
      bg: "#fff5f7",
    },
    {
      label: "Conversion Rate",
      value: overview?.conversionRate || "0%",
      change: "+0%",
      trend: "up",
      icon: TrendingUp,
      accent: "#0ea5e9",
      bg: "#f0f9ff",
    },
    {
      label: "Total Testimonials",
      value: overview?.totalTestimonials || "0",
      change: `+${overview?.newTestimonials || 0}`,
      trend: "up",
      icon: MessageSquareQuote,
      accent: "#16a34a",
      bg: "#f0fdf4",
    },
    {
      label: "Widget Avg CTR",
      value:
        performance.length > 0
          ? (
              performance.reduce((acc, curr) => acc + parseFloat(curr.ctr), 0) / performance.length
            ).toFixed(1) + "%"
          : "0%",
      change: "0%",
      trend: "up",
      icon: MousePointer2,
      accent: "#7c3aed",
      bg: "#f5f3ff",
    },
  ];

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
            Real-time overview of your testimonial performance across the web
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
              type="button"
              className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13px] font-semibold text-neutral-700 transition-all hover:bg-neutral-50"
            >
              <Calendar className="size-3.5 text-neutral-400" />
              {TIMEFRAME_LABELS[timeframe]}
              <ChevronDown
                className={`size-3 text-neutral-400 transition-transform ${isTimeframeOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isTimeframeOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsTimeframeOpen(false)} />
                <div className="animate-in fade-in zoom-in-95 absolute top-full right-0 z-20 mt-2 w-48 overflow-hidden rounded-2xl border border-neutral-100 bg-white p-1 shadow-xl duration-200">
                  {(Object.keys(TIMEFRAME_LABELS) as Array<keyof typeof TIMEFRAME_LABELS>).map(
                    (key) => (
                      <button
                        key={key}
                        onClick={() => {
                          setTimeframe(key);
                          setIsTimeframeOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-[13px] font-semibold transition-colors ${
                          timeframe === key
                            ? "bg-neutral-50 text-neutral-900"
                            : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                        }`}
                      >
                        {TIMEFRAME_LABELS[key]}
                        {timeframe === key && <Check className="size-3.5 text-neutral-900" />}
                      </button>
                    ),
                  )}
                </div>
              </>
            )}
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            type="button"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            style={{ backgroundColor: "#171717" }}
          >
            {isExporting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5" />
            )}
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS_DATA.map((stat) => (
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
              Daily impressions{" "}
              {timeframe === "all"
                ? "for all time"
                : `for the ${TIMEFRAME_LABELS[timeframe].toLowerCase()}`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[12px] font-bold text-neutral-600">
              <span className="size-2 rounded-full bg-pink-500" />
              Impressions
            </div>
          </div>
        </div>
        <PerformanceChart data={chartData} />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-3">
        {/* Widget Performance Section */}
        <div className="overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-neutral-50 px-6 py-5">
            <h3 className="text-[15px] font-bold text-neutral-900">Active Widgets Performance</h3>
            <button
              onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
              type="button"
              className="group flex size-8 items-center justify-center rounded-full text-neutral-400 transition-all hover:bg-neutral-50 hover:text-neutral-900"
              title={`Switch to ${viewMode === "table" ? "Grid" : "Table"} View`}
            >
              {viewMode === "table" ? (
                <LayoutGrid className="size-4" />
              ) : (
                <List className="size-4" />
              )}
            </button>
          </div>

          {viewMode === "table" ? (
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {performance.map((w) => (
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
                    </tr>
                  ))}
                  {performance.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-sm text-neutral-400">
                        No active widgets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
              {performance.map((w) => (
                <div
                  key={w.name}
                  className="rounded-2xl border border-neutral-100 p-4 transition-all hover:border-pink-100 hover:shadow-sm"
                >
                  <h4 className="mb-3 text-[14px] font-bold text-neutral-900">{w.name}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                        Views
                      </p>
                      <p className="text-lg font-bold text-neutral-900">
                        {w.views.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                        Clicks
                      </p>
                      <p className="text-lg font-bold text-neutral-900">
                        {w.clicks.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-dotted border-neutral-100 pt-3">
                    <span className="text-[12px] font-bold text-pink-500">{w.ctr} CTR</span>
                  </div>
                </div>
              ))}
              {performance.length === 0 && (
                <div className="col-span-full py-10 text-center text-sm text-neutral-400">
                  No active widgets found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Top Testimonials */}
        <div className="overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-sm xl:col-span-1">
          <div className="border-b border-neutral-50 px-6 py-5">
            <h3 className="text-[15px] font-bold text-neutral-900">Highest Rated</h3>
          </div>
          <div className="space-y-4 p-4">
            {topTestimonials.map((t) => (
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
                  <p className="text-[12px] font-bold text-neutral-800">{t.rating} ★</p>
                </div>
              </div>
            ))}
            {topTestimonials.length === 0 && (
              <p className="py-10 text-center text-sm text-neutral-400">
                No approved testimonials yet.
              </p>
            )}
            <Link
              href="/dashboard"
              className="flex w-full items-center justify-center gap-2 py-3 text-[13px] font-bold text-neutral-400 underline-offset-4 transition-colors hover:text-neutral-900 hover:underline"
            >
              View all insights
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
