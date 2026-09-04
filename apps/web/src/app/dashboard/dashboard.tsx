"use client";

import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  House,
  Quotes,
  ChartBar,
  Code,
  Gear,
  SignOut,
  Plus,
  Globe,
  CaretRight,
  CaretLeft,
  List,
  X,
  Lock,
  Gift,
} from "@phosphor-icons/react";
import { authClient } from "@/lib/auth-client";
import { WorkspaceSwitcher } from "@/components/dashboard/WorkspaceSwitcher";
import { gooeyToast as toast } from "goey-toast";
import { trpc, queryClient, type RouterOutputs } from "@/utils/trpc";
import { useQuery, useMutation } from "@tanstack/react-query";
import ErrorBoundary from "@/components/error-boundary";
import { WorkspaceProvider } from "@/components/dashboard/WorkspaceContext";
import { TrialBanner } from "@/components/dashboard/TrialBanner";
import { UpgradeModalProvider, useUpgradeModal } from "@/components/modals/UpgradeModal";
import { createProject } from "./actions";

type DashboardData = RouterOutputs["dashboard"]["getData"];
type Project = DashboardData["projects"][number];
type RecentTestimonial = DashboardData["recentTestimonials"][number];

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/dashboard", icon: House, label: "Overview" },
  { href: "/dashboard/testimonials", icon: Quotes, label: "Testimonials" },
  { href: "/dashboard/collection", icon: Globe, label: "Collection Page" },
  { href: "/dashboard/analytics", icon: ChartBar, label: "Analytics", feature: "analytics" },
  { href: "/dashboard/embed", icon: Code, label: "Embed Widget" },
  { href: "/dashboard/rewards", icon: Gift, label: "Rewards" },
  { href: "/dashboard/settings", icon: Gear, label: "Settings" },
] as const;

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

// ─── Nav content (shared between sidebar + mobile drawer) ─────────────────────

function NavContent({
  pathname,
  onNavClick,
  userName,
  userEmail,
  onSignOut,
  onNewCollection,
  currentWorkspaceId,
  onWorkspaceChange,
  plan,
  collapsed = false,
}: {
  pathname: string;
  onNavClick?: () => void;
  userName: string;
  userEmail: string;
  onSignOut: () => void;
  onNewCollection: () => void;
  currentWorkspaceId: string;
  onWorkspaceChange: (id: string) => void;
  plan?: string;
  collapsed?: boolean;
}) {
  const { openUpgradeModal } = useUpgradeModal();

  const isFeatureLocked = (feature?: string) => {
    if (!feature) return false;
    if (feature === "analytics" && (!plan || plan === "free")) return true;
    return false;
  };

  return (
    <>
      {/* Workspace Switcher */}
      <div
        className={`pt-5 pb-4 border-b border-neutral-100 ${collapsed ? "px-1" : "px-3"}`}
      >
        <WorkspaceSwitcher
          currentWorkspaceId={currentWorkspaceId}
          onWorkspaceChange={onWorkspaceChange}
          collapsed={collapsed}
        />
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const { href, icon: Icon, label } = item;
          const isActive = pathname === href;
          const isLocked = isFeatureLocked((item as any).feature);

          const linkHref = currentWorkspaceId
            ? (`${href}?workspaceId=${currentWorkspaceId}` as Route)
            : (href as Route);

          if (isLocked) {
            return (
              <button
                key={href}
                type="button"
                onClick={() => {
                  if (onNavClick) onNavClick();
                  openUpgradeModal({
                    featureName: label,
                    description: `Upgrade to KudosWall Pro to unlock ${label}, unlimited testimonials, video downloads, and custom domains.`,
                  });
                }}
                className={`flex w-full cursor-pointer items-center rounded-xl py-2 text-xs font-semibold text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-800 ${
                  collapsed ? "justify-center px-0" : "gap-3 px-3"
                }`}
                title={`${label} is a Pro feature — Click to unlock`}
              >
                <Icon className="size-4 shrink-0" weight="bold" />
                {!collapsed && <span>{label}</span>}
                {!collapsed && <Lock className="ml-auto size-3.5 text-neutral-400" weight="bold" />}
              </button>
            );
          }

          return (
            <Link
              key={href}
              href={linkHref}
              onClick={onNavClick}
              title={collapsed ? label : undefined}
              className={`flex items-center rounded-xl py-2 text-xs font-semibold transition-all duration-200 ${
                collapsed ? "justify-center px-0" : "gap-3 px-3"
              } ${
                isActive
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              }`}
            >
              <Icon
                className={`size-4 shrink-0 ${isActive ? "text-white" : "text-neutral-500"}`}
                weight={isActive ? "bold" : "regular"}
              />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* CTA */}
      <div className="shrink-0 px-3 pb-3">
        <button
          type="button"
          onClick={() => {
            if (onNavClick) onNavClick();
            onNewCollection();
          }}
          title={collapsed ? "New Collection Link" : undefined}
          className={`group flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:bg-neutral-800 active:scale-[0.98] ${
            collapsed ? "px-0" : "px-4"
          }`}
        >
          <Plus className="size-3.5 transition-transform duration-300 group-hover:rotate-90" weight="bold" />
          {!collapsed && "New collection link"}
        </button>
      </div>

      {/* User */}
      <div
        className={`flex shrink-0 items-center border-t border-neutral-100 py-4 ${collapsed ? "justify-center px-2" : "gap-3 px-4"}`}
      >
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white"
          title={collapsed ? userName : undefined}
        >
          {userName.charAt(0).toUpperCase()}
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-neutral-900">
                {userName}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-neutral-500">
                {userEmail}
              </p>
            </div>
            <button
              type="button"
              onClick={onSignOut}
              className="p-1 text-neutral-400 transition-colors hover:text-neutral-900"
              title="Sign out"
              aria-label="Sign out"
            >
              <SignOut className="size-4" weight="bold" />
            </button>
          </>
        )}
      </div>
    </>
  );
}

