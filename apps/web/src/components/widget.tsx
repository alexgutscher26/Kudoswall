"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Star, Quote, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";

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
  const trackEvent = useMutation(trpc.analytics.trackEvent.mutationOptions());

  // Track View and Handle Height Reporting
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only track view once on mount
    trackEvent.mutate({
      workspaceId: data.workspaceId,
      widgetId: data.id,
      eventType: "view",
    });

    // Report height to parent if in iframe
    if (window.self !== window.top) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Use the actual scroll height of the content to be more precise
          // and avoid feedback loops from padding/margins
          const height = entry.target.scrollHeight;
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

  // Handle Carousel Auto-advance
  useEffect(() => {
    if (settings.layout === "carousel" && settings.carouselAutoAdvance && testimonials.length > 1) {
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
        return "32px";
      case "pill":
        return "999px";
      default:
        return "32px";
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
      : "bg-white text-neutral-900 border-neutral-100";

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
        className={`relative flex flex-col overflow-hidden border p-7 transition-all duration-500 hover:scale-[1.02] ${themeClasses} ${settings.animation === "fade" ? "animate-in fade-in duration-700" : ""} ${settings.layout === "masonry" ? "mb-6 break-inside-avoid-column" : ""}`}
        style={cardStyle}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.showReviewerPhoto && (
              <div className="size-10 shrink-0 overflow-hidden rounded-full bg-neutral-100">
                {t.authorImage ? (
                  <Image
                    src={t.authorImage}
                    alt={t.authorName}
                    width={40}
                    height={40}
                    priority={index < 3}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center font-bold text-neutral-400">
                    {t.authorName.charAt(0)}
                  </div>
                )}
              </div>
            )}
            <div>
              <h5
                className="text-[14px] leading-tight font-bold tracking-tight"
                style={{ color: settings.textColor || undefined }}
              >
                {t.authorName}
              </h5>
              <p className="mt-1 text-[11px] font-medium text-neutral-400">
                {t.authorTagline}{" "}
                {settings.showReviewerCompany && t.authorCompany && `· ${t.authorCompany}`}
              </p>
            </div>
          </div>
          {t.type === "video" && (
            <div className="flex size-8 items-center justify-center rounded-full bg-pink-50 text-pink-500">
              <Play className="size-3 fill-current" />
            </div>
          )}
        </div>

        {settings.showRating && (
          <div className="mb-3 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-3 ${i < t.rating ? "fill-current" : "text-neutral-200"}`}
                style={{ color: i < t.rating ? settings.accentColor : undefined }}
              />
            ))}
          </div>
        )}

        <p className="flex-1 text-[14px] leading-relaxed text-neutral-600 italic dark:text-neutral-400">
          "{content}"
          {isTruncated && t.content.length > maxLength && (
            <span className="ml-1 cursor-pointer font-bold text-pink-500">Read more</span>
          )}
        </p>

        {settings.showDate && (
          <div className="mt-4 text-[10px] font-bold tracking-widest text-neutral-300 uppercase">
            {formatDistanceToNow(new Date(t.createdAt))} ago
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden"
      style={{ backgroundColor: settings.backgroundColor }}
    >
      <div className="mx-auto" style={{ maxWidth: "1200px" }}>
        {settings.layout === "carousel" ? (
          <div className="group relative px-12">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((t, index) => (
                  <div key={t.id} className="w-full shrink-0 px-4">
                    {renderCard(t, index)}
                  </div>
                ))}
              </div>
            </div>

            {settings.carouselShowArrows !== false && testimonials.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentIndex(
                      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
                    )
                  }
                  className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full border border-neutral-100 bg-white p-2 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
                  className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full border border-neutral-100 bg-white p-2 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}

            {testimonials.length > 1 && (
              <div className="mt-6 flex justify-center gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-1 rounded-full transition-all ${currentIndex === i ? "w-6" : "w-2 bg-neutral-200"}`}
                    style={{
                      backgroundColor: currentIndex === i ? settings.accentColor : undefined,
                    }}
                  />
                ))}
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

        {(!settings.hideBadge || !isPro) && (
          <div className="mt-12 flex justify-center">
            <a
              href="https://testimonialwall.me"
              target="_blank"
              className="flex items-center gap-1.5 rounded-full border border-neutral-100 bg-white px-3 py-1.5 text-[10px] font-bold text-neutral-400 shadow-sm transition-all hover:border-pink-100 hover:text-neutral-600"
            >
              Powered by{" "}
              <span
                className="font-extrabold text-neutral-900"
                style={{ color: settings.accentColor }}
              >
                TestimonialWall
              </span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
