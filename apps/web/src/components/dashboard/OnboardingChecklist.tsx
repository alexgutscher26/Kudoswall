"use client";

import { CheckCircle2, ChevronRight, Gift } from "lucide-react";
import { Progress } from "@my-better-t-app/ui/components/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkspace } from "./WorkspaceContext";
import { useRouter } from "next/navigation";

interface OnboardingStatus {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
  step5: boolean;
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
  const { onShareLink, activeWorkspaceId, data } = useWorkspace();
  const router = useRouter();

  const status = data?.onboarding || initialStatus;
  const doneCount = Object.values(status).filter(Boolean).length;
  const totalCount = STEPS.length;
  const percentage = Math.round((doneCount / totalCount) * 100);
  const isComplete = doneCount === totalCount;

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
          <h3 className="text-[15px] font-bold tracking-tight text-neutral-900">Onboarding Guide</h3>
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
                    <div className="flex size-5 items-center justify-center rounded-full border-2 border-neutral-200 text-[10px] font-bold text-neutral-400 group-hover:border-neutral-300 group-hover:bg-neutral-50 group-hover:text-neutral-600 transition-all">
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
                    <p className="mt-1 text-[11px] leading-relaxed text-neutral-500 group-hover:text-neutral-600 transition-colors">
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
              <div className="flex items-center gap-4 rounded-2xl bg-neutral-900 p-4 text-white">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/10">
                  <Gift className="size-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-[13px] font-bold">Unlocking Rewards...</p>
                  <p className="text-[11px] text-neutral-400">
                    You've completed the tour! Stay tuned for your bonuses.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