// ─── Desktop sidebar ─────────────────────────────────────────────────────────

function DesktopSidebar({
  userName,
  userEmail,
  onSignOut,
  onNewCollection,
  currentWorkspaceId,
  onWorkspaceChange,
  plan,
  collapsed,
}: {
  userName: string;
  userEmail: string;
  onSignOut: () => void;
  onNewCollection: () => void;
  currentWorkspaceId: string;
  onWorkspaceChange: (id: string) => void;
  plan?: string;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  return (
    <aside
      className={`dashboard-sidebar fixed top-0 left-0 z-40 hidden h-screen flex-col border-r border-neutral-200 bg-white transition-[width] duration-300 lg:flex ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <NavContent
        pathname={pathname}
        userName={userName}
        userEmail={userEmail}
        onSignOut={onSignOut}
        onNewCollection={onNewCollection}
        currentWorkspaceId={currentWorkspaceId}
        onWorkspaceChange={onWorkspaceChange}
        plan={plan}
        collapsed={collapsed}
      />
    </aside>
  );
}

// ─── Mobile drawer ────────────────────────────────────────────────────────────

function MobileDrawer({
  open,
  onClose,
  userName,
  userEmail,
  onSignOut,
  onNewCollection,
  currentWorkspaceId,
  onWorkspaceChange,
  plan,
}: {
  open: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  onSignOut: () => void;
  onNewCollection: () => void;
  currentWorkspaceId: string;
  onWorkspaceChange: (id: string) => void;
  plan?: string;
}) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div
        className="animate-in slide-in-from-left fixed top-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-neutral-200 bg-white duration-200 lg:hidden"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full transition-colors hover:bg-neutral-100"
        >
          <X className="size-4 text-neutral-500" weight="bold" />
        </button>
        <NavContent
          pathname={pathname}
          onNavClick={onClose}
          userName={userName}
          userEmail={userEmail}
          onSignOut={onSignOut}
          onNewCollection={onNewCollection}
          currentWorkspaceId={currentWorkspaceId}
          onWorkspaceChange={onWorkspaceChange}
          plan={plan}
        />
      </div>
    </>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────────────────

function TopBar({
  userName,
  onMenuOpen,
  pageTitle = "Overview",
  pageSubtitle,
  isLive,
  collapsed,
  onToggleCollapsed,
}: {
  userName: string;
  onMenuOpen: () => void;
  pageTitle?: string;
  pageSubtitle?: string;
  isLive?: boolean;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-neutral-200 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8"
    >
      <div className="flex items-center gap-3">
        {/* Collapse toggle — desktop only */}
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden size-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition-colors hover:bg-neutral-100 lg:flex"
        >
          {collapsed ? (
            <CaretRight className="size-3.5" weight="bold" />
          ) : (
            <CaretLeft className="size-3.5" weight="bold" />
          )}
        </button>

        {/* Hamburger — mobile only */}
        <button
          type="button"
          onClick={onMenuOpen}
          aria-label="Open navigation"
          className="flex size-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition-colors hover:bg-neutral-100 lg:hidden"
        >
          <List className="size-4" weight="bold" />
        </button>

        <div className="flex items-center gap-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-neutral-900">
              {pageTitle}
              {isLive && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
              )}
            </p>
            <p className="hidden text-[11px] text-neutral-500 sm:block">
              {pageSubtitle ?? `Welcome back, ${userName}`}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Modal ──────────────────────────────────────────────────────────────────

function NewCollectionModal({
  open,
  onClose,
  workspaceId,
  workspaceSlug,
  permissions,
}: {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceSlug: string;
  permissions?: DashboardData["permissions"];
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

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

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await createProject(formData, workspaceId);
      if (result?.success) {
        toast.success("Collection link created!");
        onClose();
        router.refresh();
      } else if (result?.needsUpgrade) {
        toast.error("Project Limit Reached", {
          description: result.error,
        });
        onClose();
        router.push(
          workspaceId
            ? (`/dashboard/settings?tab=billing&workspaceId=${workspaceId}` as any)
            : ("/dashboard/settings?tab=billing" as any),
        );
      } else {
        toast.error(result?.error || "Failed to create collection link");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to create collection link");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="animate-in fade-in absolute inset-0 bg-black/40 backdrop-blur-sm duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        className="animate-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl duration-300 sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-neutral-900">
            New collection link
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="size-4" weight="bold" />
          </button>
        </div>

        <p className="mb-6 text-xs text-neutral-500 [text-wrap:pretty]">
          Create a dedicated page where your customers can record video or write testimonials.
        </p>

        {permissions && !permissions.canAddProject ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-5 text-center">
              <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <Lock className="size-5" weight="bold" />
              </div>
              <h4 className="text-sm font-bold text-neutral-900">Project limit reached</h4>
              <p className="mt-1 text-xs text-neutral-600 [text-wrap:pretty]">
                Your current {permissions.name} plan includes {permissions.limits.maxProjects}{" "}
                project link. Upgrade to the Agency plan to manage up to 5 project workspaces.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-700 transition-all hover:bg-neutral-50 active:scale-[0.98]"
              >
                Cancel
              </button>
              <Link
                href={`/dashboard/settings?tab=billing&workspaceId=${workspaceId}` as any}
                onClick={onClose}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.98]"
              >
                <span>Upgrade to Agency</span>
                <CaretRight className="size-3.5" weight="bold" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">
                Project / Campaign name
              </label>
              <input
                autoFocus
                name="name"
                type="text"
                required
                placeholder="e.g. Product Launch Reviews"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium transition-all outline-none placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="space-y-1.5 rounded-xl border border-neutral-200 bg-neutral-50 p-3.5">
              <p className="text-[11px] font-semibold text-neutral-600">
                Preview URL
              </p>
              <code className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-600">
                <Globe className="size-3 text-neutral-400" />
                <span>kudoswall.org/{workspaceSlug}/</span>
                <span className="font-bold text-neutral-900">
                  {name ? name.toLowerCase().replace(/\s+/g, "-") : "link-slug"}
                </span>
              </code>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-semibold text-neutral-700 transition-all hover:bg-neutral-50 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <span>Create link</span>
                    <CaretRight className="size-3.5" weight="bold" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard shell ──────────────────────────────────────────────────────────

export default function DashboardShell({
  userName,
  userEmail,
  children,
  pageTitle,
  pageSubtitle,
  initialData,
  initialWorkspaceId,
}: {
  userName: string;
  userEmail: string;
  children?: ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
  initialData?: DashboardData | null;
  initialWorkspaceId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newCollectionOpen, setNewCollectionOpen] = useState(false);
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);

  const SIDEBAR_COLLAPSED_KEY = "kudoswall:sidebar-collapsed";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, sidebarCollapsed ? "true" : "false");
    } catch {}
  }, [sidebarCollapsed]);

  // Auto-open modal if `new=project` is in URL
  useEffect(() => {
    if (searchParams.get("new") === "project") {
      setNewCollectionOpen(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("new");
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl as Route, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  const urlWorkspaceId = searchParams.get("workspaceId");
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(
    initialWorkspaceId || urlWorkspaceId || initialData?.workspace.id || "",
  );

  useEffect(() => {
    if (urlWorkspaceId && urlWorkspaceId !== activeWorkspaceId) {
      setActiveWorkspaceId(urlWorkspaceId);
      setCookie("workspace-id", urlWorkspaceId);
    } else if (activeWorkspaceId) {
      setCookie("workspace-id", activeWorkspaceId);
    }
  }, [urlWorkspaceId, activeWorkspaceId]);

  const [isMounted, setIsMounted] = useState(false);
  const claimReferral = useMutation(trpc.referral.claim.mutationOptions());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const refCode = getCookie("kudoswall-ref");
      if (refCode) {
        claimReferral.mutate(
          { code: refCode },
          {
            onSuccess: () => {
              document.cookie = "kudoswall-ref=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              toast.success("Referral linked! Embed a wall to unlock your 30-day reward.");
            },
          },
        );
      }
    }
  }, [isMounted]);

  useEffect(() => {
    if (initialData?.workspace.id && initialData.workspace.id !== activeWorkspaceId) {
      if (!urlWorkspaceId || urlWorkspaceId === initialData.workspace.id) {
        setActiveWorkspaceId(initialData.workspace.id);
        setCookie("workspace-id", initialData.workspace.id);
      }
    }
  }, [initialData?.workspace.id, urlWorkspaceId, activeWorkspaceId]);

  const [polledData, setPolledData] = useState<DashboardData | null>(null);

  const activeData = (() => {
    const isPolledDataStale = polledData && polledData.workspace.id !== activeWorkspaceId;
    if (isPolledDataStale) {
      if (initialData?.workspace.id === activeWorkspaceId) return initialData;
      return null;
    }
    return activeWorkspaceId === initialData?.workspace.id ? polledData || initialData : polledData;
  })();

  const completeStep = useMutation(
    {
      ...trpc.dashboard.completeOnboardingStep.mutationOptions(),
      onSuccess: () => {
        toast.success("Progress updated!");
        queryClient.invalidateQueries(
          trpc.dashboard.getData.queryOptions({ workspaceId: activeWorkspaceId }),
        );
      },
      onError: (err) => {
        console.error("❌ Onboarding mutation failed:", err);
        toast.error("Failed to update progress");
      },
    },
    queryClient,
  );

  const handleCopyCollectionLink = () => {
    if (activeData?.projects && activeData.projects.length > 0) {
      const p = activeData.projects[0];
      const url = `${window.location.origin}/collect/${p.slug}`;
      navigator.clipboard.writeText(url);
      toast.success("Collection link copied!", {
        description: url,
      });
      completeStep.mutate({ step: "step3", workspaceId: activeWorkspaceId });
    } else {
      setNewCollectionOpen(true);
    }
  };

  function handleSignOut() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/"),
      },
    });
  }

  return (
    <WorkspaceProvider
      activeWorkspaceId={activeWorkspaceId}
      setActiveWorkspaceId={setActiveWorkspaceId}
      isModalOpen={isChildModalOpen}
      setIsModalOpen={setIsChildModalOpen}
      onShareLink={handleCopyCollectionLink}
      onCompleteStep={async (step) => {
        await completeStep.mutateAsync({ step, workspaceId: activeWorkspaceId });
      }}
      data={activeData}
    >
      <UpgradeModalProvider>
        {/* Live Data Poller */}
        {isMounted && (
          <DashboardPoller
            workspaceId={activeWorkspaceId}
            onData={setPolledData}
            initialData={activeWorkspaceId === initialData?.workspace.id ? initialData : null}
          />
        )}

        <div className="flex min-h-screen bg-white">
          {/* Desktop sidebar */}
          <DesktopSidebar
            userName={userName}
            userEmail={userEmail}
            onSignOut={handleSignOut}
            onNewCollection={() => setNewCollectionOpen(true)}
            currentWorkspaceId={activeWorkspaceId}
            plan={activeData?.workspace.plan}
            collapsed={sidebarCollapsed}
            onWorkspaceChange={(id) => {
              setActiveWorkspaceId(id);
              const params = new URLSearchParams(searchParams.toString());
              params.set("workspaceId", id);
              params.delete("project");
              const targetPath = pathname.startsWith("/dashboard") ? pathname : "/dashboard";
              router.push(`${targetPath}?${params.toString()}` as any);
            }}
          />

          {/* Mobile drawer */}
          <MobileDrawer
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            userName={userName}
            userEmail={userEmail}
            onSignOut={handleSignOut}
            onNewCollection={() => setNewCollectionOpen(true)}
            currentWorkspaceId={activeWorkspaceId}
            plan={activeData?.workspace.plan}
            onWorkspaceChange={(id) => {
              setActiveWorkspaceId(id);
              const params = new URLSearchParams(searchParams.toString());
              params.set("workspaceId", id);
              params.delete("project");
              const targetPath = pathname.startsWith("/dashboard") ? pathname : "/dashboard";
              router.push(`${targetPath}?${params.toString()}` as any);
            }}
          />

          {/* New Collection Modal */}
          <NewCollectionModal
            open={newCollectionOpen}
            onClose={() => setNewCollectionOpen(false)}
            workspaceId={activeWorkspaceId}
            workspaceSlug={activeData?.workspace.slug || "loading"}
            permissions={activeData?.permissions}
          />

          {/* Main content */}
          <div
            className={`dashboard-content relative flex min-h-screen flex-1 flex-col overflow-x-hidden transition-[margin] duration-300 ${
              sidebarCollapsed ? "lg:ml-16" : "lg:ml-60"
            }`}
          >
            {/* Top bar */}
            <TopBar
              userName={userName}
              onMenuOpen={() => setMobileMenuOpen(true)}
              pageTitle={pageTitle}
              pageSubtitle={pageSubtitle}
              isLive
              collapsed={sidebarCollapsed}
              onToggleCollapsed={() => setSidebarCollapsed((c) => !c)}
            />

            {/* Main view container */}
            <main className="relative flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              <TrialBanner permissions={activeData?.permissions} workspaceId={activeWorkspaceId} />
              <ErrorBoundary name={pageTitle || "Dashboard Content"}>{children}</ErrorBoundary>
            </main>
          </div>
        </div>
      </UpgradeModalProvider>
    </WorkspaceProvider>
  );
}

function DashboardPoller({
  workspaceId,
  onData,
  initialData,
}: {
  workspaceId: string;
  onData: (data: DashboardData) => void;
  initialData?: DashboardData | null;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data } = useQuery({
    ...trpc.dashboard.getData.queryOptions({ workspaceId }),
    initialData: initialData || undefined,
    refetchInterval: 5000,
    enabled: mounted && !!workspaceId,
  });

  useEffect(() => {
    if (data) onData(data);
  }, [data, onData]);

  return null;
}
