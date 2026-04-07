"use client";

import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  MessageSquareQuote,
  BarChart2,
  Code2,
  Settings,
  LogOut,
  Star,
  Clock,
  CheckCircle2,
  Copy,
  Plus,
  Globe,
  Bell,
  ChevronRight,
  Video,
  ExternalLink,
  Menu,
  X,
  User,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { createProject } from "./actions";
import { gooeyToast as toast } from "goey-toast";
import { trpc, queryClient } from "@/utils/trpc";
import { useQuery, useMutation } from "@tanstack/react-query";
import ErrorBoundary from "@/components/error-boundary";

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/testimonials", icon: MessageSquareQuote, label: "Testimonials" },
  { href: "/dashboard/collection", icon: Globe, label: "Collection Page" },
  { href: "/dashboard/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/dashboard/embed", icon: Code2, label: "Embed Widget" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
] as const;

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  {
    label: "Testimonials",
    value: "0",
    sub: "Start collecting today",
    icon: MessageSquareQuote,
    accent: "#e8527a",
    bg: "#fff5f7",
  },
  {
    label: "Pending Approval",
    value: "0",
    sub: "All clear",
    icon: Clock,
    accent: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    label: "Widget Views",
    value: "0",
    sub: "Embed to start tracking",
    icon: Globe,
    accent: "#0ea5e9",
    bg: "#f0f9ff",
  },
  {
    label: "Conversion Rate",
    value: "—",
    sub: "Needs more data",
    icon: BarChart2,
    accent: "#16a34a",
    bg: "#f0fdf4",
  },
] as const;

