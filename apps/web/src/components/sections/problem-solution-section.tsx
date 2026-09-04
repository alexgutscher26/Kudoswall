"use client";

import { XCircle, CheckCircle, WarningCircle, Sparkle } from "@phosphor-icons/react";

const PAIN_POINTS = [
  "Awkwardly chasing clients over email for quotes",
  "Dealing with huge video files that break inbox limits",
  "Manually taking screenshots and pasting them into Figma",
  "Heavy third party widgets that tank Core Web Vitals",
];

const OUTCOMES = [
  "One self serve link that collects video and text in two clicks",
  "Instant in browser recording with automatic permissions",
  "Pre built wall and badge widgets customizable in seconds",
  "Sub 12kb edge cached embeds that load at lightning speed",
];

export default function ProblemSolutionSection() {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-[680px] text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700">
            <Sparkle className="size-3.5 text-neutral-900" weight="bold" />
            <span>Why founders switch</span>
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl [text-wrap:balance]">
            Stop losing sales to skepticism
          </h2>
          <p className="mt-3 text-base text-neutral-500 sm:text-lg [text-wrap:pretty]">
            Most visitors leave because they cannot verify your claims. Turn your real results into your strongest asset.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* The Old Way */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-neutral-200/70 text-neutral-700">
                <WarningCircle className="size-5" weight="bold" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">
                The manual struggle
              </h3>
            </div>
            <p className="mt-3 text-sm text-neutral-500 [text-wrap:pretty]">
              How testimonial collection usually fails and wastes hours of founder time every week.
            </p>

            <ul className="mt-6 space-y-4">
              {PAIN_POINTS.map((pain) => (
                <li key={pain} className="flex items-start gap-3">
                  <XCircle className="mt-0.5 size-5 shrink-0 text-neutral-400" weight="fill" />
                  <span className="text-sm font-medium text-neutral-600 [text-wrap:pretty]">{pain}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* The KudosWall Way */}
          <div className="rounded-2xl border border-neutral-900 bg-neutral-900 p-6 text-white shadow-xl sm:p-8">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-white">
                <CheckCircle className="size-5" weight="fill" />
              </div>
              <h3 className="text-lg font-bold text-white">
                The KudosWall system
              </h3>
            </div>
            <p className="mt-3 text-sm text-neutral-400 [text-wrap:pretty]">
              Automated proof gathering and instant edge embedding designed for high conversion.
            </p>

            <ul className="mt-6 space-y-4">
              {OUTCOMES.map((outcome) => (
                <li key={outcome} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 size-5 shrink-0 text-white" weight="fill" />
                  <span className="text-sm font-medium text-neutral-200 [text-wrap:pretty]">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
