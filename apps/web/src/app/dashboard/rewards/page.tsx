"use client";

import { trpc } from "@/utils/trpc";
import { Copy, Check, Users, Lightning, ArrowRight, ShieldCheck, Star, Sparkle } from "@phosphor-icons/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { gooeyToast as toast } from "goey-toast";
import DashboardShell from "../dashboard";
import { authClient } from "@/lib/auth-client";
import { Card } from "@my-better-t-app/ui/components/card";
import { Button } from "@my-better-t-app/ui/components/button";

export default function RewardsPage() {
  const { data: session } = authClient.useSession();
  const { data: stats, isLoading } = useQuery(trpc.referral.getStats.queryOptions());
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!stats?.referralLink) return;
    navigator.clipboard.writeText(stats.referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!session) return null;

  return (
    <DashboardShell
      userName={session.user.name || "Founder"}
      userEmail={session.user.email}
      pageTitle="Rewards & Growth"
      pageSubtitle="Give 30 days of badge-free embedding, get 30 days back."
    >
      <div className="mx-auto max-w-5xl space-y-6 pb-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:justify-between lg:text-left gap-8">
            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-800">
                <Star className="size-3.5 text-amber-500" weight="fill" />
                <span>Growth rewards</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl [text-wrap:balance]">
                Refer a founder, remove the badge
              </h1>

              <p className="text-sm leading-relaxed text-neutral-600 [text-wrap:pretty]">
                Help another founder build authentic social proof. When they embed their first wall, both of you get 30 days of badge-free embedding.
              </p>
            </div>

            <div className="w-full max-w-sm shrink-0">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 shadow-sm space-y-3">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                  Your unique invite link
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-sm">
                  <div className="flex-1 truncate px-2.5 font-mono text-xs text-neutral-600">
                    {isLoading ? "Generating..." : stats?.referralLink}
                  </div>
                  <Button
                    onClick={handleCopy}
                    disabled={isLoading}
                    className="h-8 rounded-lg bg-neutral-900 px-3 text-xs font-semibold text-white transition-all hover:bg-neutral-800 active:scale-95"
                  >
                    {copied ? <Check className="size-3.5" weight="bold" /> : <Copy className="size-3.5" weight="bold" />}
                    <span className="ml-1.5">{copied ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
                <p className="text-[11px] text-neutral-500 text-center">
                  Share via Twitter, Slack, or direct email.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800">
              <Users className="size-5" weight="bold" />
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight text-neutral-900">{stats?.totalReferred || 0}</p>
              <p className="text-xs font-semibold text-neutral-500">
                Founders referred
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
            <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800">
              <Lightning className="size-5 text-amber-500" weight="fill" />
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight text-neutral-900">{stats?.totalActivated || 0}</p>
              <p className="text-xs font-semibold text-neutral-500">
                Active widgets
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-900 bg-neutral-900 p-6 text-center text-white shadow-md">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 text-white">
              <ShieldCheck className="size-5" weight="fill" />
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight text-white">{stats?.daysRemaining || 0}</p>
              <p className="text-xs font-semibold text-neutral-300">
                Badge-free days left
              </p>
            </div>
          </div>
        </div>

        {/* How it works & Referrals */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-neutral-900">How rewards work</h2>

            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Invite a founder",
                  desc: "Send your invite link to someone building a product or service.",
                },
                {
                  step: 2,
                  title: "They create their wall",
                  desc: "They collect testimonials and get 30 days badge-free immediately.",
                },
                {
                  step: 3,
                  title: "They embed on their site",
                  desc: "Once their embedded widget gets its first live view, your reward activates.",
                },
                {
                  step: 4,
                  title: "Rewards stack indefinitely",
                  desc: "Refer 10 founders? That unlocks 300 continuous days of badge-free display.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-3.5 items-start">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-neutral-900">{item.title}</h3>
                    <p className="mt-0.5 text-xs text-neutral-500 [text-wrap:pretty]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-neutral-900">Your referrals</h2>
            <ReferralList />
          </div>
        </div>

        {/* Pro CTA banner */}
        <div className="relative flex flex-col justify-between rounded-2xl border border-neutral-900 bg-neutral-900 p-6 sm:p-8 text-white shadow-xl">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-neutral-200">
              <Sparkle className="size-3.5 text-amber-400" weight="fill" />
              <span>Instant upgrade</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white [text-wrap:balance]">
              Skip the wait and upgrade directly
            </h3>
            <p className="text-xs leading-relaxed text-neutral-300 max-w-xl [text-wrap:pretty]">
              Removing the KudosWall branding badge is standard on all Pro plans, alongside HD video downloads and unlimited collection.
            </p>
          </div>

          <div className="pt-6">
            <Button
              onClick={() => (window.location.href = "/dashboard/settings?tab=billing")}
              className="group flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-6 text-xs font-bold text-neutral-900 shadow-sm transition-all hover:bg-neutral-100 active:scale-[0.98]"
            >
              <span>Unlock Pro features</span>
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" weight="bold" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function ReferralList() {
  const { data: list, isLoading } = useQuery(trpc.referral.getReferralList.queryOptions());

  if (isLoading) {
    return (
      <div className="space-y-2.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 w-full animate-pulse rounded-xl bg-neutral-100" />
        ))}
      </div>
    );
  }

  if (!list || list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 p-8 text-center">
        <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
          <Users className="size-5" weight="bold" />
        </div>
        <p className="text-xs font-bold text-neutral-700">No referrals yet</p>
        <p className="mt-0.5 text-[11px] text-neutral-500">
          Share your invite link above to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {list.map((u) => (
        <div
          key={u.id}
          className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50/50 p-3.5 transition-colors hover:bg-neutral-50"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-700">
              {u.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900">{u.name}</p>
              <p className="text-[11px] text-neutral-500">{u.email}</p>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                u.status === "Activated"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {u.status === "Activated" && <Check className="size-2.5" weight="bold" />}
              {u.status}
            </span>
            <p className="mt-0.5 text-[10px] text-neutral-400">
              {new Date(u.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
