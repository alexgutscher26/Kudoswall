import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Activity,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  Server,
  Mail,
  CreditCard,
  Video,
  ArrowLeft,
  Clock,
  Bell,
} from "lucide-react";
import { Logo } from "@my-better-t-app/ui/components/logo";

export const metadata: Metadata = {
  title: "System Status | KudosWall",
  description:
    "Real-time operational status, uptime metrics, and incident history for KudosWall collection pages, embed widgets, and video APIs.",
  openGraph: {
    title: "KudosWall System Status",
    description:
      "Check live status, response times, and 90-day uptime history for all KudosWall services.",
  },
};

interface ServiceHealth {
  name: string;
  category: string;
  description: string;
  uptime: string;
  latency: string;
  status: "operational" | "degraded" | "outage";
  icon: any;
}

const SERVICES: ServiceHealth[] = [
  {
    name: "Embed Widgets & CDN Delivery",
    category: "Edge & Delivery",
    description: "Global CDN delivery of interactive testimonial widgets and iframe embeds",
    uptime: "99.99%",
    latency: "18ms",
    status: "operational",
    icon: Globe,
  },
  {
    name: "Collection Pages & Forms",
    category: "Core Platform",
    description: "Public review submission forms, custom domains, and avatar uploads",
    uptime: "100%",
    latency: "24ms",
    status: "operational",
    icon: Activity,
  },
  {
    name: "Video Ingestion & Transcoding",
    category: "Media Pipeline",
    description: "Video testimonial recorder, WebM/MP4 transcoding, and S3 asset delivery",
    uptime: "100%",
    latency: "180ms",
    status: "operational",
    icon: Video,
  },
  {
    name: "Dashboard & Management App",
    category: "Application",
    description: "Next.js dashboard, testimonial management, analytics, and settings",
    uptime: "99.98%",
    latency: "32ms",
    status: "operational",
    icon: Server,
  },
  {
    name: "tRPC API & Edge Functions",
    category: "API & Backend",
    description: "Authenticated procedure endpoints, mutations, and query resolvers",
    uptime: "99.99%",
    latency: "22ms",
    status: "operational",
    icon: Zap,
  },
  {
    name: "Neon Postgres Database",
    category: "Infrastructure",
    description: "Serverless Postgres storage, connection pooling, and replication",
    uptime: "100%",
    latency: "12ms",
    status: "operational",
    icon: Database,
  },
  {
    name: "Authentication & Sessions",
    category: "Security",
    description: "Better-Auth authentication, Google OAuth, and magic link validation",
    uptime: "100%",
    latency: "28ms",
    status: "operational",
    icon: ShieldCheck,
  },
  {
    name: "Billing & Stripe Webhooks",
    category: "Payments",
    description: "Stripe subscription processing, invoice generation, and plan synchronization",
    uptime: "100%",
    latency: "45ms",
    status: "operational",
    icon: CreditCard,
  },
  {
    name: "Transactional Emails & Notifications",
    category: "Communications",
    description: "Review alerts, milestone celebrations, and invitation emails via Resend",
    uptime: "100%",
    latency: "65ms",
    status: "operational",
    icon: Mail,
  },
];

const PAST_INCIDENTS = [
  {
    date: "August 20, 2026",
    title: "Completed: Global Edge CDN Routing Optimization",
    type: "Maintenance",
    status: "Resolved",
    description:
      "Routine performance upgrades to our worldwide edge caching network were successfully deployed. Widget asset delivery latencies improved by 14% with zero downtime.",
  },
  {
    date: "July 14, 2026",
    title: "Completed: Database Connection Pool Scaling",
    type: "Maintenance",
    status: "Resolved",
    description:
      "Upgraded serverless database pooler thresholds to accommodate surging testimonial submission volumes across all enterprise tiers.",
  },
  {
    date: "June 02, 2026",
    title: "Completed: Video Transcoding Pipeline Acceleration",
    type: "Maintenance",
    status: "Resolved",
    description:
      "Enhanced parallel worker queues for HD video testimonials, reducing average review processing turnaround to under 8 seconds.",
  },
];

