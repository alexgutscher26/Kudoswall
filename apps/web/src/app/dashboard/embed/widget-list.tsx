"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Code,
  Trash,
  MagnifyingGlass,
  SquaresFour,
  Columns,
  Rows,
  CaretRight,
  CircleNotch,
  X,
  Lock,
} from "@phosphor-icons/react";
import Link from "next/link";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { gooeyToast as toast } from "goey-toast";
import { formatDistanceToNow } from "date-fns";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useWorkspace } from "@/components/dashboard/WorkspaceContext";
import { useUpgradeModal } from "@/components/modals/UpgradeModal";
import type { WidgetSettings } from "./[id]/customizer";

export default function WidgetList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWidgetName, setNewWidgetName] = useState("");
  const { openUpgradeModal } = useUpgradeModal();

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

  const { activeWorkspaceId, data: dashboardData } = useWorkspace();
  const permissions = dashboardData?.permissions;

  const openModal = () => {
    setIsCreateModalOpen(true);
  };
  const closeModal = () => {
    setIsCreateModalOpen(false);
  };
  const { data: widgets, isLoading, refetch } = useQuery(trpc.widget.list.queryOptions());

  const handleCreateButtonClick = () => {
    if (permissions && !permissions.canAddWidget && (widgets?.length ?? 0) >= 1) {
      openUpgradeModal({
        featureName: "Unlimited Embed Widgets",
        description: `Your ${permissions.name} plan allows ${permissions.limits.maxWidgets} embed widget. Upgrade to Pro to create unlimited widgets and unlock Carousel, Masonry, and Bento layouts.`,
      });
      return;
    }
    openModal();
  };

  const createWidget = useMutation(
    trpc.widget.create.mutationOptions({
      onSuccess: (data: { id: string }) => {
        toast.success("Widget created!");
        router.push(`/dashboard/embed/${data.id}` as Route);
      },
      onError: (err) => {
        const msg = err instanceof Error ? err.message : "Failed to create widget";
        if (msg.toLowerCase().includes("limit") || msg.toLowerCase().includes("upgrade")) {
          closeModal();
          openUpgradeModal({
            featureName: "Unlimited Embed Widgets",
            description: msg,
          });
        } else {
          toast.error(msg);
        }
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
      <div className="flex min-h-[300px] items-center justify-center">
        <CircleNotch className="size-6 animate-spin text-neutral-800" weight="bold" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Search & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <MagnifyingGlass className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-neutral-400" weight="bold" />
          <input
            type="text"
            placeholder="Search widgets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white py-2 pr-4 pl-10 text-xs font-medium transition-all outline-none placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
          />
        </div>
        <button
          onClick={handleCreateButtonClick}
          className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.98]"
        >
          <Plus className="size-3.5" weight="bold" />
          <span>Create widget</span>
        </button>
      </div>

      {/* Widget Grid */}
      {filteredWidgets && filteredWidgets.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredWidgets.map((w) => {
            const settings = JSON.parse(w.settingsJson) as WidgetSettings;
            return (
              <div
                key={w.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-neutral-300 hover:shadow-md"
              >
                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                      <Code className="size-4" weight="bold" />
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
                        className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Delete widget"
                        aria-label="Delete widget"
                      >
                        <Trash className="size-3.5" weight="bold" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 [text-wrap:balance]">{w.name}</h3>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Created {formatDistanceToNow(new Date(w.createdAt))} ago
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-3">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-neutral-600 uppercase tracking-wider">
                    {settings.layout === "grid" && <SquaresFour className="size-3.5" weight="bold" />}
                    {settings.layout === "masonry" && <Columns className="size-3.5" weight="bold" />}
                    {settings.layout === "carousel" && <Rows className="size-3.5" weight="bold" />}
                    <span>{settings.layout} · {settings.theme}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold text-neutral-900">
                    <span>Configure</span>
                    <CaretRight className="size-3 text-neutral-500" weight="bold" />
                  </span>
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
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 p-8 text-center">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
            <MagnifyingGlass className="size-5" weight="bold" />
          </div>
          <h3 className="text-xs font-bold text-neutral-900">No widgets found</h3>
          <p className="mt-1 text-xs text-neutral-500">No widgets matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/30 p-8 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-800">
            <Code className="size-6" weight="bold" />
          </div>
          <h2 className="text-base font-bold text-neutral-900">Start embedding social proof</h2>
          <p className="mx-auto mt-1.5 max-w-[320px] text-xs leading-relaxed text-neutral-500 [text-wrap:pretty]">
            Create your first embed widget configuration to display live reviews on your website.
          </p>
          <button
            onClick={openModal}
            className="mt-6 flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.98]"
          >
            <Plus className="size-3.5" weight="bold" />
            <span>Create widget</span>
          </button>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="animate-in fade-in absolute inset-0 bg-black/40 backdrop-blur-sm duration-300"
            onClick={closeModal}
          />
          <div className="animate-in zoom-in-95 relative w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl duration-300 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900">New embed widget</h3>
              <button
                onClick={closeModal}
                className="flex size-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="size-4" weight="bold" />
              </button>
            </div>
            {permissions && !permissions.canAddWidget && (widgets?.length ?? 0) >= 1 ? (
              <div className="space-y-6">
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-5 text-center">
                  <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                    <Lock className="size-5" weight="bold" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900">Widget limit reached</h4>
                  <p className="mt-1 text-xs text-neutral-600 [text-wrap:pretty]">
                    Your {permissions.name} plan allows {permissions.limits.maxWidgets} embed
                    widget. Upgrade to Pro to create unlimited embed widgets and unlock all 4 layout styles.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-700 transition-all hover:bg-neutral-50 active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <Link
                    href={
                      activeWorkspaceId
                        ? (`/dashboard/settings?tab=billing&workspaceId=${activeWorkspaceId}` as any)
                        : ("/dashboard/settings?tab=billing" as any)
                    }
                    onClick={closeModal}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.98]"
                  >
                    <span>Upgrade to Pro</span>
                    <CaretRight className="size-3.5" weight="bold" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700">
                    Widget name
                  </label>
                  <input
                    autoFocus
                    type="text"
                    required
                    placeholder="e.g. Homepage Wall of Love"
                    value={newWidgetName}
                    onChange={(e) => setNewWidgetName(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium transition-all outline-none placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-700 transition-all hover:bg-neutral-50 active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createWidget.isPending}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-50"
                  >
                    {createWidget.isPending ? (
                      <CircleNotch className="size-4 animate-spin" weight="bold" />
                    ) : (
                      <>
                        <span>Create widget</span>
                        <CaretRight className="size-3.5" weight="bold" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
