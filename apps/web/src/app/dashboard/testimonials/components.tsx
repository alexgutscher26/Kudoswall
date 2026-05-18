"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
  Trash2,
  ExternalLink,
  ChevronDown,
  Filter,
  X,
  Type,
  Video,
  Layers,
  Tag,
  Download,
  ShieldCheck,
  Sparkles,
  GripVertical,
  Lock,
  Eye,
  Quote,
} from "lucide-react";
import { gooeyToast as toast } from "goey-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
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
import {
  updateTestimonialStatus,
  deleteTestimonial,
  bulkUpdateTestimonialStatus,
  bulkDeleteTestimonials,
  bulkTagTestimonials,
  featureTestimonial,
  reorderFeaturedTestimonials,
} from "../actions";
import { formatDistanceToNow } from "date-fns";
import { useRealtimeInbox } from "@/hooks/use-realtime-inbox";

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
  verifiedVia?: string | null;
  verifiedAt?: string | Date | null;
  verifiedId?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date | null;
  featured: boolean;
  featuredOrder: number;
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
  permissions: any;
}

const TABS = [
  { id: "pending", label: "Pending", icon: Clock },
  { id: "approved", label: "Approved", icon: Check },
  { id: "featured", label: "Featured", icon: Sparkles },
  { id: "archived", label: "Archived", icon: Archive },
  { id: "all", label: "All", icon: MessageSquareQuote },
] as const;

