"use client";

import { useState } from "react";
import { Star, Quotes, CheckCircle, CaretLeft, CaretRight } from "@phosphor-icons/react";

const DEMO_TESTIMONIALS = [
  {
    name: "Siddharth Nair",
    role: "Founder, SupaDocs",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    text: "We replaced manual screenshot reviews with KudosWall and saw our checkout completion jump by 28.4% within 10 days.",
    verified: true,
  },
  {
    name: "Clara Dubois",
    role: "Product Lead, FlowCraft",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    text: "Our users love how easy it is to leave video feedback directly in their mobile browser without installing anything.",
    verified: true,
  },
  {
    name: "Mateo Rodriguez",
    role: "Course Creator, DesignStack",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    text: "The embed script weighs next to nothing. It loads instantly and matches our dark mode theme seamlessly.",
    verified: true,
  },
  {
    name: "Hanna Lindqvist",
    role: "Growth, HyperScale",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    text: "Zero setup friction. We collected 24 authentic video reviews in 48 hours for our product launch.",
    verified: true,
  },
];

export default function WidgetPreviewSection() {
  const [activeTab, setActiveTab] = useState<"grid" | "masonry" | "carousel" | "bento">("grid");
  const [carouselIndex, setCarouselIndex] = useState(0);

  return (
    <section className="relative bg-white px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-[680px] text-center">
          <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700">
            Live preview
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl [text-wrap:balance]">
            Four widget layouts to match any page design
          </h2>
          <p className="mt-3 text-base text-neutral-500 sm:text-lg [text-wrap:pretty]">
            Switch between Grid, Masonry, Carousel, and Bento layouts with a single click in your dashboard.
          </p>

          {/* Widget Layout Type Selector */}
          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("grid")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                activeTab === "grid"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("masonry")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                activeTab === "masonry"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Masonry
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("carousel")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                activeTab === "carousel"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Carousel
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bento")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                activeTab === "bento"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Bento
            </button>
          </div>
        </div>

        {/* Browser Mockup */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8 shadow-xl">
          {/* Top Bar */}
          <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-neutral-300" />
              <div className="size-2.5 rounded-full bg-neutral-300" />
              <div className="size-2.5 rounded-full bg-neutral-300" />
              <span className="ml-2 text-xs font-medium text-neutral-400">yourbrand.com/testimonials</span>
            </div>
            <span className="text-xs font-semibold text-neutral-700 capitalize">
              {activeTab} layout
            </span>
          </div>

          {/* Layout 1: Grid */}
          {activeTab === "grid" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {DEMO_TESTIMONIALS.slice(0, 3).map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={`grid-star-${i}`} className="size-3 fill-amber-400" weight="fill" />
                        ))}
                      </div>
                      <Quotes className="size-4 text-neutral-300" weight="fill" />
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-neutral-700 [text-wrap:pretty]">
                      "{t.text}"
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2.5 border-t border-neutral-100 pt-3">
                    <img src={t.avatar} alt={t.name} className="size-7 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-semibold text-neutral-900">{t.name}</p>
                      <p className="text-[10px] text-neutral-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Layout 2: Masonry */}
          {activeTab === "masonry" && (
            <div className="columns-1 gap-4 md:columns-2 lg:columns-3 space-y-4">
              {DEMO_TESTIMONIALS.map((t, idx) => (
                <div
                  key={t.name}
                  className="break-inside-avoid rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={`masonry-star-${i}`} className="size-3 fill-amber-400" weight="fill" />
                      ))}
                    </div>
                    <Quotes className="size-4 text-neutral-300" weight="fill" />
                  </div>
                  <p className={`mt-3 text-xs leading-relaxed text-neutral-700 [text-wrap:pretty] ${idx === 1 ? "line-clamp-none font-medium" : ""}`}>
                    "{t.text}"
                  </p>
                  <div className="mt-4 flex items-center gap-2.5 border-t border-neutral-100 pt-3">
                    <img src={t.avatar} alt={t.name} className="size-7 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-semibold text-neutral-900">{t.name}</p>
                      <p className="text-[10px] text-neutral-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Layout 3: Carousel */}
          {activeTab === "carousel" && (
            <div className="relative px-8 py-2">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                >
                  {DEMO_TESTIMONIALS.map((t) => (
                    <div key={t.name} className="w-full shrink-0 px-2">
                      <div className="mx-auto max-w-lg rounded-xl border border-neutral-200 bg-white p-6 shadow-sm text-center">
                        <div className="flex justify-center items-center gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={`car-star-${i}`} className="size-4 fill-amber-400" weight="fill" />
                          ))}
                        </div>
                        <p className="mt-4 text-sm font-medium leading-relaxed text-neutral-800 [text-wrap:pretty]">
                          "{t.text}"
                        </p>
                        <div className="mt-5 flex items-center justify-center gap-2.5">
                          <img src={t.avatar} alt={t.name} className="size-8 rounded-full object-cover" />
                          <div className="text-left">
                            <p className="text-xs font-bold text-neutral-900">{t.name}</p>
                            <p className="text-[10px] text-neutral-500">{t.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prev / Next controls */}
              <button
                type="button"
                onClick={() => setCarouselIndex((prev) => (prev === 0 ? DEMO_TESTIMONIALS.length - 1 : prev - 1))}
                className="absolute left-0 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm hover:bg-neutral-100"
                aria-label="Previous slide"
              >
                <CaretLeft className="size-4 text-neutral-700" weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => setCarouselIndex((prev) => (prev === DEMO_TESTIMONIALS.length - 1 ? 0 : prev + 1))}
                className="absolute right-0 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-sm hover:bg-neutral-100"
                aria-label="Next slide"
              >
                <CaretRight className="size-4 text-neutral-700" weight="bold" />
              </button>

              {/* Dots */}
              <div className="mt-6 flex justify-center gap-1.5">
                {DEMO_TESTIMONIALS.map((_, i) => (
                  <button
                    key={`dot-${i}`}
                    type="button"
                    onClick={() => setCarouselIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      carouselIndex === i ? "w-6 bg-neutral-900" : "w-1.5 bg-neutral-300"
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Layout 4: Bento */}
          {activeTab === "bento" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Featured Large Bento Card */}
              <div className="flex flex-col justify-between rounded-xl border border-neutral-900 bg-neutral-900 p-6 text-white md:col-span-2 shadow-md">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={`bento-star-lg-${i}`} className="size-4 fill-amber-400" weight="fill" />
                      ))}
                    </div>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-neutral-200">
                      Featured story
                    </span>
                  </div>
                  <p className="mt-4 text-base font-semibold leading-relaxed text-white [text-wrap:pretty]">
                    "{DEMO_TESTIMONIALS[0].text}"
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                  <img src={DEMO_TESTIMONIALS[0].avatar} alt={DEMO_TESTIMONIALS[0].name} className="size-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-bold text-white">{DEMO_TESTIMONIALS[0].name}</p>
                    <p className="text-xs text-neutral-400">{DEMO_TESTIMONIALS[0].role}</p>
                  </div>
                </div>
              </div>

              {/* Standard Bento Card */}
              <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
                <div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={`bento-star-sm-${i}`} className="size-3 fill-amber-400" weight="fill" />
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-neutral-700 [text-wrap:pretty]">
                    "{DEMO_TESTIMONIALS[1].text}"
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2.5 border-t border-neutral-100 pt-3">
                  <img src={DEMO_TESTIMONIALS[1].avatar} alt={DEMO_TESTIMONIALS[1].name} className="size-7 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900">{DEMO_TESTIMONIALS[1].name}</p>
                    <p className="text-[10px] text-neutral-500">{DEMO_TESTIMONIALS[1].role}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
