"use client";

import { useState } from "react";
import {
  MessageSquareQuote,
  Search,
  Filter,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Video,
  FileText,
  Trash2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Copy,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TestimonialStatus = "pending" | "approved" | "rejected";
type TestimonialType = "text" | "video";

interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  type: TestimonialType;
  status: TestimonialStatus;
  submittedAt: string;
  featured: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    author: "Sarah Chen",
    role: "Head of Marketing",
    company: "Acme Corp",
    avatar: "SC",
    content:
      "TestimonialWall completely transformed how we collect and display social proof. Setup took under 5 minutes and our conversion rate jumped 23% in the first month. I honestly can't imagine going back.",
    rating: 5,
    type: "text",
    status: "approved",
    submittedAt: "2025-03-28",
    featured: true,
  },
  {
    id: "2",
    author: "James Okafor",
    role: "Founder",
    company: "LaunchPad SaaS",
    avatar: "JO",
    content:
      "We tried three other tools before this one. None of them let customers submit video reviews this easily, without creating an account. Huge win for our team.",
    rating: 5,
    type: "video",
    status: "approved",
    submittedAt: "2025-03-25",
    featured: false,
  },
  {
    id: "3",
    author: "Priya Anand",
    role: "CX Lead",
    company: "Bloom Studio",
    avatar: "PA",
    content:
      "Honestly impressed. The embed widget is beautiful and looks native to our design. Customers trust the reviews more because they feel authentic, not like generic template widgets.",
    rating: 4,
    type: "text",
    status: "pending",
    submittedAt: "2025-03-30",
    featured: false,
  },
  {
    id: "4",
    author: "Marcus Webb",
    role: "Growth Engineer",
    company: "Rocketship AI",
    avatar: "MW",
    content:
      "This replaced three different tools in our stack. Collecting, curating, and displaying testimonials — all in one place. The ROI was obvious within the first week.",
    rating: 5,
    type: "text",
    status: "pending",
    submittedAt: "2025-04-01",
    featured: false,
  },
  {
    id: "5",
    author: "Sophie Larkin",
    role: "Director of Sales",
    company: "PeakFlow",
    avatar: "SL",
    content:
      "Decent product. Does what it says, though I'd love more customization options for the widget colors. Overall a solid B+.",
    rating: 3,
    type: "text",
    status: "rejected",
    submittedAt: "2025-03-20",
    featured: false,
  },
  {
    id: "6",
    author: "Elena Vasquez",
    role: "Product Lead",
    company: "BuildFast",
    avatar: "EV",
    content:
      "The video submission flow is so smooth — customers don't need to install anything. We went from 0 video reviews to 14 in two weeks after sharing the link in our onboarding email.",
    rating: 5,
    type: "video",
    status: "approved",
    submittedAt: "2025-04-02",
    featured: false,
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
] as const;

const TYPE_FILTERS = ["All types", "Text", "Video"] as const;

const SORT_OPTIONS = ["Newest first", "Oldest first", "Highest rating", "Featured first"] as const;

const AVATAR_COLORS = [
  { bg: "#fff5f7", text: "#c2395d" },
  { bg: "#f5f3ff", text: "#6d28d9" },
  { bg: "#f0f9ff", text: "#0369a1" },
  { bg: "#f0fdf4", text: "#15803d" },
  { bg: "#fff7ed", text: "#c2410c" },
  { bg: "#f8fafc", text: "#475569" },
];

type StatusTab = (typeof STATUS_TABS)[number]["key"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function avatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

// ─── Star rating ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <div key={s} className="relative">
          {/* Base Star (Grey) */}
          <Star className="size-3 fill-neutral-100 text-neutral-100" />
          {/* Half Star Overlay */}
          {rating >= s - 0.5 && rating < s && (
            <div className="absolute inset-0 z-10 w-1/2 overflow-hidden">
              <Star className="size-3 fill-amber-400 text-amber-400" />
            </div>
          )}
          {/* Full Star Overlay */}
          {rating >= s && (
            <div className="absolute inset-0 z-10 overflow-hidden">
              <Star className="size-3 fill-amber-400 text-amber-400" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TestimonialStatus }) {
  const map = {
    approved: {
      bg: "#f0fdf4",
      color: "#15803d",
      border: "#bbf7d0",
      label: "Approved",
      Icon: CheckCircle2,
    },
    pending: {
      bg: "#fff7ed",
      color: "#c2410c",
      border: "#fed7aa",
      label: "Pending",
      Icon: Clock,
    },
    rejected: {
      bg: "#fef2f2",
      color: "#b91c1c",
      border: "#fecaca",
      label: "Rejected",
      Icon: XCircle,
    },
  } satisfies Record<
    TestimonialStatus,
    { bg: string; color: string; border: string; label: string; Icon: React.ElementType }
  >;

  const s = map[status];

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
    >
      <s.Icon className="size-2.5" />
      {s.label}
    </span>
  );
}

