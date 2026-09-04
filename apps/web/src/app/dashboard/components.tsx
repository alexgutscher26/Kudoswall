"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Quotes,
  Star,
  User,
  CaretRight,
  Globe,
  Lock,
  CheckCircle,
  LinkSimple,
} from "@phosphor-icons/react";
import type { RouterOutputs } from "@/utils/trpc";
import { CopyButton } from "./CopyButton";
import { UpgradeToastTrigger } from "./UpgradeToastTrigger";

type DashboardData = RouterOutputs["dashboard"]["getData"];
type Project = DashboardData["projects"][number];
type RecentTestimonial = DashboardData["recentTestimonials"][number];

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  bg,
  locked,
}: {
  label: string;
  value: string;
  sub: string;
  icon: any;
  accent: string;
  bg: string;
  locked?: boolean;
}) {
  return (
    <UpgradeToastTrigger
      locked={locked}
      title="Pro feature"
      description="Upgrade to Pro to unlock advanced analytics and live tracking."
    >
      <div
        className={`relative flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300 ${
          locked ? "opacity-75" : "hover:border-neutral-300 hover:shadow-md"
        }`}
      >
        <div>
          <div className="flex items-center justify-between">
            <div className="flex size-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
              <Icon className="size-4" weight="bold" />
            </div>
            {locked && (
              <div className="rounded-full bg-neutral-100 p-1 text-neutral-500">
                <Lock className="size-3" weight="bold" />
              </div>
            )}
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {locked ? "Locked" : value}
          </p>
          <p className="mt-1 text-xs font-semibold text-neutral-700">{label}</p>
        </div>
        <p className="mt-2 text-[11px] text-neutral-500 [text-wrap:pretty]">
          {locked ? "Pro feature" : sub}
        </p>
      </div>
    </UpgradeToastTrigger>
  );
}

export function RecentTestimonialsList({
  testimonials,
  workspaceId,
}: {
  testimonials: RecentTestimonial[];
  workspaceId?: string;
}) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="max-h-[400px] divide-y divide-neutral-100 overflow-y-auto">
      {testimonials.map((t) => (
        <div
          key={t.id}
          className="group flex items-center justify-between p-4 transition-colors hover:bg-neutral-50 sm:p-5"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
              {t.authorImage ? (
                <Image
                  src={t.authorImage as string}
                  alt={t.authorName || "User"}
                  width={40}
                  height={40}
                  className="size-full object-cover"
                />
              ) : (
                <User className="size-5 text-neutral-400" weight="bold" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="truncate text-xs font-bold text-neutral-900">
                  {t.authorName || "Anonymous"}
                </h4>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={`star-${s}`}
                      className={`size-3 ${
                        (t.rating ?? 0) > s ? "fill-amber-400" : "fill-neutral-200 text-neutral-200"
                      }`}
                      weight="fill"
                    />
                  ))}
                </div>
              </div>
              <p className="mt-0.5 line-clamp-1 text-xs text-neutral-600 [text-wrap:pretty]">
                "{t.content || (t.type === "video" ? "Video testimonial" : "No content")}"
              </p>
              <div className="mt-1 flex items-center gap-2">
                {t.verifiedVia && (
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                    <CheckCircle className="size-3" weight="fill" />
                    Verified
                  </span>
                )}
                {t.project?.name && (
                  <span className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600">
                    {t.project.name}
                  </span>
                )}
                <span className="text-[10px] text-neutral-400">
                  {new Date(t.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="ml-3 flex items-center gap-2">
            <Link
              href={`/dashboard/testimonials?id=${t.id}${workspaceId ? `&workspaceId=${workspaceId}` : ""}`}
              className="flex size-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-900 shadow-sm"
              aria-label="View testimonial details"
            >
              <CaretRight className="size-3.5" weight="bold" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProjectsList({
  projects,
  workspaceSlug,
  workspaceId,
}: {
  projects: Project[];
  workspaceSlug: string;
  workspaceId?: string;
}) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="max-h-[400px] divide-y divide-neutral-100 overflow-y-auto">
      {projects.map((p) => (
        <div
          key={p.id}
          className="group flex items-center justify-between p-4 transition-colors hover:bg-neutral-50 sm:p-5"
        >
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
              <LinkSimple className="size-5" weight="bold" />
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-xs font-bold text-neutral-900">
                {p.name}
              </h4>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-neutral-500">
                <Globe className="size-3 text-neutral-400" />
                <span>/{workspaceSlug}/{p.slug}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton slug={p.slug} workspaceSlug={workspaceSlug} />
            <Link
              href={`/dashboard/testimonials?project=${p.id}${workspaceId ? `&workspaceId=${workspaceId}` : ""}`}
              className="flex size-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-900 shadow-sm"
              aria-label="View project details"
            >
              <CaretRight className="size-3.5" weight="bold" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyTestimonials() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center sm:py-16">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800">
        <Quotes className="size-6" weight="bold" />
      </div>
      <h3 className="text-sm font-bold text-neutral-900">No testimonials yet</h3>
      <p className="mt-1 max-w-xs text-xs text-neutral-500 [text-wrap:pretty]">
        Share your collection link with customers and your incoming reviews will appear here ready for approval.
      </p>
    </div>
  );
}
