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
      <div
        className="overflow-hidden rounded-2xl border border-neutral-100"
        style={{ backgroundColor: "#ffffff" }}
      >
        <EmptyTestimonials />
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-2xl border border-neutral-100"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div
        className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-neutral-900">Recent Testimonials</p>
          <p className="mt-0.5 hidden text-[11px] text-neutral-400 sm:block">
            Latest submissions from your customers
          </p>
        </div>
        {/* Filter chips */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          {(["All", "Video", "Text"] as const).map((f) => {
            const isActive = testimonialFilter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setTestimonialFilter(f)}
                className="rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all sm:px-3"
                style={
                  isActive
                    ? {
                        backgroundColor: "#fff5f7",
                        color: "#e8527a",
                        borderColor: "#fecdd3",
                      }
                    : {
                        backgroundColor: "transparent",
                        color: "#a3a3a3",
                        borderColor: "rgba(0,0,0,0.08)",
                      }
                }
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-4">
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
