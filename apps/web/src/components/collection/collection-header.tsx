"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface CollectionHeaderProps {
  projectId: string;
  projectName: string;
  workspaceName: string;
  logoUrl?: string | null;
  accentColor: string;
  defaultHeadline: string;
  defaultSubheading: string;
  abTesting?: {
    enabled?: boolean;
    variants?: Array<{
      id: string;
      headline?: string;
      subheading?: string;
      ctaText?: string;
    }>;
  };
}

export function CollectionHeader({
  projectId,
  projectName,
  workspaceName,
  logoUrl,
  accentColor,
  defaultHeadline,
  defaultSubheading,
  abTesting,
}: CollectionHeaderProps) {
  const [headline, setHeadline] = useState(defaultHeadline);
  const [subheading, setSubheading] = useState(defaultSubheading);

  useEffect(() => {
    if (!abTesting?.enabled || !abTesting.variants || abTesting.variants.length === 0) {
      return;
    }

    try {
      const storageKey = `kw_ab_variant_${projectId}`;
      let assigned = localStorage.getItem(storageKey);
      if (!assigned || !abTesting.variants.some((v) => v.id === assigned)) {
        assigned = Math.random() < 0.5 ? "A" : "B";
        const validChosen = abTesting.variants.some((v) => v.id === assigned)
          ? assigned
          : abTesting.variants[0]?.id || "A";
        localStorage.setItem(storageKey, validChosen);
        assigned = validChosen;
      }

      const activeVariant = abTesting.variants.find((v) => v.id === assigned);
      if (activeVariant?.headline) {
        setHeadline(activeVariant.headline);
      }
      if (activeVariant?.subheading) {
        setSubheading(activeVariant.subheading);
      }
    } catch {
      // Fallback to defaults
    }
  }, [projectId, abTesting, defaultHeadline, defaultSubheading]);

  return (
    <div className="mb-6 space-y-4 text-center">
      {logoUrl && (
        <div className="group relative inline-block">
          <div
            className="absolute -inset-2 rounded-[24px] opacity-20 blur-xl transition-opacity group-hover:opacity-40"
            style={{ backgroundColor: accentColor }}
          />
          <Image
            src={logoUrl}
            alt={workspaceName}
            width={56}
            height={56}
            priority
            className="relative mx-auto size-14 rounded-[18px] border border-neutral-100 bg-white object-cover p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          />
        </div>
      )}
      <div className="space-y-1">
        <h1 className="collect-heading text-3xl leading-tight font-black tracking-tighter text-neutral-900 transition-colors duration-300 sm:text-5xl">
          {headline}
        </h1>
        <p className="collect-subheading mx-auto max-w-xl text-lg font-medium text-neutral-500 transition-colors duration-300">
          {subheading}
        </p>
      </div>
    </div>
  );
}
