"use client";

import {
  useState,
  useEffect,
  type JSXElementConstructor,
  type Key,
  type ReactElement,
  type ReactNode,
  type ReactPortal,
} from "react";
import { ChevronDown, Plus, Building2, Check, Loader2, X, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@my-better-t-app/ui/components/dropdown-menu";
import { useQuery, useMutation } from "@tanstack/react-query";
import { trpc, queryClient } from "@/utils/trpc";
import { gooeyToast as toast } from "goey-toast";

interface WorkspaceSwitcherProps {
  currentWorkspaceId: string;
  onWorkspaceChange: (workspaceId: string) => void;
}

export function WorkspaceSwitcher({
  currentWorkspaceId,
  onWorkspaceChange,
}: WorkspaceSwitcherProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  useEffect(() => {
    if (isModalOpen) {
      document.body.setAttribute("data-modal-open", "true");
    } else {
      document.body.removeAttribute("data-modal-open");
    }
    return () => {
      document.body.removeAttribute("data-modal-open");
    };
  }, [isModalOpen]);

  const { data: workspaces, isLoading } = useQuery(trpc.dashboard.listWorkspaces.queryOptions());
  const createWorkspace = useMutation({
    ...trpc.dashboard.createWorkspace.mutationOptions(),
    onSuccess: (newWs) => {
      queryClient.invalidateQueries(trpc.dashboard.listWorkspaces.queryOptions());
      toast.success("Workspace created!");
      setIsModalOpen(false);
      setNewWorkspaceName("");
      onWorkspaceChange(newWs.id);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create workspace");
    },
  });

  const activeWorkspace = (workspaces as any)?.find((ws: any) => ws.id === currentWorkspaceId);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="group flex w-full items-center gap-3 rounded-xl border border-neutral-100 bg-white p-2 text-left transition-all outline-none hover:bg-neutral-50 active:scale-[0.98]">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-500">
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Building2 className="size-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-neutral-900">
              {activeWorkspace?.name || "Loading..."}
            </p>
            <p className="truncate text-[11px] font-medium text-neutral-400">Personal Workspace</p>
          </div>
          <ChevronDown className="mr-1 size-4 text-neutral-300 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 rounded-xl p-1" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
              Workspaces
            </DropdownMenuLabel>
            <div className="space-y-0.5">
              {workspaces?.map((ws: any) => (
                <DropdownMenuItem
                  key={ws.id}
                  onClick={() => onWorkspaceChange(ws.id as string)}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 transition-colors ${
                    ws.id === currentWorkspaceId
                      ? "bg-pink-50 font-semibold text-pink-600"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  <div
                    className={`flex size-6 shrink-0 items-center justify-center rounded-md ${
                      ws.id === currentWorkspaceId ? "bg-white shadow-sm" : "bg-neutral-100"
                    }`}
                  >
                    <Building2 className="size-3" />
                  </div>
                  <span className="flex-1 truncate">{ws.name}</span>
                  {ws.id === currentWorkspaceId && <Check className="size-3" />}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-neutral-600 hover:bg-neutral-50"
          >
            <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-neutral-100">
              <Plus className="size-3" />
            </div>
            <span>Create Workspace</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Workspace Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="animate-in fade-in absolute inset-0 bg-black/40 backdrop-blur-sm duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          <div
            className="animate-in zoom-in-95 relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl duration-300"
            style={{ border: "1px solid rgba(0,0,0,0.08)" }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3
                className="text-lg font-bold tracking-tight text-neutral-900"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                New Workspace
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-neutral-50"
              >
                <X className="size-4 text-neutral-400" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newWorkspaceName.trim()) {
                  createWorkspace.mutate({ name: newWorkspaceName });
                }
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="px-1 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                  Workspace Name
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm font-medium transition-all outline-none placeholder:text-neutral-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-full px-4 py-2.5 text-sm font-bold text-neutral-500 transition-all hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createWorkspace.isPending || !newWorkspaceName.trim()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                >
                  {createWorkspace.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      Create
                      <ChevronRight className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
