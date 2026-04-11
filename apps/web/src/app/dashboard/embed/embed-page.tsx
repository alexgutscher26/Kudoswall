"use client";

import { useState } from "react";
import {
  Code2,
  Copy,
  LayoutGrid,
  Columns,
  GalleryHorizontal,
  LayoutTemplate,
  Monitor,
  Smartphone,
  Check,
  ChevronRight,
  Eye,
  Settings2,
  HelpCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LayoutType = "grid" | "masonry" | "carousel" | "bento";
type ThemeType = "light" | "dark" | "glass";

interface WidgetSettings {
  layout: LayoutType;
  theme: ThemeType;
  accentColor: string;
  showRating: boolean;
  showDate: boolean;
  enableAnimation: boolean;
  roundCorners: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_TESTIMONIALS = [
  {
    author: "Sarah Chen",
    role: "Head of Marketing",
    company: "Acme Corp",
    avatar: "SC",
    content: "Embed-a-Testimonial completely transformed how we collect and display social proof.",
    rating: 5,
  },
  {
    author: "James Okafor",
    role: "Founder",
    company: "LaunchPad SaaS",
    avatar: "JO",
    content: "The best testimonial tool we've used in 5 years. Clean, fast, and simple.",
    rating: 5,
  },
  {
    author: "Priya Anand",
    role: "CX Lead",
    company: "Bloom Studio",
    avatar: "PA",
    content: "Honestly impressed. The embed widget is beautiful and looks native.",
    rating: 4,
  },
];

// ─── Layout Icon Helpers ───────────────────────────────────────────────────────

function LayoutIcon({ type, active }: { type: LayoutType; active: boolean }) {
  const iconProps = { className: `size-4 ${active ? "text-pink-600" : "text-neutral-400"}` };
  const icons = {
    grid: <LayoutGrid {...iconProps} />,
    masonry: <Columns {...iconProps} />,
    carousel: <GalleryHorizontal {...iconProps} />,
    bento: <LayoutTemplate {...iconProps} />,
  };
  return icons[type];
}

// ─── Widget Card Preview ──────────────────────────────────────────────────────

function PreviewCard({
  testimonial,
  settings,
}: {
  testimonial: (typeof MOCK_TESTIMONIALS)[0];
  settings: WidgetSettings;
}) {
  const isDark = settings.theme === "dark";
  const isGlass = settings.theme === "glass";

  return (
    <div
      className={`border p-4 transition-all duration-300 ${
        isDark
          ? "border-neutral-800 bg-neutral-900 text-white"
          : isGlass
            ? "border-white/40 bg-white/40 text-neutral-900 shadow-sm backdrop-blur-md"
            : "border-neutral-100 bg-white text-neutral-900 shadow-sm"
      }`}
      style={{ borderRadius: `${settings.roundCorners}px` }}
    >
      <div className="mb-3 flex items-center gap-2">
        <div
          className={`flex size-8 items-center justify-center rounded-full text-xs font-bold ${
            isDark ? "bg-neutral-800 text-white" : "bg-neutral-100 text-neutral-500"
          }`}
        >
          {testimonial.author.charAt(0)}
        </div>
        <div>
          <p className="text-[12px] leading-none font-bold">{testimonial.author}</p>
          <p className={`mt-0.5 text-[10px] ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
      {settings.showRating && (
        <div className="mb-2 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`text-[10px] ${i < testimonial.rating ? "" : "text-neutral-300"}`}
              style={{ color: i < testimonial.rating ? settings.accentColor : undefined }}
            >
              ★
            </span>
          ))}
        </div>
      )}
      <p
        className={`text-[12px] leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}
      >
        &ldquo;{testimonial.content}&rdquo;
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EmbedPage() {
  const [settings, setSettings] = useState<WidgetSettings>({
    layout: "grid",
    theme: "light",
    accentColor: "#e8527a",
    showRating: true,
    showDate: true,
    enableAnimation: true,
    roundCorners: 16,
  });
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  const embedCode = `<script src="${typeof window !== "undefined" ? window.location.origin : "https://kudoswall.org"}/widget.js" 
  data-id="5475dd90-24ad-49b3-99a1-609c939ae199" 
  async
></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 xl:flex-row">
      <div className="w-full shrink-0 space-y-6 lg:sticky lg:top-8 xl:w-[320px]">
        {/* Left: Settings Panel */}
        <div className="overflow-hidden rounded-[32px] border border-neutral-100 bg-white p-6 shadow-sm">
          <div className="mb-8 flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-pink-50 text-pink-500">
              <Settings2 className="size-4" />
            </div>
            <h3 className="text-[15px] font-bold tracking-tight text-neutral-900">
              Widget Options
            </h3>
          </div>

          <div className="space-y-10">
            {/* Layout */}
            <div className="space-y-4">
              <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                Layout Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["grid", "masonry", "carousel", "bento"] as LayoutType[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, layout: l }))}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-[12px] font-bold transition-all ${
                      settings.layout === l
                        ? "border-pink-200 bg-pink-50 text-pink-700 shadow-sm shadow-pink-100/50"
                        : "border-neutral-100 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <LayoutIcon type={l} active={settings.layout === l} />
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div className="space-y-4">
              <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                Visual Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["light", "dark", "glass"] as ThemeType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, theme: t }))}
                    className={`rounded-xl border px-2 py-2.5 text-[11px] font-bold transition-all ${
                      settings.theme === t
                        ? "border-pink-200 bg-pink-50 text-pink-700 shadow-sm shadow-pink-100/50"
                        : "border-neutral-100 text-neutral-500 hover:bg-neutral-50"
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-4">
              <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                Brand Accent
              </label>
              <div className="flex items-center gap-3">
                <div className="group/color relative">
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => setSettings((s) => ({ ...s, accentColor: e.target.value }))}
                    className="size-11 cursor-pointer overflow-hidden rounded-xl border-2 border-white bg-transparent p-0 shadow-sm"
                    title="Choose accent color"
                  />
                </div>
                <code className="font-mono text-[12px] font-bold text-neutral-400">
                  {settings.accentColor.toUpperCase()}
                </code>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-6 border-t border-neutral-50 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-neutral-700">Show star ratings</span>
                <button
                  type="button"
                  onClick={() => setSettings((s) => ({ ...s, showRating: !s.showRating }))}
                  className={`relative flex h-5 w-10 items-center rounded-full transition-all duration-300 ${settings.showRating ? "bg-emerald-500" : "bg-neutral-200"}`}
                >
                  <div
                    className={`size-3.5 rounded-full bg-white shadow-md transition-all duration-300 ${settings.showRating ? "translate-x-5.5" : "translate-x-1"}`}
                  />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-neutral-700">Rounded corners</span>
                  <span className="font-mono text-[11px] font-bold text-neutral-400">
                    {settings.roundCorners}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={settings.roundCorners}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, roundCorners: parseInt(e.target.value) }))
                  }
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-100 accent-pink-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace: Preview + Code Tabs */}
      <div className="flex-1 space-y-6">
        {/* Workspace Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1 overflow-hidden rounded-2xl bg-neutral-100 p-1.5">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2 text-[13px] font-bold transition-all ${
                activeTab === "preview"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <Eye className="size-4" />
              Live Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2 text-[13px] font-bold transition-all ${
                activeTab === "code"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <Code2 className="size-4" />
              Embed Code
            </button>
          </div>

          {activeTab === "preview" && (
            <div className="flex items-center gap-1 rounded-2xl bg-neutral-100 p-1.5">
              <button
                type="button"
                onClick={() => setViewMode("desktop")}
                className={`rounded-xl p-2 transition-all ${viewMode === "desktop" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-600"}`}
              >
                <Monitor className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("mobile")}
                className={`rounded-xl p-2 transition-all ${viewMode === "mobile" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-600"}`}
              >
                <Smartphone className="size-4" />
              </button>
            </div>
          )}
        </div>

        {activeTab === "preview" ? (
          <div className="relative flex min-h-[650px] flex-col overflow-hidden rounded-[48px] border border-neutral-100 bg-neutral-50/50 p-4 sm:p-8">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(0,0,0,0.1) 1.5px, transparent 1.5px)",
                backgroundSize: "32px 32px",
              }}
            />

            <div className="relative z-10 flex flex-1 items-center justify-center p-4 transition-all duration-500">
              <div
                className={`transition-all duration-500 ${viewMode === "mobile" ? "w-full max-w-[375px]" : "w-full max-w-5xl"}`}
              >
                <div
                  className={`grid gap-6 ${viewMode === "mobile" ? "grid-cols-1" : settings.layout === "grid" ? "grid-cols-2 lg:grid-cols-3" : settings.layout === "carousel" ? "grid-cols-3 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-3"}`}
                >
                  {MOCK_TESTIMONIALS.map((t, i) => (
                    <div
                      key={t.author}
                      className={
                        settings.layout === "carousel" && i > 0 && viewMode === "mobile"
                          ? "hidden"
                          : ""
                      }
                    >
                      <PreviewCard testimonial={t} settings={settings} />
                    </div>
                  ))}
                  {/* Duplicate items for a fuller preview in the expanded space */}
                  {viewMode === "desktop" &&
                    MOCK_TESTIMONIALS.map((t, i) => (
                      <div key={t.author + i}>
                        <PreviewCard testimonial={t} settings={settings} />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            <div className="rounded-[32px] border border-neutral-100 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Get your code</h3>
                  <p className="mt-1 text-[13px] text-neutral-500">
                    Add this to your site's HTML to start showing testimonials.
                  </p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-[13px] font-bold transition-all ${
                    copied
                      ? "bg-emerald-500 text-white"
                      : "bg-pink-500 text-white shadow-lg shadow-pink-100 hover:bg-pink-600"
                  }`}
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-neutral-900 p-6">
                <code className="block font-mono text-[13px] leading-loose text-pink-300">
                  {embedCode}
                </code>
              </div>

              <div className="mt-12">
                <h4 className="mb-6 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                  Installation Guides
                </h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      name: "React / Next.js",
                      icon: "Re",
                      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
                    },
                    {
                      name: "Webflow",
                      icon: "Wf",
                      color: "bg-blue-50 text-blue-600 border-blue-100",
                    },
                    {
                      name: "Shopify",
                      icon: "Sh",
                      color: "bg-pink-50 text-pink-600 border-pink-100",
                    },
                  ].map((guide) => (
                    <button
                      key={guide.name}
                      type="button"
                      className="group flex flex-col gap-4 rounded-[24px] border border-neutral-100 p-5 transition-all hover:border-pink-200 hover:bg-pink-50/30"
                    >
                      <div
                        className={`flex size-10 items-center justify-center rounded-xl border text-[11px] font-bold ${guide.color}`}
                      >
                        {guide.icon}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-bold text-neutral-800">{guide.name}</span>
                        <ChevronRight className="size-4 text-neutral-300 group-hover:text-pink-500" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[32px] border border-neutral-100 bg-neutral-50/50 p-6">
                <HelpCircle className="mb-4 size-6 text-pink-500" />
                <h4 className="mb-2 font-bold text-neutral-900">Need help?</h4>
                <p className="text-[13px] leading-relaxed text-neutral-500">
                  Can't figure out how to add the code to your site? Check our detailed
                  documentation or reach out to support.
                </p>
                <a href="#" className="mt-4 block font-bold text-neutral-900 hover:text-pink-600">
                  View Documentation →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
