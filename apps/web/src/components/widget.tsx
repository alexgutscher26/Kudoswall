"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Star, Quote, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import VideoPlayer from "./video-player";

interface WidgetProps {
  data: {
    id: string;
    name: string;
    settings: {
      layout: "grid" | "masonry" | "carousel";
      theme: "light" | "dark" | "auto";
      accentColor: string;
      backgroundColor: string;
      showRating: boolean;
      showReviewerPhoto: boolean;
      showReviewerCompany: boolean;
      showDate: boolean;
      cardBorderRadius: "none" | "small" | "large" | "pill";
      cardShadow: "none" | "subtle" | "medium";
      columnsOverride: number | null;
      hideBadge: boolean;
      animation: "fade" | "none";
      truncateText: "off" | 150 | 250;
      maxItems: number;
      filterTags: string[];
      filterMinRating: number;
      filterType: "all" | "text" | "video";
      carouselAutoAdvance?: boolean;
      carouselInterval?: number;
      carouselShowArrows?: boolean;
      textColor?: string | null;
      locale?: string;
      maxWidth?: number | null;
      fontFamily?: string;
      headerTitle?: string;
      headerRating?: number;
      headerReviewCount?: number;
      headerAutoStats?: boolean;
      hideHeader?: boolean;
    };
    isPro: boolean;
    workspaceId: string;
  };
  testimonials: Array<{
    id: string;
    content: string;
    rating: number;
    authorName: string;
    authorTagline: string;
    authorCompany: string;
    authorImage: string;
    createdAt: Date;
    type: "text" | "video";
    videoUrl?: string;
  }>;
}

