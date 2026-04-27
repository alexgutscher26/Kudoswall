import Image from "next/image";
import Link from "next/link";
import {
  MessageSquareQuote,
  Star,
  User,
  ChevronRight,
  Globe,
  Clock,
  BarChart2,
  Plus,
  Lock,
  CheckCircle2,
} from "lucide-react";
import type { RouterOutputs } from "@/utils/trpc";
import { CopyButton } from "./CopyButton";

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
    <div
      className={`relative rounded-2xl border border-neutral-100 p-4 transition-shadow sm:p-5 ${
        locked ? "group opacity-80 grayscale-[0.2]" : "hover:shadow-md"
      }`}
      style={{ backgroundColor: bg }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div
          className="inline-flex size-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}20` }}
        >
          <Icon className="size-4" style={{ color: accent }} />
        </div>
        {locked && (
          <div className="rounded-full bg-white/80 p-1 shadow-sm backdrop-blur-sm">
            <Lock className="size-3 text-neutral-500" />
          </div>
        )}
      </div>
      <p className="mb-1 text-2xl leading-none font-bold tracking-tight text-neutral-900 sm:text-3xl">
        {locked ? "Locked" : value}
      </p>
      <p className="text-[13px] font-medium text-neutral-700">{label}</p>
      <p className="mt-0.5 hidden text-[12px] text-neutral-400 sm:block">
        {locked ? "Pro feature" : sub}
      </p>
    </div>
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
    <div className="max-h-[400px] divide-y divide-neutral-50 overflow-y-auto">
      {testimonials.map((t) => (
        <div
          key={t.id}
          className="group flex items-center justify-between px-4 py-4 transition-all hover:bg-neutral-50/50 sm:px-6"
        >
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50">
              {t.authorImage ? (
                <Image
                  src={t.authorImage as string}
                  alt={t.authorName || "User"}
                  width={40}
                  height={40}
                  className="size-full object-cover"
                />
              ) : (
                <User className="size-5 text-neutral-300" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="truncate text-[14px] font-bold tracking-tight text-neutral-900">
                  {t.authorName || "Anonymous"}
                </h4>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="relative">
                      <Star className="size-2.5 fill-neutral-100 text-neutral-100" />
                      {(t.rating ?? 0) >= s - 0.5 && (t.rating ?? 0) < s && (
                        <div className="absolute inset-0 z-10 w-1/2 overflow-hidden">
                          <Star className="size-2.5 fill-amber-400 text-amber-400" />
                        </div>
                      )}
                      {(t.rating ?? 0) >= s && (
                        <div className="absolute inset-0 z-10 overflow-hidden">
                          <Star className="size-2.5 fill-amber-400 text-amber-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-0.5 line-clamp-1 text-[12px] text-neutral-500 italic">
                "{t.content || (t.type === "video" ? "Video testimonial" : "No content")}"
              </p>
              <div className="mt-1 flex items-center gap-2">
                {t.verifiedVia && (
                  <span className="inline-flex items-center gap-0.5 rounded-md bg-green-50 px-1.5 py-0.5 text-[9px] font-bold text-green-600 ring-1 ring-green-100/50">
                    <CheckCircle2 className="size-2.5" />
                    Verified
                  </span>
                )}
                <span className="rounded-md border border-neutral-100/50 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400">
                  {t.project?.name}
                </span>
                <span className="text-[10px] text-neutral-300">
                  {new Date(t.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="ml-4 flex items-center gap-2">
            <Link
              href={`/dashboard/testimonials?id=${t.id}${workspaceId ? `&workspaceId=${workspaceId}` : ""}`}
              className="rounded-full p-2 text-neutral-300 transition-all hover:bg-white hover:text-neutral-600 hover:shadow-sm"
            >
              <ChevronRight className="size-4" />
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
    <div className="max-h-[400px] divide-y divide-neutral-50 overflow-y-auto">
      {projects.map((p) => (
        <div
          key={p.id}
          className="group flex items-center justify-between px-4 py-4 transition-all hover:bg-neutral-50/50 sm:px-6"
        >
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-pink-50">
              <LinkIcon className="size-5 text-pink-500" />
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-[14px] font-bold tracking-tight text-neutral-900">
                {p.name}
              </h4>
              <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-neutral-400">
                <Globe className="size-3" />/{workspaceSlug}/{p.slug}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton slug={p.slug} workspaceSlug={workspaceSlug} />
            <Link
              href={`/dashboard/testimonials?project=${p.id}${workspaceId ? `&workspaceId=${workspaceId}` : ""}`}
              className="rounded-full p-2 text-neutral-300 transition-all hover:bg-white hover:text-neutral-600 hover:shadow-sm"
            >
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

export function EmptyTestimonials() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center sm:py-14">
      <div
        className="mb-4 flex size-14 items-center justify-center rounded-2xl"
        style={{ backgroundColor: "#fff5f7" }}
      >
        <MessageSquareQuote className="size-6" style={{ color: "#e8527a" }} />
      </div>
      <h3 className="mb-1.5 text-[15px] font-semibold text-neutral-900">No testimonials yet</h3>
      <p className="mb-6 max-w-xs text-[13px] leading-relaxed text-neutral-400">
        Share your collection link with customers and your first testimonials will appear here —
        ready to review and approve.
      </p>
      {/* We keep New Collection Button logic in the shell for now as it triggers a modal */}
    </div>
  );
}
