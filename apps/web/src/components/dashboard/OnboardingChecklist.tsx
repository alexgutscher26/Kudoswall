"use client";

import { useState, useEffect } from "react";
import { CheckCircle, CaretRight, Gift, Sparkle } from "@phosphor-icons/react";
import { Progress } from "@my-better-t-app/ui/components/progress";
import { useWorkspace } from "./WorkspaceContext";
import { useRouter } from "next/navigation";
import { gooeyToast as toast } from "goey-toast";

interface OnboardingStatus {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
  step5: boolean;
  rewardClaimed: boolean;
}

interface OnboardingChecklistProps {
  status: OnboardingStatus;
  accentColor?: string;
}

const STEPS = [
  {
    key: "step1",
    label: "Create your first space",
    desc: "Set up a dedicated wall for your testimonials",
    href: "/dashboard",
  },
  {
    key: "step2",
    label: "Customize your page",
    desc: "Add your logo and questions to the collection form",
    href: "/dashboard/collection",
  },
  {
    key: "step3",
    label: "Share your link",
    desc: "Send your unique link to customers via email or SMS",
    action: "share",
  },
  {
    key: "step4",
    label: "Approve a testimonial",
    desc: "Review and approve your first customer submission",
    href: "/dashboard/testimonials",
  },
  {
    key: "step5",
    label: "Embed on website",
    desc: "Copy the embed code and drop it into your website",
    href: "/dashboard/embed",
  },
] as const;

export function OnboardingChecklist({
  status: initialStatus,
}: OnboardingChecklistProps) {
  const { onShareLink, activeWorkspaceId, data } = useWorkspace();
  const router = useRouter();

  const status = data?.onboarding || initialStatus;
  const doneCount = Object.entries(status).filter(
    ([key, val]) => key !== "rewardClaimed" && val,
  ).length;
  const totalCount = STEPS.length;
  const percentage = Math.round((doneCount / totalCount) * 100);

  const handleStepClick = (step: (typeof STEPS)[number]) => {
    if (status[step.key as keyof OnboardingStatus]) return;

    if ("action" in step && step.action === "share") {
      onShareLink?.();
    } else if ("href" in step) {
      const url = activeWorkspaceId ? `${step.href}?workspaceId=${activeWorkspaceId}` : step.href;
      router.push(url);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
        <div>
          <h3 className="text-sm font-bold text-neutral-900">
            Setup checklist
          </h3>
          <p className="mt-0.5 text-xs text-neutral-500">
            {doneCount} of {totalCount} steps completed ({percentage}%)
          </p>
        </div>
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-800">
          {percentage}%
        </span>
      </div>

      <div className="px-5 pt-3 pb-2">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full bg-neutral-900 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="divide-y divide-neutral-100 px-2 py-2">
        {STEPS.map((step) => {
          const isDone = !!status[step.key as keyof OnboardingStatus];
          return (
            <button
              key={step.key}
              type="button"
              onClick={() => handleStepClick(step)}
              disabled={isDone}
              className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition-colors ${
                isDone
                  ? "opacity-60 cursor-default"
                  : "hover:bg-neutral-50 cursor-pointer"
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <CheckCircle
                  className={`mt-0.5 size-4.5 shrink-0 ${
                    isDone ? "text-emerald-600" : "text-neutral-300"
                  }`}
                  weight={isDone ? "fill" : "bold"}
                />
                <div className="min-w-0">
                  <p className={`text-xs font-bold ${isDone ? "text-neutral-500 line-through" : "text-neutral-900"}`}>
                    {step.label}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-neutral-500">
                    {step.desc}
                  </p>
                </div>
              </div>
              {!isDone && (
                <CaretRight className="size-3.5 shrink-0 text-neutral-400" weight="bold" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
