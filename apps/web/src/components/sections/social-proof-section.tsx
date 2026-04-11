"use client";
import { useEffect, useRef } from "react";

/**
 * SocialProofSection
 *
 * This is the LIVE Wall of Love.
 * It dynamically pulls your approved testimonials (Aisha, Tom, Sarah)
 * using the drop-in KudosWall script.
 */
export default function SocialProofSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // Small delay to ensure the DOM is ready for the widget to anchor
    const timer = setTimeout(() => {
      if (containerRef.current && !containerRef.current.querySelector("script")) {
        // This is the React-equivalent of dropping:
        // <script src="/widget.js" data-id="5475dd90-24ad-49b3-99a1-609c939ae199" async></script>
        const script = document.createElement("script");
        script.src = "/widget.js";
        script.setAttribute("data-id", "5475dd90-24ad-49b3-99a1-609c939ae199");
        script.async = true;

        // Optional: Adding custom overrides just like a power user might
        // script.setAttribute("data-theme", "light");

        containerRef.current.appendChild(script);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="social-proof" className="relative w-full overflow-hidden bg-white py-24 sm:py-32">
      {/* Background Decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
            Our <span className="text-pink-600">Wall of Love</span>
          </h2>
          <p className="mt-4 text-lg text-neutral-500">
            Real feedback from our amazing community, synced live via KudosWall.
          </p>
        </div>

        {/* The Widget Area */}
        <div className="relative mx-auto max-w-5xl">
          <div ref={containerRef} className="min-h-[400px] w-full" />
        </div>
      </div>
    </section>
  );
}
