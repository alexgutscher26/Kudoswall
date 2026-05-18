"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Code2,
  Copy,
  LayoutGrid,
  Columns,
  GalleryHorizontal,
  Monitor,
  Smartphone,
  Check,
  Eye,
  Sparkles,
  Filter,
  Palette,
  Layout,
  Image as ImageIcon,
  Zap,
  ArrowRight,
  Save,
  Loader2,
  Type,
  MoreHorizontal,
  Lock,
  Terminal,
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import { gooeyToast as toast } from "goey-toast";
import { UploadButton } from "@/utils/uploadthing";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import Widget from "@/components/widget";

// ─── Types ────────────────────────────────────────────────────────────────────

type LayoutType = "grid" | "masonry" | "carousel" | "bento";
type ThemeType = "light" | "dark" | "auto";

export interface WidgetSettings {
  layout: LayoutType;
  theme: ThemeType;
  maxItems: number;
  showRating: boolean;

  // Pro
  carouselAutoAdvance: boolean;
  carouselInterval: number;
  carouselShowArrows: boolean;
  columnsOverride: number | null;
  cardBorderRadius: "none" | "small" | "large" | "pill";
  cardShadow: "none" | "subtle" | "medium";
  showReviewerPhoto: boolean;
  showReviewerCompany: boolean;
  showDate: boolean;
  truncateText: "off" | 150 | 250;

  // Filtering
  filterTags: string[];
  filterMinRating: number;
  filterType: "all" | "text" | "video";
  pinTopTestimonials?: boolean;

  // Branding
  accentColor: string;
  backgroundColor: string;
  textColor: string | null;
  hideBadge: boolean;

  // Advanced
  locale: string;
  animation: "fade" | "none";
  fontFamily: string;
  customFontUrl?: string;
  customFontName?: string;

