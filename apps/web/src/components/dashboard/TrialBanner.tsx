"use client";

import Link from "next/link";
import { Sparkle, Clock, Warning, ArrowRight } from "@phosphor-icons/react";
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
      <div className="relative mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:p-5">
        <div className="flex items-start gap-3.5 sm:items-center">
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
              isUrgent ? "bg-amber-100 text-amber-800" : "bg-neutral-100 text-neutral-800"
            }`}
          >
            {isUrgent ? (
              <Clock className="size-4 animate-pulse" weight="bold" />
            ) : (
              <Sparkle className="size-4 text-amber-500" weight="fill" />
            )}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-800 uppercase">
                Pro trial active
              </span>
              <span className="text-xs font-bold text-neutral-900">
                {days === 1 ? "Last day of trial" : `${days} days remaining`}
              </span>
            </div>
            <p className="text-xs text-neutral-500 [text-wrap:pretty]">
              You have full access to unlimited testimonials, high definition video downloads, and custom widgets.
            </p>
          </div>
        </div>

        <Link
          href={billingUrl as any}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:bg-neutral-800 active:scale-[0.98]"
        >
          <span>Upgrade to Pro</span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" weight="bold" />
        </Link>
      </div>
    );
  }

  if (isTrialExpired) {
    return (
      <div className="relative mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm sm:flex-row sm:items-center sm:p-5">
        <div className="flex items-start gap-3.5 sm:items-center">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-neutral-200 text-neutral-700">
            <Warning className="size-4" weight="bold" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-700 uppercase">
                Trial ended
              </span>
              <span className="text-xs font-bold text-neutral-900">
                Your workspace is on the Free plan (10 testimonials limit)
              </span>
            </div>
            <p className="text-xs text-neutral-500 [text-wrap:pretty]">
              Upgrade to Pro to reactivate unlimited testimonials, video downloads, and custom domains.
            </p>
          </div>
        </div>

        <Link
          href={billingUrl as any}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:bg-neutral-800 active:scale-[0.98]"
        >
          <span>Upgrade to Pro</span>
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" weight="bold" />
        </Link>
      </div>
    );
  }

  return null;
}
