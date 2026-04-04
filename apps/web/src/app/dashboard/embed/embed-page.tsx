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
      className={`p-4 transition-all duration-300 border ${
        isDark
          ? "bg-neutral-900 border-neutral-800 text-white"
          : isGlass
          ? "bg-white/40 backdrop-blur-md border-white/40 text-neutral-900 shadow-sm"
          : "bg-white border-neutral-100 text-neutral-900 shadow-sm"
      }`}
      style={{ borderRadius: `${settings.roundCorners}px` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${
            isDark ? "bg-neutral-800 text-white" : "bg-neutral-100 text-neutral-500"
          }`}
        >
          {testimonial.author.charAt(0)}
        </div>
        <div>
          <p className="text-[12px] font-bold leading-none">{testimonial.author}</p>
          <p className={`text-[10px] mt-0.5 ${isDark ? "text-neutral-500" : "text-neutral-400"}`}>
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
      {settings.showRating && (
        <div className="flex gap-0.5 mb-2">
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
      <p className={`text-[12px] leading-relaxed ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
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
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-6">
        
        {/* ── Left: Settings Panel ────────────────────────────────────────── */}
        <div className="w-full xl:w-[350px] space-y-5 shrink-0">
          <div className="bg-white rounded-3xl border border-neutral-100 p-6 overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Settings2 className="size-4 text-neutral-400" />
              <h3 className="text-[15px] font-bold text-neutral-900 tracking-tight">Widget Options</h3>
            </div>

            {/* Layout */}
            <div className="space-y-4 mb-8">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Layout Style</label>
              <div className="grid grid-cols-2 gap-2">
                {(["grid", "masonry", "carousel", "bento"] as LayoutType[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, layout: l }))}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-[12px] font-bold ${
                      settings.layout === l ? "border-pink-200 bg-pink-50 text-pink-700" : "border-neutral-100 hover:bg-neutral-50 text-neutral-600"
                    }`}
                  >
                    <LayoutIcon type={l} active={settings.layout === l} />
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div className="space-y-4 mb-8">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Visual Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {(["light", "dark", "glass"] as ThemeType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, theme: t }))}
                    className={`px-2 py-2 rounded-xl border transition-all text-[11px] font-bold ${
                      settings.theme === t ? "border-pink-200 bg-pink-50 text-pink-700" : "border-neutral-100 hover:bg-neutral-50 text-neutral-500"
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-4 mb-8">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Brand Accent</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => setSettings((s) => ({ ...s, accentColor: e.target.value }))}
                  className="size-10 rounded-full border-0 cursor-pointer overflow-hidden p-0 bg-transparent"
                  title="Choose accent color"
                />
                <code className="text-[12px] font-mono font-bold text-neutral-400">{settings.accentColor.toUpperCase()}</code>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-neutral-700">Show star ratings</span>
                <button
                  type="button"
                  onClick={() => setSettings((s) => ({ ...s, showRating: !s.showRating }))}
                  className={`relative w-9 h-5 rounded-full transition-colors flex items-center ${settings.showRating ? "bg-emerald-500" : "bg-neutral-200"}`}
                >
                  <div className={`size-3.5 rounded-full bg-white shadow-sm transition-transform ${settings.showRating ? "translate-x-5" : "translate-x-1"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-neutral-700">Rounded corners</span>
                <input
                  type="range"
                  min="0"
                  max="32"
                  value={settings.roundCorners}
                  onChange={(e) => setSettings((s) => ({ ...s, roundCorners: parseInt(e.target.value) }))}
                  className="w-20 accent-pink-500 h-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Center: Preview Panel ───────────────────────────────────────── */}
        <div className="flex-1 space-y-5">
          <div className="bg-neutral-50 rounded-[40px] border border-neutral-100 p-2 sm:p-4 min-h-[500px] flex flex-col relative overflow-hidden">
            
            {/* Dots Background (Custom opacity) */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 relative z-10">
              <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-neutral-200 shadow-sm">
                <button
                  type="button"
                  onClick={() => setViewMode("desktop")}
                  className={`p-1.5 rounded-full transition-all ${viewMode === "desktop" ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-600"}`}
                >
                  <Monitor className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("mobile")}
                  className={`p-1.5 rounded-full transition-all ${viewMode === "mobile" ? "bg-neutral-100 text-neutral-900" : "text-neutral-400 hover:text-neutral-600"}`}
                >
                  <Smartphone className="size-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1.5">
                  <Eye className="size-3" /> LIVE PREVIEW
                </span>
              </div>
            </div>

            {/* Widget Canvas */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10 transition-all duration-500">
              <div className={`transition-all duration-500 ${viewMode === "mobile" ? "max-w-[320px] w-full" : "w-full max-w-3xl"}`}>
                <div className={`grid gap-4 ${viewMode === "mobile" ? "grid-cols-1" : settings.layout === "grid" ? "grid-cols-2" : settings.layout === "carousel" ? "grid-cols-3" : "grid-cols-2"}`}>
                  {MOCK_TESTIMONIALS.map((t, i) => (
                    <div key={t.author} className={settings.layout === "carousel" && i > 0 && viewMode === "mobile" ? "hidden" : ""}>
                      <PreviewCard testimonial={t} settings={settings} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Code Panel ──────────────────────────────────────────── */}
        <div className="w-full xl:w-[350px] space-y-5 shrink-0">
          <div className="bg-white rounded-3xl border border-neutral-100 p-6 shadow-sm overflow-hidden sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="size-4 text-emerald-500" />
              <h3 className="text-[15px] font-bold text-neutral-900">Embed Code</h3>
            </div>
            <p className="text-[12px] text-neutral-400 leading-relaxed mb-6">
              Paste this line of code anywhere in your HTML, Webflow, or Shopify theme. Your wall will load instantly.
            </p>
            <div className="bg-neutral-900 rounded-2xl p-4 relative group mb-8">
              <code className="text-[11px] font-mono text-pink-300 leading-relaxed break-all block">
                {embedCode}
              </code>
              <button
                type="button"
                onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Installation Guides</h4>
              <button
                type="button"
                className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-50 hover:bg-neutral-50 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-lg bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-600">Re</div>
                  <span className="text-[13px] font-bold text-neutral-700">React / Next.js</span>
                </div>
                <ChevronRight className="size-3.5 text-neutral-300 group-hover:text-neutral-500" />
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-50 hover:bg-neutral-50 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-lg bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600">Wf</div>
                  <span className="text-[13px] font-bold text-neutral-700">Webflow</span>
                </div>
                <ChevronRight className="size-3.5 text-neutral-300 group-hover:text-neutral-500" />
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-50 hover:bg-neutral-50 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-lg bg-pink-50 flex items-center justify-center text-[10px] font-bold text-pink-600">Sh</div>
                  <span className="text-[13px] font-bold text-neutral-700">Shopify</span>
                </div>
                <ChevronRight className="size-3.5 text-neutral-300 group-hover:text-neutral-500" />
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-50">
              <a
                href="#"
                className="flex items-center justify-center gap-2 text-[12px] font-bold text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <HelpCircle className="size-3.5" />
                Need help embedding?
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
