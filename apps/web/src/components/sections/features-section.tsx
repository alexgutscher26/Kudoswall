"use client";

import { VideoCamera, TrendUp, Lightning, ShareNetwork } from "@phosphor-icons/react";

const BENEFITS = [
  {
    icon: VideoCamera,
    title: "Zero friction client responses",
    metric: "Under 60 seconds",
    description:
      "Customers record high definition video reviews or write testimonials straight in their browser without downloading apps or creating accounts.",
  },
  {
    icon: TrendUp,
    title: "Double your landing page conversions",
    metric: "+34.2% visitor lift",
    description:
      "Websites embedding KudosWall social proof report an average 34.2% lift in visitor signups within their first two weeks of display.",
  },
  {
    icon: Lightning,
    title: "Lightning fast edge delivery",
    metric: "Under 12kb payload",
    description:
      "Embed widgets load asynchronously from edge CDN locations with zero impact on Core Web Vitals or Google Lighthouse scores.",
  },
  {
    icon: ShareNetwork,
    title: "One click social ad exports",
    metric: "Instant graphics",
    description:
      "Turn top customer quotes into branded image cards and video snippets formatted for Twitter, LinkedIn, and high converting paid ad campaigns.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative bg-white px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-[680px] text-center">
          <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700">
            Measurable impact
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl [text-wrap:balance]">
            Engineered to turn skeptical visitors into buyers
          </h2>
          <p className="mt-3 text-base text-neutral-500 sm:text-lg [text-wrap:pretty]">
            Every feature is focused on one objective: converting casual browsers into paying customers with verified proof.
          </p>
        </div>

        {/* Benefits Grid (2x2) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {BENEFITS.map(({ icon: Icon, title, metric, description }) => (
            <div
              key={title}
              className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-neutral-300 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-900">
                    <Icon className="size-5" weight="bold" />
                  </div>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-800">
                    {metric}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold tracking-tight text-neutral-900 [text-wrap:balance]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 [text-wrap:pretty]">
                  {description}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-neutral-900">
                <span>Verified outcome</span>
                <span className="size-1 rounded-full bg-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