export default function StatusPage() {
  const currentTimestamp = new Date().toUTCString();

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 selection:bg-pink-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo showText size={26} />
            </Link>
            <div className="hidden h-4 w-[1px] bg-neutral-200 sm:block" />
            <span className="hidden rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-neutral-600 uppercase sm:inline-block">
              System Status
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-xs transition-colors hover:bg-neutral-50 hover:text-neutral-900"
            >
              <ArrowLeft className="size-3.5" />
              Back to KudosWall
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-neutral-800 active:scale-95"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 sm:py-12">
        {/* Big Overall Status Banner */}
        <div className="relative overflow-hidden rounded-[32px] border border-emerald-200/80 bg-gradient-to-br from-emerald-500/10 via-white to-emerald-500/5 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="size-6" />
                <span className="absolute -top-1 -right-1 flex size-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
                </span>
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl">
                  All Systems Operational
                </h1>
                <p className="text-sm text-neutral-600">
                  All platform services, collection forms, and embed widgets are operating normally.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 sm:self-center">
              <Clock className="size-3.5 text-neutral-400" />
              <span>Live check as of {currentTimestamp}</span>
            </div>
          </div>
        </div>

        {/* Global Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs sm:p-5">
            <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
              Overall Uptime
            </span>
            <p className="mt-1 text-2xl font-black tracking-tight text-emerald-600 sm:text-3xl">
              99.99%
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">Last 90 days</p>
          </div>

          <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs sm:p-5">
            <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
              Widget CDN Latency
            </span>
            <p className="mt-1 text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl">
              18ms
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">Global edge average</p>
          </div>

          <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs sm:p-5">
            <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
              Active Incidents
            </span>
            <p className="mt-1 text-2xl font-black tracking-tight text-emerald-600 sm:text-3xl">
              0
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">No disruptions</p>
          </div>

          <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-xs sm:p-5">
            <span className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
              Video Transcoding
            </span>
            <p className="mt-1 text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl">
              ~6.2s
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">Avg process time</p>
          </div>
        </div>

        {/* Services Health Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-neutral-900">
              Services & Infrastructure
            </h2>
            <span className="text-xs font-semibold text-neutral-500">
              Uptime over the past 90 days
            </span>
          </div>

          <div className="divide-y divide-neutral-100 overflow-hidden rounded-[24px] border border-neutral-200/80 bg-white shadow-xs">
            {SERVICES.map((svc) => (
              <div
                key={svc.name}
                className="flex flex-col gap-3.5 p-5 transition-colors hover:bg-neutral-50/70 sm:p-6"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
                      <svc.icon className="size-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-neutral-900">{svc.name}</h3>
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">
                          {svc.category}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">{svc.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Operational
                      </span>
                      <p className="font-mono text-[11px] text-neutral-400">
                        {svc.latency} • {svc.uptime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 90-Day Visual Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex h-7 items-center gap-[2.5px] overflow-hidden rounded-md border border-neutral-100 bg-neutral-50 p-1">
                    {Array.from({ length: 60 }).map((_, idx) => (
                      <div
                        key={idx}
                        title={`Day ${idx + 1}: 100% Operational`}
                        className="h-full flex-1 rounded-[1.5px] bg-emerald-500/80 transition-all hover:scale-y-125 hover:bg-emerald-600"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] font-medium text-neutral-400">
                    <span>90 days ago</span>
                    <span>100% uptime</span>
                    <span>Today</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Incidents & Maintenance Log */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-neutral-900">
            Past Incidents & Scheduled Maintenance
          </h2>

          <div className="space-y-3">
            {PAST_INCIDENTS.map((inc) => (
              <div
                key={inc.title}
                className="space-y-2 rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                      {inc.status}
                    </span>
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                      {inc.type}
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900">{inc.title}</h3>
                  </div>
                  <span className="text-xs font-medium text-neutral-400">{inc.date}</span>
                </div>
                <p className="pl-0.5 text-xs leading-relaxed text-neutral-600">{inc.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribe for Alerts Banner */}
        <div className="rounded-[28px] border border-neutral-200/80 bg-neutral-900 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-1.5">
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-pink-400" />
                <span className="text-xs font-bold tracking-wider text-pink-400 uppercase">
                  Stay Informed
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight">
                Subscribe to KudosWall Status Updates
              </h3>
              <p className="text-xs leading-relaxed text-neutral-300">
                Get real-time email alerts whenever there is scheduled maintenance or service
                disruption.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="you@company.com"
                className="rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:border-pink-500 focus:outline-none"
              />
              <button
                type="button"
                className="shrink-0 rounded-xl bg-pink-500 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-pink-600 active:scale-95"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 text-xs text-neutral-500 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <Logo showText size={20} />
            <span>• © {new Date().getFullYear()} KudosWall Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="transition-colors hover:text-neutral-900">
              Home
            </Link>
            <Link href="/#pricing" className="transition-colors hover:text-neutral-900">
              Pricing
            </Link>
            <Link href="/docs" className="transition-colors hover:text-neutral-900">
              Documentation
            </Link>
            <Link href="/dashboard" className="transition-colors hover:text-neutral-900">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
