"use client";

import {
  useState,
  useEffect,
} from "react";
import { CaretDown, Buildings, Check, CircleNotch, Plus, X, CaretRight } from "@phosphor-icons/react";
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
import { useWorkspace } from "@/components/dashboard/WorkspaceContext";

interface WorkspaceSwitcherProps {
  currentWorkspaceId: string;
  onWorkspaceChange: (workspaceId: string) => void;
  collapsed?: boolean;
}

export function WorkspaceSwitcher({
  currentWorkspaceId,
  onWorkspaceChange,
  collapsed = false,
}: WorkspaceSwitcherProps) {
  const { isModalOpen, setIsModalOpen } = useWorkspace();
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

  const canCreateMoreWorkspaces =
    !workspaces ||
    workspaces.length === 0 ||
    workspaces.some((ws: any) => {
      const plan = ws.organization?.plan || ws.plan;
      return plan === "plan_2" || plan === "ltd";
    });

  const activeWorkspace = (workspaces as any)?.find((ws: any) => ws.id === currentWorkspaceId);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          title={collapsed ? "Switch workspace" : undefined}
          className={`group flex w-full items-center rounded-xl border border-neutral-200 bg-white text-left transition-all outline-none hover:bg-neutral-50 active:scale-[0.98] ${
            collapsed ? "justify-center p-1" : "gap-3 p-2"
          }`}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800">
            {isLoading ? (
              <CircleNotch className="size-4 animate-spin" weight="bold" />
            ) : (
              <Buildings className="size-4" weight="bold" />
            )}
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-neutral-900">
                  {activeWorkspace?.name || "Loading..."}
                </p>
                <p className="truncate text-[10px] font-medium text-neutral-500">
                  Workspace
                </p>
              </div>
              <CaretDown className="mr-1 size-3.5 text-neutral-400 transition-transform duration-200 group-data-[state=open]:rotate-180" weight="bold" />
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 rounded-xl border border-neutral-200 bg-white p-1 shadow-lg" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
              Workspaces
            </DropdownMenuLabel>
            <div className="space-y-0.5">
              {workspaces?.map((ws: any) => (
                <DropdownMenuItem
                  key={ws.id}
                  onClick={() => onWorkspaceChange(ws.id as string)}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors ${
                    ws.id === currentWorkspaceId
                      ? "bg-neutral-900 font-semibold text-white"
                      : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                  }`}
                >
                  <div
                    className={`flex size-5 shrink-0 items-center justify-center rounded ${
                      ws.id === currentWorkspaceId ? "bg-white/10 text-white" : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    <Buildings className="size-3" weight="bold" />
                  </div>
                  <span className="flex-1 truncate">{ws.name}</span>
                  {ws.id === currentWorkspaceId && <Check className="size-3" weight="bold" />}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuGroup>

          {canCreateMoreWorkspaces && (
            <>
              <DropdownMenuSeparator className="my-1 border-neutral-100" />
              <DropdownMenuItem
                onClick={() => setIsModalOpen(true)}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
              >
                <div className="flex size-5 shrink-0 items-center justify-center rounded bg-neutral-100">
                  <Plus className="size-3 text-neutral-700" weight="bold" />
                </div>
                <span>Create workspace</span>
              </DropdownMenuItem>
            </>
          )}
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
            className="animate-in zoom-in-95 relative w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl duration-300"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900">
                New workspace
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X className="size-4" weight="bold" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newWorkspaceName.trim()) {
                  createWorkspace.mutate({ name: newWorkspaceName });
                }
              }}
              className="space-y-5"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700">
                  Workspace name
                </label>
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium transition-all outline-none placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-700 transition-all hover:bg-neutral-50 active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createWorkspace.isPending || !newWorkspaceName.trim()}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-50"
                >
                  {createWorkspace.isPending ? (
                    <CircleNotch className="size-4 animate-spin" weight="bold" />
                  ) : (
                    <>
                      <span>Create</span>
                      <CaretRight className="size-3.5" weight="bold" />
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
