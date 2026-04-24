"use client";

import { useState, useEffect } from "react";

import { CheckCircle2, ChevronRight, Gift } from "lucide-react";
import { Progress } from "@my-better-t-app/ui/components/progress";
import { motion, AnimatePresence } from "framer-motion";
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
    label: "Create your first Space",
    desc: "Set up a dedicated wall for your testimonials",
    href: "/dashboard",
  },
  {
    key: "step2",
    label: "Customize your Page",
    desc: "Add your logo and branding to the collection form",
    href: "/dashboard/collection",
  },
  {
    key: "step3",
    label: "Share your Link",
    desc: "Send your unique link to customers via email or social",
    action: "share",
  },
  {
    key: "step4",
    label: "Approve a Testimonial",
    desc: "Review and approve your first customer submission",
    href: "/dashboard/testimonials",
  },
  {
    key: "step5",
    label: "Embed on Website",
    desc: "Copy the embed code and drop it into your site",
    href: "/dashboard/embed",
  },
] as const;

export function OnboardingChecklist({
  status: initialStatus,
  accentColor = "#e8527a",
}: OnboardingChecklistProps) {
  const { onShareLink, onCompleteStep, activeWorkspaceId, data } = useWorkspace();
  const router = useRouter();
  const [isClaiming, setIsClaiming] = useState(false);

  const status = data?.onboarding || initialStatus;
  const doneCount = Object.entries(status).filter(
    ([key, val]) => key !== "rewardClaimed" && val,
  ).length;
  const totalCount = STEPS.length;
  const percentage = Math.round((doneCount / totalCount) * 100);
  const isComplete = doneCount === totalCount;

  // Sync isClaiming state when status updates
  useEffect(() => {
    if (status.rewardClaimed) {
      setIsClaiming(false);
    }
  }, [status.rewardClaimed]);

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
    <div className="overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between border-b border-neutral-50 px-6 py-5">
        <div>
          <h3 className="text-[15px] font-bold tracking-tight text-neutral-900">
            Onboarding Guide
          </h3>
          <p className="mt-0.5 text-[12px] font-medium text-neutral-400">
            {doneCount} of {totalCount} steps completed
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="rounded-full px-3 py-1 text-[11px] font-bold"
            style={{ color: accentColor, backgroundColor: `${accentColor}10` }}
          >
            {percentage}%
          </span>
        </div>
      </div>

      <Progress currentStep={doneCount} maxSteps={totalCount} accentColor={accentColor} />

      <div className="p-6">
        <ul className="space-y-4">
          {STEPS.map((step, index) => {
            const isDone = status[step.key as keyof OnboardingStatus];
            return (
              <motion.li
                key={step.key}
                onClick={() => handleStepClick(step)}
                className={`group flex items-start gap-4 ${isDone ? "opacity-60" : "cursor-pointer"}`}
                initial={false}
                animate={{ opacity: isDone ? 0.6 : 1 }}
              >
                <div className="mt-1 shrink-0">
                  {isDone ? (
                    <div className="flex size-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                      <CheckCircle2 className="size-3.5" />
                    </div>
                  ) : (
                    <div className="flex size-5 items-center justify-center rounded-full border-2 border-neutral-200 text-[10px] font-bold text-neutral-400 transition-all group-hover:border-neutral-300 group-hover:bg-neutral-50 group-hover:text-neutral-600">
                      {index + 1}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[13px] leading-none font-semibold transition-colors ${
                      isDone
                        ? "text-neutral-400 line-through"
                        : "text-neutral-800 group-hover:text-neutral-900"
                    }`}
                  >
                    {step.label}
                  </p>
                  {!isDone && (
                    <p className="mt-1 text-[11px] leading-relaxed text-neutral-500 transition-colors group-hover:text-neutral-600">
                      {step.desc}
                    </p>
                  )}
                </div>
                {!isDone && (
                  <ChevronRight className="size-4 text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-400" />
                )}
              </motion.li>
            );
          })}
        </ul>

        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mt-6 border-t border-dashed border-neutral-100 pt-6"
            >
              {status.rewardClaimed ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="rounded-2xl border-2 border-emerald-100 bg-emerald-50 p-6 text-center shadow-inner"
                >
                  <div className="animate-in zoom-in mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-200 duration-500">
                    <Gift className="size-7" />
                  </div>
                  <h4 className="text-[16px] font-bold text-neutral-900">Your Gift is Ready! 🎊</h4>
                  <p className="mt-1.5 text-[12px] text-neutral-500">
                    Get 50% off any plan, forever.
                  </p>

                  <div className="mt-5 flex flex-col gap-2">
                    <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-white p-3 shadow-sm">
                      <code className="font-mono text-[15px] font-black tracking-wider text-emerald-600 uppercase">
                        ONBOARDING50
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("ONBOARDING50");
                          toast.success("Code copied to clipboard!");
                        }}
                        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-[11px] font-bold text-white transition-all hover:bg-emerald-600 active:scale-[0.95]"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-[10px] text-neutral-400">Apply this code at checkout</p>
                  </div>
                </motion.div>
              ) : (
                <div className="group relative overflow-hidden rounded-2xl bg-neutral-900 p-5 text-white shadow-xl">
                  <div className="absolute -top-4 -right-4 size-24 rounded-full bg-pink-500/20 blur-2xl transition-all group-hover:bg-pink-500/30" />
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 shadow-inner">
                      <Gift className="size-6 animate-bounce text-pink-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-bold">You've unlocked a gift!</p>
                      <p className="text-[11px] text-neutral-400">
                        Claim your special onboarding bonus.
                      </p>
                    </div>
                  </div>
                  <button
                    disabled={isClaiming}
                    onClick={async () => {
                      setIsClaiming(true);
                      try {
                        await onCompleteStep?.("rewardClaimed");
                      } catch (e) {
                        setIsClaiming(false);
                      }
                    }}
                    className="relative z-10 mt-4 w-full rounded-xl bg-white py-2.5 text-[12px] font-bold text-neutral-900 shadow-lg transition-all hover:bg-neutral-50 active:scale-[0.98] disabled:opacity-70"
                  >
                    {isClaiming ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="size-3 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-800" />
                        Claiming...
                      </div>
                    ) : (
                      "Claim My Gift"
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
