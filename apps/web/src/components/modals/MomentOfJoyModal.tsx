"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Sparkles, Video, Trophy, ArrowRight, X, Flame } from "lucide-react";
import type { WorkspacePermissions } from "@my-better-t-app/api/logic/billing";

export type JoyMilestoneType =
  | "FIRST_TESTIMONIAL"
  | "FIRST_VIDEO"
  | "LIMIT_APPROACHING"
  | "LIMIT_REACHED";

interface MomentOfJoyModalProps {
  workspaceId: string;
  testimonialsCount: number;
  hasVideoTestimonial: boolean;
  permissions?: WorkspacePermissions;
}

export function MomentOfJoyModal({
  workspaceId,
  testimonialsCount,
  hasVideoTestimonial,
  permissions,
}: MomentOfJoyModalProps) {
  const [activeMilestone, setActiveMilestone] = useState<JoyMilestoneType | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!workspaceId) return;

    // Check which milestone applies (ordered by priority/sequence)
    const checkMilestones = () => {
      // 1. First Testimonial milestone
      if (testimonialsCount >= 1) {
        const key = `kudoswall_joy_${workspaceId}_first_testimonial`;
        if (!localStorage.getItem(key)) {
          return { type: "FIRST_TESTIMONIAL" as const, key };
        }
      }

      // 2. First Video Review milestone
      if (hasVideoTestimonial) {
        const key = `kudoswall_joy_${workspaceId}_first_video`;
        if (!localStorage.getItem(key)) {
          return { type: "FIRST_VIDEO" as const, key };
        }
      }

      // 3. Limit Approaching / Reached (if on free tier or trial expired)
      if (
        (!permissions?.isPro || permissions?.effectivePlan === "free") &&
        testimonialsCount >= 8
      ) {
        const isMaxed = testimonialsCount >= 10;
        const key = `kudoswall_joy_${workspaceId}_${isMaxed ? "limit_reached" : "limit_approaching"}`;
        if (!localStorage.getItem(key)) {
          return {
            type: isMaxed ? ("LIMIT_REACHED" as const) : ("LIMIT_APPROACHING" as const),
            key,
          };
        }
      }

      return null;
    };

    const eligible = checkMilestones();
    if (eligible) {
      setActiveMilestone(eligible.type);
      setIsOpen(true);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#e8527a", "#ff6b8b", "#7c3aed", "#38bdf8", "#fbbf24"],
        });
      } catch (err) {
        // Safe fallback if canvas-confetti is not loaded
      }
    }
  }, [workspaceId, testimonialsCount, hasVideoTestimonial, permissions]);

  const handleDismiss = () => {
    if (activeMilestone && workspaceId) {
      let key = "";
      if (activeMilestone === "FIRST_TESTIMONIAL")
        key = `kudoswall_joy_${workspaceId}_first_testimonial`;
      if (activeMilestone === "FIRST_VIDEO") key = `kudoswall_joy_${workspaceId}_first_video`;
      if (activeMilestone === "LIMIT_APPROACHING")
        key = `kudoswall_joy_${workspaceId}_limit_approaching`;
      if (activeMilestone === "LIMIT_REACHED") key = `kudoswall_joy_${workspaceId}_limit_reached`;
      if (key) localStorage.setItem(key, "dismissed");
    }
    setIsOpen(false);
  };

  if (!isOpen || !activeMilestone) return null;

  const billingUrl = `/dashboard/settings?tab=billing&workspaceId=${workspaceId}`;

  const config = {
    FIRST_TESTIMONIAL: {
      icon: Trophy,
      iconBg: "bg-pink-100 text-pink-600",
      badge: "🎉 First Social Proof Milestone",
      badgeColor: "bg-pink-100 text-pink-800",
      title: "Boom! You collected your first testimonial!",
      description:
        "Your social proof engine is working. You can now turn customer feedback into high-converting website widgets and social media proof cards.",
      proHighlight:
        "Pro unlocks 1-click social card exports, custom domain embedding, and zero KudosWall branding.",
      cta: "Explore Pro Features",
    },
    FIRST_VIDEO: {
      icon: Video,
      iconBg: "bg-sky-100 text-sky-600",
      badge: "🎬 High-Impact Video Review",
      badgeColor: "bg-sky-100 text-sky-800",
      title: "You collected your first Video Testimonial!",
      description:
        "Video testimonials convert up to 34% higher on sales pages than text alone. Your customers are advocating for you in high definition.",
      proHighlight:
        "Pro gives you original HD MP4 video downloads, animated social clips, and priority video streaming.",
      cta: "Unlock Video Downloads & Pro",
    },
    LIMIT_APPROACHING: {
      icon: Flame,
      iconBg: "bg-amber-100 text-amber-600",
      badge: "🔥 High Engagement",
      badgeColor: "bg-amber-100 text-amber-800",
      title: "Your Wall of Love is filling up fast!",
      description: `You've collected ${testimonialsCount} of your 10 free testimonials. Submissions beyond the limit will be queued.`,
      proHighlight:
        "Upgrade to Pro for unlimited testimonials, team collaboration, and automated social proof feeds.",
      cta: "Unlock Unlimited Testimonials",
    },
    LIMIT_REACHED: {
      icon: Sparkles,
      iconBg: "bg-rose-100 text-rose-600",
      badge: "⭐ Free Tier Milestone Reached",
      badgeColor: "bg-rose-100 text-rose-800",
      title: "You've reached your 10 Testimonial limit!",
      description:
        "Your customers love your product. Upgrade now so new customer praise continues displaying live without interruption.",
      proHighlight:
        "Pro gives you unlimited testimonials, all 7 widget layouts, and custom white-label branding.",
      cta: "Upgrade to Pro (Unlimited)",
    },
  }[activeMilestone];

  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity"
        onClick={handleDismiss}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl transition-all sm:p-7">
        {/* Glow decoration */}
        <div className="pointer-events-none absolute -top-16 -right-16 size-44 rounded-full bg-pink-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-44 rounded-full bg-sky-500/15 blur-3xl" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
        >
          <X className="size-4" />
        </button>

        {/* Content */}
        <div className="relative space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-12 items-center justify-center rounded-2xl ${config.iconBg}`}
            >
              <Icon className="size-6" />
            </div>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase ${config.badgeColor}`}
            >
              {config.badge}
            </span>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-bold tracking-tight text-neutral-900">{config.title}</h3>
            <p className="text-[13px] leading-relaxed text-neutral-600">{config.description}</p>
          </div>

          <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50/70 to-purple-50/50 p-4">
            <div className="flex items-start gap-2.5">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-pink-500" />
              <p className="text-[12px] leading-relaxed font-medium text-neutral-700">
                {config.proHighlight}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center">
            <Link
              href={billingUrl as any}
              onClick={handleDismiss}
              className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.98]"
            >
              <span>{config.cta}</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-xl px-4 py-3 text-[13px] font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