  // Header
  headerTitle: string;
  headerRating: number;
  headerReviewCount: number;
  headerAutoStats: boolean;
  hideHeader: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function WidgetCustomizer({
  widgetId,
  workspaceId,
  initialSettings,
  initialCustomCss,
  isPro,
}: {
  widgetId: string;
  workspaceId: string;
  initialSettings: Partial<WidgetSettings>;
  initialCustomCss?: string | null;
  isPro: boolean;
}) {
  const router = useRouter();
  const [settings, setSettings] = useState<WidgetSettings>({
    layout: "grid",
    theme: "light",
    maxItems: 20,
    showRating: true,
    carouselAutoAdvance: false,
    carouselInterval: 5000,
    carouselShowArrows: true,
    columnsOverride: null,
    cardBorderRadius: "small", // Corrected default to match marketing
    cardShadow: "subtle",
    showReviewerPhoto: true,
    showReviewerCompany: true,
    showDate: true,
    truncateText: "off",
    filterTags: [],
    filterMinRating: 0,
    filterType: "all",
    pinTopTestimonials: true,
    accentColor: "#e8527a",
    backgroundColor: "transparent",
    textColor: null,
    hideBadge: false,
    locale: "en",
    animation: "fade",
    fontFamily: "sans",
    headerTitle: "What our customers say",
    headerRating: 4.9,
    headerReviewCount: 128,
    headerAutoStats: true,
    hideHeader: false,
    ...initialSettings,
  });
  const [customCss, setCustomCss] = useState(initialCustomCss || "");

  const [activeTab, setActiveTab] = useState<"layout" | "display" | "filtering" | "branding">(
    "layout",
  );

  const { data: tags } = useQuery(trpc.tag.list.queryOptions());

  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [previewTab, setPreviewTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const updateWidget = useMutation(
    trpc.widget.update.mutationOptions({
      onSuccess: () => {
        toast.success("Settings saved");
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : String(err));
      },
    }),
  );

  const handleSave = () => {
    updateWidget.mutate({
      id: widgetId,
      settings: settings,
      customCss,
    });
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Dynamically load the Google Font or Custom Font in the customizer preview whenever fontFamily changes.
  useEffect(() => {
    const { fontFamily, customFontUrl } = settings;
    if (!fontFamily) return;

    if (fontFamily === "custom" && customFontUrl) {
      const linkId = "kudos-custom-font";
      let style = document.getElementById(linkId) as HTMLStyleElement;
      if (!style) {
        style = document.createElement("style");
        style.id = linkId;
        document.head.appendChild(style);
      }
      style.innerHTML = `
        @font-face {
          font-family: 'CustomFont';
          src: url('${customFontUrl}') format('woff2');
          font-weight: 300 900;
          font-style: normal;
          font-display: swap;
        }
      `;
      return;
    }

    if (["sans", "serif", "mono"].includes(fontFamily)) return;
    const linkId = `kudos-preview-font-${fontFamily.replace(/\s+/g, "-")}`.toLowerCase();
    if (document.getElementById(linkId)) return; // already injected
    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800;900&display=swap`;
    document.head.appendChild(link);
  }, [settings.fontFamily, settings.customFontUrl]);

  const embedCode = `<script src="${origin || "https://kudoswall.org"}/widget.js" 
  data-id="${widgetId}" 
  async
></script>`;

  // Mock for preview
  const MOCK_DATA = [
    {
      id: "1",
      authorName: "Jordan K.",
      authorTagline: "Customer",
      authorCompany: "Acme Labs",
      content:
        "Absolutely love this product. The quality is outstanding and shipping was super fast! Changed my business completely.",
      rating: 5,
      createdAt: new Date(),
      type: "text" as const,
      authorImage: "",
    },
    {
      id: "2",
      authorName: "Aisha M.",
      authorTagline: "Verified buyer",
      authorCompany: "Stellar Design",
      content: "Clean, fast, and simple. Exactly what we needed for our marketing site.",
      rating: 5,
      createdAt: new Date(),
      type: "video" as const,
      authorImage: "",
    },
    {
      id: "3",
      authorName: "Tom B.",
      authorTagline: "Founder",
      authorCompany: "LaunchPad",
      content: "Best purchase this year. The support team is also incredibly responsive.",
      rating: 5,
      createdAt: new Date(),
      type: "text" as const,
      authorImage: "",
    },
    {
      id: "4",
      authorName: "Sarah J.",
      authorTagline: "Product Manager",
      authorCompany: "TechFlow",
      content: "The interface is so intuitive. We were up and running in minutes.",
      rating: 5,
      createdAt: new Date(),
      type: "text" as const,
      authorImage: "",
    },
    {
      id: "5",
      authorName: "Michael R.",
      authorTagline: "Software Engineer",
      authorCompany: "DevOps Inc",
      content: "Robust API and great documentation. Highly recommended for developers.",
      rating: 4,
      createdAt: new Date(),
      type: "text" as const,
      authorImage: "",
    },
    {
      id: "6",
      authorName: "Elena V.",
      authorTagline: "Marketing Director",
      authorCompany: "Creative co",
      content:
        "Our conversion rate jumped by 20% after adding these testimonials to our landing page.",
      rating: 5,
      createdAt: new Date(),
      type: "text" as const,
      authorImage: "",
    },
  ];

  const ProBadge = () => (
    <span className="ml-auto flex items-center gap-1 rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-bold text-pink-600">
      <Sparkles className="size-2.5" />
      PRO
    </span>
  );

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Sidebar: Controls */}
      <div className="w-full shrink-0 space-y-6 lg:sticky lg:top-8 lg:w-[360px]">
        <div className="overflow-hidden rounded-[32px] border border-neutral-100 bg-white shadow-sm">
          {/* Tabs header */}
          <div className="flex border-b border-neutral-50 px-2 pt-2">
            {[
              { id: "layout", icon: Layout, label: "Layout" },
              { id: "display", icon: Eye, label: "Display" },
              { id: "filtering", icon: Filter, label: "Filter" },
              { id: "branding", icon: Palette, label: "Brand" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-1 flex-col items-center gap-1 pt-4 pb-3 text-[10px] font-bold tracking-wider uppercase transition-all ${
                  activeTab === tab.id ? "text-pink-500" : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                <tab.icon
                  className={`size-4 ${activeTab === tab.id ? "text-pink-500" : "text-neutral-300"}`}
                />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 h-0.5 w-6 rounded-full bg-pink-500" />
                )}
              </button>
            ))}
          </div>

          <div className="scrollbar-hide max-h-[60vh] overflow-y-auto p-6">
            {activeTab === "layout" && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Layout Style
                  </label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {[
                      { id: "grid", icon: LayoutGrid, label: "Grid", pro: false },
                      { id: "masonry", icon: Columns, label: "Masonry", pro: true },
                      { id: "bento", icon: Layout, label: "Bento", pro: true },
                      { id: "carousel", icon: GalleryHorizontal, label: "Carousel", pro: true },
                    ].map((l) => (
                      <button
                        key={l.id}
                        disabled={l.pro && !isPro}
                        onClick={() => setSettings((s) => ({ ...s, layout: l.id as any }))}
                        className={`flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all ${
                          settings.layout === l.id
                            ? "border-pink-200 bg-pink-50 text-pink-600 shadow-sm"
                            : "border-neutral-100 text-neutral-500 hover:bg-neutral-50"
                        } ${l.pro && !isPro ? "cursor-not-allowed opacity-50 grayscale" : ""}`}
                      >
                        <l.icon className="size-5" />
                        <span className="text-[10px] font-bold uppercase">{l.label}</span>
                        {l.pro && !isPro && <Zap className="size-3 text-pink-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {settings.layout === "carousel" && isPro && (
                  <div className="space-y-6 border-t border-neutral-50 pt-6">
                    {/* Toggles */}
                    <div className="space-y-4">
                      <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-neutral-700">
                        <input
                          type="checkbox"
                          checked={settings.carouselAutoAdvance}
                          className="size-4 rounded border-neutral-300 text-pink-600 focus:ring-pink-500"
                          onChange={(e) =>
                            setSettings((s) => ({ ...s, carouselAutoAdvance: e.target.checked }))
                          }
                        />
                        Auto-advance slides
                      </label>
                      <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-neutral-700">
                        <input
                          type="checkbox"
                          checked={settings.carouselShowArrows ?? true}
                          className="size-4 rounded border-neutral-300 text-pink-600 focus:ring-pink-500"
                          onChange={(e) =>
                            setSettings((s) => ({ ...s, carouselShowArrows: e.target.checked }))
                          }
                        />
                        Show navigation arrows
                      </label>
                    </div>

                    {/* Interval */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-neutral-400 uppercase">
                          Auto-advance Interval
                        </span>
                        <span className="text-[11px] font-bold text-neutral-900">
                          {settings.carouselInterval / 1000}s
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {[3000, 5000, 8000].map((v) => (
                          <button
                            key={v}
                            onClick={() => setSettings((s) => ({ ...s, carouselInterval: v }))}
                            className={`flex-1 rounded-lg border py-1.5 text-[10px] font-bold transition-all ${
                              settings.carouselInterval === v
                                ? "border-pink-200 bg-pink-50 text-pink-600 shadow-sm"
                                : "border-neutral-100 text-neutral-500 hover:bg-neutral-50"
                            }`}
                          >
                            {v / 1000}s
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {settings.layout === "carousel" && !isPro && (
                  <div className="mt-6 rounded-2xl border border-pink-100 bg-pink-50/50 p-4 text-center">
                    <Zap className="mx-auto mb-2 size-5 text-pink-500" />
                    <p className="text-[12px] font-bold text-pink-600">
                      Carousel Layout is a Pro Feature
                    </p>
                    <p className="mt-1 text-[10px] text-pink-400">
                      Upgrade to customize carousel settings
                    </p>
                  </div>
                )}

                <div className="space-y-4 border-t border-neutral-50 pt-6">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                      Responsive Columns
                    </label>
                    {!isPro && <Zap className="size-3 text-pink-400" />}
                  </div>
                  <div className="flex gap-2">
                    {[null, 1, 2, 3].map((v) => (
                      <button
                        key={v?.toString() ?? "auto"}
                        disabled={!isPro}
                        onClick={() => setSettings((s) => ({ ...s, columnsOverride: v }))}
                        className={`flex-1 rounded-xl border py-2 text-[11px] font-bold transition-all ${settings.columnsOverride === v ? "border-pink-200 bg-pink-50 text-pink-600" : "border-neutral-100 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"} ${!isPro ? "opacity-50" : ""}`}
                      >
                        {v === null ? "Auto" : `${v} ${v === 1 ? "Col" : "Cols"}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "display" && (
              <div className="space-y-6">
                {[
                  { key: "showRating" as const, label: "Show star ratings", pro: false },
                  { key: "showReviewerPhoto" as const, label: "Show reviewer photo", pro: true },
                  { key: "showReviewerCompany" as const, label: "Show company info", pro: true },
                  { key: "showDate" as const, label: "Show submission date", pro: true },
                  {
                    key: "hideHeader" as const,
                    label: "Hide widget header",
                    pro: false,
                    invert: true,
                  },
                ].map((field) => (
                  <div key={field.key} className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-neutral-700">{field.label}</span>
                    <div className="flex items-center gap-2">
                      {field.pro && !isPro && <Zap className="size-3 text-pink-400" />}
                      <button
                        type="button"
                        disabled={field.pro && !isPro}
                        onClick={() =>
                          setSettings((s) => ({
                            ...s,
                            [field.key]: !s[field.key as keyof WidgetSettings],
                          }))
                        }
                        className={`relative flex h-5 w-10 items-center rounded-full transition-all duration-300 ${field.invert ? !settings[field.key as keyof WidgetSettings] : settings[field.key as keyof WidgetSettings] ? "bg-emerald-500" : "bg-neutral-200"} ${field.pro && !isPro ? "opacity-50" : ""}`}
                      >
                        <div
                          className={`size-3.5 rounded-full bg-white shadow-md transition-all duration-300 ${(field.invert ? !settings[field.key as keyof WidgetSettings] : settings[field.key as keyof WidgetSettings]) ? "translate-x-5.5" : "translate-x-1"}`}
                        />
                      </button>
                    </div>
                  </div>
                ))}

                {!settings.hideHeader && (
                  <div className="space-y-4 border-t border-neutral-50 pt-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                        Header Title
                      </label>
                      <input
                        type="text"
                        value={settings.headerTitle}
                        onChange={(e) =>
                          setSettings((s) => ({ ...s, headerTitle: e.target.value }))
                        }
                        className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-2 text-[13px] focus:border-pink-200 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                          Rating
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={settings.headerRating}
                          onChange={(e) =>
                            setSettings((s) => ({ ...s, headerRating: Number(e.target.value) }))
                          }
                          className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-2 text-[13px] focus:border-pink-200 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                          Reviews
                        </label>
                        <input
                          type="number"
                          value={settings.headerReviewCount}
                          onChange={(e) =>
                            setSettings((s) => ({
                              ...s,
                              headerReviewCount: Number(e.target.value),
                            }))
                          }
                          className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-2 text-[13px] focus:border-pink-200 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-dotted border-neutral-100 pt-4">
                      <div className="space-y-0.5">
                        <span className="text-[13px] font-medium text-neutral-700">
                          Auto calculate stats
                        </span>
                        <p className="text-[11px] text-neutral-400">
                          Use real rating/count from testimonials
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSettings((s) => ({
                            ...s,
                            headerAutoStats: !s.headerAutoStats,
                          }))
                        }
                        className={`relative flex h-5 w-10 items-center rounded-full transition-all duration-300 ${settings.headerAutoStats ? "bg-emerald-500" : "bg-neutral-200"}`}
                      >
                        <div
                          className={`size-3.5 rounded-full bg-white shadow-md transition-all duration-300 ${settings.headerAutoStats ? "translate-x-5.5" : "translate-x-1"}`}
                        />
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3 border-t border-neutral-50 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase">
                      Card Rounding
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {["none", "small", "large", "pill"].map((v) => (
                      <button
                        key={v}
                        disabled={!isPro && v !== "small"}
                        onClick={() => setSettings((s) => ({ ...s, cardBorderRadius: v as any }))}
                        className={`flex-1 rounded-lg border py-1.5 text-[10px] font-bold ${settings.cardBorderRadius === v ? "border-pink-200 bg-pink-50 text-pink-600 shadow-sm" : "border-neutral-100 text-neutral-500"} ${!isPro && v !== "small" ? "opacity-30" : ""}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Shadow */}
                <div className="space-y-3 border-t border-neutral-50 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase">
                      Card Shadow
                    </span>
                    {!isPro && <Zap className="size-3 text-pink-400" />}
                  </div>
                  <div className="flex gap-2">
                    {["none", "subtle", "medium"].map((v) => (
                      <button
                        key={v}
                        disabled={!isPro}
                        onClick={() => setSettings((s) => ({ ...s, cardShadow: v as any }))}
                        className={`flex-1 rounded-lg border py-1.5 text-[10px] font-bold transition-all ${settings.cardShadow === v ? "border-pink-200 bg-pink-50 text-pink-600 shadow-sm" : "border-neutral-100 text-neutral-500"} ${!isPro ? "opacity-30" : ""}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Truncation */}
                <div className="space-y-3 border-t border-neutral-50 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase">
                      Text Limit
                    </span>
                    {!isPro && <Zap className="size-3 text-pink-400" />}
                  </div>
                  <div className="flex gap-2">
                    {[
                      { id: "off", label: "None" },
                      { id: 150, label: "150ch" },
                      { id: 250, label: "250ch" },
                    ].map((v) => (
                      <button
                        key={v.id}
                        disabled={!isPro}
                        onClick={() => setSettings((s) => ({ ...s, truncateText: v.id as any }))}
                        className={`flex-1 rounded-lg border py-1.5 text-[10px] font-bold transition-all ${settings.truncateText === v.id ? "border-pink-200 bg-pink-50 text-pink-600 shadow-sm" : "border-neutral-100 text-neutral-500"} ${!isPro ? "opacity-30" : ""}`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "filtering" && (
              <div className="space-y-8">
                {/* Pin Featured Testimonials Toggle */}
                <div className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                  <div className="space-y-0.5">
                    <span className="text-[13px] font-medium text-neutral-700">
                      Pin Featured Testimonials
                    </span>
                    <p className="text-[11px] text-neutral-400">
                      Keep featured testimonials pinned at the top
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        pinTopTestimonials: s.pinTopTestimonials !== false ? false : true,
                      }))
                    }
                    className={`relative flex h-5 w-10 shrink-0 items-center rounded-full transition-all duration-300 ${settings.pinTopTestimonials !== false ? "bg-emerald-500" : "bg-neutral-200"}`}
                  >
                    <div
                      className={`size-3.5 rounded-full bg-white shadow-md transition-all duration-300 ${settings.pinTopTestimonials !== false ? "translate-x-5.5" : "translate-x-1"}`}
                    />
                  </button>
                </div>

                <div className="space-y-4 border-t border-neutral-50 pt-6">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                      Min. Star Rating
                    </label>
                    {!isPro && <ProBadge />}
                  </div>
                  <div className="flex items-center gap-1">
                    {[0, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        disabled={!isPro && r !== 0}
                        onClick={() => setSettings((s) => ({ ...s, filterMinRating: r }))}
                        className={`flex flex-1 items-center justify-center gap-1 rounded-xl border py-2 text-[12px] font-bold ${settings.filterMinRating === r ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-neutral-100 text-neutral-500"} ${!isPro && r !== 0 ? "opacity-50" : ""}`}
                      >
                        {r === 0 ? "All" : `${r}+★`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 border-t border-neutral-50 pt-6">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                      Content Type
                    </label>
                    {!isPro && <ProBadge />}
                  </div>
                  <div className="flex gap-2">
                    {[
                      { id: "all", label: "All" },
                      { id: "text", label: "Text Only" },
                      { id: "video", label: "Video Only" },
                    ].map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          if (!isPro && v.id !== "all") {
                            toast.error("Pro Feature", {
                              description: "Upgrade to Pro to filter by testimonial type.",
                            });
                            return;
                          }
                          setSettings((s) => ({ ...s, filterType: v.id as any }));
                        }}
                        className={`flex-1 rounded-xl border py-2 text-[10px] font-bold uppercase ${settings.filterType === v.id ? "border-pink-200 bg-pink-50 text-pink-600" : "border-neutral-100 text-neutral-500"} ${!isPro && v.id !== "all" ? "opacity-50" : ""}`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                {tags && tags.length > 0 && (
                  <div className="space-y-4 border-t border-neutral-50 pt-6">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                        Filter by Tags
                      </label>
                      {!isPro && <ProBadge />}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => {
                        const isSelected = (settings.filterTags || []).includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            onClick={() => {
                              if (!isPro) {
                                toast.error("Pro Feature", {
                                  description: "Upgrade to Pro to filter your widget by tags.",
                                });
                                return;
                              }
                              setSettings((s) => ({
                                ...s,
                                filterTags: isSelected
                                  ? (s.filterTags || []).filter((id) => id !== tag.id)
                                  : [...(s.filterTags || []), tag.id],
                              }));
                            }}
                            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-bold transition-all ${
                              isSelected
                                ? "border-pink-200 bg-pink-50 text-pink-600"
                                : "border-neutral-100 bg-white text-neutral-500 hover:bg-neutral-50"
                            } ${!isPro ? "opacity-50" : ""}`}
                          >
                            <div
                              className="size-2 rounded-full"
                              style={{ backgroundColor: tag.color }}
                            />
                            {tag.name}
                            {isSelected && <Check className="ml-0.5 size-3" />}
                          </button>
                        );
                      })}
                    </div>
                    {(settings.filterTags || []).length > 0 && (
                      <button
                        onClick={() => setSettings((s) => ({ ...s, filterTags: [] }))}
                        className="text-[11px] font-bold text-pink-500 transition-colors hover:text-pink-600"
                      >
                        Clear tags
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "branding" && (
              <div className="space-y-8">
                {/* Accent Color */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                      Accent Color
                    </label>
                    {!isPro && <ProBadge />}
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="relative"
                      onClick={() => {
                        if (!isPro) {
                          toast.error("Pro Feature", {
                            description: "Upgrade to Pro to use custom accent colors.",
                          });
                        }
                      }}
                    >
                      <input
                        type="color"
                        disabled={!isPro}
                        value={settings.accentColor}
                        onChange={(e) =>
                          setSettings((s) => ({ ...s, accentColor: e.target.value }))
                        }
                        className={`size-10 cursor-pointer overflow-hidden rounded-xl border-2 border-white shadow-sm ${!isPro ? "cursor-not-allowed opacity-50" : ""}`}
                      />
                      {!isPro && <Lock className="absolute inset-0 m-auto size-3 text-white" />}
                    </div>
                    <code className="text-[12px] font-bold text-neutral-400 uppercase">
                      {settings.accentColor}
                    </code>
                  </div>
                </div>

                {/* Font Family */}
                <div className="space-y-4 border-t border-neutral-50 pt-6">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                      Font Family
                    </label>
                    {!isPro && <ProBadge />}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "sans", label: "Sans" },
                      { id: "serif", label: "Serif" },
                      { id: "Outfit", label: "Outfit" },
                      { id: "Playfair Display", label: "Elegant" },
                      { id: "custom", label: "Custom Font" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          if (!isPro && f.id !== "sans") {
                            toast.error("Pro Feature", {
                              description: "Upgrade to Pro to use premium fonts.",
                            });
                            return;
                          }
                          setSettings((s) => ({ ...s, fontFamily: f.id }));
                        }}
                        className={`flex items-center justify-between rounded-xl border px-3 py-2 transition-all ${settings.fontFamily === f.id ? "border-pink-200 bg-pink-50 text-pink-600 shadow-sm" : "border-neutral-100 text-neutral-500 hover:bg-neutral-50"} ${!isPro && f.id !== "sans" ? "opacity-30" : ""}`}
                      >
                        <span className="text-[12px] font-bold" style={{ fontFamily: f.id }}>
                          {f.label}
                        </span>
                        {settings.fontFamily === f.id && <Check className="size-3" />}
                      </button>
                    ))}
                  </div>

                  {settings.fontFamily === "custom" && (
                    <div className="animate-in fade-in slide-in-from-top-2 mt-2 space-y-2 rounded-2xl border border-neutral-100 bg-neutral-50 p-3 duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-tighter text-neutral-400 uppercase">
                          Upload .woff2
                        </span>
                        {settings.customFontUrl && (
                          <span className="text-[10px] font-bold text-emerald-500">Ready</span>
                        )}
                      </div>
                      <UploadButton
                        endpoint="fontUploader"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]) {
                            setSettings((s) => ({
                              ...s,
                              customFontUrl: res[0].url,
                              customFontName: res[0].name.replace(".woff2", ""),
                            }));
                            toast.success("Font uploaded!");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Error: ${error.message}`);
                        }}
                        appearance={{
                          button:
                            "w-full h-8 text-[11px] font-bold bg-neutral-900 border-none rounded-xl",
                          allowedContent: "hidden",
                        }}
                      />
                      {settings.customFontName && (
                        <div className="flex items-center gap-2 truncate overflow-hidden rounded-lg border border-neutral-100 bg-white px-2 py-1.5">
                          <Type className="size-3 shrink-0 text-neutral-400" />
                          <span className="truncate text-[10px] font-bold text-neutral-600">
                            {settings.customFontName}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* White Label */}
                <div className="space-y-4 border-t border-neutral-50 pt-6">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                      White Label
                    </label>
                    {!isPro && <ProBadge />}
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="size-4 text-neutral-400" />
                      <span className="text-[13px] font-medium text-neutral-700">Hide Badge</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isPro) {
                          toast.error("Pro Feature", {
                            description: "Upgrade to Pro to remove the KudosWall branding.",
                          });
                          return;
                        }
                        setSettings((s) => ({ ...s, hideBadge: !s.hideBadge }));
                      }}
                      className={`relative flex h-5 w-10 items-center rounded-full transition-all duration-300 ${settings.hideBadge ? "bg-emerald-500" : "bg-neutral-200"} ${!isPro ? "opacity-50" : ""}`}
                    >
                      <div
                        className={`size-3.5 rounded-full bg-white shadow-md transition-all duration-300 ${settings.hideBadge ? "translate-x-5.5" : "translate-x-1"}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Custom CSS */}
                <div className="space-y-4 border-t border-neutral-50 pt-6">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                      Custom CSS
                    </label>
                    {!isPro && <ProBadge />}
                  </div>
                  <div className="relative">
                    <textarea
                      className="h-32 w-full resize-none rounded-2xl border border-neutral-100 bg-neutral-900 p-3 font-mono text-[11px] text-emerald-400 outline-none focus:ring-1 focus:ring-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!isPro}
                      onChange={(e) => setCustomCss(e.target.value)}
                      placeholder="/* .card { background: red; } */"
                      spellCheck={false}
                      value={customCss}
                    />
                    {!isPro && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-neutral-900/10 backdrop-blur-[1px]">
                        <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 shadow-xl">
                          <Lock className="size-3 text-neutral-400" />
                          <span className="text-[10px] font-bold text-neutral-600">
                            Pro Feature
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-neutral-400 italic">
                    Advanced users only. Target classes like .card, .author-name, etc.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-neutral-50 bg-neutral-50/50 p-4">
            <button
              onClick={handleSave}
              disabled={updateWidget.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-3 text-[14px] font-bold text-white shadow-lg shadow-neutral-900/10 transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-50"
            >
              {updateWidget.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save Changes
            </button>
          </div>
        </div>

        {/* Installation tips */}
        <div className="group relative overflow-hidden rounded-[32px] bg-neutral-900 p-6 text-white">
          <Zap className="absolute -top-2 -right-2 size-8 text-pink-500 opacity-20 transition-transform group-hover:scale-110" />
          <h4 className="mb-2 text-[15px] font-bold">Pro Tip</h4>
          <p className="text-[12px] leading-relaxed text-neutral-400">
            Use "Filter by tag" to keep your testimonials contextually relevant to the pages they
            appear on.
          </p>
          <Link
            href={"/dashboard/settings"}
            className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-pink-400 transition-colors hover:text-pink-300"
          >
            Upgrade to PRO <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="min-w-0 flex-1 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1 rounded-2xl bg-neutral-100 p-1.5">
            <button
              onClick={() => setPreviewTab("preview")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2 text-[13px] font-bold transition-all ${
                previewTab === "preview"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <Eye className="size-4" /> Preview
            </button>
            <button
              onClick={() => setPreviewTab("code")}
              className={`flex items-center gap-2 rounded-xl px-5 py-2 text-[13px] font-bold transition-all ${
                previewTab === "code"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <Code2 className="size-4" /> Code
            </button>
          </div>

          {previewTab === "preview" && (
            <div className="flex items-center gap-1 rounded-2xl bg-neutral-100 p-1.5">
              <button
                onClick={() => setViewMode("desktop")}
                className={`rounded-xl p-2 transition-all ${viewMode === "desktop" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}
              >
                <Monitor className="size-4" />
              </button>
              <button
                onClick={() => setViewMode("mobile")}
                className={`rounded-xl p-2 transition-all ${viewMode === "mobile" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400"}`}
              >
                <Smartphone className="size-4" />
              </button>
            </div>
          )}
        </div>

        {previewTab === "preview" ? (
          <div className="relative flex min-h-[600px] flex-col items-center justify-center overflow-hidden rounded-[48px] border border-neutral-100 bg-neutral-50/50 p-8 sm:p-12">
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Dynamic Preview Content */}
            <div
              className={`transition-all duration-500 ${viewMode === "mobile" ? "w-full max-w-[375px]" : "w-full max-w-3xl"}`}
            >
              {/* Browser chrome mock */}
              <div className="rounded-2xl border border-neutral-200 bg-white shadow-2xl">
                {/* Browser bar */}
                <div
                  className="flex items-center gap-2 border-b border-neutral-200 px-4 py-3"
                  style={{ backgroundColor: "#f0efeb" }}
                >
                  <div className="flex gap-1.5">
                    <span className="size-2 rounded-full bg-red-400" />
                    <span className="size-2 rounded-full bg-amber-400" />
                    <span className="size-2 rounded-full bg-green-400" />
                  </div>
                  <div
                    className="mx-4 flex-1 rounded-full px-3 py-1 text-center text-[10px] text-neutral-400"
                    style={{ backgroundColor: "#e8e7e3" }}
                  >
                    yourwebsite.com
                  </div>
                  <MoreHorizontal className="size-3 text-neutral-400" />
                </div>

                {/* Widget content */}
                <div className="min-h-[400px] bg-white p-4 sm:p-8">
                  <Widget
                    data={{
                      id: widgetId,
                      name: "Preview",
                      settings,
                      isPro,
                      workspaceId,
                    }}
                    testimonials={MOCK_DATA}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[32px] border border-neutral-100 bg-white p-8 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Embed Code</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Copy this code and paste it wherever you want the widget to appear.
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(embedCode)}
                className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-bold transition-all ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "bg-neutral-900 text-white hover:bg-neutral-800"
                }`}
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-neutral-950 p-6">
              <code className="flex flex-col gap-2 font-mono text-[13px] leading-relaxed text-pink-400">
                <span className="text-neutral-500 select-none">
                  // Standard Script (Recommended)
                </span>
                {embedCode}
              </code>
            </div>

            <div className="mt-12">
              <div className="group rounded-[32px] border border-neutral-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
                <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-pink-50 text-pink-500 transition-transform group-hover:scale-110">
                  <Zap className="size-6 fill-pink-500/10" />
                </div>
                <h4 className="mb-3 text-xl font-bold text-neutral-900">Dynamic Filtering</h4>
                <p className="mb-6 text-[15px] leading-relaxed text-neutral-500">
                  You can override some settings via data-attributes without coming back here.
                </p>
                <Link
                  href={"/docs"}
                  className="inline-flex items-center gap-2 text-[14px] font-bold text-neutral-900 transition-colors hover:text-pink-500"
                >
                  View Documentation{" "}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
