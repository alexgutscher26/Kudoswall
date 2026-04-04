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
  ExternalLink,
  ChevronRight,
  Palette,
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

  const embedCode = `<script src="https://cdn.testimonialwall.com/widget.js" 
  data-id="ws_abc123" 
  data-layout="${settings.layout}"
  data-theme="${settings.theme}"
  data-accent="${settings.accentColor}"
></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 xl:flex-row">
      {/* ── Left: Settings Panel ────────────────────────────────────────── */}
      <div className="w-full shrink-0 space-y-5 xl:w-[350px]">
        <div className="overflow-hidden rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Settings2 className="size-4 text-neutral-400" />
            <h3 className="text-[15px] font-bold tracking-tight text-neutral-900">
              Widget Options
            </h3>
          </div>

          {/* Layout */}
          <div className="mb-8 space-y-4">
            <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
              Layout Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(["grid", "masonry", "carousel", "bento"] as LayoutType[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setSettings((s) => ({ ...s, layout: l }))}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[12px] font-bold transition-all ${
                    settings.layout === l
                      ? "border-pink-200 bg-pink-50 text-pink-700"
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
          <div className="mb-8 space-y-4">
            <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
              Visual Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["light", "dark", "glass"] as ThemeType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSettings((s) => ({ ...s, theme: t }))}
                  className={`rounded-xl border px-2 py-2 text-[11px] font-bold transition-all ${
                    settings.theme === t
                      ? "border-pink-200 bg-pink-50 text-pink-700"
                      : "border-neutral-100 text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div className="mb-8 space-y-4">
            <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
              Brand Accent
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => setSettings((s) => ({ ...s, accentColor: e.target.value }))}
                className="size-10 cursor-pointer overflow-hidden rounded-full border-0 bg-transparent p-0"
                title="Choose accent color"
              />
              <code className="font-mono text-[12px] font-bold text-neutral-400">
                {settings.accentColor.toUpperCase()}
              </code>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-neutral-700">Show star ratings</span>
              <button
                type="button"
                onClick={() => setSettings((s) => ({ ...s, showRating: !s.showRating }))}
                className={`relative flex h-5 w-9 items-center rounded-full transition-colors ${settings.showRating ? "bg-emerald-500" : "bg-neutral-200"}`}
              >
                <div
                  className={`size-3.5 rounded-full bg-white shadow-sm transition-transform ${settings.showRating ? "translate-x-5" : "translate-x-1"}`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-neutral-700">Rounded corners</span>
              <input
                type="range"
                min="0"
                max="32"
                value={settings.roundCorners}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, roundCorners: parseInt(e.target.value) }))
                }
                className="h-1 w-20 accent-pink-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Center: Preview Panel ───────────────────────────────────────── */}
      <div className="flex-1 space-y-5">
        <div className="relative flex min-h-[500px] flex-col overflow-hidden rounded-[40px] border border-neutral-100 bg-neutral-50 p-2 sm:p-4">
          {/* Dots Background (Custom opacity) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Top Toolbar */}
          <div className="relative z-10 flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode("desktop")}
                className={`rounded-full p-1.5 transition-all ${viewMode === "desktop" ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-600"}`}
              >
                <Monitor className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("mobile")}
                className={`rounded-full p-1.5 transition-all ${viewMode === "mobile" ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-600"}`}
              >
                <Smartphone className="size-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400">
                <Eye className="size-3" /> LIVE PREVIEW
              </span>
            </div>
          </div>

          {/* Widget Canvas */}
          <div className="relative z-10 flex flex-1 items-center justify-center p-4 transition-all duration-500 sm:p-8">
            <div
              className={`transition-all duration-500 ${viewMode === "mobile" ? "w-full max-w-[320px]" : "w-full max-w-3xl"}`}
            >
              <div
                className={`grid gap-4 ${viewMode === "mobile" ? "grid-cols-1" : settings.layout === "grid" ? "grid-cols-2" : settings.layout === "carousel" ? "grid-cols-3" : "grid-cols-2"}`}
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Code Panel ──────────────────────────────────────────── */}
      <div className="w-full shrink-0 space-y-5 xl:w-[350px]">
        <div className="sticky top-6 overflow-hidden rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Code2 className="size-4 text-emerald-500" />
            <h3 className="text-[15px] font-bold text-neutral-900">Embed Code</h3>
          </div>
          <p className="mb-6 text-[12px] leading-relaxed text-neutral-400">
            Paste this line of code anywhere in your HTML, Webflow, or Shopify theme. Your wall will
            load instantly.
          </p>
          <div className="group relative mb-8 rounded-2xl bg-neutral-900 p-4">
            <code className="block font-mono text-[11px] leading-relaxed break-all text-pink-300">
              {embedCode}
            </code>
            <button
              type="button"
              onClick={copyToClipboard}
              className="absolute top-3 right-3 rounded-lg bg-neutral-800 p-2 text-neutral-400 opacity-0 transition-all group-hover:opacity-100 hover:text-white"
            >
              {copied ? (
                <Check className="size-3.5 text-emerald-400" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
              Installation Guides
            </h4>
            <button
              type="button"
              className="group flex w-full items-center justify-between rounded-xl border border-neutral-50 p-3 transition-all hover:bg-neutral-50"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-[10px] font-bold text-emerald-600">
                  Re
                </div>
                <span className="text-[13px] font-bold text-neutral-700">React / Next.js</span>
              </div>
              <ChevronRight className="size-3.5 text-neutral-300 group-hover:text-neutral-500" />
            </button>
            <button
              type="button"
              className="group flex w-full items-center justify-between rounded-xl border border-neutral-50 p-3 transition-all hover:bg-neutral-50"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-blue-50 text-[10px] font-bold text-blue-600">
                  Wf
                </div>
                <span className="text-[13px] font-bold text-neutral-700">Webflow</span>
              </div>
              <ChevronRight className="size-3.5 text-neutral-300 group-hover:text-neutral-500" />
            </button>
            <button
              type="button"
              className="group flex w-full items-center justify-between rounded-xl border border-neutral-50 p-3 transition-all hover:bg-neutral-50"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-pink-50 text-[10px] font-bold text-pink-600">
                  Sh
                </div>
                <span className="text-[13px] font-bold text-neutral-700">Shopify</span>
              </div>
              <ChevronRight className="size-3.5 text-neutral-300 group-hover:text-neutral-500" />
            </button>
          </div>

          <div className="mt-8 border-t border-neutral-50 pt-6">
            <a
              href="#"
              className="flex items-center justify-center gap-2 text-[12px] font-bold text-neutral-400 transition-colors hover:text-neutral-900"
            >
              <HelpCircle className="size-3.5" />
              Need help embedding?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