export default function Widget({ data, testimonials }: WidgetProps) {
  const { settings, isPro } = data;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackEvent = useMutation(trpc.analytics.trackEvent.mutationOptions());

  // Track View and Handle Height Reporting
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only track view once on mount
    trackEvent.mutate(
      {
        workspaceId: data.workspaceId,
        widgetId: data.id,
        eventType: "view",
      },
      {
        onError: (err) => console.error("[KudosWall Analytics] trackEvent failed:", err.message),
      },
    );

    // Report height to parent if in iframe
    if (window.self !== window.top) {
      // Send ready signal immediately so the loader script can show the iframe
      window.parent.postMessage({ type: "ready", widgetId: data.id }, "*");

      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Use scrollHeight + small buffer to ensure no scrollbars
          const height = entry.target.scrollHeight + 10;
          window.parent.postMessage({ type: "resize", height, widgetId: data.id }, "*");
        }
      });

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }
    // We only want to run this once when the widget ID changes or on mount.
    // trackEvent should NOT be in the dependency array as its state changes
    // trigger re-renders which would cause an infinite loop.
  }, [data.id, data.workspaceId]);

  // Carousel auto-advance logic
  useEffect(() => {
    if (
      settings.layout === "carousel" &&
      settings.carouselAutoAdvance &&
      testimonials.length > 1 &&
      !isPaused
    ) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, settings.carouselInterval || 5000);
      return () => clearInterval(interval);
    }
  }, [
    settings.layout,
    settings.carouselAutoAdvance,
    settings.carouselInterval,
    testimonials.length,
    isPaused,
  ]);

  if (testimonials.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-neutral-100 p-12 text-center">
        <Quote className="mb-4 size-8 text-neutral-200" />
        <h3 className="text-lg font-bold text-neutral-900">No testimonials yet</h3>
        <p className="mt-1 max-w-[240px] text-sm text-neutral-500">
          Once you approve some testimonials in your dashboard, they will appear here.
        </p>
      </div>
    );
  }

  const getBorderRadius = () => {
    switch (settings.cardBorderRadius) {
      case "none":
        return "0";
      case "small":
        return "12px";
      case "large":
        return "24px";
      case "pill":
        return "999px";
      default:
        return "12px"; // Default to small
    }
  };

  const getShadow = () => {
    switch (settings.cardShadow) {
      case "none":
        return "none";
      case "subtle":
        return "0 4px 6px -1px rgb(0 0 0 / 0.1)";
      case "medium":
        return "0 10px 15px -3px rgb(0 0 0 / 0.1)";
      default:
        return "0 4px 6px -1px rgb(0 0 0 / 0.1)";
    }
  };

  const themeClasses =
    settings.theme === "dark"
      ? "bg-neutral-900 text-white border-neutral-800"
      : "bg-[#fafafa] text-neutral-900 border-neutral-100";

  const renderCard = (t: any, index: number) => {
    const isTruncated = settings.truncateText !== "off";
    const maxLength = typeof settings.truncateText === "number" ? settings.truncateText : 0;
    const content =
      isTruncated && t.content.length > maxLength
        ? t.content.substring(0, maxLength) + "..."
        : t.content;

    const cardStyle: React.CSSProperties = {
      borderRadius: getBorderRadius(),
      boxShadow: getShadow(),
      backdropFilter: settings.backgroundColor === "transparent" ? "blur(12px)" : "none",
      color: settings.textColor || undefined,
    };

    return (
      <div
        key={t.id}
        className={`relative flex min-h-[160px] flex-col overflow-hidden border p-4 transition-all duration-500 hover:scale-[1.02] ${themeClasses} ${settings.animation === "fade" ? "animate-in fade-in duration-700" : ""} ${settings.layout === "masonry" ? "mb-6 break-inside-avoid-column" : ""}`}
        style={cardStyle}
      >
        {t.type === "video" && t.videoUrl && (
          <div className="mb-4 overflow-hidden rounded-lg">
            <VideoPlayer
              url={t.videoUrl}
              thumbnail={t.authorImage}
              accentColor={settings.accentColor}
            />
          </div>
        )}

        {t.type === "text" && <Quote className="mb-2 size-5 text-neutral-200" />}

        {settings.showRating && (
          <div className="mb-1.5 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-3.5 ${i < t.rating ? "fill-current" : "text-neutral-200"}`}
                style={{ color: i < t.rating ? settings.accentColor : undefined }}
              />
            ))}
          </div>
        )}

        <p className="mb-3 flex-1 text-xs leading-relaxed wrap-break-word text-neutral-600 dark:text-neutral-400">
          "{content}"
        </p>

        <div className="flex items-center gap-2">
          {settings.showReviewerPhoto && (
            <div className="size-8 shrink-0 overflow-hidden rounded-full bg-neutral-100 shadow-sm ring-2 ring-white">
              {t.authorImage ? (
                <Image
                  src={t.authorImage}
                  alt={t.authorName}
                  width={32}
                  height={32}
                  priority={index < 4}
                  className="size-full object-cover"
                  loading={index < 4 ? undefined : "lazy"}
                />
              ) : (
                <div
                  className="flex size-full items-center justify-center text-xs font-bold text-white uppercase"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  {t.authorName.charAt(0)}
                </div>
              )}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h5
              className="truncate text-[13px] font-bold tracking-tight text-neutral-800 dark:text-white"
              style={{ color: settings.textColor || undefined }}
            >
              {t.authorName}
            </h5>
            <p className="mt-0.5 truncate text-[11px] font-medium text-neutral-400">
              {t.authorTagline}{" "}
              {settings.showReviewerCompany && t.authorCompany && `· ${t.authorCompany}`}
            </p>
          </div>
        </div>

        {settings.showDate && (
          <div className="mt-3 text-[9px] font-bold tracking-widest text-neutral-200 uppercase">
            {formatDistanceToNow(new Date(t.createdAt))} ago
          </div>
        )}
      </div>
    );
  };

  // Resolve fontFamily to a valid CSS font-family stack
  const resolvedFontFamily = (() => {
    const f = settings.fontFamily;
    if (!f || f === "sans") return undefined;
    if (f === "serif") return "ui-serif, Georgia, serif";
    if (f === "mono") return "ui-monospace, 'Cascadia Code', monospace";
    // Custom Google Font — the embed page already loaded the @font-face via <link>
    return `"${f}", sans-serif`;
  })();

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden pb-12"
      style={{ backgroundColor: settings.backgroundColor, fontFamily: resolvedFontFamily }}
    >
      {/* ─── Auto Stats Calculation ────────────────────────────────────────── */}
      {(() => {
        const totalRating = testimonials.reduce((acc, t) => acc + t.rating, 0);
        const avgRating =
          testimonials.length > 0 ? (totalRating / testimonials.length).toFixed(1) : "0";
        const reviewCount = testimonials.length;

        const effectiveRating =
          settings.headerAutoStats !== false ? Number(avgRating) : settings.headerRating || 4.9;
        const effectiveCount =
          settings.headerAutoStats !== false ? reviewCount : settings.headerReviewCount || 128;

        return (
          <div
            className="mx-auto"
            style={{ maxWidth: settings.maxWidth ? `${settings.maxWidth}px` : "800px" }}
          >
            {!settings.hideHeader && (
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4 px-4 sm:px-0">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    {settings.headerTitle || "What our customers say"}
                  </h3>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-4 ${i < Math.floor(effectiveRating) ? "fill-amber-400 text-amber-400" : "text-neutral-200"}`}
                        />
                      ))}
                    </div>
                    <span className="text-[13px] font-medium text-neutral-500">
                      {effectiveRating} · {effectiveCount} reviews
                    </span>
                  </div>
                </div>
                {(!settings.hideBadge || !isPro) && (
                  <a
                    href="https://kudoswall.org"
                    target="_blank"
                    className="inline-flex shrink-0 items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-bold transition-all hover:opacity-80"
                    style={{ backgroundColor: "#fff5f7", color: "#e8527a" }}
                  >
                    Powered by KudosWall
                  </a>
                )}
              </div>
            )}

            {settings.layout === "carousel" ? (
              <div
                className="group relative px-4 sm:px-12"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="overflow-hidden">
                  <motion.div
                    className="flex cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      const threshold = 50;
                      if (info.offset.x < -threshold) {
                        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
                      } else if (info.offset.x > threshold) {
                        setCurrentIndex(
                          (prev) => (prev - 1 + testimonials.length) % testimonials.length,
                        );
                      }
                    }}
                    animate={{ x: `-${currentIndex * (100 / (settings.columnsOverride || 1))}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {testimonials.map((t, index) => (
                      <div
                        key={t.id}
                        className="shrink-0 px-2"
                        style={{ width: `${100 / (settings.columnsOverride || 1)}%` }}
                      >
                        {renderCard(t, index)}
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Navigation Arrows */}
                {settings.carouselShowArrows !== false && testimonials.length > 1 && (
                  <>
                    <button
                      onClick={() => {
                        const pageSize = settings.columnsOverride || 1;
                        setCurrentIndex(
                          (prev) => (prev - pageSize + testimonials.length) % testimonials.length,
                        );
                      }}
                      className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full border border-neutral-100 bg-white/90 p-2 shadow-sm transition-all hover:bg-white hover:shadow-md sm:left-2"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="size-5 text-neutral-600" />
                    </button>
                    <button
                      onClick={() => {
                        const pageSize = settings.columnsOverride || 1;
                        setCurrentIndex((prev) => (prev + pageSize) % testimonials.length);
                      }}
                      className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full border border-neutral-100 bg-white/90 p-2 shadow-sm transition-all hover:bg-white hover:shadow-md sm:right-2"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="size-5 text-neutral-600" />
                    </button>
                  </>
                )}

                {/* Pagination Dots */}
                {testimonials.length > 1 && (
                  <div className="mt-10 flex justify-center gap-2.5">
                    {Array.from({
                      length: Math.ceil(testimonials.length / (settings.columnsOverride || 1)),
                    }).map((_, i) => {
                      const pageSize = settings.columnsOverride || 1;
                      const isActive = Math.floor(currentIndex / pageSize) === i;
                      return (
                        <motion.button
                          key={i}
                          layout
                          onClick={() => setCurrentIndex(i * pageSize)}
                          className="h-2 rounded-full transition-colors duration-300"
                          style={{
                            width: isActive ? 32 : 8,
                            backgroundColor: isActive ? settings.accentColor : "rgb(209 213 219)", // neutral-300 for better visibility
                          }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          aria-label={`Go to slide group ${i + 1}`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`gap-6 ${
                  settings.layout === "masonry" ? "columns-1 md:columns-2 lg:columns-3" : "grid"
                } ${
                  settings.layout !== "masonry" && settings.columnsOverride === 1
                    ? "grid-cols-1"
                    : settings.layout !== "masonry" && settings.columnsOverride === 2
                      ? "grid-cols-1 md:grid-cols-2"
                      : settings.layout !== "masonry" && settings.columnsOverride === 3
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                        : settings.layout !== "masonry"
                          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                          : ""
                }`}
              >
                {testimonials.map((t, index) => renderCard(t, index))}
              </div>
            )}

            {(!settings.hideBadge || !isPro) && settings.hideHeader && (
              <div className="mt-8 flex justify-center">
                <a
                  href="https://kudoswall.org"
                  target="_blank"
                  className="flex items-center gap-1.5 rounded-full border border-neutral-100 bg-white px-3 py-1.5 text-[10px] font-bold text-neutral-400 shadow-sm transition-all hover:border-pink-100 hover:text-neutral-600"
                >
                  Powered by{" "}
                  <span
                    className="font-extrabold text-neutral-900"
                    style={{ color: settings.accentColor }}
                  >
                    KudosWall
                  </span>
                </a>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
