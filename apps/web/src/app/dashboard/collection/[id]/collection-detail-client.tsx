"use client";

import { useState } from "react";
import { Palette, BarChart3, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { CollectionCustomizer } from "../collection-customizer";
import { CollectionFunnelAnalytics } from "../collection-funnel-analytics";

interface CollectionDetailClientProps {
  project: {
    id: string;
    name: string;
    slug: string;
    collectionSlug?: string | null;
    collectionSettingsJson?: string | null;
    customDomain?: string | null;
    customDomainVerified?: boolean | null;
    customDomainVerificationToken?: string | null;
    customDomainVerificationError?: string | null;
    customCss?: string | null;
    emailFromName?: string | null;
    workspaceId: string;
  };
  workspace: {
    id: string;
    name: string;
    plan: "free" | "plan_1" | "plan_2" | "plan_3" | "ltd";
    logoUrl?: string | null;
  };
  isPro: boolean;
  permissions?: any;
}

export function CollectionDetailClient({
  project,
  workspace,
  isPro,
  permissions,
}: CollectionDetailClientProps) {
  const [activeView, setActiveView] = useState<"customizer" | "analytics">("customizer");
  const publicCollectionUrl = `/collect/${project.collectionSlug || project.slug}`;

  return (
    <div className="space-y-6">
      {/* Subheader & Top Level View Switcher */}
      <div className="flex flex-col gap-4 border-b border-neutral-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/collection"
            className="flex size-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-500 shadow-xs transition-all hover:bg-neutral-50 hover:text-neutral-900"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-neutral-900">{project.name}</h2>
              <a
                href={publicCollectionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-900"
              >
                <span>/collect/{project.collectionSlug || project.slug}</span>
                <ExternalLink className="size-2.5" />
              </a>
            </div>
            <p className="text-xs text-neutral-400">
              Manage form customization and funnel analytics
            </p>
          </div>
        </div>

        {/* View Switcher Pill */}
        <div className="flex rounded-2xl border border-neutral-200 bg-neutral-100/80 p-1 shadow-xs">
          <button
            onClick={() => setActiveView("customizer")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeView === "customizer"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Palette className="size-3.5" />
            Form Customizer
          </button>
          <button
            onClick={() => setActiveView("analytics")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeView === "analytics"
                ? "bg-white text-pink-600 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <BarChart3 className="size-3.5" />
            Funnel & A/B Analytics
          </button>
        </div>
      </div>

      {/* Main View Content */}
      {activeView === "customizer" ? (
        <CollectionCustomizer
          project={project}
          workspace={workspace}
          isPro={isPro}
          permissions={permissions}
        />
      ) : (
        <CollectionFunnelAnalytics
          workspaceId={project.workspaceId}
          projectId={project.id}
          projectName={project.name}
          onNavigateToCustomizerTab={(tab) => {
            setActiveView("customizer");
          }}
        />
      )}
    </div>
  );
}
