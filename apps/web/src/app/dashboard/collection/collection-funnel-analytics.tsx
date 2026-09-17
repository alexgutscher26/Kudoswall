"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Split,
  Layers,
  Flame,
  AlertTriangle,
  Sparkles,
  Trophy,
  Filter,
  BarChart3,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

interface CollectionFunnelAnalyticsProps {
  workspaceId: string;
  projectId: string;
  projectName: string;
  onNavigateToCustomizerTab?: (tab: string) => void;
}

export function CollectionFunnelAnalytics({
  workspaceId,
  projectId,
  projectName,
  onNavigateToCustomizerTab,
}: CollectionFunnelAnalyticsProps) {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d" | "all">("30d");

  const funnelQuery = useQuery(
    trpc.analytics.getCollectionFunnel.queryOptions({
      workspaceId,
      projectId,
      timeframe,
    }),
  );

  const data = funnelQuery.data;
  const isLoading = funnelQuery.isLoading;

  const TIMEFRAME_LABELS = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    all: "All Time",
  };

  // Find step with highest drop-off
  const bottleneckStep = data?.steps
    ? [...data.steps]
        .filter((s) => s.id !== "success")
        .sort((a, b) => b.dropOffRate - a.dropOffRate)[0]
    : null;

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">
            Funnel Analytics & A/B Testing
          </h2>
          <p className="text-xs font-medium text-neutral-500">
            Real-time conversion tracking, step drop-off heatmaps, and copy experimentation for{" "}
            <span className="font-semibold text-neutral-800">{projectName}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex rounded-xl border border-neutral-200 bg-white p-1 shadow-sm">
            {(["7d", "30d", "90d", "all"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                  timeframe === t
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {t === "7d" ? "7D" : t === "30d" ? "30D" : t === "90d" ? "90D" : "ALL"}
              </button>
            ))}
          </div>

          <button
            onClick={() => funnelQuery.refetch()}
            disabled={isLoading}
            className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-neutral-600 shadow-sm transition-all hover:bg-neutral-50 active:scale-95 disabled:opacity-50"
            title="Refresh analytics data"
          >
            <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Views */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-5 shadow-xs transition-all hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="size-5" />
            </div>
            <span className="rounded-full bg-blue-50/70 px-2 py-0.5 text-[10px] font-bold text-blue-600">
              Unique Visitors
            </span>
          </div>
          <p className="text-2xl font-black tracking-tight text-neutral-900">
            {isLoading ? "..." : (data?.overall.totalViews.toLocaleString() ?? 0)}
          </p>
          <p className="mt-1 text-xs font-medium text-neutral-500">Collection Page Views</p>
        </div>

        {/* Total Submissions */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-5 shadow-xs transition-all hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="size-5" />
            </div>
            <span className="rounded-full bg-emerald-50/70 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
              Completed
            </span>
          </div>
          <p className="text-2xl font-black tracking-tight text-neutral-900">
            {isLoading ? "..." : (data?.overall.totalSubmissions.toLocaleString() ?? 0)}
          </p>
          <p className="mt-1 text-xs font-medium text-neutral-500">Testimonials Collected</p>
        </div>

        {/* Submission Rate */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-5 shadow-xs transition-all hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
              <TrendingUp className="size-5" />
            </div>
            <span className="rounded-full bg-pink-50/70 px-2 py-0.5 text-[10px] font-bold text-pink-600">
              Conversion
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-black tracking-tight text-neutral-900">
              {isLoading ? "..." : `${data?.overall.submissionRate ?? 0}%`}
            </p>
          </div>
          <p className="mt-1 text-xs font-medium text-neutral-500">Overall Submission Rate</p>
        </div>

        {/* Avg Time */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-5 shadow-xs transition-all hover:shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Clock className="size-5" />
            </div>
            <span className="rounded-full bg-purple-50/70 px-2 py-0.5 text-[10px] font-bold text-purple-600">
              Engagement
            </span>
          </div>
          <p className="text-2xl font-black tracking-tight text-neutral-900">
            {isLoading ? "..." : `${data?.overall.averageCompletionTimeSec ?? 0}s`}
          </p>
          <p className="mt-1 text-xs font-medium text-neutral-500">Avg Completion Time</p>
        </div>
      </div>

      {/* A/B Testing Experimentation Card */}
      <div className="overflow-hidden rounded-3xl border border-neutral-100 bg-white p-6 shadow-xs">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20">
              <Split className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-neutral-900">
                  A/B Testing: Copy Experiments
                </h3>
                {data?.abTest.enabled ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 ring-1 ring-emerald-200">
                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Live & Tracking
                  </span>
                ) : (
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-500">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500">
                Split testing Headline & CTA button copy with automatic statistical attribution
              </p>
            </div>
          </div>

          {!data?.abTest.enabled && onNavigateToCustomizerTab && (
            <button
              onClick={() => onNavigateToCustomizerTab("ab")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-95"
            >
              <Sparkles className="size-3.5 text-pink-400" />
              Configure A/B Test
            </button>
          )}
        </div>

        {/* Variant Comparison Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {data?.abTest.variants.map((variant, index) => {
            const isControl = variant.id === "A";
            const isWinner = data.abTest.winner === variant.id;

            return (
              <div
                key={variant.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                  isWinner
                    ? "border-pink-200 bg-pink-50/15 shadow-md ring-2 shadow-pink-500/5 ring-pink-500/20"
                    : isControl
                      ? "border-neutral-200 bg-neutral-50/40"
                      : "border-neutral-200 bg-white"
                }`}
              >
                {isWinner && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-pink-500 px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
                    <Trophy className="size-3" />
                    Winner ({(data.abTest.confidenceScore ?? 0).toFixed(0)}% Conf.)
                  </div>
                )}

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className={`flex size-6 items-center justify-center rounded-full text-xs font-black ${
                        isControl
                          ? "bg-neutral-900 text-white"
                          : "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                      }`}
                    >
                      {variant.id}
                    </span>
                    <span className="text-sm font-black text-neutral-900">{variant.name}</span>
                  </div>

                  {/* Copy preview box */}
                  <div className="mb-4 space-y-2 rounded-xl border border-neutral-100 bg-white p-3.5 shadow-xs">
                    <div>
                      <span className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase">
                        Headline
                      </span>
                      <p className="text-xs font-bold text-neutral-900">
                        "{variant.headline || "Share your experience"}"
                      </p>
                    </div>
                    {variant.subheading && (
                      <div>
                        <span className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase">
                          Subheading
                        </span>
                        <p className="text-[11px] font-medium text-neutral-600">
                          "{variant.subheading}"
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase">
                        CTA Button Text
                      </span>
                      <p className="inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-800">
                        "{variant.ctaText || "Submit Testimonial"}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metrics for this variant */}
                <div className="border-t border-neutral-100 pt-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-neutral-50 p-2">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">
                        Impressions
                      </span>
                      <p className="text-sm font-black text-neutral-900">
                        {isLoading ? "..." : variant.impressions.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl bg-neutral-50 p-2">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">
                        Conversions
                      </span>
                      <p className="text-sm font-black text-neutral-900">
                        {isLoading ? "..." : variant.submissions.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl bg-neutral-50 p-2">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">
                        Conv. Rate
                      </span>
                      <p className="text-sm font-black text-neutral-900">
                        {isLoading ? "..." : `${variant.conversionRate}%`}
                      </p>
                    </div>
                  </div>

                  {/* Uplift Bar for Variant B */}
                  {!isControl && (
                    <div className="mt-3 flex items-center justify-between rounded-xl bg-pink-50/60 px-3 py-2 text-xs">
                      <span className="font-bold text-pink-900">Conversion Delta:</span>
                      <span
                        className={`font-black ${
                          data?.abTest.uplift && data.abTest.uplift > 0
                            ? "text-emerald-600"
                            : data?.abTest.uplift && data.abTest.uplift < 0
                              ? "text-rose-600"
                              : "text-neutral-600"
                        }`}
                      >
                        {data?.abTest.uplift && data.abTest.uplift > 0 ? "+" : ""}
                        {data?.abTest.uplift ?? 0}% Uplift
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step-by-Step Funnel Visualizer */}
      <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-xs">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Layers className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Step Completion Funnel</h3>
              <p className="text-xs text-neutral-500">
                Visitor progression through collection form wizard stages
              </p>
            </div>
          </div>
        </div>

        {/* Funnel Flow */}
        <div className="space-y-4">
          {data?.steps.map((step, index) => {
            const maxViews = data.overall.totalViews || 1;
            const barWidthPercent = Math.max(8, (step.views / maxViews) * 100);

            return (
              <div
                key={step.id}
                className="group relative rounded-2xl border border-neutral-100 bg-neutral-50/40 p-4 transition-all hover:bg-white hover:shadow-md"
              >
                <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-bold text-neutral-700">
                      {step.order}
                    </span>
                    <span className="text-xs font-bold text-neutral-900">{step.name}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                    <span className="text-neutral-500">
                      Views:{" "}
                      <strong className="text-neutral-900">{step.views.toLocaleString()}</strong>
                    </span>
                    <span className="text-neutral-500">
                      Completed:{" "}
                      <strong className="text-neutral-900">
                        {step.completions.toLocaleString()}
                      </strong>
                    </span>
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                        step.dropOffRate >= 30
                          ? "bg-rose-50 text-rose-600"
                          : step.dropOffRate >= 15
                            ? "bg-amber-50 text-amber-600"
                            : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {step.dropOffRate}% Drop-off
                    </span>
                  </div>
                </div>

                {/* Progress Visualizer Bar */}
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-700"
                    style={{ width: `${barWidthPercent}%` }}
                  />
                </div>

                {/* Metric Footer */}
                <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Step Completion Rate: {step.completionRate}%</span>
                  <span>Avg Duration: {step.avgTimeSpentSec}s</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drop-off Heatmap & Friction Matrix */}
      <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-xs">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Flame className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Drop-Off Heatmap Matrix</h3>
              <p className="text-xs text-neutral-500">
                Friction intensity and abandonment hot-spots across the submission journey
              </p>
            </div>
          </div>

          {bottleneckStep && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">
              <AlertTriangle className="size-4 text-amber-600" />
              <span>
                Highest Friction: {bottleneckStep.name} ({bottleneckStep.dropOffRate}% Drop-off)
              </span>
            </div>
          )}
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data?.dropOffHeatmap.map((item) => {
            const isCritical = item.frictionLevel === "critical";
            const isHigh = item.frictionLevel === "high";
            const isModerate = item.frictionLevel === "moderate";

            return (
              <div
                key={item.stepId}
                className={`relative flex flex-col justify-between rounded-2xl border p-4 transition-all hover:scale-[1.01] ${
                  isCritical
                    ? "border-rose-200 bg-rose-50/30 ring-1 ring-rose-300"
                    : isHigh
                      ? "border-amber-200 bg-amber-50/20"
                      : isModerate
                        ? "border-yellow-200 bg-yellow-50/10"
                        : "border-emerald-100 bg-emerald-50/10"
                }`}
              >
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">{item.stepName}</span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[9px] font-black uppercase ${
                        isCritical
                          ? "bg-rose-500 text-white"
                          : isHigh
                            ? "bg-amber-500 text-white"
                            : isModerate
                              ? "bg-yellow-500 text-white"
                              : "bg-emerald-500 text-white"
                      }`}
                    >
                      {item.frictionLevel} friction
                    </span>
                  </div>

                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-[11px] text-neutral-500">Drop-off Rate:</span>
                    <span
                      className={`text-base font-black ${
                        isCritical
                          ? "text-rose-600"
                          : isHigh
                            ? "text-amber-600"
                            : "text-neutral-900"
                      }`}
                    >
                      {item.dropOffRate}%
                    </span>
                  </div>

                  <div className="mt-1 flex items-baseline justify-between text-[11px] text-neutral-500">
                    <span>Abandoned Visitors:</span>
                    <strong className="text-neutral-800">{item.dropOffCount}</strong>
                  </div>
                </div>

                <div className="mt-3 border-t border-neutral-100 pt-2 text-[10px] font-medium text-neutral-400">
                  Avg Step Time: {item.avgTimeSpentSec}s
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