export function TestimonialInbox({
  initialTestimonials,
  project,
  projects,
  permissions,
}: InboxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "approved" | "archived" | "featured"
  >("pending");
  const [typeFilter, setTypeFilter] = useState<"all" | "video" | "text">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Enable real-time updates for this project and workspace
  useRealtimeInbox(project.workspaceId, project.id);
  const [rawTestimonial, setRawTestimonial] = useState<Testimonial | null>(null);
  const [previewTestimonial, setPreviewTestimonial] = useState<Testimonial | null>(null);
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

  const idParam = searchParams.get("id");
  useEffect(() => {
    if (idParam && displayedTestimonials) {
      const found = (displayedTestimonials as Testimonial[]).find(
        (t: Testimonial) => t.id === idParam,
      );
      if (found) {
        setPreviewTestimonial(found);
      }
    }
  }, [idParam, displayedTestimonials]);

  const handleClosePreview = () => {
    setPreviewTestimonial(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("id");
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}` as any);
  };

  // Clear focused card when filters or active tabs change
  useEffect(() => {
    setFocusedId(null);
  }, [activeTab, typeFilter, searchQuery, minRating, selectedTagId]);

  const handleProjectSwitch = (projectId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("project", projectId);
    router.push(`/dashboard/testimonials?${params.toString()}` as any);
  };

  const filteredTestimonials = (displayedTestimonials as Testimonial[]).filter((t: Testimonial) => {
    const matchesTab =
      activeTab === "all" ? true : activeTab === "featured" ? t.featured : t.status === activeTab;
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

  const sortedTestimonials = [...filteredTestimonials].sort((a, b) => {
    if (activeTab === "featured") {
      return a.featuredOrder - b.featuredOrder;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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

  // Keyboard Navigation & Shortcuts Hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      // 1. Toggle shortcuts cheat sheet with '?' (Shift + /)
      if (e.key === "?") {
        setShowShortcutsHelp((prev) => !prev);
        return;
      }

      // 2. Escape to close modals
      if (e.key === "Escape") {
        if (showShortcutsHelp) {
          setShowShortcutsHelp(false);
        } else if (previewTestimonial) {
          handleClosePreview();
        } else if (rawTestimonial) {
          setRawTestimonial(null);
        }
        return;
      }

      // Actions if preview modal is open
      if (previewTestimonial) {
        const t = previewTestimonial;
        if (e.key === "a" || e.key === "A") {
          handleStatusUpdate(t.id, "approved");
          handleClosePreview();
          toast.success("Testimonial approved");
        } else if (e.key === "r" || e.key === "R") {
          handleStatusUpdate(t.id, "archived");
          handleClosePreview();
          toast.success("Testimonial archived");
        }
        return;
      }

      // Actions if in the main list
      if (sortedTestimonials.length === 0) return;

      const currentIndex = sortedTestimonials.findIndex((t) => t.id === focusedId);

      // J key - navigate down
      if (e.key === "j" || e.key === "J") {
        e.preventDefault();
        let nextIndex = 0;
        if (currentIndex !== -1 && currentIndex < sortedTestimonials.length - 1) {
          nextIndex = currentIndex + 1;
        }
        const nextId = sortedTestimonials[nextIndex]!.id;
        setFocusedId(nextId);
        // Scroll target card into view smoothly
        setTimeout(() => {
          const el = document.getElementById(`testimonial-card-${nextId}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }, 10);
      }

      // K key - navigate up
      else if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        let prevIndex = sortedTestimonials.length - 1;
        if (currentIndex > 0) {
          prevIndex = currentIndex - 1;
        }
        const prevId = sortedTestimonials[prevIndex]!.id;
        setFocusedId(prevId);
        // Scroll target card into view smoothly
        setTimeout(() => {
          const el = document.getElementById(`testimonial-card-${prevId}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }, 10);
      }

      // A key - approve focused card
      else if (e.key === "a" || e.key === "A") {
        if (focusedId) {
          handleStatusUpdate(focusedId, "approved");
          toast.success("Testimonial approved");
        }
      }

      // R key - archive focused card
      else if (e.key === "r" || e.key === "R") {
        if (focusedId) {
          handleStatusUpdate(focusedId, "archived");
          toast.success("Testimonial archived");
        }
      }

      // V or Enter key - open preview modal
      else if (e.key === "v" || e.key === "V" || e.key === "Enter") {
        if (focusedId) {
          const t = sortedTestimonials.find((x) => x.id === focusedId);
          if (t) {
            setPreviewTestimonial(t);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedId, sortedTestimonials, previewTestimonial, showShortcutsHelp, rawTestimonial]);

  const handleBulkStatusUpdate = async (status: "approved" | "archived" | "pending") => {
    if (selectedIds.length === 0) return;
    startTransition(async () => {
      try {
        await bulkUpdateTestimonialStatus(selectedIds, status);
        await queryClient.invalidateQueries(
          trpc.dashboard.getProjectTestimonials.queryOptions({ projectId: project.id }),
        );
        toast.success(`${selectedIds.length} testimonials ${status}`);
        setSelectedIds([]);
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

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    toast(`Delete ${selectedIds.length} testimonials?`, {
      description: "Are you sure you want to delete selected items? This action cannot be undone.",
      action: {
        label: "Delete All",
        onClick: () => {
          startTransition(async () => {
            try {
              await bulkDeleteTestimonials(selectedIds);
              await queryClient.invalidateQueries(
                trpc.dashboard.getProjectTestimonials.queryOptions({ projectId: project.id }),
              );
              toast.success(`${selectedIds.length} testimonials deleted`);
              setSelectedIds([]);
            } catch (error) {
              toast.error("Failed to delete testimonials");
            }
          });
        },
      },
    });
  };

  const handleBulkTag = async (tagId: string, action: "assign" | "unassign") => {
    if (selectedIds.length === 0) return;
    startTransition(async () => {
      try {
        await bulkTagTestimonials(selectedIds, tagId, action);
        await queryClient.invalidateQueries(
          trpc.dashboard.getProjectTestimonials.queryOptions({ projectId: project.id }),
        );
        toast.success(`Tags ${action === "assign" ? "assigned" : "removed"}`);
        setSelectedIds([]);
      } catch (error) {
        toast.error("Failed to update tags");
      }
    });
  };

  const handleFeatureToggle = async (id: string, featured: boolean) => {
    startTransition(async () => {
      try {
        await featureTestimonial(id, featured);
        await queryClient.invalidateQueries(
          trpc.dashboard.getProjectTestimonials.queryOptions({ projectId: project.id }),
        );
        toast.success(featured ? "Testimonial featured" : "Testimonial unfeatured");
      } catch (error) {
        toast.error("Failed to update featured status");
      }
    });
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const items = Array.from(sortedTestimonials);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Optimistic update
    const orders = items.map((t, index) => ({ id: t.id, featuredOrder: index }));

    try {
      await reorderFeaturedTestimonials(orders);
      await queryClient.invalidateQueries(
        trpc.dashboard.getProjectTestimonials.queryOptions({ projectId: project.id }),
      );
      toast.success("Order updated");
    } catch (error) {
      toast.error("Failed to save new order");
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredTestimonials.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTestimonials.map((t: Testimonial) => t.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/collect/${project.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Collection link copied!", {
      description: url,
    });
  };

  const handleExport = () => {
    if (!permissions?.features?.csvExport) {
      toast.error("CSV Export is a Pro feature", {
        description: "Upgrade your plan to export your testimonials.",
      });
      return;
    }

    if (filteredTestimonials.length === 0) {
      toast.error("No testimonials to export");
      return;
    }

    const headers = [
      "ID",
      "Author Name",
      "Author Email",
      "Author Company",
      "Rating",
      "Status",
      "Type",
      "Content",
      "Video URL",
      "Tags",
      "Submitted At",
    ];

    const csvRows = filteredTestimonials.map((t: Testimonial) => {
      const tags = t.testimonialToTags?.map((tt) => tt.tag.name).join("; ") || "";
      const row = [
        t.id,
        t.authorName || "",
        t.authorEmail || "",
        t.authorCompany || "",
        t.rating?.toString() || "",
        t.status,
        t.type,
        (t.content || "").replace(/"/g, '""'),
        t.videoUrl || "",
        tags,
        new Date(t.createdAt).toISOString(),
      ];
      return row.map((val) => `"${val}"`).join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `testimonials_${project.slug}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export successful!", {
      description: `${filteredTestimonials.length} testimonials exported`,
    });
  };

  const handleBulkExport = () => {
    if (!permissions?.features?.csvExport) {
      toast.error("CSV Export is a Pro feature", {
        description: "Upgrade your plan to export your testimonials.",
      });
      return;
    }

    if (selectedIds.length === 0) return;

    const selectedTestimonials = filteredTestimonials.filter((t: Testimonial) =>
      selectedIds.includes(t.id),
    );

    const headers = [
      "ID",
      "Author Name",
      "Author Email",
      "Author Company",
      "Rating",
      "Status",
      "Type",
      "Content",
      "Video URL",
      "Tags",
      "Submitted At",
    ];

    const csvRows = selectedTestimonials.map((t: Testimonial) => {
      const tags = t.testimonialToTags?.map((tt) => tt.tag.name).join("; ") || "";
      const row = [
        t.id,
        t.authorName || "",
        t.authorEmail || "",
        t.authorCompany || "",
        t.rating?.toString() || "",
        t.status,
        t.type,
        (t.content || "").replace(/"/g, '""'),
        t.videoUrl || "",
        tags,
        new Date(t.createdAt).toISOString(),
      ];
      return row.map((val) => `"${val}"`).join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `selected_testimonials_${project.slug}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export successful!", {
      description: `${selectedIds.length} testimonials exported`,
    });
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Premium Header: Project Context & Search/Filter Toolbar */}
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            {/* Project Switcher - Simplified */}
            <DropdownMenu>
              <DropdownMenuTrigger className="group flex items-center gap-3 outline-none">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-pink-50 shadow-sm ring-1 ring-pink-100 transition-all group-hover:scale-105 group-hover:bg-pink-100 group-hover:shadow-md">
                  <MessageSquareQuote className="size-5 text-pink-500" />
                </div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                      {project.name}
                    </h1>
                    <ChevronDown className="mt-1 size-4 text-neutral-400 transition-colors group-hover:text-neutral-600" />
                  </div>
                  <p className="text-xs font-medium text-neutral-400">Personal Workspace</p>
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
                      {projects?.map((p) => (
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
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("new", "project");
                    router.push(`${pathname}?${params.toString()}` as any);
                  }}
                  className="mt-1 flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-bold text-neutral-900 transition-all hover:bg-neutral-50 focus:bg-neutral-900 focus:text-white"
                >
                  <Plus className="size-3.5" />
                  New Collection Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="mx-2 hidden h-8 w-px bg-neutral-100 sm:block" />

            {/* Subtle Copy Link */}
            <button
              onClick={handleCopyLink}
              className="group hidden items-center gap-2 rounded-xl border border-neutral-100 bg-white px-3 py-1.5 shadow-sm transition-all hover:border-neutral-200 hover:shadow-md sm:flex"
            >
              <Copy className="size-3.5 text-neutral-400 transition-colors group-hover:text-pink-500" />
              <span className="text-[13px] font-semibold text-neutral-600 transition-colors group-hover:text-neutral-900">
                Copy Link
              </span>
            </button>

            {/* Keyboard Shortcuts Guide Button */}
            <button
              onClick={() => setShowShortcutsHelp(true)}
              className="group hidden items-center gap-2 rounded-xl border border-neutral-100 bg-white px-3 py-1.5 shadow-sm transition-all hover:border-neutral-200 hover:shadow-md sm:flex"
              title="Keyboard Shortcuts Guide (?)"
            >
              <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold text-neutral-500 ring-1 ring-neutral-200/50">
                ?
              </kbd>
              <span className="text-[13px] font-semibold text-neutral-600 transition-colors group-hover:text-neutral-900">
                Shortcuts
              </span>
            </button>
          </div>
        </div>

        {/* Unified Control Bar */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-neutral-100 bg-white/50 p-1.5 shadow-xs ring-1 ring-black/[0.02] backdrop-blur-sm sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search testimonials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl bg-transparent pr-4 pl-10 text-[14px] text-neutral-900 outline-none placeholder:text-neutral-400"
              />
            </div>

            <div className="h-6 w-px bg-neutral-100" />

            <div className="scrollbar-hide flex items-center gap-1.5 overflow-x-auto pr-1">
              {filteredTestimonials.length > 0 && (
                <button
                  onClick={handleSelectAll}
                  className="flex h-9 shrink-0 items-center gap-2 rounded-xl px-3 text-[13px] font-bold text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900"
                >
                  <Check
                    className={`size-3.5 ${selectedIds.length === filteredTestimonials.length ? "text-pink-500" : "text-neutral-400"}`}
                  />
                  <span className="hidden whitespace-nowrap sm:inline">
                    {selectedIds.length === filteredTestimonials.length ? "Deselect" : "Select All"}
                  </span>
                </button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger
                  className={`relative flex h-9 shrink-0 items-center gap-2 rounded-xl px-3 text-[13px] font-bold transition-all outline-none ${
                    minRating !== null
                      ? "bg-pink-50 text-pink-600"
                      : "text-neutral-600 hover:bg-neutral-100"
                  } `}
                >
                  <Filter className={`size-3.5 ${minRating !== null ? "text-pink-500" : ""}`} />
                  Rating
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

              <DropdownMenu>
                <DropdownMenuTrigger
                  disabled={!permissions?.features?.tagFiltering}
                  className={`relative flex h-9 shrink-0 items-center gap-2 rounded-xl px-3 text-[13px] font-bold transition-all outline-none ${
                    selectedTagId !== null
                      ? "bg-pink-50 text-pink-600"
                      : "text-neutral-600 hover:bg-neutral-100"
                  } ${!permissions?.features?.tagFiltering ? "cursor-not-allowed opacity-60" : ""}`}
                  onClick={(e) => {
                    if (!permissions?.features?.tagFiltering) {
                      e.preventDefault();
                      toast.error("Pro Feature", {
                        description: "Upgrade to Pro to filter testimonials by tags.",
                      });
                    }
                  }}
                >
                  <Tag className={`size-3.5 ${selectedTagId !== null ? "text-pink-500" : ""}`} />
                  Tag
                  {!permissions?.features?.tagFiltering && (
                    <Lock className="size-2.5 text-neutral-400" />
                  )}
                </DropdownMenuTrigger>
                {permissions?.features?.tagFiltering && (
                  <DropdownMenuContent
                    align="end"
                    className="w-56 rounded-2xl border-neutral-100 bg-white p-2 text-neutral-900 shadow-2xl"
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="px-3 py-2 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                        Filter by Tag
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="mx-2 my-1 bg-neutral-50" />
                      <div className="max-h-60 overflow-y-auto">
                        <DropdownMenuRadioGroup
                          value={selectedTagId || "all"}
                          onValueChange={(val) => setSelectedTagId(val === "all" ? null : val)}
                        >
                          <DropdownMenuRadioItem
                            value="all"
                            className="rounded-xl px-3 py-2 text-[14px] transition-colors focus:bg-neutral-50"
                          >
                            All Tags
                          </DropdownMenuRadioItem>
                          {tags?.map((tag) => (
                            <DropdownMenuRadioItem
                              key={tag.id}
                              value={tag.id}
                              className="rounded-xl px-3 py-2 text-[14px] transition-colors focus:bg-neutral-50"
                            >
                              {tag.name}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </div>
                    </DropdownMenuGroup>
                    {selectedTagId !== null && (
                      <>
                        <DropdownMenuSeparator className="mx-2 my-1 bg-neutral-50" />
                        <DropdownMenuItem
                          onClick={() => setSelectedTagId(null)}
                          className="cursor-pointer justify-center rounded-xl px-3 py-2 text-center text-[13px] font-bold text-pink-600 transition-colors hover:bg-pink-50 focus:bg-pink-50"
                        >
                          Clear Filter
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                )}
              </DropdownMenu>

              <button
                onClick={handleExport}
                className="flex h-9 shrink-0 items-center gap-2 rounded-xl px-3 text-[13px] font-bold text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900"
              >
                <Download className="size-3.5 text-neutral-400" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar (Type Switchers & Status Tabs) */}
      <div className="flex flex-col gap-4 px-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="scrollbar-hide flex items-center gap-1 overflow-x-auto rounded-xl bg-neutral-100/50 p-1">
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
                className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-1.5 text-[13px] font-medium transition-all ${
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

        <div className="scrollbar-hide flex items-center gap-1 overflow-x-auto rounded-xl bg-neutral-100/50 p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = (displayedTestimonials as Testimonial[]).filter((t: Testimonial) =>
              tab.id === "all" ? true : tab.id === "featured" ? t.featured : t.status === tab.id,
            ).length;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-1.5 text-[13px] font-medium transition-all ${
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

      <div className="grid grid-cols-1 gap-4">
        {activeTab === "featured" ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="testimonials">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 gap-4"
                >
                  {sortedTestimonials.map((t, index) => (
                    <Draggable key={t.id} draggableId={t.id} index={index}>
                      {(provided) => (
                        <div
                          id={`testimonial-card-${t.id}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group relative rounded-3xl transition-all duration-200 ${
                            focusedId === t.id
                              ? "scale-[1.01] shadow-[0_0_20px_rgba(232,82,122,0.15)] ring-2 ring-pink-500/80"
                              : "hover:scale-[1.005]"
                          }`}
                          onClick={() => setFocusedId(t.id)}
                        >
                          <TestimonialCard
                            testimonial={t}
                            onUpdateStatus={handleStatusUpdate}
                            onDelete={handleDelete}
                            onViewRaw={() => setRawTestimonial(t)}
                            onPreview={() => setPreviewTestimonial(t)}
                            onFeatureToggle={handleFeatureToggle}
                            workspaceId={project.workspaceId}
                            isSelected={selectedIds.includes(t.id)}
                            onSelect={() => toggleSelect(t.id)}
                            dragHandleProps={provided.dragHandleProps}
                            permissions={permissions}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : sortedTestimonials.length > 0 ? (
          sortedTestimonials.map((t: Testimonial) => (
            <div
              id={`testimonial-card-${t.id}`}
              key={t.id}
              className={`rounded-3xl transition-all duration-200 ${
                focusedId === t.id
                  ? "scale-[1.01] shadow-[0_0_20px_rgba(232,82,122,0.15)] ring-2 ring-pink-500/80"
                  : "hover:scale-[1.005]"
              }`}
              onClick={() => setFocusedId(t.id)}
            >
              <TestimonialCard
                testimonial={t}
                onUpdateStatus={handleStatusUpdate}
                onDelete={handleDelete}
                onViewRaw={() => setRawTestimonial(t)}
                onPreview={() => setPreviewTestimonial(t)}
                onFeatureToggle={handleFeatureToggle}
                workspaceId={project.workspaceId}
                isSelected={selectedIds.includes(t.id)}
                onSelect={() => toggleSelect(t.id)}
                permissions={permissions}
              />
            </div>
          ))
        ) : (
          <div className="rounded-[32px] border border-dashed border-neutral-200 bg-white py-24 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border border-neutral-100 bg-neutral-50">
              <MessageSquareQuote className="size-8 text-neutral-300" />
            </div>
            <h3 className="text-[16px] font-bold text-neutral-900">No testimonials found</h3>
            <p className="mx-auto mt-1 max-w-xs text-[14px] leading-relaxed text-neutral-500">
              {(activeTab as string) === "featured"
                ? "Feature your best testimonials to show them off in your widgets and wall of fame."
                : searchQuery || typeFilter !== "all" || minRating !== null
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

      <BulkActionToolbar
        selectedIds={selectedIds}
        onApprove={() => handleBulkStatusUpdate("approved")}
        onReject={() => handleBulkStatusUpdate("archived")}
        onDelete={handleBulkDelete}
        onExport={handleBulkExport}
        onTag={(tagId) => handleBulkTag(tagId, "assign")}
        tags={tags ?? []}
        onClearSelection={() => setSelectedIds([])}
      />

      <RawDataModal
        open={!!rawTestimonial}
        testimonial={rawTestimonial}
        onClose={() => setRawTestimonial(null)}
      />

      <TestimonialPreviewModal
        open={!!previewTestimonial}
        testimonial={previewTestimonial}
        onClose={handleClosePreview}
        onUpdateStatus={handleStatusUpdate}
        onFeatureToggle={handleFeatureToggle}
        onDelete={handleDelete}
        permissions={permissions}
      />

      <ShortcutsHelpModal open={showShortcutsHelp} onClose={() => setShowShortcutsHelp(false)} />
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
  onPreview,
  onFeatureToggle,
  workspaceId,
  isSelected,
  onSelect,
  dragHandleProps,
  permissions,
}: {
  testimonial: Testimonial;
  onUpdateStatus: (id: string, status: "approved" | "archived" | "pending") => void;
  onDelete: (id: string) => void;
  onViewRaw: () => void;
  onPreview: () => void;
  onFeatureToggle?: (id: string, featured: boolean) => void;
  workspaceId?: string;
  isSelected?: boolean;
  onSelect?: () => void;
  dragHandleProps?: any;
  permissions?: any;
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
    <div
      onClick={(e) => {
        // If clicking anywhere on the card, toggle selection if the user didn't click a button
        if ((e.target as HTMLElement).closest("button")) return;
        onSelect?.();
      }}
      className={`group relative cursor-pointer overflow-hidden rounded-[24px] border p-6 transition-all hover:shadow-xl hover:shadow-black/5 sm:p-7 ${
        isSelected
          ? "border-pink-200 bg-pink-50/30 ring-1 ring-pink-100"
          : "border-neutral-100 bg-white"
      }`}
    >
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
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.();
                }}
                className={`flex size-5 items-center justify-center rounded-md border transition-all ${
                  isSelected
                    ? "border-pink-500 bg-pink-500 text-white"
                    : "border-neutral-200 bg-white group-hover:border-neutral-300"
                }`}
              >
                {isSelected && <Check className="size-3.5" strokeWidth={3} />}
              </div>

              {dragHandleProps && (
                <div {...dragHandleProps} className="mr-1 cursor-grab active:cursor-grabbing">
                  <GripVertical className="size-4 text-neutral-300" />
                </div>
              )}

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
              <video
                src={`${t.videoUrl}#t=0.001`}
                controls
                preload="metadata"
                className="size-full object-cover"
              />
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
              <h4 className="flex items-center gap-2 truncate text-[15px] font-bold text-neutral-900">
                {t.authorName}
                {t.verifiedVia && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-600 uppercase ring-1 ring-blue-500/10">
                    <ShieldCheck className="size-2.5" />
                    Verified
                  </span>
                )}
              </h4>
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
            {t.status === "approved" && (
              <button
                onClick={() => onFeatureToggle?.(t.id, !t.featured)}
                className={`flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-[13px] font-bold transition-all ${
                  t.featured
                    ? "border-pink-200 bg-pink-50 text-pink-600 hover:bg-pink-100"
                    : "border-neutral-100 bg-white text-neutral-400 shadow-sm hover:border-neutral-200 hover:text-neutral-900"
                }`}
              >
                <Sparkles className={`size-4 ${t.featured ? "fill-pink-500" : ""}`} />
                {t.featured ? "Featured" : "Feature"}
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

          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="flex items-center gap-2 text-[12px] font-bold tracking-widest text-neutral-400 uppercase transition-colors hover:text-neutral-600"
            >
              <Eye className="size-3.5" />
              Preview
            </button>
            <span className="text-neutral-200">|</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewRaw();
              }}
              className="flex items-center gap-2 text-[12px] font-bold tracking-widest text-neutral-400 uppercase transition-colors hover:text-neutral-600"
            >
              <ExternalLink className="size-3.5" />
              Raw Data
            </button>
            {t.status === "approved" && (
              <>
                <span className="text-neutral-200">|</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!permissions?.features?.singleTestimonialShare) {
                      toast.error("Agency & LTD Feature", {
                        description: "Upgrade your plan to share single testimonials publicly.",
                      });
                      return;
                    }
                    const url = `${window.location.origin}/t/${t.id}`;
                    navigator.clipboard.writeText(url);
                    toast.success("Share link copied!", {
                      description: url,
                    });
                  }}
                  className="flex items-center gap-2 text-[12px] font-bold tracking-widest text-pink-500 uppercase transition-colors hover:text-pink-600"
                  title="Copy public shareable link"
                >
                  <Copy className="size-3.5" />
                  Copy Share Link
                </button>
              </>
            )}
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

