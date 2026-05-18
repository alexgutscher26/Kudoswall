"use client";

import { ChevronLeft, Shield, Lock, Send, Target, Heart, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ResponsibleDisclosurePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 z-50 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[14px] font-bold text-neutral-400 transition-colors hover:text-neutral-900"
          >
            <ChevronLeft className="size-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-blue-600" />
            <span className="text-[15px] font-black tracking-tight text-neutral-900 uppercase">
              KudosWall
            </span>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <div className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold tracking-widest text-green-600 uppercase">
            <Shield className="size-3" /> Security
          </div>
          <h1
            className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Responsible Disclosure
          </h1>
          <p className="text-lg font-medium text-neutral-500">
            Help us keep KudosWall secure for everyone.
          </p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-12 text-[15px] leading-relaxed text-neutral-700">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">Our Commitment</h2>
            <p>
              Security is a top priority at KudosWall. We believe that professional security
              researchers play a crucial role in the ecosystem. This policy is intended to give
              security researchers clear guidelines for conducting vulnerability discovery
              activities and to convey our preferences in how to submit discovered vulnerabilities
              to us.
            </p>
          </section>

          <section className="space-y-6">
            <div className="rounded-3xl border border-neutral-100 bg-neutral-50 p-8">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-neutral-900">
                <Target className="size-6 text-blue-500" />
                Vulnerability Disclosure Guidelines
              </h2>
              <div className="space-y-4 text-[14px]">
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle2 className="size-4 text-green-500" />
                  </div>
                  <p>
                    Notify us as soon as possible after you discover a real or potential security
                    issue.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle2 className="size-4 text-green-500" />
                  </div>
                  <p>
                    Provide a detailed description of the vulnerability and the steps required to
                    reproduce it.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle2 className="size-4 text-green-500" />
                  </div>
                  <p>
                    Make every effort to avoid privacy violations, degradation of user experience,
                    disruption to production systems, and destruction of data during security
                    testing.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <CheckCircle2 className="size-4 text-green-500" />
                  </div>
                  <p>
                    Give us a reasonable amount of time to resolve the issue before making any
                    information public.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900 underline decoration-blue-500/30 underline-offset-8">
              What is in Scope?
            </h2>
            <p>
              The following domains and services are included in our responsible disclosure program:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>kudoswall.org</strong> (Main website and marketing pages)
              </li>
              <li>
                <strong>app.kudoswall.org</strong> (Dashboard and principal platform)
              </li>
              <li>
                <strong>api.kudoswall.org</strong> (Public and internal APIs)
              </li>
              <li>Official KudosWall testimonial widgets and embed scripts</li>
            </ul>
            <p className="text-neutral-500 italic">
              Note: Third-party integrations or services used by KudosWall but not controlled by us
              are out of scope.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">Reporting a Vulnerability</h2>
            <p>
              If you believe you have discovered a security vulnerability, please send a report to:
            </p>
            <div className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <Send className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-neutral-900">security@kudoswall.org</p>
                <p className="text-[12px] text-neutral-500">
                  We typically respond within 48 hours.
                </p>
              </div>
            </div>
            <p className="mt-4">
              Please include as much information as possible, including screenshots, proofs of
              concept, and impact assessment.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">Rewards & Recognition</h2>
            <p>
              At this stage, KudosWall does not operate a paid bug bounty program. However, for
              significant findings that help us secure our platform, we may offer:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Official recognition on our Hall of Fame (optional)</li>
              <li>KudosWall "Security Hero" swag</li>
              <li>Free lifetime access to our Pro or Business plans</li>
            </ul>
          </section>

          <div className="rounded-3xl bg-neutral-900 p-8 text-white shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <Lock className="size-6 text-blue-400" />
              <h3 className="text-xl font-bold tracking-tight uppercase">Safe Harbor</h3>
            </div>
            <p className="mb-6 text-[14px] text-neutral-400">
              Any activities conducted in a manner consistent with this policy will be considered
              authorized conduct and we will not initiate legal action against you. If legal action
              is initiated by a third party against you in connection with activities conducted
              under this policy, we will take steps to make it known that your actions were
              conducted in compliance with this policy.
            </p>
            <div className="flex items-center gap-2 text-rose-400">
              <Heart className="size-4 fill-current" />
              <span className="text-[12px] font-black uppercase">Thank you for your help</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-100 px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-[13px] text-neutral-400">© 2026 KudosWall. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-[13px] font-bold text-neutral-400 transition-colors hover:text-neutral-900"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[13px] font-bold text-neutral-400 transition-colors hover:text-neutral-900"
            >
              Terms of Service
            </Link>
            <Link
              href="/security/responsible-disclosure"
              className="text-[13px] font-bold text-neutral-900 underline transition-colors"
            >
              Security
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
