"use client";

import { useState } from "react";
import { RecentTestimonialsList, ProjectsList, EmptyTestimonials } from "./components";
import type { RouterOutputs } from "@/utils/trpc";

type DashboardData = RouterOutputs["dashboard"]["getData"];
type RecentTestimonial = DashboardData["recentTestimonials"][number];

interface TestimonialsPanelProps {
  data: DashboardData;
  workspaceId?: string;
}

export function TestimonialsPanel({ data, workspaceId }: TestimonialsPanelProps) {
  const [testimonialFilter, setTestimonialFilter] = useState<"All" | "Video" | "Text">("All");

  if (!data.recentTestimonials || data.recentTestimonials.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <EmptyTestimonials />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="text-sm font-bold text-neutral-900">Recent testimonials</p>
          <p className="mt-0.5 hidden text-xs text-neutral-500 sm:block">
            Latest submissions from your customers
          </p>
        </div>
        {/* Filter chips */}
        <div className="flex shrink-0 items-center gap-1.5">
          {(["All", "Video", "Text"] as const).map((f) => {
            const isActive = testimonialFilter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setTestimonialFilter(f)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col">
        <ProjectsList
          projects={data.projects}
          workspaceSlug={data.workspace.slug}
          workspaceId={workspaceId}
        />
        <RecentTestimonialsList
          workspaceId={workspaceId}
          testimonials={data.recentTestimonials.filter((t: RecentTestimonial) => {
            if (testimonialFilter === "All") return true;
            return t.type?.toLowerCase() === testimonialFilter.toLowerCase();
          })}
        />
      </div>
    </div>
  );
}
