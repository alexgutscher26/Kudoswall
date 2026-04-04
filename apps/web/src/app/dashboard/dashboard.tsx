"use client";

import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
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
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/testimonials", icon: MessageSquareQuote, label: "Testimonials" },
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

// ─── Checklist ────────────────────────────────────────────────────────────────

const CHECKLIST = [
  { label: "Create your account", done: true },
  { label: "Share your collection link", done: false },
  { label: "Collect your first testimonial", done: false },
  { label: "Customize your widget", done: false },
  { label: "Embed on your website", done: false },
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
}: {
  pathname: string;
  onNavClick?: () => void;
  userName: string;
  userEmail: string;
  onSignOut: () => void;
}) {
  return (
    <>
      {/* Logo */}
      <div
        className="px-5 py-5 shrink-0"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}
      >
        <Link
          href="/"
          onClick={onNavClick}
          className="block text-lg font-bold tracking-tight text-neutral-900 select-none leading-none"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          TestimonialWall
        </Link>
        <span
          className="inline-block mt-2 text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
          style={{ backgroundColor: "#fff5f7", color: "#e8527a" }}
        >
          Dashboard
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href as Route}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? "text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
              }`}
              style={isActive ? { backgroundColor: "#fff5f7", color: "#c2395d" } : {}}
            >
              <Icon
                className="size-4 shrink-0"
                style={isActive ? { color: "#e8527a" } : {}}
              />
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
      <div className="px-3 pb-3 shrink-0">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] shadow-sm"
          style={{ backgroundColor: "#171717" }}
        >
          <Plus className="size-3.5" />
          New Collection Link
        </button>
      </div>

      {/* User */}
      <div
        className="px-4 py-4 flex items-center gap-3 shrink-0"
        style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
      >
        <div
          className="size-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ backgroundColor: "#e8527a" }}
        >
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-neutral-900 truncate leading-tight">
            {userName}
          </p>
          <p className="text-[11px] text-neutral-400 truncate leading-tight mt-0.5">
            {userEmail}
          </p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="text-neutral-300 hover:text-neutral-600 transition-colors p-1"
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
}: {
  userName: string;
  userEmail: string;
  onSignOut: () => void;
}) {
  const pathname = usePathname();
  return (
    <aside
      className="hidden lg:flex fixed left-0 top-0 h-screen w-60 flex-col z-40"
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
}: {
  open: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  onSignOut: () => void;
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
        className="fixed left-0 top-0 h-screen w-72 flex flex-col z-50 lg:hidden animate-in slide-in-from-left duration-200"
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
          className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
        >
          <X className="size-4 text-neutral-500" />
        </button>
        <NavContent
          pathname={pathname}
          onNavClick={onClose}
          userName={userName}
          userEmail={userEmail}
          onSignOut={onSignOut}
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
}: {
  userName: string;
  onMenuOpen: () => void;
  pageTitle?: string;
  pageSubtitle?: string;
}) {
  return (
    <header
      className="h-14 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30"
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
          className="lg:hidden size-8 flex items-center justify-center rounded-full border hover:bg-neutral-50 transition-colors"
          style={{ borderColor: "rgba(0,0,0,0.1)" }}
        >
          <Menu className="size-4 text-neutral-600" />
        </button>

        <div>
          <p className="text-[15px] font-bold text-neutral-900 leading-none">
            {pageTitle}
          </p>
          <p className="hidden sm:block text-[12px] text-neutral-400 mt-0.5">
            {pageSubtitle ?? `Welcome back, ${userName} 👋`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative size-8 flex items-center justify-center rounded-full border transition-colors hover:bg-neutral-50"
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
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[12px] sm:text-[13px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
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
      className="rounded-2xl p-4 sm:p-5 border border-neutral-100 hover:shadow-md transition-shadow"
      style={{ backgroundColor: bg }}
    >
      <div
        className="inline-flex items-center justify-center size-9 rounded-xl mb-3"
        style={{ backgroundColor: `${accent}20` }}
      >
        <Icon className="size-4" style={{ color: accent }} />
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-none mb-1 tracking-tight">
        {value}
      </p>
      <p className="text-[13px] font-medium text-neutral-700">{label}</p>
      <p className="text-[11px] text-neutral-400 mt-0.5 hidden sm:block">{sub}</p>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyTestimonials() {
  return (
    <div className="flex flex-col items-center justify-center py-10 sm:py-14 px-6 text-center">
      <div
        className="size-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: "#fff5f7" }}
      >
        <MessageSquareQuote className="size-6" style={{ color: "#e8527a" }} />
      </div>
      <h3 className="text-[15px] font-semibold text-neutral-900 mb-1.5">
        No testimonials yet
      </h3>
      <p className="text-[13px] text-neutral-400 max-w-xs leading-relaxed mb-6">
        Share your collection link with customers and your first testimonials will appear here — ready to review and approve.
      </p>
      <button
        type="button"
        className="flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ backgroundColor: "#171717" }}
      >
        <Copy className="size-3.5" />
        Copy Collection Link
      </button>
    </div>
  );
}

// ─── Getting started ──────────────────────────────────────────────────────────

function GettingStarted() {
  const done = CHECKLIST.filter((c) => c.done).length;
  const total = CHECKLIST.length;
  const pct = Math.round((done / total) * 100);

  return (
    <div
      className="rounded-2xl border border-neutral-100 overflow-hidden"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div>
          <p className="text-[13px] font-semibold text-neutral-900">
            Getting Started
          </p>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            {done} / {total} complete
          </p>
        </div>
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={{ color: "#e8527a", backgroundColor: "#fff5f7" }}
        >
          {pct}%
        </span>
      </div>

      <div className="h-[3px] bg-neutral-100">
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: "#e8527a" }}
        />
      </div>

      <ul className="px-5 py-4 space-y-3">
        {CHECKLIST.map(({ label, done: isDone }) => (
          <li key={label} className="flex items-center gap-3">
            {isDone ? (
              <CheckCircle2
                className="size-4 shrink-0"
                style={{ color: "#16a34a" }}
              />
            ) : (
              <div
                className="size-4 rounded-full border-2 shrink-0"
                style={{ borderColor: "rgba(0,0,0,0.15)" }}
              />
            )}
            <span
              className={`text-[13px] leading-snug ${
                isDone ? "line-through text-neutral-300" : "text-neutral-700"
              }`}
            >
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Quick actions ────────────────────────────────────────────────────────────

function QuickActions() {
  return (
    <div
      className="rounded-2xl border border-neutral-100 overflow-hidden"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div
        className="px-5 py-4"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      >
        <p className="text-[13px] font-semibold text-neutral-900">
          Quick Actions
        </p>
      </div>
      <ul className="divide-y" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
        {QUICK_ACTIONS.map(({ icon: Icon, label, desc, accent, bg }) => (
          <li key={label}>
            <button
              type="button"
              className="w-full flex items-center gap-3.5 px-5 py-3.5 text-left transition-colors hover:bg-neutral-50 group"
            >
              <div
                className="size-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: bg }}
              >
                <Icon className="size-3.5" style={{ color: accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-neutral-800 leading-tight">
                  {label}
                </p>
                <p className="text-[11px] text-neutral-400 leading-tight mt-0.5">
                  {desc}
                </p>
              </div>
              <ChevronRight className="size-3.5 text-neutral-200 group-hover:text-neutral-400 transition-colors" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Bento spotlight ──────────────────────────────────────────────────────────

function FeatureSpotlight() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Collect — 1 col */}
      <div
        className="rounded-2xl p-5 sm:p-6 border border-neutral-100 hover:shadow-md transition-shadow"
        style={{ backgroundColor: "#fff5f7" }}
      >
        <div
          className="inline-flex items-center justify-center size-10 rounded-xl mb-4"
          style={{ backgroundColor: "#e8527a20" }}
        >
          <Star className="size-5" style={{ color: "#e8527a" }} />
        </div>
        <h3 className="font-semibold text-neutral-900 text-[15px] mb-1.5">
          Collect reviews
        </h3>
        <p className="text-neutral-500 text-[13px] leading-relaxed mb-4">
          Share a single link — customers send video or text with no login required.
        </p>
        <button
          type="button"
          className="text-[12px] font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity"
          style={{ color: "#e8527a" }}
        >
          Copy your link <ChevronRight className="size-3" />
        </button>
      </div>

      {/* Embed — 2 col */}
      <div
        className="rounded-2xl p-5 sm:p-6 border border-neutral-100 hover:shadow-md transition-shadow md:col-span-2"
        style={{ backgroundColor: "#f0f9ff" }}
      >
        <div
          className="inline-flex items-center justify-center size-10 rounded-xl mb-4"
          style={{ backgroundColor: "#0ea5e920" }}
        >
          <Code2 className="size-5" style={{ color: "#0ea5e9" }} />
        </div>
        <h3 className="font-semibold text-neutral-900 text-[15px] mb-1.5">
          Embed on your website
        </h3>
        <p className="text-neutral-500 text-[13px] leading-relaxed mb-4">
          Copy one{" "}
          <code className="font-mono bg-white/70 px-1.5 py-0.5 rounded-md text-[11px] border border-white/80">
            &lt;script&gt;
          </code>{" "}
          tag and drop it into Webflow, WordPress, or any HTML page — testimonials show up instantly.
        </p>
        <div
          className="flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl border"
          style={{
            backgroundColor: "rgba(255,255,255,0.7)",
            borderColor: "rgba(0,0,0,0.08)",
          }}
        >
          <code className="flex-1 text-[11px] font-mono text-neutral-500 truncate">
            {'<script src="https://cdn.testimonialwall.com/widget.js" />'}
          </code>
          <button
            type="button"
            className="shrink-0 text-neutral-300 hover:text-neutral-600 transition-colors"
            aria-label="Copy embed code"
          >
            <Copy className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard shell ──────────────────────────────────────────────────────────

// ─── Dashboard shell ──────────────────────────────────────────────────────────
// When `children` is provided it renders instead of the default overview content.

export default function DashboardShell({
  userName,
  userEmail,
  children,
  pageTitle,
  pageSubtitle,
}: {
  userName: string;
  userEmail: string;
  children?: ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
}) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleSignOut() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/"),
      },
    });
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#ffffff" }}>
      {/* Desktop sidebar */}
      <DesktopSidebar
        userName={userName}
        userEmail={userEmail}
        onSignOut={handleSignOut}
      />

      {/* Mobile drawer */}
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        userName={userName}
        userEmail={userEmail}
        onSignOut={handleSignOut}
      />

      {/* Main content — offset only on lg+ */}
      <div className="flex-1 flex flex-col min-h-screen relative lg:ml-60">
        <DotGrid opacity={0.08} />

        {/* Soft central glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-start justify-center"
          style={{ zIndex: 0 }}
        >
          <div
            className="w-[600px] lg:w-[900px] h-[500px] rounded-full blur-3xl"
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
          />
        </div>

        {/* Main content */}
        {children ? (
          <main className="relative z-10 flex-1">{children}</main>
        ) : (
          <main className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">
              {/* Stats grid — 2 cols on mobile, 4 on xl */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                {STATS.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>

              {/* Main split */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
                {/* Testimonials panel */}
                <div
                  className="xl:col-span-2 rounded-2xl border border-neutral-100 overflow-hidden"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <div
                    className="px-4 sm:px-6 py-4 flex items-center justify-between gap-3"
                    style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                  >
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-neutral-900">
                        Recent Testimonials
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-0.5 hidden sm:block">
                        Latest submissions from your customers
                      </p>
                    </div>
                    {/* Filter chips */}
                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                      {["All", "Video", "Text"].map((f, i) => (
                        <button
                          key={f}
                          type="button"
                          className="text-[11px] font-medium rounded-full px-2.5 sm:px-3 py-1 transition-all border"
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
                  <EmptyTestimonials />
                </div>

                {/* Right column */}
                <div className="xl:col-span-1 space-y-4 sm:space-y-5">
                  <GettingStarted />
                  <QuickActions />
                </div>
              </div>

              {/* Bento feature cards */}
              <FeatureSpotlight />
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
