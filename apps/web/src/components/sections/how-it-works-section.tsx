"use client";

import { LinkSimple, VideoCamera, Code } from "@phosphor-icons/react";

const STEPS = [
  {
    number: "01",
    icon: LinkSimple,
    title: "Share your collection link",
    description:
      "Generate a branded collection page with custom prompt questions and your logo in sixty seconds. Send via email, SMS, or post purchase redirects.",
  },
  {
    number: "02",
    icon: VideoCamera,
    title: "Gather authentic video and text",
    description:
      "Customers record quick video reviews or type feedback with automatic transcription, permissions, and zero app download requirements.",
  },
  {
    number: "03",
    icon: Code,
    title: "Embed with a single script tag",
    description:
      "Paste one lightweight embed code into Webflow, Framer, Next.js, WordPress, or Shopify to show live customer proof that updates automatically.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative bg-white px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-[680px] text-center">
          <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700">
            Three simple steps
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl [text-wrap:balance]">
            From zero reviews to live social proof in minutes
          </h2>
          <p className="mt-3 text-base text-neutral-500 sm:text-lg [text-wrap:pretty]">
            No complex backend configuration. Share your link and watch high converting reviews roll into your dashboard.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map(({ number, icon: Icon, title, description }) => (
            <div
              key={number}
              className="relative flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-neutral-300 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-900">
                    <Icon className="size-5" weight="bold" />
                  </div>
                  <span className="text-xs font-bold tracking-wider text-neutral-400">
                    {number}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold text-neutral-900 [text-wrap:balance]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 [text-wrap:pretty]">
                  {description}
                </p>
              </div>

              <div className="mt-6 border-t border-neutral-100 pt-4">
                <span className="text-xs font-semibold text-neutral-500">
                  Step {number}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
