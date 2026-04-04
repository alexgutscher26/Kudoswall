"use client";

import Link from "next/link";
import { Star, Play, MessageSquareQuote, Image, BarChart2, Zap, Globe, Palette } from "lucide-react";
import { Button } from "@my-better-t-app/ui/components/button";

const CATEGORY_CHIPS = [
  { icon: Star, label: "Collect reviews" },
  { icon: Image, label: "Video testimonials" },
  { icon: MessageSquareQuote, label: "Text quotes" },
  { icon: BarChart2, label: "Analytics" },
  { icon: Palette, label: "Custom widget" },
  { icon: Globe, label: "Embed anywhere" },
  { icon: Zap, label: "Instant setup" },
] as const;

// Hero is intentionally always light
export default function Hero() {
  return (
    <section
      className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Dot-grid texture overlay — always dark dots on the light bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.16) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Soft white radial glow at the centre to fade out the dots */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="w-[min(700px,90vw)] h-[min(500px,60vw)] rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(255,255,255,0.75)" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 px-4 sm:px-6 text-center max-w-4xl mx-auto pt-24">
        {/* Watch intro badge */}
        <button
          type="button"
          className="flex items-center gap-3 bg-white border border-neutral-200 rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="relative flex items-center justify-center size-8 rounded-full overflow-hidden bg-neutral-100 shrink-0">
            <span className="absolute inset-0 bg-linear-to-br from-pink-400 to-orange-300 opacity-80" />
            <Play className="relative size-3 text-white fill-white" />
          </span>
          <span className="text-sm font-medium text-neutral-700 pr-1">
            Watch Introduction
          </span>
        </button>

        {/* Main headline */}
        <div className="flex flex-col gap-1 -mt-2">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] text-neutral-900">
            The easiest way to collect
          </h1>
          <span
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1]"
            style={{ color: "#e8527a" }}
          >
            glowing testimonials
          </span>
        </div>

        {/* Sub-headline */}
        <p className="text-base sm:text-lg md:text-xl text-neutral-500 max-w-2xl -mt-2 px-2">
          Collect, organize, and display beautiful customer testimonials on your website in minutes — no code required.
        </p>

        {/* Input card */}
        <div className="w-full max-w-2xl bg-white border border-neutral-200 rounded-2xl shadow-md overflow-hidden">
          <div className="px-5 py-4">
            <p className="text-left text-neutral-400 text-base">
              🚀 Paste a customer's email and collect a testimonial instantly…
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-t border-neutral-100">
            <span className="flex items-center gap-1.5 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full px-3 py-1.5">
              <Star className="size-3 fill-pink-500 text-pink-500" />
              Smart mode
            </span>
            <div className="flex-1" />
            <Link href="/login">
              <Button className="rounded-full h-8 px-5 text-sm bg-neutral-900 hover:bg-neutral-700 text-white">
                Get started free →
              </Button>
            </Link>
          </div>
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap justify-center gap-2 -mt-2">
          {CATEGORY_CHIPS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 bg-white/80 border border-neutral-200 rounded-full px-3 py-1.5 hover:border-neutral-400 hover:text-neutral-900 transition-all"
            >
              <Icon className="size-3" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
