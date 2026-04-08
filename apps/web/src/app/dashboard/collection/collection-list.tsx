"use client";

import { useState } from "react";
import {
  Plus,
  Globe,
  Search,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Video,
  Clock,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { gooeyToast as toast } from "goey-toast";

import { useRouter } from "next/navigation";
import type { Route } from "next";

interface CollectionListProps {
  projects: any[];
}

export default function CollectionList({ projects }: CollectionListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const deleteProject = useMutation(
    trpc.dashboard.deleteProject.mutationOptions({
      onSuccess: () => {
        toast.success("Collection deleted");
        router.refresh();
      },
    }),
  );

  const onCreateClick = () => {
    router.push("/dashboard/collection?new=project" as Route);
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-neutral-100 bg-white py-2.5 pr-4 pl-11 text-[13px] transition-all outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/5"
          />
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-[13px] font-bold text-white transition-all hover:bg-neutral-800 active:scale-[0.98]"
        >
          <Plus className="size-4" />
          New Collection Link
        </button>
      </div>

      {/* Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="group relative flex flex-col overflow-hidden rounded-[32px] border border-neutral-100 bg-white p-6 shadow-sm transition-all hover:border-pink-200 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-400 transition-colors group-hover:bg-pink-50 group-hover:text-pink-500">
                  <Globe className="size-5" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (
                        confirm(
                          "Are you sure you want to delete this collection? This will also delete all testimonials within it.",
                        )
                      ) {
                        deleteProject.mutate({ id: p.id });
                      }
                    }}
                    className="p-2 text-neutral-300 transition-all hover:bg-red-50 hover:text-red-500"
                    title="Delete Collection"
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <a
                    href={`/collect/${p.collectionSlug || p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex size-8 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-neutral-50 hover:text-neutral-600"
                    title="Live Preview"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>

              <div className="mb-6 flex-1">
                <h3 className="text-[15px] font-bold text-neutral-900 transition-colors group-hover:text-pink-500">
                  {p.name}
                </h3>
                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-neutral-400">
                  <Clock className="size-3" />
                  Created {formatDistanceToNow(new Date(p.createdAt))} ago
                </div>
              </div>

              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2">
                  <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                    URL:
                  </span>
                  <span className="truncate font-mono text-[11px] text-neutral-500 italic">
                    kudoswall.org/{p.collectionSlug || p.slug}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t border-neutral-50 pt-5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                  <MessageSquare className="size-3" />
                  Text
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-neutral-400 uppercase">
                  <Video className="size-3" />
                  Video
                </div>
                <div className="ml-auto translate-x-2 text-[11px] font-bold text-pink-500 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                  Customize <ChevronRight className="inline size-3" />
                </div>
              </div>

              <Link
                href={`/dashboard/collection/${p.id}` as Route}
                className="absolute inset-0 z-10"
              />
            </div>
          ))}
        </div>
      ) : searchQuery ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[32px] border border-dashed border-neutral-200 bg-neutral-50/50 p-12 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
            <Search className="size-6" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900">No collections found</h3>
          <p className="mt-1 text-[13px] text-neutral-500">
            No collection pages matching "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[48px] border border-dashed border-neutral-200 bg-neutral-50/30 p-12 text-center">
          <div className="mb-6 flex size-20 items-center justify-center rounded-[32px] bg-pink-50 text-pink-500 shadow-inner">
            <Globe className="size-10" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Start Collecting Social Proof</h2>
          <p className="mx-auto mt-2 max-w-[320px] text-[13px] leading-relaxed text-neutral-500">
            Create your first collection link to start getting video and text testimonials from your
            customers.
          </p>
          <button
            onClick={onCreateClick}
            className="mt-8 flex items-center gap-2 rounded-full bg-neutral-900 px-8 py-3 text-[14px] font-bold text-white transition-all hover:bg-neutral-800 active:scale-[0.95]"
          >
            <Plus className="size-4" />
            Create Your First Link
          </button>
        </div>
      )}
    </div>
  );
}
