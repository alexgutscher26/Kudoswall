"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "@phosphor-icons/react";
import { Button } from "@my-better-t-app/ui/components/button";

export default function CtaSection() {
  return (
    <section className="relative bg-white px-4 py-24 sm:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700">
          <ShieldCheck className="size-4 text-emerald-600" weight="fill" />
          <span>14 day unrestricted trial</span>
        </div>

        {/* Headline */}
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl [text-wrap:balance]">
          Start collecting testimonials today
        </h2>

        {/* Subheadline */}
        <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg [text-wrap:pretty]">
          Join over 480 ambitious founders using KudosWall to turn happy customer praise into their highest converting sales asset.
        </p>

        {/* Primary Action Button */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/login">
            <Button className="group flex h-12 items-center gap-2 rounded-full bg-neutral-900 px-8 text-base font-semibold text-white shadow-xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] hover:bg-neutral-800 active:scale-[0.98]">
              <span>Start free trial</span>
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" weight="bold" />
            </Button>
          </Link>
        </div>

        {/* Risk Reversal Footer */}
        <p className="mt-4 text-xs font-medium text-neutral-500">
          No credit card required · Cancel anytime · Full access to Pro features
        </p>
      </div>
    </section>
  );
}
