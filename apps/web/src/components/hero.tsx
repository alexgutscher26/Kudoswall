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
  { icon: Image, label: "Photo reviews" },
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

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 pt-24 text-center sm:px-6 lg:pt-28">
        {/* Main headline */}
        <h1 className="-mt-2 text-4xl leading-[1.1] font-black tracking-tight text-neutral-900 sm:text-5xl md:text-7xl">
          Wall of Love in <br className="hidden md:block" />
          <span style={{ color: "#e8527a" }}>5 minutes.</span>
        </h1>

        {/* Sub-headline */}
        <p className="max-w-xl px-2 text-base leading-relaxed text-neutral-500 sm:text-lg md:text-xl">
The fast, no-bloat testimonial tool for founders who just want their wall live. No $29/mo paywalls. No unnecessary complexity. Just trust-building social proof, delivered at the edge.
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
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORY_CHIPS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-neutral-600 shadow-sm transition-all hover:border-neutral-400 hover:text-neutral-900"
            >
              <Icon className="size-3" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
