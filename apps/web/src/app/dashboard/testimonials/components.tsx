"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Star,
  User,
  Check,
  Archive,
  Search,
  Plus,
  MessageSquareQuote,
  Copy,
  Clock,
  MoreVertical,
  Trash2,
  ExternalLink,
  ChevronDown,
  Filter,
  X,
  Type,
  Video,
  Layers,
  Tag,
} from "lucide-react";
import { gooeyToast as toast } from "goey-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { trpc, queryClient, type RouterOutputs } from "@/utils/trpc";
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
  deletedAt?: string | Date | null;
  testimonialToTags?: {
    tag: {
      id: string;
      name: string;
      color: string;
    };
  }[];
}

interface InboxProps {
  initialTestimonials: Testimonial[];
  project: RouterOutputs["dashboard"]["getProjectTestimonials"]["project"];
  projects: {
    id: string;
    name: string;
  }[];
}

const TABS = [
  { id: "pending", label: "Pending", icon: Clock },
  { id: "approved", label: "Approved", icon: Check },
  { id: "archived", label: "Archived", icon: Archive },
  { id: "all", label: "All", icon: MessageSquareQuote },
] as const;

export function TestimonialInbox({ initialTestimonials, project, projects }: InboxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "archived">(
    "pending",
  );
  const [typeFilter, setTypeFilter] = useState<"all" | "video" | "text">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [rawTestimonial, setRawTestimonial] = useState<Testimonial | null>(null);
  const [isPending, startTransition] = useTransition();

  const { data: tags } = useQuery(trpc.tag.list.queryOptions());

  // Fetch testimonials with real-time polling
  const { data: qData } = useQuery(
    trpc.dashboard.getProjectTestimonials.queryOptions(
      { projectId: project.id },
      {
        initialData: { project: project as any, testimonials: initialTestimonials as any },
      },
    ),
  );

  const testimonials = qData?.testimonials ?? initialTestimonials;
  const displayedTestimonials = mounted ? testimonials : initialTestimonials;

  const handleProjectSwitch = (projectId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("project", projectId);
    router.push(`/dashboard/testimonials?${params.toString()}`);
  };

  const filteredTestimonials = displayedTestimonials.filter((t: Testimonial) => {
    const matchesTab = activeTab === "all" || t.status === activeTab;
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    const matchesSearch =
      t.authorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.authorEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = minRating === null || (t.rating ?? 0) >= minRating;
    const matchesTag =
      selectedTagId === null || t.testimonialToTags?.some((tt) => tt.tag.id === selectedTagId);
    return matchesTab && matchesType && matchesSearch && matchesRating && matchesTag;
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

  const handleDelete = (id: string) => {
    toast("Delete testimonial?", {
      description: "Are you sure you want to delete this? This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => {
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
        },
      },
    });
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/collect/${project.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Collection link copied!", {
      description: url,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Toolbar: Collection Info & Quick Actions */}
      <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-3">
          {/* Project Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger className="group flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white px-4 py-2 shadow-sm transition-all outline-none hover:border-neutral-200 hover:shadow-md">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-pink-50 transition-colors group-hover:bg-pink-100">
                <MessageSquareQuote className="size-4 text-pink-500" />
              </div>
              <div className="text-left">
                <p className="mb-0.5 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                  Active Collection
                </p>
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-[14px] font-bold text-neutral-900">{project.name}</p>
                  <ChevronDown className="size-3.5 text-neutral-300 transition-colors group-hover:text-neutral-500" />
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="animate-in zoom-in-95 w-64 rounded-2xl border-neutral-100 bg-white p-2 text-neutral-900 shadow-2xl duration-200"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-3 py-2 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                  Switch Collection
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

          {/* Collection Link Action */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="group flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white px-4 py-2 shadow-sm transition-all outline-none hover:border-neutral-200 hover:shadow-md"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-neutral-50 transition-colors group-hover:bg-neutral-100">
              <Copy className="size-4 text-neutral-400 transition-colors group-hover:text-neutral-600" />
            </div>
            <div className="text-left">
              <p className="mb-0.5 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                Collection Link
              </p>
              <p className="max-w-[140px] truncate text-[14px] font-bold text-neutral-900 group-hover:text-pink-600 sm:max-w-[200px]">
                {mounted
                  ? `${window.location.host}/collect/${project.slug}`
                  : `/collect/${project.slug}`}
              </p>
            </div>
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search testimonials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-neutral-100 bg-white py-2.5 pr-4 pl-10 text-[14px] text-neutral-900 shadow-sm transition-all outline-none placeholder:text-neutral-400 focus:border-pink-200 focus:ring-2 focus:ring-pink-100 focus:outline-hidden"
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
              className="w-56 rounded-2xl border-neutral-100 bg-white p-2 text-neutral-900 shadow-2xl"
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

          {/* Tag Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`relative flex h-[46px] items-center gap-2 rounded-2xl border px-4 py-2 text-[13px] font-bold shadow-sm transition-all outline-none ${
                selectedTagId !== null
                  ? "border-pink-200 bg-pink-50 text-pink-600"
                  : "border-neutral-100 bg-white text-neutral-600 hover:bg-neutral-50"
              } `}
            >
              <Tag className={`size-3.5 ${selectedTagId !== null ? "text-pink-500" : ""}`} />
              Tag
              {selectedTagId !== null && (
                <span className="absolute -top-1 -right-1 size-2.5 rounded-full border-2 border-white bg-pink-500 shadow-sm" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-2xl border-neutral-100 bg-white p-2 text-neutral-900 shadow-2xl"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-3 py-2 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                  Filter by Tag
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mx-2 my-1 bg-neutral-50" />
                <DropdownMenuRadioGroup
                  value={selectedTagId || "all"}
                  onValueChange={(val) => setSelectedTagId(val === "all" ? null : val)}
                >
                  <DropdownMenuRadioItem
                    value="all"
                    className="rounded-xl px-3 py-2 text-[14px] transition-colors focus:bg-neutral-50"
                  >
                    All Testimonials
                  </DropdownMenuRadioItem>
                  {tags?.map((tag) => (
                    <DropdownMenuRadioItem
                      key={tag.id}
                      value={tag.id}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-[14px] transition-colors focus:bg-neutral-50"
                    >
                      <div className="size-2 rounded-full" style={{ backgroundColor: tag.color }} />
                      <span>{tag.name}</span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>

              {selectedTagId !== null && (
                <>
                  <DropdownMenuSeparator className="mx-2 my-1 bg-neutral-50" />
                  <DropdownMenuItem
                    onClick={() => setSelectedTagId(null)}
                    className="cursor-pointer justify-center rounded-xl px-3 py-2 text-center text-[13px] font-bold text-pink-600 transition-colors hover:bg-pink-50 focus:bg-pink-50"
                  >
                    Clear Tag Filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filter Toolbar (Type Switchers & Status Tabs) */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-1">
        {/* Type Switchers (Segmented Control) */}
        <div className="flex items-center gap-1 rounded-xl bg-neutral-100/50 p-1">
          {[
            { id: "all", label: "All", icon: Layers },
            { id: "video", label: "Video", icon: Video },
            { id: "text", label: "Text", icon: Type },
          ].map((type) => {
            const Icon = type.icon;
            const isActive = typeFilter === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setTypeFilter(type.id as any)}
                className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-[13px] font-medium transition-all ${
                  isActive
                    ? "border border-black/5 bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:bg-white/50 hover:text-neutral-700"
                } `}
              >
                <Icon className={`size-3.5 ${isActive ? "text-pink-500" : "text-neutral-400"}`} />
                {type.label}
              </button>
            );
          })}
        </div>

        {/* Status Tabs */}
        <div className="flex w-fit items-center gap-1 rounded-xl bg-neutral-100/50 p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = displayedTestimonials.filter(
              (t: { status: string }) => tab.id === "all" || t.status === tab.id,
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
          filteredTestimonials.map((t: Testimonial) => (
            <TestimonialCard
              key={t.id}
              testimonial={t}
              onUpdateStatus={handleStatusUpdate}
              onDelete={handleDelete}
              onViewRaw={() => setRawTestimonial(t)}
              workspaceId={project.workspaceId}
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
            {!(searchQuery || typeFilter !== "all" || minRating !== null) && (
              <button
                onClick={handleCopyLink}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#171717] px-6 py-3 text-[14px] font-bold text-white shadow-lg shadow-black/5 transition-all hover:opacity-90 active:scale-[0.98]"
              >
                <Copy className="size-4" />
                Copy Collection Link
              </button>
            )}
          </div>
        )}
      </div>

      <RawDataModal
        open={!!rawTestimonial}
        testimonial={rawTestimonial}
        onClose={() => setRawTestimonial(null)}
      />
    </div>
  );
}

const TAG_COLORS = [
  { name: "Pink", color: "#e8527a" },
  { name: "Purple", color: "#8b5cf6" },
  { name: "Indigo", color: "#6366f1" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Cyan", color: "#06b6d4" },
  { name: "Emerald", color: "#10b981" },
  { name: "Amber", color: "#f59e0b" },
  { name: "Orange", color: "#f97316" },
  { name: "Rose", color: "#f43f5e" },
  { name: "Slate", color: "#64748b" },
];

function CreateTagModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0].color);
  const [loading, setLoading] = useState(false);

  const createTag = useMutation(
    trpc.tag.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.tag.list.queryOptions());
        toast.success("Tag created!");
        onClose();
        setName("");
      },
      onError: () => {
        toast.error("Failed to create tag");
      },
    }),
  );

  useEffect(() => {
    if (open) {
      document.body.setAttribute("data-modal-open", "true");
    } else {
      document.body.removeAttribute("data-modal-open");
    }
    return () => {
      document.body.removeAttribute("data-modal-open");
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createTag.mutateAsync({ name, color: selectedColor });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="animate-in fade-in absolute inset-0 bg-black/40 backdrop-blur-sm duration-300"
        onClick={onClose}
      />
      <div
        className="animate-in zoom-in-95 relative w-full max-w-sm overflow-hidden rounded-[32px] bg-white shadow-2xl duration-300"
        style={{ border: "1px solid rgba(0,0,0,0.08)" }}
      >
        <div className="relative p-7 sm:p-9">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight text-neutral-900">Create Tag</h3>
            <button
              type="button"
              onClick={onClose}
              className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-neutral-50"
            >
              <X className="size-5 text-neutral-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="px-1 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                Tag Name
              </label>
              <input
                autoFocus
                type="text"
                required
                placeholder="e.g. Enterprise"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-[14px] font-medium transition-all outline-none placeholder:text-neutral-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              />
            </div>

            <div className="space-y-3">
              <label className="px-1 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                Color
              </label>
              <div className="grid grid-cols-5 gap-3">
                {TAG_COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.color)}
                    className={`flex size-10 items-center justify-center rounded-xl transition-all ${
                      selectedColor === c.color ? "ring-2 ring-neutral-900 ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: c.color }}
                    title={c.name}
                  >
                    {selectedColor === c.color && <Check className="size-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#171717] px-4 py-3 text-[14px] font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Tag"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({
  testimonial,
  onUpdateStatus,
  onDelete,
  onViewRaw,
  workspaceId,
}: {
  testimonial: Testimonial;
  onUpdateStatus: (id: string, status: "approved" | "archived" | "pending") => void;
  onDelete: (id: string) => void;
  onViewRaw: () => void;
  workspaceId?: string;
}) {
  const t = testimonial;
  const { data: tags } = useQuery(trpc.tag.list.queryOptions());
  const [createTagOpen, setCreateTagOpen] = useState(false);

  const assignTag = useMutation(
    trpc.tag.assign.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.dashboard.getProjectTestimonials.queryOptions({ projectId: t.projectId }),
        );
        toast.success("Tag assigned");
      },
    }),
  );
  const unassignTag = useMutation(
    trpc.tag.unassign.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.dashboard.getProjectTestimonials.queryOptions({ projectId: t.projectId }),
        );
        toast.success("Tag removed");
      },
    }),
  );

  const getIsTagged = (tagId: string) => {
    return t.testimonialToTags?.some((tt) => tt.tag.id === tagId);
  };

  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-neutral-100 bg-white p-6 transition-all hover:shadow-xl hover:shadow-black/5 sm:p-7">
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
        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="relative">
                  <Star className="size-4 fill-neutral-100 text-neutral-100" />
                  {(t.rating ?? 0) >= s - 0.5 && (t.rating ?? 0) < s && (
                    <div className="absolute inset-0 z-10 w-1/2 overflow-hidden">
                      <Star className="size-4 fill-amber-400 text-amber-400" />
                    </div>
                  )}
                  {(t.rating ?? 0) >= s && (
                    <div className="absolute inset-0 z-10 overflow-hidden">
                      <Star className="size-4 fill-amber-400 text-amber-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <span className="text-[11px] font-bold tracking-widest text-neutral-300 uppercase">
              · {t.type} Testimonial
            </span>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {t.testimonialToTags?.map((tt) => (
              <span
                key={tt.tag.id}
                className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold"
                style={{
                  backgroundColor: `${tt.tag.color}10`,
                  color: tt.tag.color,
                  borderColor: `${tt.tag.color}30`,
                }}
              >
                {tt.tag.name}
                <button
                  onClick={() => unassignTag.mutate({ testimonialId: t.id, tagId: tt.tag.id })}
                  className="hover:opacity-60"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-5 items-center gap-1 rounded-full border border-dashed border-neutral-200 px-2 text-[10px] font-bold text-neutral-400 hover:border-neutral-300 hover:text-neutral-500">
                <Plus className="size-2.5" /> Tag
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 rounded-xl">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Available Tags
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {tags?.map((tag) => (
                    <DropdownMenuItem
                      key={tag.id}
                      disabled={getIsTagged(tag.id)}
                      onClick={() => assignTag.mutate({ testimonialId: t.id, tagId: tag.id })}
                      className="flex items-center gap-2"
                    >
                      <div className="size-2 rounded-full" style={{ backgroundColor: tag.color }} />
                      {tag.name}
                      {getIsTagged(tag.id) && <Check className="ml-auto size-3" />}
                    </DropdownMenuItem>
                  ))}
                  {(!tags || tags.length === 0) && (
                    <div className="p-2 text-center text-[11px] text-neutral-400">
                      No tags created yet
                    </div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setCreateTagOpen(true)}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-[11px] font-bold text-pink-600 transition-colors hover:bg-pink-50"
                  >
                    <Plus className="size-3" />
                    Create New Tag
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CreateTagModal open={createTagOpen} onClose={() => setCreateTagOpen(false)} />

          {t.type === "video" && t.videoUrl && (
            <div className="mb-6 aspect-video w-full max-w-sm overflow-hidden rounded-3xl border border-neutral-100 bg-black shadow-lg">
              <video src={t.videoUrl} controls className="size-full object-cover" />
            </div>
          )}

          {t.content && (
            <p
              className="mb-8 text-[17px] leading-relaxed font-medium text-neutral-800 italic sm:text-[18px]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              "{t.content}"
            </p>
          )}

          <footer className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50">
              {t.authorImage ? (
                <Image
                  src={t.authorImage as string}
                  alt={t.authorName ?? "Author"}
                  width={44}
                  height={44}
                  className="size-full object-cover"
                />
              ) : (
                <User className="size-6 text-neutral-200" />
              )}
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-[15px] font-bold text-neutral-900">{t.authorName}</h4>
              <p className="mt-0.5 truncate text-[13px] text-neutral-400">
                {t.authorEmail}
                <span className="mx-2 inline-block size-1 rounded-full bg-neutral-200" />
                <span suppressHydrationWarning>
                  {formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}
                </span>
              </p>
            </div>
          </footer>
        </div>

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
                Unapprove
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
                <Archive className="size-4" />
              </button>
              <button
                onClick={() => onDelete(t.id)}
                className="flex size-10 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-400 transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                title="Delete"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onViewRaw}
              className="flex items-center gap-2 text-[12px] font-bold tracking-widest text-neutral-400 uppercase transition-colors hover:text-neutral-600"
            >
              <ExternalLink className="size-3.5" />
              Raw Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RawDataModal({
  open,
  testimonial,
  onClose,
}: {
  open: boolean;
  testimonial: Testimonial | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.setAttribute("data-modal-open", "true");
    } else {
      document.body.removeAttribute("data-modal-open");
    }
    return () => {
      document.body.removeAttribute("data-modal-open");
    };
  }, [open]);

  if (!open || !testimonial) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(testimonial, null, 2));
    setCopied(true);
    toast.success("JSON copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="animate-in fade-in absolute inset-0 bg-black/40 backdrop-blur-sm duration-300"
        onClick={onClose}
      />

      {/* Content */}
      <div
        className="animate-in zoom-in-95 relative w-full max-w-2xl overflow-hidden rounded-[32px] bg-white shadow-2xl duration-300"
        style={{ border: "1px solid rgba(0,0,0,0.08)" }}
      >
        <div className="relative p-7 sm:p-9">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3
                className="text-xl font-bold tracking-tight text-neutral-900"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Raw Testimonial Data
              </h3>
              <p className="mt-1 text-[13px] text-neutral-400">
                Detailed metadata and payload for integration.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-neutral-50"
            >
              <X className="size-5 text-neutral-400" />
            </button>
          </div>

          <div className="relative rounded-2xl border border-neutral-100 bg-neutral-800 p-6 shadow-inner">
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-lg bg-neutral-700 px-3 py-1.5 text-[11px] font-bold text-neutral-300 transition-all hover:bg-neutral-600 hover:text-white"
              >
                {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                {copied ? "Copied!" : "Copy JSON"}
              </button>
            </div>
            <pre className="scrollbar-hide max-h-[400px] overflow-auto font-mono text-[13px] leading-relaxed text-neutral-300">
              <code>{JSON.stringify(testimonial, null, 2)}</code>
            </pre>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-full bg-neutral-900 px-8 py-3 text-[14px] font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Close Metadata
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
