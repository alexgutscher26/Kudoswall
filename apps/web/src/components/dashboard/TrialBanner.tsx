"use client";

import Link from "next/link";
import { Sparkles, Clock, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import type { WorkspacePermissions } from "@my-better-t-app/api/logic/billing";

interface TrialBannerProps {
  permissions?: WorkspacePermissions;
  workspaceId?: string;
}

export function TrialBanner({ permissions, workspaceId }: TrialBannerProps) {
  if (!permissions) return null;

  const { isTrialing, isTrialExpired, trialDaysRemaining } = permissions;

  if (!isTrialing && !isTrialExpired) return null;

  const billingUrl = workspaceId
    ? `/dashboard/settings?tab=billing&workspaceId=${workspaceId}`
    : "/dashboard/settings?tab=billing";

  if (isTrialing) {
    const days = trialDaysRemaining ?? 14;
    const isUrgent = days <= 3;

    return (
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 p-4 backdrop-blur-sm sm:p-5">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5 sm:items-center">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${isUrgent ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25" : "bg-amber-100 text-amber-700"}`}
            >
              {isUrgent ? (
                <Clock className="size-5 animate-pulse" />
              ) : (
                <Sparkles className="size-5 text-amber-600" />
              )}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-amber-200/60 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-amber-900 uppercase">
                  ⚡ Pro Trial Active
                </span>
                <span className="text-[13px] font-bold text-neutral-900">
                  {days === 1 ? "Last day of your trial!" : `${days} days remaining`}
                </span>
              </div>
              <p className="text-[12px] text-neutral-600">
                You have full access to unlimited testimonials, HD video downloads, custom widgets &
                zero branding.
              </p>
            </div>
          </div>

          <Link
            href={billingUrl as any}
            className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 hover:shadow-md active:scale-[0.98]"
          >
            <span>Lock In Pro Plan</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    );
  }

  if (isTrialExpired) {
    return (
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent p-4 sm:p-5">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5 sm:items-center">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <AlertTriangle className="size-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-rose-800 uppercase">
                  Trial Expired
                </span>
                <span className="text-[13px] font-bold text-neutral-900">
                  Your workspace is now on the Free Plan (10 testimonials limit)
                </span>
              </div>
              <p className="text-[12px] text-neutral-600">
                Upgrade to Pro to reactivate unlimited testimonials, video downloads, and remove the
                KudosWall badge.
              </p>
            </div>
          </div>

          <Link
            href={billingUrl as any}
            className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-rose-700 active:scale-[0.98]"
          >
            <span>Upgrade to Pro</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