interface PreviewModalProps {
  open: boolean;
  testimonial: Testimonial | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: "approved" | "archived" | "pending") => void;
  onFeatureToggle?: (id: string, featured: boolean) => void;
  onDelete: (id: string) => void;
  permissions?: any;
}

function TestimonialPreviewModal({
  open,
  testimonial,
  onClose,
  onUpdateStatus,
  onFeatureToggle,
  onDelete,
  permissions,
}: PreviewModalProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

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

  const t = testimonial;

  const handleAction = (action: () => void) => {
    action();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="animate-in fade-in absolute inset-0 bg-black/60 backdrop-blur-md duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="animate-in zoom-in-95 relative w-full max-w-2xl overflow-hidden rounded-[32px] bg-neutral-900 shadow-2xl duration-300"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="relative p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 rounded-full bg-pink-500/10 px-3 py-1 text-[11px] font-bold text-pink-400 uppercase ring-1 ring-pink-500/20">
                {t.type === "video" ? <Video className="size-3" /> : <Type className="size-3" />}
                {t.type} Preview
              </span>
              <div className="flex items-center gap-1 overflow-hidden rounded-full bg-neutral-800 p-0.5 ring-1 ring-white/5">
                <button
                  onClick={() => setTheme("light")}
                  className={`rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                    theme === "light"
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Light Theme
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`rounded-full px-3 py-1 text-[11px] font-bold transition-all ${
                    theme === "dark"
                      ? "bg-neutral-950 text-white shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Dark Theme
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex size-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* High-Fidelity Testimonial Card Display Area */}
          <div className="relative rounded-[24px] bg-neutral-950 p-6 shadow-inner ring-1 ring-white/5 sm:p-8">
            <div
              className={`relative overflow-hidden rounded-[20px] border p-6 transition-all duration-300 sm:p-8 ${
                theme === "dark"
                  ? "border-neutral-800 bg-neutral-900 text-white shadow-xl"
                  : "border-neutral-100 bg-white text-neutral-900 shadow-xl"
              }`}
            >
              {/* Star Rating & Type */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < (t.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-neutral-200 dark:text-neutral-700"}`}
                    />
                  ))}
                </div>
                {t.type === "text" && (
                  <Quote
                    className={`size-6 ${theme === "dark" ? "text-neutral-800" : "text-neutral-100"}`}
                  />
                )}
              </div>

              {/* Video Player Render */}
              {t.type === "video" && t.videoUrl && (
                <div className="mb-6 aspect-video w-full overflow-hidden rounded-2xl border border-neutral-200/10 bg-black shadow-lg">
                  <video
                    src={`${t.videoUrl}#t=0.001`}
                    controls
                    preload="metadata"
                    className="size-full object-cover"
                  />
                </div>
              )}

              {/* Content text */}
              {t.content && (
                <p
                  className={`mb-6 text-[16px] leading-relaxed font-medium italic sm:text-[18px] ${
                    theme === "dark" ? "text-neutral-200" : "text-neutral-700"
                  }`}
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  "{t.content}"
                </p>
              )}

              {/* Author Footer Profile */}
              <footer className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-100/50 bg-neutral-50 shadow-sm">
                  {t.authorImage ? (
                    <Image
                      src={t.authorImage}
                      alt={t.authorName ?? "Reviewer"}
                      width={40}
                      height={40}
                      className="size-full object-cover"
                    />
                  ) : (
                    <User className="size-5 text-neutral-300" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4
                    className={`flex items-center gap-1.5 truncate text-[14px] font-bold ${
                      theme === "dark" ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    {t.authorName || "Anonymous"}
                    {t.verifiedVia && (
                      <span className="flex items-center gap-0.5 rounded-full bg-blue-50 px-1.5 py-0.5 text-[8px] font-bold text-blue-600 uppercase ring-1 ring-blue-500/10">
                        <ShieldCheck className="size-2.5" />
                        Verified
                      </span>
                    )}
                  </h4>
                  <p className="mt-0.5 truncate text-[11px] text-neutral-400">
                    {t.authorTagline || "Customer"} {t.authorCompany && `· ${t.authorCompany}`}
                  </p>
                </div>
              </footer>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="mt-6 flex flex-col items-stretch justify-between gap-4 border-t border-neutral-800 pt-6 sm:flex-row sm:items-center">
            {/* Left side Metadata */}
            <div className="text-[12px] text-neutral-500">
              <span className="font-semibold text-neutral-400">Status:</span>{" "}
              <span
                className={`font-bold capitalize ${
                  t.status === "approved"
                    ? "text-green-400"
                    : t.status === "pending"
                      ? "text-amber-400"
                      : "text-neutral-400"
                }`}
              >
                {t.status}
              </span>
              {t.featured && <span className="font-bold text-pink-400"> · Featured</span>}
              <span className="mx-1.5">·</span>
              <span suppressHydrationWarning>
                Submitted {formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}
              </span>
            </div>

            {/* Decision Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {t.status !== "approved" && (
                <button
                  onClick={() => {
                    handleAction(() => onUpdateStatus(t.id, "approved"));
                    // Instantly update local state of t so preview updates
                    t.status = "approved";
                  }}
                  className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-green-500 px-4 text-[12px] font-bold text-white shadow-sm transition-all hover:bg-green-600 active:scale-95"
                >
                  <Check className="size-3.5" />
                  Approve
                </button>
              )}
              {t.status === "approved" && (
                <button
                  onClick={() => {
                    handleAction(() => onUpdateStatus(t.id, "pending"));
                    t.status = "pending";
                    t.featured = false;
                  }}
                  className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-amber-500/20 px-4 text-[12px] font-bold text-amber-400 shadow-sm transition-all hover:bg-amber-500/30 active:scale-95"
                >
                  <Clock className="size-3.5" />
                  Unapprove
                </button>
              )}
              {t.status === "approved" && (
                <button
                  onClick={() => {
                    if (onFeatureToggle) {
                      handleAction(() => onFeatureToggle(t.id, !t.featured));
                      t.featured = !t.featured;
                    }
                  }}
                  className={`flex h-9 items-center justify-center gap-1.5 rounded-full px-4 text-[12px] font-bold shadow-sm transition-all active:scale-95 ${
                    t.featured
                      ? "bg-pink-500 text-white hover:bg-pink-600"
                      : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  }`}
                >
                  <Sparkles className={`size-3.5 ${t.featured ? "fill-white" : ""}`} />
                  {t.featured ? "Featured" : "Feature"}
                </button>
              )}
              {t.status === "approved" && (
                <button
                  onClick={() => {
                    if (!permissions?.features?.singleTestimonialShare) {
                      toast.error("Agency & LTD Feature", {
                        description: "Upgrade your plan to share single testimonials publicly.",
                      });
                      return;
                    }
                    const url = `${window.location.origin}/t/${t.id}`;
                    navigator.clipboard.writeText(url);
                    toast.success("Share link copied!", {
                      description: url,
                    });
                  }}
                  className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-pink-500/20 px-4 text-[12px] font-bold text-pink-400 shadow-sm transition-all hover:bg-pink-500/30 active:scale-95"
                >
                  <Copy className="size-3.5" />
                  Copy Share Link
                </button>
              )}
              <button
                onClick={() => {
                  handleAction(() => onUpdateStatus(t.id, "archived"));
                  t.status = "archived";
                  t.featured = false;
                  onClose();
                }}
                className={`flex size-9 items-center justify-center rounded-full bg-neutral-800 text-neutral-300 transition-all hover:bg-neutral-700 hover:text-white active:scale-95 ${
                  t.status === "archived" ? "bg-neutral-900 ring-2 ring-white/10" : ""
                }`}
                title="Archive"
              >
                <Archive className="size-4" />
              </button>
              <button
                onClick={() => {
                  handleAction(() => onDelete(t.id));
                  onClose();
                }}
                className="flex size-9 items-center justify-center rounded-full border border-transparent bg-neutral-800/50 text-neutral-400 transition-all hover:border-red-900/50 hover:bg-red-950 hover:text-red-400 active:scale-95"
                title="Delete"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ShortcutsHelpModalProps {
  open: boolean;
  onClose: () => void;
}

function ShortcutsHelpModal({ open, onClose }: ShortcutsHelpModalProps) {
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

  const shortcuts = [
    { key: "J", action: "Navigate to next testimonial card" },
    { key: "K", action: "Navigate to previous testimonial card" },
    { key: "A", action: "Approve focused card / preview open card" },
    { key: "R", action: "Archive focused card / preview open card" },
    { key: "V / Enter", action: "Open preview modal for focused card" },
    { key: "Esc", action: "Close active preview / raw JSON modals" },
    { key: "?", action: "Toggle keyboard shortcuts help cheat sheet" },
  ];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="animate-in fade-in absolute inset-0 bg-black/60 backdrop-blur-md duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="animate-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/5 bg-neutral-900 shadow-2xl duration-300">
        <div className="relative p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-[18px] font-bold text-white">
              <span className="flex size-7 items-center justify-center rounded-xl bg-pink-500/10 text-[12px] font-bold text-pink-400 ring-1 ring-pink-500/20">
                kbd
              </span>
              Keyboard Shortcuts
            </h3>
            <button
              onClick={onClose}
              className="flex size-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="space-y-4">
            {shortcuts.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-neutral-800/50 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-[13px] text-neutral-400">{s.action}</span>
                <kbd className="rounded-lg bg-neutral-800 px-2.5 py-1 text-[11px] font-bold text-white uppercase shadow-sm ring-1 ring-white/10">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-full bg-neutral-950 px-6 py-2.5 text-[13px] font-bold text-neutral-300 ring-1 ring-white/5 transition-all hover:bg-neutral-900 hover:text-white"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BulkActionToolbarProps {
  selectedIds: string[];
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  onExport: () => void;
  onTag: (tagId: string) => void;
  tags: any[];
  onClearSelection: () => void;
}

function BulkActionToolbar({
  selectedIds,
  onApprove,
  onReject,
  onDelete,
  onExport,
  onTag,
  tags,
  onClearSelection,
}: BulkActionToolbarProps) {
  if (selectedIds.length === 0) return null;

  return (
    <div className="animate-in slide-in-from-bottom-8 fixed right-0 bottom-8 left-0 z-50 flex justify-center px-4 duration-300">
      <div className="flex flex-wrap items-center gap-2 rounded-full border border-neutral-200 bg-white/80 p-2 shadow-2xl backdrop-blur-xl sm:gap-4 sm:p-3">
        <div className="flex items-center gap-3 px-3 sm:border-r sm:border-neutral-100 sm:pr-4">
          <div className="flex size-6 items-center justify-center rounded-full bg-pink-500 text-[12px] font-bold text-white">
            {selectedIds.length}
          </div>
          <span className="hidden text-[13px] font-bold text-neutral-600 sm:inline">Selected</span>
          <button
            onClick={onClearSelection}
            className="rounded-full p-1 transition-colors hover:bg-neutral-100"
          >
            <X className="size-3.5 text-neutral-400" />
          </button>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onApprove}
            className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-[13px] font-bold text-green-600 transition-all hover:bg-green-100 active:scale-95"
          >
            <Check className="size-3.5" />
            <span className="hidden sm:inline">Approve All</span>
            <span className="sm:hidden">Approve</span>
          </button>

          <button
            onClick={onReject}
            className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-[13px] font-bold text-amber-600 transition-all hover:bg-amber-100 active:scale-95"
          >
            <Archive className="size-3.5" />
            <span className="hidden sm:inline">Archive All</span>
            <span className="sm:hidden">Archive</span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full bg-neutral-50 px-4 py-2 text-[13px] font-bold text-neutral-600 transition-all outline-none hover:bg-neutral-100 active:scale-95">
              <Tag className="size-3.5" />
              Tag
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="w-48 rounded-2xl border-neutral-100 p-2 shadow-xl"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-3 py-2 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                  Tag Selected
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="mx-2 my-1" />
                {tags.map((tag) => (
                  <DropdownMenuItem
                    key={tag.id}
                    onClick={() => onTag(tag.id)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-medium transition-colors focus:bg-pink-50 focus:text-pink-600"
                  >
                    <div className="size-2 rounded-full" style={{ backgroundColor: tag.color }} />
                    {tag.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={onExport}
            className="flex items-center gap-2 rounded-full bg-neutral-50 px-4 py-2 text-[13px] font-bold text-neutral-600 transition-all hover:bg-neutral-100 active:scale-95"
          >
            <Download className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={onDelete}
            className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-[13px] font-bold text-red-600 transition-all hover:bg-red-100 active:scale-95"
          >
            <Trash2 className="size-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