// ─── Quick actions ────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  {
    icon: Copy,
    label: "Copy Collection Link",
    desc: "Share with customers to start collecting",
    accent: "#e8527a",
    bg: "#fff5f7",
  },
  {
    icon: Video,
    label: "Preview Submission Form",
    desc: "See what your customers experience",
    accent: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    icon: Code2,
    label: "Get Embed Code",
    desc: "Drop the widget into any website",
    accent: "#0ea5e9",
    bg: "#f0f9ff",
  },
  {
    icon: ExternalLink,
    label: "Visit Marketing Page",
    desc: "Share your TestimonialWall page",
    accent: "#16a34a",
    bg: "#f0fdf4",
  },
] as const;

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
}: {
  pathname: string;
  onNavClick?: () => void;
  userName: string;
  userEmail: string;
  onSignOut: () => void;
  onNewCollection: () => void;
}) {
  return (
    <>
      {/* Logo */}
      <div className="shrink-0 px-5 py-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
        <Link
          href="/"
          onClick={onNavClick}
          className="block text-lg leading-none font-bold tracking-tight text-neutral-900 select-none"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          TestimonialWall
        </Link>
        <span
          className="mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase"
          style={{ backgroundColor: "#fff5f7", color: "#e8527a" }}
        >
          Dashboard
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href as Route}
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
}: {
  userName: string;
  userEmail: string;
  onSignOut: () => void;
  onNewCollection: () => void;
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
}: {
  open: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  onSignOut: () => void;
  onNewCollection: () => void;
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
        {/* Notification bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-8 items-center justify-center rounded-full border transition-colors hover:bg-neutral-50"
          style={{ borderColor: "rgba(0,0,0,0.1)" }}
        >
          <Bell className="size-[15px] text-neutral-500" />
          <span
            className="absolute top-1 right-1 size-1.5 rounded-full"
            style={{ backgroundColor: "#e8527a" }}
          />
        </button>

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

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  bg,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  accent: string;
  bg: string;
}) {
  return (
    <div
      className="rounded-2xl border border-neutral-100 p-4 transition-shadow hover:shadow-md sm:p-5"
      style={{ backgroundColor: bg }}
    >
      <div
        className="mb-3 inline-flex size-9 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}20` }}
      >
        <Icon className="size-4" style={{ color: accent }} />
      </div>
      <p className="mb-1 text-2xl leading-none font-bold tracking-tight text-neutral-900 sm:text-3xl">
        {value}
      </p>
      <p className="text-[13px] font-medium text-neutral-700">{label}</p>
      <p className="mt-0.5 hidden text-[11px] text-neutral-400 sm:block">{sub}</p>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyTestimonials({ onNewCollection }: { onNewCollection: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center sm:py-14">
      <div
        className="mb-4 flex size-14 items-center justify-center rounded-2xl"
        style={{ backgroundColor: "#fff5f7" }}
      >
        <MessageSquareQuote className="size-6" style={{ color: "#e8527a" }} />
      </div>
      <h3 className="mb-1.5 text-[15px] font-semibold text-neutral-900">No testimonials yet</h3>
      <p className="mb-6 max-w-xs text-[13px] leading-relaxed text-neutral-400">
        Share your collection link with customers and your first testimonials will appear here —
        ready to review and approve.
      </p>
      <button
        type="button"
        onClick={onNewCollection}
        className="flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ backgroundColor: "#171717" }}
      >
        <Plus className="size-3.5" />
        New Collection Link
      </button>
    </div>
  );
}

// ─── Quick actions ────────────────────────────────────────────────────────────

function QuickActions({
  onNewCollection,
  onCopyLink,
  hasProjects,
}: {
  onNewCollection: () => void;
  onCopyLink: () => void;
  hasProjects: boolean;
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-neutral-100"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <p className="text-[13px] font-semibold text-neutral-900">Quick Actions</p>
      </div>
      <ul className="divide-y" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
        {QUICK_ACTIONS.map(({ icon: Icon, label, desc, accent, bg }) => (
          <li key={label}>
            <button
              type="button"
              onClick={label === "Copy Collection Link" ? onCopyLink : onNewCollection}
              className="group flex w-full items-center gap-3.5 px-5 py-3.5 text-left transition-colors hover:bg-neutral-50"
            >
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: bg }}
              >
                <Icon className="size-3.5" style={{ color: accent }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] leading-tight font-medium text-neutral-800">
                  {label === "Copy Collection Link" && !hasProjects ? "New Collection Link" : label}
                </p>
                <p className="mt-0.5 text-[11px] leading-tight text-neutral-400">
                  {label === "Copy Collection Link" && !hasProjects
                    ? "Create a dedicated wall page"
                    : desc}
                </p>
              </div>
              <ChevronRight className="size-3.5 text-neutral-200 transition-colors group-hover:text-neutral-400" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Modal ──────────────────────────────────────────────────────────────────

function NewCollectionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
      const result = await createProject(formData);
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
                  wall.me/my-workspace/
                  <span className={name ? "text-pink-500" : "text-neutral-300"}>
                    {name ? name.toLowerCase().replace(/\s+/g, "-") : "link-slug"}
                  </span>
                </div>
                <div className="text-[10px] font-medium text-neutral-300">
                  Local: localhost:3001/my-workspace/...
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

// ─── Bento spotlight ──────────────────────────────────────────────────────────

function FeatureSpotlight({ onNewCollection }: { onNewCollection: () => void }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Collect — 1 col */}
      <div
        className="rounded-2xl border border-neutral-100 p-5 transition-shadow hover:shadow-md sm:p-6"
        style={{ backgroundColor: "#fff5f7" }}
      >
        <div
          className="mb-4 inline-flex size-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: "#e8527a20" }}
        >
          <Star className="size-5" style={{ color: "#e8527a" }} />
        </div>
        <h3 className="mb-1.5 text-[15px] font-semibold text-neutral-900">Collect reviews</h3>
        <p className="mb-4 text-[13px] leading-relaxed text-neutral-500">
          Share a single link — customers send video or text with no login required.
        </p>
        <button
          type="button"
          onClick={onNewCollection}
          className="flex items-center gap-1 text-[12px] font-semibold transition-opacity hover:opacity-70"
          style={{ color: "#e8527a" }}
        >
          Create your link <ChevronRight className="size-3" />
        </button>
      </div>

      {/* Embed — 2 col */}
      <div
        className="rounded-2xl border border-neutral-100 p-5 transition-shadow hover:shadow-md sm:p-6 md:col-span-2"
        style={{ backgroundColor: "#f0f9ff" }}
      >
        <div
          className="mb-4 inline-flex size-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: "#0ea5e920" }}
        >
          <Code2 className="size-5" style={{ color: "#0ea5e9" }} />
        </div>
        <h3 className="mb-1.5 text-[15px] font-semibold text-neutral-900">Embed on your website</h3>
        <p className="mb-4 text-[13px] leading-relaxed text-neutral-500">
          Copy one{" "}
          <code className="rounded-md border border-white/80 bg-white/70 px-1.5 py-0.5 font-mono text-[11px]">
            &lt;script&gt;
          </code>{" "}
          tag and drop it into Webflow, WordPress, or any HTML page — testimonials show up
          instantly.
        </p>
        <div
          className="flex items-center gap-3 rounded-xl border px-3 py-3 sm:px-4"
          style={{
            backgroundColor: "rgba(255,255,255,0.7)",
            borderColor: "rgba(0,0,0,0.08)",
          }}
        >
          <code className="flex-1 truncate font-mono text-[11px] text-neutral-500">
            &lt;script src="https://cdn.testimonialwall.com/widget.js" /&gt;
          </code>
          <button
            type="button"
            className="shrink-0 text-neutral-300 transition-colors hover:text-neutral-600"
            aria-label="Copy embed code"
          >
            <Copy className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function RecentTestimonialsList({ testimonials }: { testimonials: any[] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="max-h-[400px] divide-y divide-neutral-50 overflow-y-auto">
      {testimonials.map((t: any) => (
        <div
          key={t.id}
          className="group flex items-center justify-between px-4 py-4 transition-all hover:bg-neutral-50/50 sm:px-6"
        >
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50">
              {t.authorImage ? (
                <Image
                  src={t.authorImage}
                  alt={t.authorName || "User"}
                  width={40}
                  height={40}
                  className="size-full object-cover"
                />
              ) : (
                <User className="size-5 text-neutral-300" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="truncate text-[14px] font-bold tracking-tight text-neutral-900">
                  {t.authorName || "Anonymous"}
                </h4>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="relative">
                      {/* Base Star (Grey) */}
                      <Star className="size-2.5 fill-neutral-100 text-neutral-100" />
                      {/* Half Star Overlay */}
                      {(t.rating ?? 0) >= s - 0.5 && (t.rating ?? 0) < s && (
                        <div className="absolute inset-0 z-10 w-1/2 overflow-hidden">
                          <Star className="size-2.5 fill-amber-400 text-amber-400" />
                        </div>
                      )}
                      {/* Full Star Overlay */}
                      {(t.rating ?? 0) >= s && (
                        <div className="absolute inset-0 z-10 overflow-hidden">
                          <Star className="size-2.5 fill-amber-400 text-amber-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-0.5 line-clamp-1 text-[12px] text-neutral-500 italic">
                "{t.content || (t.type === "video" ? "Video testimonial" : "No content")}"
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-md border border-neutral-100/50 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400">
                  {t.project?.name}
                </span>
                <span className="text-[10px] text-neutral-300">
                  {new Date(t.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="ml-4 flex items-center gap-2">
            <Link
              href={`/dashboard/testimonials?id=${t.id}`}
              className="rounded-full p-2 text-neutral-300 transition-all hover:bg-white hover:text-neutral-600 hover:shadow-sm"
            >
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectsList({
  projects,
  workspaceSlug,
  onCopyLink,
}: {
  projects: any[];
  workspaceSlug: string;
  onCopyLink?: () => void;
}) {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="max-h-[400px] divide-y divide-neutral-50 overflow-y-auto">
      {projects.map((p: any) => (
        <div
          key={p.id}
          className="group flex items-center justify-between px-4 py-4 transition-all hover:bg-neutral-50/50 sm:px-6"
        >
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-pink-50">
              <LinkIcon className="size-5 text-pink-500" />
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-[14px] font-bold tracking-tight text-neutral-900">
                {p.name}
              </h4>
              <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-neutral-400">
                <Globe className="size-3" />/{workspaceSlug}/{p.slug}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const url =
                  window.location.origin === "http://localhost:3001"
                    ? `http://localhost:3001/${workspaceSlug}/${p.slug}`
                    : `https://wall.me/${workspaceSlug}/${p.slug}`;
                navigator.clipboard.writeText(url);
                toast.success("Link copied!");
                onCopyLink?.();
              }}
              className="rounded-full p-2 text-neutral-300 transition-all hover:bg-white hover:text-neutral-600 hover:shadow-sm"
              title="Copy link"
            >
              <Copy className="size-4" />
            </button>
            <Link
              href={`/dashboard/testimonials?project=${p.id}`}
              className="rounded-full p-2 text-neutral-300 transition-all hover:bg-white hover:text-neutral-600 hover:shadow-sm"
            >
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
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
}: {
  userName: string;
  userEmail: string;
  children?: ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
  initialData?: any;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newCollectionOpen, setNewCollectionOpen] = useState(false);

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

  // Live polling for dashboard data
  const { data: liveData } = useQuery({
    ...trpc.dashboard.getData.queryOptions(),
    initialData,
    refetchInterval: 5000,
  });

  const activeData = liveData || initialData;

  const completeStep = useMutation({
    ...trpc.dashboard.completeOnboardingStep.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.dashboard.getData.queryOptions());
    },
  });

  // Derived stats from initialData
  const stats = activeData
    ? [
        {
          label: "Testimonials",
          value: activeData.stats.testimonials.toString(),
          sub: activeData.stats.testimonials > 0 ? "Great progress!" : "Start collecting today",
          icon: MessageSquareQuote,
          accent: "#e8527a",
          bg: "#fff5f7",
        },
        {
          label: "Pending Approval",
          value: activeData.stats.pending.toString(),
          sub: activeData.stats.pending > 0 ? "New submissions!" : "All clear",
          icon: Clock,
          accent: "#7c3aed",
          bg: "#f5f3ff",
        },
        {
          label: "Widget Views",
          value: activeData.stats.views.toString(),
          sub: "Embed to start tracking",
          icon: Globe,
          accent: "#0ea5e9",
          bg: "#f0f9ff",
        },
        {
          label: "Conversion Rate",
          value: activeData.stats.conversion,
          sub: "Needs more data",
          icon: BarChart2,
          accent: "#16a34a",
          bg: "#f0fdf4",
        },
      ]
    : [];

  const handleCopyCollectionLink = () => {
    if (activeData?.projects?.length > 0) {
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
    <div className="flex min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      {/* Desktop sidebar */}
      <DesktopSidebar
        userName={userName}
        userEmail={userEmail}
        onSignOut={handleSignOut}
        onNewCollection={() => setNewCollectionOpen(true)}
      />

      {/* Mobile drawer */}
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        userName={userName}
        userEmail={userEmail}
        onSignOut={handleSignOut}
        onNewCollection={() => setNewCollectionOpen(true)}
      />

      {/* Modal */}
      <NewCollectionModal open={newCollectionOpen} onClose={() => setNewCollectionOpen(false)} />

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
          <ErrorBoundary name={pageTitle || "Dashboard Content"}>
            {children || (
              <div className="mx-auto max-w-6xl space-y-5 sm:space-y-6">
                {/* Stats grid — 2 cols on mobile, 4 on xl */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                  {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                  ))}
                </div>

                {/* Main split */}
                <div className="grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-3">
                  {/* Testimonials panel */}
                  <div
                    className="overflow-hidden rounded-2xl border border-neutral-100 xl:col-span-2"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <div
                      className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6"
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-neutral-900">
                          Recent Testimonials
                        </p>
                        <p className="mt-0.5 hidden text-[11px] text-neutral-400 sm:block">
                          Latest submissions from your customers
                        </p>
                      </div>
                      {/* Filter chips */}
                      <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
                        {["All", "Video", "Text"].map((f, i) => (
                          <button
                            key={f}
                            type="button"
                            className="rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all sm:px-3"
                            style={
                              i === 0
                                ? {
                                    backgroundColor: "#fff5f7",
                                    color: "#e8527a",
                                    borderColor: "#fecdd3",
                                  }
                                : {
                                    backgroundColor: "transparent",
                                    color: "#a3a3a3",
                                    borderColor: "rgba(0,0,0,0.08)",
                                  }
                            }
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                    {activeData?.recentTestimonials && activeData.recentTestimonials.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        <ProjectsList
                          projects={activeData.projects}
                          workspaceSlug={activeData.workspace.slug}
                          onCopyLink={() => completeStep.mutate({ step: "step3" })}
                        />
                        <RecentTestimonialsList testimonials={activeData.recentTestimonials} />
                      </div>
                    ) : (
                      <EmptyTestimonials onNewCollection={() => setNewCollectionOpen(true)} />
                    )}
                  </div>

                  {/* Right column */}
                  <div className="space-y-4 sm:space-y-5 xl:col-span-1">
                    {activeData?.onboarding && (
                      <OnboardingChecklist status={activeData.onboarding} />
                    )}
                    <QuickActions
                      onNewCollection={() => setNewCollectionOpen(true)}
                      onCopyLink={handleCopyCollectionLink}
                      hasProjects={activeData?.projects?.length > 0}
                    />
                  </div>
                </div>

                {/* Bento feature cards */}
                <FeatureSpotlight onNewCollection={() => setNewCollectionOpen(true)} />
              </div>
            )}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
