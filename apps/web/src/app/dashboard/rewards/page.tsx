"use client";

import { trpc } from "@/utils/trpc";
import { 
  Gift, 
  Copy, 
  Check, 
  Users, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Star
} from "lucide-react";
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
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-pink-100 bg-gradient-to-br from-white to-pink-50/30 p-8 sm:p-12">
          {/* Decorative elements */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-pink-500/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-pink-500/5 blur-3xl" />
          
          <div className="relative flex flex-col items-center text-center lg:flex-row lg:text-left lg:items-start lg:justify-between">
            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-1.5 text-[11px] font-black tracking-widest text-pink-500 uppercase shadow-sm">
                <Star className="size-3 fill-pink-500" />
                Growth Engine
              </div>
              
              <h1 className="text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">
                Refer a friend, <br />
                <span className="text-pink-500">Remove the badge.</span>
              </h1>
              
              <p className="text-lg font-medium leading-relaxed text-neutral-500">
                Help another founder build social proof. When they embed their first wall, 
                <span className="font-bold text-neutral-900"> both of you </span> 
                get 30 days of badge-free embedding (a Pro feature).
              </p>

            </div>

            <div className="mt-12 w-full max-w-sm lg:mt-0">
              <Card className="overflow-hidden rounded-3xl border-2 border-neutral-100 bg-white p-6 shadow-xl shadow-pink-500/5">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                      Your Unique Invite Link
                    </label>
                    <div className="flex items-center gap-2 rounded-2xl border-2 border-neutral-50 bg-neutral-50 p-1.5 transition-all focus-within:border-pink-500/20 focus-within:bg-white">
                      <div className="flex-1 px-3 py-1 font-mono text-xs font-bold text-neutral-500 truncate">
                        {isLoading ? "Generating..." : stats?.referralLink}
                      </div>
                      <Button 
                        onClick={handleCopy}
                        disabled={isLoading}
                        className="h-10 rounded-xl bg-neutral-900 px-4 text-[11px] font-black tracking-widest text-white uppercase transition-all hover:bg-neutral-800 active:scale-95"
                      >
                        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                        <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-center text-[10px] font-medium text-neutral-400 leading-tight">
                    Share this link with founders on Twitter, Slack, or via Email.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="flex flex-col items-center justify-center gap-2 rounded-[2rem] border-2 border-neutral-100 bg-white p-8 text-center transition-all hover:border-pink-200">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-400">
              <Users className="size-6" />
            </div>
            <div>
              <p className="text-3xl font-black text-neutral-900">{stats?.totalReferred || 0}</p>
              <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Founders Referred</p>
            </div>
          </Card>

          <Card className="flex flex-col items-center justify-center gap-2 rounded-[2rem] border-2 border-neutral-100 bg-white p-8 text-center transition-all hover:border-pink-200">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
              <Zap className="size-6 fill-emerald-500" />
            </div>
            <div>
              <p className="text-3xl font-black text-neutral-900">{stats?.totalActivated || 0}</p>
              <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Activations</p>
            </div>
          </Card>

          <Card className="flex flex-col items-center justify-center gap-2 rounded-[2rem] border-2 border-neutral-100 bg-pink-500 p-8 text-center text-white shadow-lg shadow-pink-500/20 transition-all hover:scale-[1.02]">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/20">
              <ShieldCheck className="size-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-black">{stats?.daysRemaining || 0}</p>
              <p className="text-[10px] font-bold tracking-widest text-white/70 uppercase">Days of Badge-Free remaining</p>
            </div>
          </Card>
        </div>

        {/* How it works & Referral List */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight text-neutral-900">How it works</h2>
            
            <div className="space-y-4">
              {[
                { 
                  step: 1, 
                  title: "Invite a Founder", 
                  desc: "Send your link to someone who needs to showcase testimonials." 
                },
                { 
                  step: 2, 
                  title: "They setup their wall", 
                  desc: "They get 50 testimonials free and their first 30 days are badge-free immediately." 
                },
                { 
                  step: 3, 
                  title: "They embed it", 
                  desc: "Once they embed their first widget and it gets 1 view, your reward activates." 
                },
                { 
                  step: 4, 
                  title: "Rewards Stack", 
                  desc: "Refer 10 people? That's 300 days of Pro-tier branding for free." 
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-black text-white">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">{item.title}</h3>
                    <p className="text-xs font-medium text-neutral-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black tracking-tight text-neutral-900">Your Referrals</h2>
            <ReferralList />
          </div>
        </div>

        {/* Skip the wait CTA */}
        <Card className="relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border-2 border-neutral-900 bg-neutral-900 p-8 text-white">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-3 py-1 text-[9px] font-black tracking-widest text-white uppercase">
              Pro Feature Preview
            </div>
            <h3 className="text-2xl font-black leading-tight">
              Get a taste of <br />
              the Pro Life.
            </h3>
            <p className="text-sm font-medium leading-relaxed text-neutral-400">
              Removing the "Powered by KudosWall" badge is usually reserved for our Pro customers. 
              We're letting you earn it so you can see how much cleaner your site looks.
            </p>
          </div>
          
          <div className="relative z-10 pt-8">
            <Button 
              onClick={() => window.location.href = "/dashboard/settings?tab=billing"}
              className="group flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-8 text-[12px] font-black tracking-widest text-neutral-900 uppercase transition-all hover:bg-neutral-100 active:scale-[0.98]"
            >
              Skip the wait, Go Pro
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Background Glow */}
          <div className="pointer-events-none absolute -bottom-20 -right-20 size-64 rounded-full bg-pink-500/20 blur-3xl" />
        </Card>
      </div>
    </DashboardShell>
  );
}

function ReferralList() {
  const { data: list, isLoading } = useQuery(trpc.referral.getReferralList.queryOptions());

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 w-full animate-pulse rounded-2xl bg-neutral-100" />
        ))}
      </div>
    );
  }

  if (!list || list.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-neutral-100 bg-neutral-50/50 p-12 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white text-neutral-300 shadow-sm">
          <Users className="size-6" />
        </div>
        <p className="text-sm font-bold text-neutral-400">No referrals yet.</p>
        <p className="mt-1 text-[11px] font-medium text-neutral-300">Share your link to get started!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {list.map((u) => (
        <Card key={u.id} className="flex items-center justify-between rounded-2xl border-2 border-neutral-50 bg-white p-4 transition-all hover:border-pink-100">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-50 text-[10px] font-black text-neutral-400">
              {u.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[13px] font-bold text-neutral-900">{u.name}</p>
              <p className="text-[10px] font-medium text-neutral-400">{u.email}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black tracking-widest uppercase ${
              u.status === "Activated" 
                ? "bg-emerald-50 text-emerald-500" 
                : "bg-neutral-50 text-neutral-400"
            }`}>
              {u.status === "Activated" && <Check className="size-2.5" />}
              {u.status}
            </div>
            <p className="mt-1 text-[9px] font-bold text-neutral-300 uppercase tracking-widest">
              Joined {new Date(u.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
