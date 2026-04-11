"use client";

import Link from "next/link";
import {
  Star,
  Play,
  MessageSquareQuote,
  Image,
  BarChart2,
  Zap,
  Globe,
  Palette,
} from "lucide-react";
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
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Dot-grid texture overlay — always dark dots on the light bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.16) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Soft white radial glow at the centre to fade out the dots */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="h-[min(500px,60vw)] w-[min(700px,90vw)] rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(255,255,255,0.75)" }}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 pt-24 text-center sm:gap-8 sm:px-6">
        {/* Watch intro badge */}
        <button
          type="button"
          className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-3 py-1.5 shadow-sm transition-shadow hover:shadow-md"
        >
          <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100">
            <span className="absolute inset-0 bg-linear-to-br from-pink-400 to-orange-300 opacity-80" />
            <Play className="relative size-3 fill-white text-white" />
          </span>
          <span className="pr-1 text-sm font-medium text-neutral-700">Watch Introduction</span>
        </button>

        {/* Main headline */}
        <h1 className="-mt-2 text-4xl leading-[1.1] font-bold text-neutral-900 sm:text-5xl md:text-6xl">
          Turn happy customers into your <span style={{ color: "#e8527a" }}>best sales tool.</span>
        </h1>

        {/* Sub-headline */}
        <p className="-mt-2 max-w-2xl px-2 text-base text-neutral-500 sm:text-lg md:text-xl">
          Collect video & text testimonials in one link. Embed anywhere in 5 minutes.
        </p>

        {/* CTA Buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
          <Link href="/login">
            <Button className="h-12 rounded-full bg-neutral-900 px-8 text-base font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:bg-neutral-800 active:scale-[0.98]">
              Start free — no credit card
            </Button>
          </Link>
        </div>

        {/* Category chips */}
        <div className="-mt-2 flex flex-wrap justify-center gap-2">
          {CATEGORY_CHIPS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-all hover:border-neutral-400 hover:text-neutral-900"
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
