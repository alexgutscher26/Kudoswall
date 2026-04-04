import { Button } from "@my-better-t-app/ui/components/button";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section
      className="py-24 px-4 relative overflow-hidden"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />
      {/* White glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          className="w-[600px] h-[400px] rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
        />
      </div>

      <div className="relative max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
          Start collecting testimonials{" "}
          <span style={{ color: "#e8527a" }}>today</span>
        </h2>
        <p className="text-lg text-neutral-500 max-w-lg">
          Join 1,200+ business owners using TestimonialWall to turn happy customers
          into their best marketing asset.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="/login">
            <Button
              className="rounded-full px-7 h-11 text-base text-white flex items-center gap-2"
              style={{ backgroundColor: "#171717" }}
            >
              Get started free
              <ArrowRight className="size-4" />
            </Button>
          </a>
          <a href="#how-it-works">
            <Button
              variant="outline"
              className="rounded-full px-7 h-11 text-base border-neutral-300 text-neutral-700 hover:bg-neutral-100"
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