// ─── Type badge ───────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: TestimonialType }) {
  return type === "video" ? (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor: "#f5f3ff", color: "#6d28d9", borderColor: "#ddd6fe" }}
    >
      <Video className="size-2.5" />
      Video
    </span>
  ) : (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor: "#f5f5f5", color: "#525252", borderColor: "#e5e5e5" }}
    >
      <FileText className="size-2.5" />
      Text
    </span>
  );
}

// ─── Testimonial card ─────────────────────────────────────────────────────────

function TestimonialCard({
  testimonial,
  index,
  onApprove,
  onReject,
  onDelete,
  onFeature,
}: {
  testimonial: Testimonial;
  index: number;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  onFeature: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const colors = avatarColor(index);

  return (
    <div
      className="relative rounded-2xl border bg-white p-4 transition-all duration-200 hover:shadow-md sm:p-5"
      style={{
        borderColor: testimonial.featured ? "#fecdd3" : "rgba(0,0,0,0.07)",
        boxShadow: testimonial.featured
          ? "0 0 0 1px #fecdd3, 0 2px 8px rgba(232,82,122,0.06)"
          : undefined,
      }}
    >
      {/* Featured pill */}
      {testimonial.featured && (
        <div
          className="absolute top-3.5 right-3.5 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ backgroundColor: "#fff5f7", color: "#e8527a" }}
        >
          <Sparkles className="size-2.5" />
          Featured
        </div>
      )}

      {/* Author row */}
      <div className="mb-3 flex items-start gap-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold select-none"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {testimonial.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] leading-tight font-semibold text-neutral-900">
            {testimonial.author}
          </p>
          <p className="mt-0.5 truncate text-[11px] leading-tight text-neutral-400">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
        {/* Badges — hide on very small, show inline on sm+ */}
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          <StatusBadge status={testimonial.status} />
          <TypeBadge type={testimonial.type} />
        </div>
      </div>

      {/* Mobile badges */}
      <div className="mb-2.5 flex items-center gap-1.5 sm:hidden">
        <StatusBadge status={testimonial.status} />
        <TypeBadge type={testimonial.type} />
      </div>

      {/* Rating */}
      <StarRating rating={testimonial.rating} />

      {/* Content */}
      <p className="mt-2.5 mb-4 line-clamp-3 text-[13px] leading-relaxed text-neutral-600">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <p className="shrink-0 text-[11px] text-neutral-300">
          {new Date(testimonial.submittedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <div className="flex items-center gap-1.5">
          {testimonial.status !== "approved" && (
            <button
              type="button"
              onClick={() => onApprove(testimonial.id)}
              className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all hover:shadow-sm active:scale-95"
              style={{
                backgroundColor: "#f0fdf4",
                color: "#15803d",
                borderColor: "#bbf7d0",
              }}
            >
              <ThumbsUp className="size-2.5" />
              Approve
            </button>
          )}

          {testimonial.status !== "rejected" && (
            <button
              type="button"
              onClick={() => onReject(testimonial.id)}
              className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all hover:shadow-sm active:scale-95"
              style={{
                backgroundColor: "#fef2f2",
                color: "#b91c1c",
                borderColor: "#fecaca",
              }}
            >
              <ThumbsDown className="size-2.5" />
              Reject
            </button>
          )}

          {/* ···  menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((p) => !p)}
              className="flex size-7 items-center justify-center rounded-full border transition-colors hover:bg-neutral-50"
              style={{ borderColor: "rgba(0,0,0,0.09)" }}
              aria-label="More options"
            >
              <MoreHorizontal className="size-3.5 text-neutral-400" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden="true"
                />
                <div
                  className="absolute right-0 bottom-full z-20 mb-1.5 overflow-hidden rounded-xl border shadow-lg"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "rgba(0,0,0,0.09)",
                    minWidth: "158px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onFeature(testimonial.id);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[12px] text-neutral-700 transition-colors hover:bg-neutral-50"
                  >
                    <Sparkles className="size-3 text-neutral-400" />
                    {testimonial.featured ? "Unfeature" : "Mark as featured"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[12px] text-neutral-700 transition-colors hover:bg-neutral-50"
                  >
                    <Eye className="size-3 text-neutral-400" />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[12px] text-neutral-700 transition-colors hover:bg-neutral-50"
                  >
                    <Copy className="size-3 text-neutral-400" />
                    Copy as quote
                  </button>
                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }} />
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(testimonial.id);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[12px] transition-colors hover:bg-red-50"
                    style={{ color: "#b91c1c" }}
                  >
                    <Trash2 className="size-3" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ activeTab }: { activeTab: StatusTab }) {
  const map: Record<StatusTab, { title: string; desc: string }> = {
    all: {
      title: "No testimonials yet",
      desc: "Share your collection link with customers and reviews will appear here — ready to review and approve.",
    },
    pending: {
      title: "No pending reviews",
      desc: "All caught up! New submissions will appear here waiting for your approval.",
    },
    approved: {
      title: "No approved testimonials",
      desc: "Approve testimonials from the Pending tab to display them on your website.",
    },
    rejected: {
      title: "No rejected testimonials",
      desc: "Testimonials you reject will be archived here for reference.",
    },
  };

  const msg = map[activeTab];

  return (
    <div className="col-span-2 flex flex-col items-center justify-center px-6 py-20 text-center">
      <div
        className="mb-4 flex size-14 items-center justify-center rounded-2xl"
        style={{ backgroundColor: "#fff5f7" }}
      >
        <MessageSquareQuote className="size-6" style={{ color: "#e8527a" }} />
      </div>
      <h3 className="mb-1.5 text-[15px] font-semibold text-neutral-900">{msg.title}</h3>
      <p className="mb-6 max-w-xs text-[13px] leading-relaxed text-neutral-400">{msg.desc}</p>
      <button
        type="button"
        className="flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
        style={{ backgroundColor: "#171717" }}
      >
        <Copy className="size-3.5" />
        Copy Collection Link
      </button>
    </div>
  );
}

// ─── Main page component ──────────────────────────────────────────────────────

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(MOCK_TESTIMONIALS);
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [typeFilter, setTypeFilter] = useState<string>("All types");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<string>("Newest first");
  const [sortOpen, setSortOpen] = useState(false);

  // ─── Derived counts
  const counts: Record<StatusTab, number> = {
    all: testimonials.length,
    pending: testimonials.filter((t) => t.status === "pending").length,
    approved: testimonials.filter((t) => t.status === "approved").length,
    rejected: testimonials.filter((t) => t.status === "rejected").length,
  };

  // ─── Handlers
  function handleApprove(id: string) {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "approved" as const } : t)),
    );
  }

  function handleReject(id: string) {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "rejected" as const } : t)),
    );
  }

  function handleDelete(id: string) {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  }

  function handleFeature(id: string) {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, featured: !t.featured } : t)));
  }

  // ─── Filtered + sorted list
  const filtered = testimonials
    .filter((t) => {
      if (activeTab !== "all" && t.status !== activeTab) return false;
      if (typeFilter === "Text" && t.type !== "text") return false;
      if (typeFilter === "Video" && t.type !== "video") return false;
      const q = search.toLowerCase();
      if (
        q &&
        !t.author.toLowerCase().includes(q) &&
        !t.content.toLowerCase().includes(q) &&
        !t.company.toLowerCase().includes(q)
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "Oldest first")
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      if (sort === "Highest rating") return b.rating - a.rating;
      if (sort === "Featured first") return Number(b.featured) - Number(a.featured);
      // Newest first (default)
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });

  return (
    <div className="mx-auto max-w-6xl space-y-5 sm:space-y-6">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Testimonials
          </h1>
          <p className="mt-0.5 text-[13px] text-neutral-400">
            {testimonials.length} total &middot; {counts.pending} pending review
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 self-start rounded-full px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] sm:self-auto"
          style={{ backgroundColor: "#171717" }}
        >
          <Copy className="size-3.5" />
          Copy Collection Link
        </button>
      </div>

      {/* ── Stats strip ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            { label: "Total", value: counts.all, accent: "#e8527a", bg: "#fff5f7" },
            { label: "Pending", value: counts.pending, accent: "#f59e0b", bg: "#fff7ed" },
            { label: "Approved", value: counts.approved, accent: "#16a34a", bg: "#f0fdf4" },
            { label: "Rejected", value: counts.rejected, accent: "#dc2626", bg: "#fef2f2" },
          ] as const
        ).map(({ label, value, accent, bg }) => (
          <div
            key={label}
            className="rounded-2xl border border-neutral-100 px-4 py-3.5 transition-shadow hover:shadow-sm"
            style={{ backgroundColor: bg }}
          >
            <p className="text-2xl leading-none font-bold tracking-tight" style={{ color: accent }}>
              {value}
            </p>
            <p className="mt-1 text-[12px] font-medium text-neutral-500">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Filters bar ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-neutral-100 bg-white p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-neutral-300" />
            <input
              id="testimonials-search"
              type="search"
              placeholder="Search name, company, or content…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border py-2 pr-3 pl-8 text-[13px] transition-all outline-none placeholder:text-neutral-300 focus:ring-2"
              style={{
                borderColor: "rgba(0,0,0,0.1)",
                backgroundColor: "#fafafa",
              }}
            />
          </div>

          {/* Type chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <Filter className="size-3.5 shrink-0 text-neutral-300" />
            {TYPE_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setTypeFilter(f)}
                className="shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-all"
                style={
                  typeFilter === f
                    ? { backgroundColor: "#fff5f7", color: "#e8527a", borderColor: "#fecdd3" }
                    : {
                        backgroundColor: "transparent",
                        color: "#a3a3a3",
                        borderColor: "rgba(0,0,0,0.09)",
                      }
                }
              >
                {f}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setSortOpen((p) => !p)}
              className="flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors hover:bg-neutral-50"
              style={{ borderColor: "rgba(0,0,0,0.09)", color: "#525252" }}
            >
              <SlidersHorizontal className="size-3 text-neutral-400" />
              {sort}
              <ChevronDown className="size-3 text-neutral-300" />
            </button>
            {sortOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setSortOpen(false)}
                  aria-hidden="true"
                />
                <div
                  className="absolute top-full right-0 z-20 mt-1 overflow-hidden rounded-xl border shadow-lg"
                  style={{
                    backgroundColor: "#ffffff",
                    borderColor: "rgba(0,0,0,0.09)",
                    minWidth: "162px",
                  }}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setSort(opt);
                        setSortOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-[12px] transition-colors hover:bg-neutral-50"
                      style={{
                        color: sort === opt ? "#e8527a" : "#525252",
                        fontWeight: sort === opt ? 600 : 400,
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Status tabs ─────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-0.5 overflow-x-auto"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.07)" }}
      >
        {STATUS_TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className="relative shrink-0 px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors"
            style={{ color: activeTab === key ? "#e8527a" : "#a3a3a3" }}
          >
            {label}
            {counts[key] > 0 && (
              <span
                className="ml-1.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold"
                style={
                  activeTab === key
                    ? { backgroundColor: "#fff5f7", color: "#e8527a" }
                    : { backgroundColor: "#f5f5f5", color: "#a3a3a3" }
                }
              >
                {counts[key]}
              </span>
            )}
            {activeTab === key && (
              <span
                className="absolute right-0 bottom-0 left-0 h-[2px] rounded-t-full"
                style={{ backgroundColor: "#e8527a" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Cards grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.length === 0 ? (
          <EmptyState activeTab={activeTab} />
        ) : (
          filtered.map((t, i) => (
            <TestimonialCard
              key={t.id}
              testimonial={t}
              index={i}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
              onFeature={handleFeature}
            />
          ))
        )}
      </div>
    </div>
  );
}
