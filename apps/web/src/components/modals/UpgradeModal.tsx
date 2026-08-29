"use client";

import React, { createContext, useContext, useState, type ReactNode } from "react";
import Link from "next/link";
import { Sparkles, Check, X, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { useWorkspace } from "@/components/dashboard/WorkspaceContext";

interface UpgradeModalOptions {
  title?: string;
  description?: string;
  featureName?: string;
  badge?: string;
}

interface UpgradeModalContextType {
  openUpgradeModal: (options?: UpgradeModalOptions) => void;
  closeUpgradeModal: () => void;
}

const UpgradeModalContext = createContext<UpgradeModalContextType | undefined>(undefined);

export function useUpgradeModal() {
  const context = useContext(UpgradeModalContext);
  if (!context) {
    throw new Error("useUpgradeModal must be used within an UpgradeModalProvider");
  }
  return context;
}

export function UpgradeModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<UpgradeModalOptions>({});
  const { activeWorkspaceId, data: dashboardData } = useWorkspace();

  const openUpgradeModal = (opts?: UpgradeModalOptions) => {
    setOptions(opts || {});
    setIsOpen(true);
  };

  const closeUpgradeModal = () => {
    setIsOpen(false);
  };

  const billingUrl = activeWorkspaceId
    ? `/dashboard/settings?tab=billing&workspaceId=${activeWorkspaceId}`
    : "/dashboard/settings?tab=billing";

  const defaultTitle = options.featureName
    ? `Unlock ${options.featureName} with Pro`
    : "Upgrade to KudosWall Pro";

  const defaultDescription =
    options.description ||
    "Take your social proof to the next level with unlimited testimonials, HD video downloads, zero branding, and advanced analytics.";

  const PRO_PERKS = [
    "Unlimited testimonials & embed widgets",
    "HD Video downloads & social media ad clips",
    "All 4 widget layouts (Grid, Carousel, Masonry, Bento)",
    "Remove 'Powered by KudosWall' watermark",
    "Real-time analytics (views, clicks, conversion rates)",
    "Custom domain collection links",
  ];

  return (
    <UpgradeModalContext.Provider value={{ openUpgradeModal, closeUpgradeModal }}>
      {children}

      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="animate-in fade-in absolute inset-0 bg-neutral-950/60 backdrop-blur-sm duration-300"
            onClick={closeUpgradeModal}
            aria-hidden="true"
          />

          {/* Modal Card */}
          <div className="animate-in zoom-in-95 relative z-10 w-full max-w-lg overflow-hidden rounded-[28px] border border-neutral-200/80 bg-white p-6 shadow-2xl duration-300 sm:p-8">
            {/* Background Glows */}
            <div className="pointer-events-none absolute -top-20 -right-20 size-52 rounded-full bg-pink-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 size-52 rounded-full bg-purple-500/10 blur-3xl" />

            {/* Close button */}
            <button
              onClick={closeUpgradeModal}
              className="absolute top-5 right-5 rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              aria-label="Close modal"
            >
              <X className="size-4" />
            </button>

            {/* Header */}
            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-2.5 py-0.5 text-[11px] font-bold tracking-wider text-pink-800 uppercase">
                    <Zap className="size-3 fill-pink-800" />
                    {options.badge || "Pro Feature"}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-2xl font-black tracking-tight text-neutral-900">
                  {options.title || defaultTitle}
                </h3>
                <p className="text-[13px] leading-relaxed text-neutral-600">{defaultDescription}</p>
              </div>

              {/* Perks List */}
              <div className="space-y-2.5 rounded-2xl border border-neutral-100 bg-neutral-50/80 p-4 sm:p-5">
                <p className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                  Everything included in Pro ($19/mo):
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {PRO_PERKS.map((perk) => (
                    <div
                      key={perk}
                      className="flex items-start gap-2 text-[12px] font-semibold text-neutral-800"
                    >
                      <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-pink-500/10 text-pink-600">
                        <Check className="size-2.5 stroke-[3]" />
                      </div>
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2.5 pt-2 sm:flex-row sm:items-center">
                <Link
                  href={billingUrl as any}
                  onClick={closeUpgradeModal}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-[13px] font-bold text-white shadow-md transition-all hover:bg-neutral-800 active:scale-[0.98]"
                >
                  <span>Unlock Pro Plan</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <button
                  type="button"
                  onClick={closeUpgradeModal}
                  className="rounded-xl px-5 py-3.5 text-[13px] font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
                >
                  Maybe Later
                </button>
              </div>

              <p className="text-center text-[11px] text-neutral-400">
                🔒 7-day money-back guarantee • Cancel or switch plans anytime
              </p>
            </div>
          </div>
        </div>
      )}
    </UpgradeModalContext.Provider>
  );
}

export function UpgradeTrigger({
  locked,
  title,
  description,
  featureName,
  children,
}: {
  locked?: boolean;
  title?: string;
  description?: string;
  featureName?: string;
  children: ReactNode;
}) {
  const { openUpgradeModal } = useUpgradeModal();

  if (!locked) return <>{children}</>;

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openUpgradeModal({ title, description, featureName });
      }}
      className="contents cursor-pointer"
    >
      {children}
    </div>
  );
}
