"use client";

import Link from "next/link";
import { Star, VideoCamera, ShieldCheck, Lightning, Users, ArrowRight, Play, Quotes } from "@phosphor-icons/react";
import { Button } from "@my-better-t-app/ui/components/button";

const PROOF_CARDS = [
  {
    name: "Marcus Vance",
    role: "Founder, ShipFast Labs",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    text: "Embedding the KudosWall widget increased our checkout conversion rate by 34.2% in our very first week.",
    metric: "+34.2% checkout rate",
    type: "text",
  },
  {
    name: "Elena Rostova",
    role: "Head of Growth, BentoUI",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    text: "Our users recorded genuine 30 second video reviews directly from their phone. Zero friction.",
    metric: "42 video reviews in 48h",
    type: "video",
  },
  {
    name: "Devon Chen",
    role: "Creator, Notion Mastery",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    text: "Setup took 3 minutes. I replaced messy static images with a live social proof feed that updates automatically.",
    metric: "Saved 4h weekly",
    type: "text",
  },
];

const LOGO_CLIENTS = [
  { name: "PostHog", label: "PostHog" },
  { name: "Linear", label: "Linear Apps" },
  { name: "Vercel Ecosystem", label: "NextLab" },
  { name: "Raycast", label: "Raycast Tools" },
  { name: "Supabase", label: "SupaFlow" },
  { name: "Cal.com", label: "CalHub" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden bg-white px-4 pt-28 pb-16 sm:px-6 lg:pt-36 lg:pb-24">
      {/* Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        
        {/* Rating and Social Proof Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-neutral-300">
          <div className="flex items-center gap-0.5 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={`star-${i}`} className="size-3.5 fill-amber-400" weight="fill" />
            ))}
          </div>
          <span className="text-xs font-semibold text-neutral-800">
            4.9/5 from 480+ founders and SaaS teams
          </span>
        </div>

        {/* Outcome Headline with left-to-right gradient */}
        <h1 className="mt-6 max-w-[680px] text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] [text-wrap:balance]">
          <span className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-500 bg-clip-text text-transparent">
            Collect video and text testimonials without chasing clients
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 max-w-[680px] text-base leading-relaxed text-neutral-600 sm:text-lg md:text-xl [text-wrap:pretty]">
          Send one simple link. Let your customers record video or write reviews in seconds, then embed high converting proof widgets on any site with zero code.
        </p>

        {/* Primary CTA Button (Single clear action) */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link href="/login">
            <Button className="group flex h-12 items-center gap-2 rounded-full bg-neutral-900 px-8 text-base font-semibold text-white shadow-xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] hover:bg-neutral-800 active:scale-[0.98]">
              <span>Start free trial</span>
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" weight="bold" />
            </Button>
          </Link>
        </div>

        {/* Risk Reversal Guarantee */}
        <p className="mt-3 text-xs font-medium text-neutral-500">
          14 day unrestricted trial · No credit card required · Setup in 3 minutes
        </p>

        {/* Hero Visual: Interactive Live Wall Preview */}
        <div className="relative mt-12 w-full max-w-4xl rounded-2xl border border-neutral-200 bg-neutral-50 p-4 shadow-2xl sm:p-6">
          {/* Top Window Bar */}
          <div className="mb-4 flex items-center justify-between border-b border-neutral-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-neutral-300" />
              <div className="size-2.5 rounded-full bg-neutral-300" />
              <div className="size-2.5 rounded-full bg-neutral-300" />
              <span className="ml-2 text-xs font-medium text-neutral-400">live-widget.kudoswall.org/embed</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <ShieldCheck className="size-3.5" weight="fill" />
              <span>Verified Testimonials</span>
            </div>
          </div>

          {/* Social Proof Cards Row */}
          <div className="grid grid-cols-1 gap-4 text-left md:grid-cols-3">
            {PROOF_CARDS.map((card) => (
              <div
                key={card.name}
                className="relative flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-md"
              >
                {card.type === "video" && (
                  <div className="relative mb-3 flex h-24 w-full items-center justify-center overflow-hidden rounded-lg bg-neutral-900">
                    <div className="flex size-9 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md">
                      <Play className="size-4 ml-0.5" weight="fill" />
                    </div>
                    <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                      0:28
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={`card-star-${i}`} className="size-3 fill-amber-400" weight="fill" />
                      ))}
                    </div>
                    {card.type === "text" && (
                      <Quotes className="size-4 text-neutral-300" weight="fill" />
                    )}
                  </div>

                  <p className="mt-2.5 text-xs font-normal leading-relaxed text-neutral-700 [text-wrap:pretty]">
                    "{card.text}"
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={card.avatar}
                      alt={card.name}
                      className="size-7 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-semibold text-neutral-900">{card.name}</p>
                      <p className="text-[10px] text-neutral-500">{card.role}</p>
                    </div>
                  </div>
                  <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-700">
                    {card.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trusted By Strip */}
        <div className="mt-14 w-full border-t border-neutral-100 pt-8">
          <p className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
            Powering social proof for fast moving teams
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale transition-opacity hover:opacity-90">
            {LOGO_CLIENTS.map((logo) => (
              <span key={logo.name} className="text-sm font-semibold tracking-tight text-neutral-700">
                {logo.label}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
