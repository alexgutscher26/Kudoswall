"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Code2,
  Trash2,
  Search,
  Layers,
  LayoutGrid,
  Columns,
  GalleryHorizontal,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { gooeyToast as toast } from "goey-toast";
import { formatDistanceToNow } from "date-fns";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useWorkspace } from "@/components/dashboard/WorkspaceContext";
import type { WidgetSettings } from "./[id]/customizer";

export default function WidgetList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWidgetName, setNewWidgetName] = useState("");

  useEffect(() => {
    if (isCreateModalOpen) {
      document.body.setAttribute("data-modal-open", "true");
    } else {
      document.body.removeAttribute("data-modal-open");
    }
    return () => {
      document.body.removeAttribute("data-modal-open");
    };
  }, [isCreateModalOpen]);

  const { activeWorkspaceId } = useWorkspace();

  const openModal = () => {
    setIsCreateModalOpen(true);
  };
  const closeModal = () => {
    setIsCreateModalOpen(false);
  };
  const { data: widgets, isLoading, refetch } = useQuery(trpc.widget.list.queryOptions());

  const createWidget = useMutation(
    trpc.widget.create.mutationOptions({
      onSuccess: (data: { id: string }) => {
        toast.success("Widget created!");
        router.push(`/dashboard/embed/${data.id}` as Route);
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Failed to create widget");
      },
    }),
  );

  const deleteWidget = useMutation(
    trpc.widget.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Widget deleted");
        refetch();
      },
    }),
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWidgetName.trim()) return;
    createWidget.mutate({ name: newWidgetName });
  };

  const filteredWidgets = widgets?.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search widgets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-neutral-100 bg-white py-2.5 pr-4 pl-11 text-[13px] transition-all outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/5"
          />
        </div>
        <button
          onClick={openModal}
          className="flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-[13px] font-bold text-white transition-all hover:bg-neutral-800 active:scale-[0.98]"
        >
          <Plus className="size-4" />
          Create New Widget
        </button>
      </div>

      {/* Widget Grid */}
      {filteredWidgets && filteredWidgets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWidgets.map((w) => {
            const settings = JSON.parse(w.settingsJson) as WidgetSettings;
            return (
              <div
                key={w.id}
                className="group relative flex flex-col overflow-hidden rounded-[32px] border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:border-pink-200 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-400 transition-colors group-hover:bg-pink-50 group-hover:text-pink-500">
                    <Code2 className="size-5" />
                  </div>
                  <div className="relative z-20 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toast("Delete widget?", {
                          description: "This action cannot be undone.",
                          action: {
                            label: "Delete",
                            onClick: () => deleteWidget.mutate({ id: w.id }),
                          },
                        });
                      }}
                      className="p-2 text-neutral-400 transition-colors hover:text-red-500"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-6 flex-1">
                  <h3 className="text-[15px] font-bold text-neutral-900">{w.name}</h3>
                  <p className="mt-1.5 text-[12px] text-neutral-500">
                    Created {formatDistanceToNow(new Date(w.createdAt))} ago
                  </p>
                </div>

                <div className="flex items-center gap-4 border-t border-neutral-50 pt-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                    {settings.layout === "grid" && <LayoutGrid className="size-3" />}
                    {settings.layout === "masonry" && <Columns className="size-3" />}
                    {settings.layout === "carousel" && <GalleryHorizontal className="size-3" />}
                    {settings.layout}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                    <Layers className="size-3" />
                    {settings.theme}
                  </div>
                </div>

                <Link
                  href={`/dashboard/embed/${w.id}` as Route}
                  className="absolute inset-0 z-10"
                />
              </div>
            );
          })}
        </div>
      ) : searchQuery ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[32px] border border-dashed border-neutral-200 bg-neutral-50/50 p-12 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
            <Search className="size-6" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900">No widgets found</h3>
          <p className="mt-1 text-[13px] text-neutral-500">No widgets matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[48px] border border-dashed border-neutral-200 bg-neutral-50/30 p-12 text-center">
          <div className="mb-6 flex size-20 items-center justify-center rounded-[32px] bg-pink-50 text-pink-500 shadow-inner">
            <Code2 className="size-10" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Start Embedding Social Proof</h2>
          <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-relaxed text-neutral-500">
            Create your first embed config to start showing testimonials on your own website.
          </p>
          <button
            onClick={openModal}
            className="mt-8 flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3 text-[14px] font-bold text-white transition-all hover:bg-neutral-800 active:scale-[0.95]"
          >
            <Plus className="size-4" />
            Create Your First Widget
          </button>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="animate-in fade-in absolute inset-0 bg-neutral-900/40 backdrop-blur-sm duration-300"
            onClick={closeModal}
          />
          <div className="animate-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-[32px] bg-white p-8 shadow-2xl duration-300">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-neutral-900">New Embed Config</h3>
              <button
                onClick={closeModal}
                className="rounded-full p-2 text-neutral-400 transition-all hover:bg-neutral-100 hover:text-neutral-600 active:scale-[0.85]"
              >
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="px-1 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                  Widget Name
                </label>
                <input
                  autoFocus
                  type="text"
                  required
                  placeholder="e.g. Homepage Hero Section"
                  value={newWidgetName}
                  onChange={(e) => setNewWidgetName(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-5 py-4 text-sm font-medium transition-all outline-none focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/5"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-full py-3 text-[14px] font-bold text-neutral-500 transition-all hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createWidget.isPending}
                  className="flex flex-2 items-center justify-center gap-2 rounded-full bg-neutral-900 py-3 text-[14px] font-bold text-white transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-50"
                >
                  {createWidget.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      Create Widget
                      <ChevronRight className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
