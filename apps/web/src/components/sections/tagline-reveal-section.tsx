"use client";

import { useEffect, useRef, useState } from "react";

const TAGLINE_WORDS = [
  "Turn",
  "casual",
  "customer",
  "praise",
  "into",
  "high",
  "converting",
  "social",
  "proof",
  "walls",
  "in",
  "under",
  "three",
  "minutes.",
];

export default function TaglineRevealSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start revealing when the top of the section enters the bottom 80% of viewport
      // Complete reveal when the section reaches middle of viewport
      const start = windowHeight * 0.85;
      const end = windowHeight * 0.35;

      const progress = Math.min(
        1,
        Math.max(0, (start - rect.top) / (start - end))
      );

      const wordsToActivate = Math.round(progress * TAGLINE_WORDS.length);
      setActiveCount(wordsToActivate);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[60vh] items-center justify-center bg-white px-4 py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-[680px] text-center">
        <p className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
          The core advantage
        </p>
        <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl [text-wrap:balance]">
          {TAGLINE_WORDS.map((word, index) => {
            const isActive = index < activeCount;
            return (
              <span
                key={`${word}-${index}`}
                className="inline-block transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] mr-[0.28em] last:mr-0"
                style={{
                  color: isActive ? "#181818" : "#d1d5db",
                  transform: isActive ? "translateY(0px)" : "translateY(4px)",
                  filter: isActive ? "blur(0px)" : "blur(0.5px)",
                }}
              >
                {word}
              </span>
            );
          })}
        </h2>
        <p className="mt-6 text-sm font-medium text-neutral-500 sm:text-base [text-wrap:pretty]">
          No manual code tweaks. No waiting on developer sprints. Just automated trust.
        </p>
      </div>
    </section>
  );
}
