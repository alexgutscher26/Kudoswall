"use client";

import { useState } from "react";
import {
  Plus,
  Globe,
  MagnifyingGlass,
  CaretRight,
  ArrowSquareOut,
  Quotes,
  Clock,
  Trash,
  Copy,
} from "@phosphor-icons/react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { gooeyToast as toast } from "goey-toast";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import type { RouterOutputs } from "@/utils/trpc";
import { useWorkspace } from "@/components/dashboard/WorkspaceContext";

interface CollectionListProps {
  projects: RouterOutputs["dashboard"]["getData"]["projects"];
}

export default function CollectionList({ projects }: CollectionListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { activeWorkspaceId } = useWorkspace();

  const deleteProject = useMutation(
    trpc.dashboard.deleteProject.mutationOptions({
      onSuccess: () => {
        toast.success("Collection deleted");
        router.refresh();
      },
    }),
  );

  const duplicateProject = useMutation(
    trpc.dashboard.duplicateProject.mutationOptions({
      onSuccess: () => {
        toast.success("Collection duplicated");
        router.refresh();
      },
    }),
  );

  const onCreateClick = () => {
    router.push(
      `/dashboard/collection?new=project${activeWorkspaceId ? `&workspaceId=${activeWorkspaceId}` : ""}` as Route,
    );
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <MagnifyingGlass className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-neutral-400" weight="bold" />
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-white py-2 pr-4 pl-10 text-xs font-medium transition-all outline-none placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
          />
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.98]"
        >
          <Plus className="size-3.5" weight="bold" />
          <span>New collection link</span>
        </button>
      </div>

      {/* Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-neutral-300 hover:shadow-md"
            >
              <div>
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
                    <Globe className="size-4" weight="bold" />
                  </div>
                  <div className="relative z-20 flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        duplicateProject.mutate({ id: p.id });
                      }}
                      disabled={duplicateProject.isPending}
                      className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-800 disabled:opacity-50"
                      title="Duplicate Collection"
                      aria-label="Duplicate Collection"
                    >
                      <Copy className="size-3.5" weight="bold" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toast(`Delete "${p.name}"?`, {
                          description: "This will also delete all testimonials within it.",
                          action: {
                            label: "Delete",
                            onClick: () => deleteProject.mutate({ id: p.id }),
                          },
                        });
                      }}
                      className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Delete Collection"
                      aria-label="Delete Collection"
                    >
                      <Trash className="size-3.5" weight="bold" />
                    </button>
                    <a
                      href={`/collect/${p.collectionSlug || p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex size-7 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
                      title="Collection Page Preview"
                      aria-label="Collection Page Preview"
                    >
                      <ArrowSquareOut className="size-3.5" weight="bold" />
                    </a>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-neutral-900 transition-colors group-hover:text-neutral-700 [text-wrap:balance]">
                  {p.name}
                </h3>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-neutral-500">
                  <Clock className="size-3 text-neutral-400" />
                  <span>Created {formatDistanceToNow(new Date(p.createdAt))} ago</span>
                </div>

                <div className="mt-4 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2">
                  <span className="font-mono text-[11px] text-neutral-600">
                    kudoswall.org/{p.collectionSlug || p.slug}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-3">
                <span className="flex items-center gap-1 text-[11px] font-semibold text-neutral-600">
                  <Quotes className="size-3 text-neutral-400" weight="bold" />
                  <span>Collection link</span>
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-neutral-900">
                  <span>Customize</span>
                  <CaretRight className="size-3 text-neutral-500" weight="bold" />
                </span>
              </div>

              <Link
                href={
                  `/dashboard/collection/${p.id}${activeWorkspaceId ? `?workspaceId=${activeWorkspaceId}` : ""}` as Route
                }
                className="absolute inset-0 z-10"
              />
            </div>
          ))}
        </div>
      ) : searchQuery ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 p-8 text-center">
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500">
            <MagnifyingGlass className="size-5" weight="bold" />
          </div>
          <h3 className="text-xs font-bold text-neutral-900">No collections found</h3>
          <p className="mt-1 text-xs text-neutral-500">
            No collection pages matching "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/30 p-8 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-800">
            <Globe className="size-6" weight="bold" />
          </div>
          <h2 className="text-base font-bold text-neutral-900">Start collecting social proof</h2>
          <p className="mx-auto mt-1.5 max-w-[320px] text-xs leading-relaxed text-neutral-500 [text-wrap:pretty]">
            Create your first collection link to start gathering video and text testimonials from your customers.
          </p>
          <button
            onClick={onCreateClick}
            className="mt-6 flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.98]"
          >
            <Plus className="size-3.5" weight="bold" />
            <span>Create collection link</span>
          </button>
        </div>
      )}
    </div>
  );
}
