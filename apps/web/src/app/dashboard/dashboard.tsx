"use client";

import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  MessageSquareQuote,
  BarChart2,
  Code2,
  Settings,
  LogOut,
  Plus,
  Globe,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { WorkspaceSwitcher } from "@/components/dashboard/WorkspaceSwitcher";
import { gooeyToast as toast } from "goey-toast";
import { trpc, queryClient, type RouterOutputs } from "@/utils/trpc";
import { useQuery, useMutation } from "@tanstack/react-query";
import ErrorBoundary from "@/components/error-boundary";
import { WorkspaceProvider } from "@/components/dashboard/WorkspaceContext";
import { createProject } from "./actions";

type DashboardData = RouterOutputs["dashboard"]["getData"];
type Project = DashboardData["projects"][number];
type RecentTestimonial = DashboardData["recentTestimonials"][number];

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/testimonials", icon: MessageSquareQuote, label: "Testimonials" },
  { href: "/dashboard/collection", icon: Globe, label: "Collection Page" },
  { href: "/dashboard/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/dashboard/embed", icon: Code2, label: "Embed Widget" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
] as const;

// ─── Dot-grid background ──────────────────────────────────────────────────────

// ─── Dot-grid background ──────────────────────────────────────────────────────

function DotGrid({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(0,0,0,${opacity}) 1.5px, transparent 1.5px)`,
        backgroundSize: "20px 20px",
      }}
    />
  );
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
}: {
  pathname: string;
  onNavClick?: () => void;
  userName: string;
  userEmail: string;
  onSignOut: () => void;
  onNewCollection: () => void;
  currentWorkspaceId: string;
  onWorkspaceChange: (id: string) => void;
}) {
  return (
    <>
      {/* Workspace Switcher */}
      <div className="px-3 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
        <WorkspaceSwitcher
          currentWorkspaceId={currentWorkspaceId}
          onWorkspaceChange={onWorkspaceChange}
        />
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          const linkHref = currentWorkspaceId
            ? (`${href}?workspaceId=${currentWorkspaceId}` as Route)
            : (href as Route);

          return (
            <Link
              key={href}
              href={linkHref}
              onClick={onNavClick}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? "text-neutral-900"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
              style={isActive ? { backgroundColor: "#fff5f7", color: "#c2395d" } : {}}
            >
              <Icon className="size-4 shrink-0" style={isActive ? { color: "#e8527a" } : {}} />
              {label}
              {isActive && (
                <div
                  className="ml-auto size-1.5 rounded-full"
                  style={{ backgroundColor: "#e8527a" }}
                />
              )}
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
          className="group flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: "#171717" }}
        >
          <Plus className="size-3.5 transition-transform duration-300 group-hover:rotate-90" />
          New Collection Link
        </button>
      </div>

      {/* User */}
      <div
        className="flex shrink-0 items-center gap-3 px-4 py-4"
        style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
      >
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: "#e8527a" }}
        >
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] leading-tight font-semibold text-neutral-900">
            {userName}
          </p>
          <p className="mt-0.5 truncate text-[11px] leading-tight text-neutral-400">{userEmail}</p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="p-1 text-neutral-300 transition-colors hover:text-neutral-600"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut className="size-3.5" />
        </button>
      </div>
    </>
  );
}

// ─── Desktop sidebar (hidden on mobile) ──────────────────────────────────────

function DesktopSidebar({
  userName,
  userEmail,
  onSignOut,
  onNewCollection,
  currentWorkspaceId,
  onWorkspaceChange,
}: {
  userName: string;
  userEmail: string;
  onSignOut: () => void;
  onNewCollection: () => void;
  currentWorkspaceId: string;
  onWorkspaceChange: (id: string) => void;
}) {
  const pathname = usePathname();
  return (
    <aside
      className="dashboard-sidebar fixed top-0 left-0 z-40 hidden h-screen w-60 flex-col lg:flex"
      style={{
        backgroundColor: "#ffffff",
        borderRight: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      <NavContent
        pathname={pathname}
        userName={userName}
        userEmail={userEmail}
        onSignOut={onSignOut}
        onNewCollection={onNewCollection}
        currentWorkspaceId={currentWorkspaceId}
        onWorkspaceChange={onWorkspaceChange}
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
}: {
  open: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  onSignOut: () => void;
  onNewCollection: () => void;
  currentWorkspaceId: string;
  onWorkspaceChange: (id: string) => void;
}) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div
        className="animate-in slide-in-from-left fixed top-0 left-0 z-50 flex h-screen w-72 flex-col duration-200 lg:hidden"
        style={{
          backgroundColor: "#ffffff",
          borderRight: "1px solid rgba(0,0,0,0.07)",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full transition-colors hover:bg-neutral-100"
        >
          <X className="size-4 text-neutral-500" />
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
}: {
  userName: string;
  onMenuOpen: () => void;
  pageTitle?: string;
  pageSubtitle?: string;
  isLive?: boolean;
}) {
  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      <div className="flex items-center gap-3">
        {/* Hamburger — only on mobile */}
        <button
          type="button"
          onClick={onMenuOpen}
          aria-label="Open navigation"
          className="flex size-8 items-center justify-center rounded-full border transition-colors hover:bg-neutral-50 lg:hidden"
          style={{ borderColor: "rgba(0,0,0,0.1)" }}
        >
          <Menu className="size-4 text-neutral-600" />
        </button>

        <div className="flex items-center gap-3">
          <div>
            <p className="flex items-center gap-2 text-[15px] leading-none font-bold text-neutral-900">
              {pageTitle}
              {isLive && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
              )}
            </p>
            <p className="mt-0.5 hidden text-[12px] text-neutral-400 sm:block">
              {pageSubtitle ?? `Welcome back, ${userName} 👋`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Upgrade pill */}
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] sm:px-4 sm:text-[13px]"
          style={{ backgroundColor: "#171717" }}
        >
          <span className="hidden sm:inline">Upgrade Plan</span>
          <span className="sm:hidden">Upgrade</span>
          <span className="hidden sm:inline">→</span>
        </button>
      </div>
    </header>
  );
}

// ─── Modal ──────────────────────────────────────────────────────────────────

// ─── Modal ──────────────────────────────────────────────────────────────────

function NewCollectionModal({
  open,
  onClose,
  workspaceId,
  workspaceSlug,
}: {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  workspaceSlug: string;
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
      if (result.success) {
        toast.success("Collection link created!");
        onClose();
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to create collection link");
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
        className="animate-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl duration-300"
        style={{ border: "1px solid rgba(0,0,0,0.08)" }}
      >
        <DotGrid opacity={0.04} />

        <div className="relative p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3
              className="text-xl font-bold tracking-tight text-neutral-900"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              New Collection Link
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-neutral-50"
            >
              <X className="size-4 text-neutral-400" />
            </button>
          </div>

          <p className="mb-8 text-[13px] leading-relaxed text-neutral-500">
            Create a dedicated page where your customers can record or write their testimonials.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="px-1 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                Project / Campaign Name
              </label>
              <input
                autoFocus
                name="name"
                type="text"
                required
                placeholder="e.g. April 2024 Product Launch"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-[14px] font-medium transition-all outline-none placeholder:text-neutral-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
              />
            </div>

            <div className="space-y-2 rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
              <p className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                Preview URL
              </p>
              <code className="flex flex-col gap-1 font-mono text-[12px] font-bold text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <Globe className="size-3" />
                  kudoswall.org/{workspaceSlug}/
                  <span className={name ? "text-pink-500" : "text-neutral-300"}>
                    {name ? name.toLowerCase().replace(/\s+/g, "-") : "link-slug"}
                  </span>
                </div>
                <div className="text-[10px] font-medium text-neutral-300">
                  Local: localhost:3001/{workspaceSlug}/...
                </div>
              </code>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full px-4 py-2.5 text-[14px] font-bold text-neutral-500 transition-all hover:bg-neutral-50 active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                style={{ backgroundColor: "#171717" }}
              >
                {loading ? (
                  <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Create Link
                    <ChevronRight className="size-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard shell ──────────────────────────────────────────────────────────
// When `children` is provided it renders instead of the default overview content.

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
  const [testimonialFilter, setTestimonialFilter] = useState<"All" | "Video" | "Text">("All");

  // Auto-open modal if `new=project` is in URL
  useEffect(() => {
    if (searchParams.get("new") === "project") {
      setNewCollectionOpen(true);
      // Clean up URL to avoid re-opening on refresh
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

  // Sync state with URL search params
  useEffect(() => {
    if (urlWorkspaceId && urlWorkspaceId !== activeWorkspaceId) {
      setActiveWorkspaceId(urlWorkspaceId);
    }
  }, [urlWorkspaceId]);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Synchronize state with initialData from server
  useEffect(() => {
    if (initialData?.workspace.id && initialData.workspace.id !== activeWorkspaceId) {
      setActiveWorkspaceId(initialData.workspace.id);
    }
  }, [initialData?.workspace.id]);

  // Derived data state (polled content)
  const [polledData, setPolledData] = useState<DashboardData | null>(null);

  // Sync initialData
  const activeData =
    activeWorkspaceId === initialData?.workspace.id ? polledData || initialData : polledData;

  const completeStep = useMutation({
    ...trpc.dashboard.completeOnboardingStep.mutationOptions(),
    onSuccess: () => {
      // Use imported global queryClient instead of useQueryClient() to be SSR-safe
      queryClient.invalidateQueries(trpc.dashboard.getData.queryOptions());
    },
  });

  const handleCopyCollectionLink = () => {
    if (activeData?.projects && activeData.projects.length > 0) {
      const p = activeData.projects[0];
      const url = `${window.location.origin}/collect/${p.slug}`;
      navigator.clipboard.writeText(url);
      toast.success("Collection link copied!", {
        description: url,
      });
      completeStep.mutate({ step: "step3" });
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
    >
      {/* Live Data Poller (Client Only) */}
      {isMounted && (
        <DashboardPoller
          workspaceId={activeWorkspaceId}
          onData={setPolledData}
          initialData={activeWorkspaceId === initialData?.workspace.id ? initialData : null}
        />
      )}

      <div className="flex min-h-screen" style={{ backgroundColor: "#ffffff" }}>
        {/* Desktop sidebar */}
        <DesktopSidebar
          userName={userName}
          userEmail={userEmail}
          onSignOut={handleSignOut}
          onNewCollection={() => setNewCollectionOpen(true)}
          currentWorkspaceId={activeWorkspaceId}
          onWorkspaceChange={(id) => {
            setActiveWorkspaceId(id);
            const params = new URLSearchParams(searchParams.toString());
            params.set("workspaceId", id);
            // When switching workspaces, we often want to go back to the overview
            // to avoid "Project not found" errors on specific sub-pages
            router.push(`/dashboard?${params.toString()}` as any);
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
          onWorkspaceChange={(id) => {
            setActiveWorkspaceId(id);
            const params = new URLSearchParams(searchParams.toString());
            params.set("workspaceId", id);
            router.push(`/dashboard?${params.toString()}` as any);
          }}
        />

        {/* Modal */}
        <NewCollectionModal
          open={newCollectionOpen}
          onClose={() => setNewCollectionOpen(false)}
          workspaceId={activeWorkspaceId}
          workspaceSlug={activeData?.workspace.slug || "loading"}
        />

        {/* Main content — offset only on lg+ */}
        <div className="dashboard-content relative flex min-h-screen flex-1 flex-col overflow-x-hidden lg:ml-60">
          <DotGrid opacity={0.08} />

          {/* Soft central glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-start justify-center"
            style={{ zIndex: 0 }}
          >
            <div
              className="h-[500px] w-[600px] rounded-full blur-3xl lg:w-[900px]"
              style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
            />
          </div>

          {/* Top bar */}
          <div className="relative z-10">
            <TopBar
              userName={userName}
              onMenuOpen={() => setMobileMenuOpen(true)}
              pageTitle={pageTitle}
              pageSubtitle={pageSubtitle}
              isLive
            />
          </div>

          {/* Main content */}
          <main className="relative z-10 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <ErrorBoundary name={pageTitle || "Dashboard Content"}>{children}</ErrorBoundary>
          </main>
        </div>
      </div>
    </WorkspaceProvider>
  );
}

/**
 * Client-only component to handle live data polling and mutations.
 * This avoids SSR issues with useQuery/useMutation in the main DashboardShell.
 */
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
