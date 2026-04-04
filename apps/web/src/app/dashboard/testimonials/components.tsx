"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Star,
  User,
  Check,
  Archive,
  Trash2,
  Clock,
  MessageSquareQuote,
  Search,
  Filter,
  ExternalLink,
  Plus,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { trpc, queryClient } from "@/utils/trpc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@my-better-t-app/ui/components/dropdown-menu";
import { updateTestimonialStatus, deleteTestimonial } from "../actions";
import { formatDistanceToNow } from "date-fns";

interface Testimonial {
  id: string;
  projectId: string;
  content: string | null;
  authorName: string | null;
  authorEmail: string | null;
  authorImage: string | null;
  authorCompany?: string | null;
  authorLinkedin?: string | null;
  authorTagline?: string | null;
  rating: number | null;
  status: "pending" | "approved" | "archived";
  type: "text" | "video";
  videoUrl?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface InboxProps {
  initialTestimonials: Testimonial[];
  project: {
    id: string;
    name: string;
    slug: string;
  };
  projects: {
    id: string;
    name: string;
  }[];
}

export function TestimonialInbox({ initialTestimonials, project, projects }: InboxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "archived">(
    "pending",
  );
  const [typeFilter, setTypeFilter] = useState<"all" | "video" | "text">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  // Fetch testimonials with real-time polling
  const { data: qData } = useQuery({
    ...trpc.dashboard.getProjectTestimonials.queryOptions({ projectId: project.id }),
    initialData: { project, testimonials: initialTestimonials } as any,
    refetchInterval: 5000,
  });

  const testimonials = qData.testimonials;

  const handleProjectSwitch = (projectId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("project", projectId);
    router.push(`/dashboard/testimonials?${params.toString()}`);
  };

  const filteredTestimonials = testimonials.filter((t) => {
    const matchesTab = activeTab === "all" || t.status === activeTab;
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    const matchesSearch =
      t.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.authorEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = minRating === null || (t.rating ?? 0) >= minRating;
    return matchesTab && matchesType && matchesSearch && matchesRating;
  });

  const handleStatusUpdate = async (id: string, status: "approved" | "archived" | "pending") => {
    startTransition(async () => {
      try {
        await updateTestimonialStatus(id, status);
        await queryClient.invalidateQueries(
          trpc.dashboard.getProjectTestimonials.queryOptions({ projectId: project.id }),
        );
        toast.success(`Testimonial ${status}`);
      } catch (error) {
        toast.error("Failed to update status");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    startTransition(async () => {
      try {
        await deleteTestimonial(id);
        await queryClient.invalidateQueries(
          trpc.dashboard.getProjectTestimonials.queryOptions({ projectId: project.id }),
        );
        toast.success("Testimonial deleted");
      } catch (error) {
        toast.error("Failed to delete testimonial");
      }
    });
  };

  const tabs = [
    { id: "pending", label: "Pending", icon: Clock },
    { id: "approved", label: "Approved", icon: Check },
    { id: "archived", label: "Archived", icon: Archive },
    { id: "all", label: "All", icon: MessageSquareQuote },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Rating Filter Bar */}
      <div className="flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
        {/* Project Switcher */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="group flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white px-4 py-2 shadow-sm transition-all outline-none hover:border-neutral-200 hover:shadow-md">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-pink-50">
                <MessageSquareQuote className="size-4 text-pink-500" />
              </div>
              <div className="min-w-[120px] text-left">
                <p className="mb-1 text-[10px] leading-none font-bold tracking-widest text-neutral-400 uppercase">
                  Collection Link
                </p>
                <p className="truncate text-[14px] leading-none font-bold text-neutral-900">
                  {project.name}
                </p>
              </div>
              <ChevronDown className="ml-2 size-4 text-neutral-300 transition-colors group-hover:text-neutral-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="animate-in zoom-in-95 w-64 rounded-2xl border-neutral-100 bg-white p-2 shadow-2xl duration-200"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-3 py-2 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                  Switch Collection Link
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mx-2 my-1 bg-neutral-50" />
                <div className="max-h-60 overflow-y-auto">
                  <DropdownMenuRadioGroup value={project.id} onValueChange={handleProjectSwitch}>
                    {projects.map((p) => (
                      <DropdownMenuRadioItem
                        key={p.id}
                        value={p.id}
                        className="rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors focus:bg-pink-50 focus:text-pink-600"
                      >
                        {p.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </div>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="mx-2 my-1 bg-neutral-50" />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard")}
                className="mt-1 flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-bold text-neutral-900 transition-all hover:bg-neutral-50 focus:bg-neutral-900 focus:text-white"
              >
                <Plus className="size-3.5" />
                New Collection Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden h-8 w-px bg-neutral-100 sm:block" />

          {/* Stats quick view (optional, but looks premium) */}
          <div className="hidden items-center gap-4 sm:flex">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-widest text-neutral-300 uppercase">
                Total
              </span>
              <span className="text-[14px] font-bold text-neutral-900">{testimonials.length}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-widest text-neutral-300 uppercase">
                Pending
              </span>
              <span className="text-[14px] font-bold text-neutral-900">
                {testimonials.filter((t) => t.status === "pending").length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search testimonials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-neutral-100 bg-white py-2.5 pr-4 pl-10 text-[14px] shadow-sm transition-all outline-none focus:border-pink-200 focus:ring-2 focus:ring-pink-100 focus:outline-hidden"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={`relative flex h-[46px] items-center gap-2 rounded-2xl border px-4 py-2 text-[13px] font-bold shadow-sm transition-all outline-none ${
                minRating !== null
                  ? "border-pink-200 bg-pink-50 text-pink-600"
                  : "border-neutral-100 bg-white text-neutral-600 hover:bg-neutral-50"
              } `}
            >
              <Filter className={`size-3.5 ${minRating !== null ? "text-pink-500" : ""}`} />
              Rating
              {minRating !== null && (
                <span className="absolute -top-1 -right-1 size-2.5 rounded-full border-2 border-white bg-pink-500 shadow-sm" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-2xl border-neutral-100 bg-white p-2 shadow-2xl"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-3 py-2 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                  Minimum Rating
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mx-2 my-1 bg-neutral-50" />
                <DropdownMenuRadioGroup
                  value={minRating?.toString() || "all"}
                  onValueChange={(val) => setMinRating(val === "all" ? null : parseInt(val))}
                >
                  <DropdownMenuRadioItem
                    value="all"
                    className="rounded-xl px-3 py-2 text-[14px] transition-colors focus:bg-neutral-50"
                  >
                    All Ratings
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="5"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-[14px] transition-colors focus:bg-neutral-50"
                  >
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    <span>5 Stars only</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="4"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-[14px] transition-colors focus:bg-neutral-50"
                  >
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    <span>4+ Stars</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="3"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-[14px] transition-colors focus:bg-neutral-50"
                  >
                    <Star className="size-3.5 fill-amber-400 text-amber-400" />
                    <span>3+ Stars</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>

              {minRating !== null && (
                <>
                  <DropdownMenuSeparator className="mx-2 my-1 bg-neutral-50" />
                  <DropdownMenuItem
                    onClick={() => setMinRating(null)}
                    className="cursor-pointer justify-center rounded-xl px-3 py-2 text-center text-[13px] font-bold text-pink-600 transition-colors hover:bg-pink-50 focus:bg-pink-50"
                  >
                    Clear Filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filter Toolbar (Type Switchers & Status Tabs) */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-1">
        {/* Type Switchers (Pills) */}
        <div className="flex items-center gap-2.5">
          {(["all", "video", "text"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`rounded-full border px-5 py-2 text-[13px] font-bold capitalize transition-all duration-200 ${
                typeFilter === type
                  ? "border-pink-200 bg-pink-50 text-pink-600 shadow-sm"
                  : "border-neutral-100 bg-white text-neutral-400 hover:border-neutral-200 hover:text-neutral-500"
              } `}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Status Tabs */}
        <div className="flex w-fit items-center gap-1 rounded-xl bg-neutral-100/50 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = testimonials.filter(
              (t) => tab.id === "all" || t.status === tab.id,
            ).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-[13px] font-medium transition-all ${
                  isActive
                    ? "border border-black/5 bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:bg-white/50 hover:text-neutral-700"
                } `}
              >
                <Icon className={`size-3.5 ${isActive ? "text-pink-500" : "text-neutral-400"}`} />
                {tab.label}
                <span
                  className={`ml-1 rounded-full border px-1.5 py-0.5 text-[11px] ${isActive ? "border-neutral-100 bg-neutral-50 text-neutral-600" : "border-transparent bg-neutral-50/50 text-neutral-400"} `}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTestimonials.length > 0 ? (
          filteredTestimonials.map((t) => (
            <TestimonialCard
              key={t.id}
              testimonial={t}
              onUpdateStatus={handleStatusUpdate}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="rounded-[32px] border border-dashed border-neutral-200 bg-white py-24 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border border-neutral-100 bg-neutral-50">
              <MessageSquareQuote className="size-8 text-neutral-300" />
            </div>
            <h3 className="text-[16px] font-bold text-neutral-900">No testimonials found</h3>
            <p className="mx-auto mt-1 max-w-xs text-[14px] leading-relaxed text-neutral-500">
              {searchQuery || typeFilter !== "all" || minRating !== null
                ? "Try adjusting your filters to find what you're looking for."
                : "You haven't received any testimonials for this project yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function TestimonialCard({
  testimonial,
  onUpdateStatus,
  onDelete,
}: {
  testimonial: Testimonial;
  onUpdateStatus: (id: string, status: "approved" | "archived" | "pending") => void;
  onDelete: (id: string) => void;
}) {
  const t = testimonial;
  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-neutral-100 bg-white p-6 transition-all hover:shadow-xl hover:shadow-black/5 sm:p-7">
      {/* Status Accent Line */}
      <div
        className={`absolute top-0 bottom-0 left-0 w-1 ${
          t.status === "approved"
            ? "bg-green-500"
            : t.status === "pending"
              ? "bg-amber-500"
              : "bg-neutral-300"
        }`}
      />

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Content Section */}
        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${(t.rating ?? 0) > i ? "fill-amber-400 text-amber-400" : "fill-neutral-100 text-neutral-100"}`}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold tracking-widest text-neutral-300 uppercase">
              · {t.type} Testimonial
            </span>
          </div>

          <p
            className="mb-8 text-[17px] leading-relaxed font-medium text-neutral-800 italic sm:text-[18px]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            "{t.content}"
          </p>

          <footer className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50">
              {t.authorImage ? (
                <img
                  src={t.authorImage}
                  alt={t.authorName ?? "Author"}
                  className="size-full object-cover"
                />
              ) : (
                <User className="size-6 text-neutral-200" />
              )}
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-[15px] font-bold text-neutral-900">{t.authorName}</h4>
              <p className="flex items-center gap-2 text-[13px] text-neutral-400">
                {t.authorEmail}
                <span className="size-1 rounded-full bg-neutral-200" />
                {formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}
              </p>
            </div>
          </footer>
        </div>

        {/* Action Controls */}
        <div className="flex shrink-0 flex-row items-center justify-between gap-6 border-t border-neutral-100 pt-6 lg:flex-col lg:items-end lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
          <div className="flex items-center gap-2.5 lg:flex-col">
            {t.status !== "approved" && (
              <button
                onClick={() => onUpdateStatus(t.id, "approved")}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-green-200/50 bg-green-50 px-4 text-[13px] font-bold text-green-600 transition-all hover:bg-green-100"
              >
                <Check className="size-4" />
                Approve
              </button>
            )}
            {t.status === "approved" && (
              <button
                onClick={() => onUpdateStatus(t.id, "pending")}
                className="flex h-10 items-center justify-center gap-2 rounded-xl border border-amber-200/50 bg-amber-50 px-4 text-[13px] font-bold text-amber-600 transition-all hover:bg-amber-100"
              >
                <Clock className="size-4" />
                Waitlist
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onUpdateStatus(t.id, "archived")}
                className={`flex size-10 items-center justify-center rounded-xl border transition-all ${
                  t.status === "archived"
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-100 bg-white text-neutral-400 shadow-sm hover:border-neutral-200 hover:text-neutral-900"
                }`}
                title="Archive"
              >
                <Archive className="size-4.5" />
              </button>
              <button
                onClick={() => onDelete(t.id)}
                className="flex size-10 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-400 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                title="Delete"
              >
                <Trash2 className="size-4.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 text-[12px] font-bold tracking-widest text-neutral-300 uppercase transition-colors hover:text-neutral-600">
              <ExternalLink className="size-3.5" />
              Raw Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
