import { Button } from "@my-better-t-app/ui/components/button";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24" style={{ backgroundColor: "#ffffff" }}>
      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />
      {/* White glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="h-[400px] w-[600px] rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
        />
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <h2 className="text-3xl leading-tight font-bold text-neutral-900 sm:text-4xl md:text-5xl">
          Start collecting testimonials <span style={{ color: "#e8527a" }}>today</span>
        </h2>
        <p className="max-w-lg text-lg text-neutral-500">
          Join business owners using KudosWall to turn happy customers into their best marketing
          asset.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href="/login">
            <Button
              className="flex h-11 items-center gap-2 rounded-full px-7 text-base text-white"
              style={{ backgroundColor: "#171717" }}
            >
              Get started free
              <ArrowRight className="size-4" />
            </Button>
          </a>
          <a href="#how-it-works">
            <Button
              variant="outline"
              className="h-11 rounded-full border-neutral-300 px-7 text-base text-neutral-700 hover:bg-neutral-100"
            >
              See how it works
            </Button>
          </a>
        </div>
        <p className="text-sm text-neutral-400">
          No credit card required · Free forever plan available
        </p>
      </div>
    </section>
  );
}
