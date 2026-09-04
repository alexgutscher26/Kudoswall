"use client";

import { useState } from "react";
import { Star, Quotes, CheckCircle, Eye, Sparkle } from "@phosphor-icons/react";

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
];

export default function WidgetPreviewSection() {
  const [activeTab, setActiveTab] = useState<"grid" | "badge" | "spotlight">("grid");

  return (
    <section className="relative bg-white px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-[680px] text-center">
          <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700">
            Live preview
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl [text-wrap:balance]">
            Widgets designed to match your brand
          </h2>
          <p className="mt-3 text-base text-neutral-500 sm:text-lg [text-wrap:pretty]">
            Choose between full walls of love, floating notification badges, or single quote spotlights with one click.
          </p>

          {/* Widget Type Selector */}
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
              Wall Grid
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("badge")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                activeTab === "badge"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Floating Badge
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("spotlight")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                activeTab === "spotlight"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Spotlight Card
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
              <span className="ml-2 text-xs font-medium text-neutral-400">yourbrand.com/pricing</span>
            </div>
            <span className="text-xs font-medium text-neutral-500">Live preview</span>
          </div>

          {/* Tab 1: Grid */}
          {activeTab === "grid" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {DEMO_TESTIMONIALS.map((t) => (
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

          {/* Tab 2: Floating Badge */}
          {activeTab === "badge" && (
            <div className="flex min-h-[160px] items-center justify-center">
              <div className="flex items-center gap-3.5 rounded-full border border-neutral-200 bg-white px-4 py-2.5 shadow-lg">
                <img
                  src={DEMO_TESTIMONIALS[0].avatar}
                  alt={DEMO_TESTIMONIALS[0].name}
                  className="size-9 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-neutral-900">{DEMO_TESTIMONIALS[0].name}</span>
                    <CheckCircle className="size-3.5 text-emerald-600" weight="fill" />
                  </div>
                  <p className="text-[11px] text-neutral-600">Left a 5 star video review 12m ago</p>
                </div>
                <span className="rounded bg-neutral-100 px-2 py-1 text-[10px] font-semibold text-neutral-700">
                  Verified
                </span>
              </div>
            </div>
          )}

          {/* Tab 3: Spotlight */}
          {activeTab === "spotlight" && (
            <div className="mx-auto max-w-xl rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={`spotlight-star-${i}`} className="size-4 fill-amber-400" weight="fill" />
                ))}
              </div>
              <p className="mt-4 text-base font-medium leading-relaxed text-neutral-800 [text-wrap:pretty]">
                "{DEMO_TESTIMONIALS[0].text}"
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-neutral-100 pt-4">
                <img
                  src={DEMO_TESTIMONIALS[0].avatar}
                  alt={DEMO_TESTIMONIALS[0].name}
                  className="size-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-neutral-900">{DEMO_TESTIMONIALS[0].name}</p>
                  <p className="text-xs text-neutral-500">{DEMO_TESTIMONIALS[0].role}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
