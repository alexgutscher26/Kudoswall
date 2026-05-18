"use client";

import Link from "next/link";
import type { Route } from "next";
import {
  ArrowLeft,
  LifeBuoy,
  Search,
  ExternalLink,
  MessageSquare,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { Input } from "@my-better-t-app/ui/components/input";

export default function GlobalNotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#fafafa] py-20">
      {/* Premium Background Patterns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Soft radial glows */}
        <div className="absolute top-[-10%] right-[-5%] size-[500px] rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] size-[600px] rounded-full bg-blue-500/5 blur-[120px]" />

        {/* Dot grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,1) 1.5px, transparent 1.5px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-[28px] border border-neutral-100 bg-white shadow-xl transition-all duration-500 hover:scale-110 hover:rotate-6">
            <LifeBuoy className="size-10 text-pink-500" />
          </div>

          <h1
            className="mb-4 text-7xl font-black tracking-tighter text-neutral-900 sm:text-8xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            404
          </h1>

          <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-800">
            Lost at sea? Let&apos;s find your way back.
          </h2>

          <p className="mx-auto mb-10 max-w-md text-[15px] leading-relaxed font-medium text-neutral-500">
            The page you are looking for might have been moved, deleted, or simply never existed.
            Try searching for it below or explore common areas.
          </p>

          {/* Premium Search UI */}
          <div className="relative mx-auto mb-16 max-w-md">
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-pink-500/20 to-blue-500/20 opacity-0 blur transition duration-500 group-hover:opacity-100" />
              <div className="relative flex items-center">
                <Search className="absolute left-4 size-4 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="What are you looking for?"
                  className="h-14 border-neutral-100 bg-white pr-4 pl-11 shadow-sm transition-all focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <QuickLink
            href="/dashboard"
            icon={<Sparkles className="size-5" />}
            title="Dashboard"
            description="Manage your collections and testimonials"
          />
          <QuickLink
            href="/"
            icon={<CreditCard className="size-5" />}
            title="Pricing & Plans"
            description="Find the right plan for your business"
          />
          <QuickLink
            href="/"
            icon={<ArrowLeft className="size-5" />}
            title="Main Home"
            description="Back to the start of our story"
          />
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[13px] font-bold text-neutral-400 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-1" />
            Navigate back home
          </Link>
        </div>
      </div>
    </main>
  );
}

function QuickLink({
  href,
  icon,
  title,
  description,
}: {
  href: Route;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-pink-500/20 hover:shadow-xl hover:shadow-pink-500/5"
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-600 transition-colors group-hover:bg-pink-50 group-hover:text-pink-500">
        {icon}
      </div>
      <div>
        <h3 className="text-[15px] font-bold text-neutral-900 group-hover:text-pink-600">
          {title}
        </h3>
        <p className="text-[13px] leading-relaxed text-neutral-400">{description}</p>
      </div>
      <ExternalLink className="ml-auto size-3 opacity-0 transition-opacity group-hover:opacity-40" />
    </Link>
  );
}
