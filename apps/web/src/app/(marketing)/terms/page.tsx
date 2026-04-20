"use client";

import {
  ChevronLeft,
  Gavel,
  Scale,
  BookOpen,
  UserCheck,
  CreditCard,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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
            <Scale className="size-5 text-orange-600" />
            <span className="text-[15px] font-black tracking-tight text-neutral-900 uppercase">
              KudosWall
            </span>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <div className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold tracking-widest text-orange-600 uppercase">
            <Gavel className="size-3" /> Terms of Service
          </div>
          <h1
            className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Terms of Service
          </h1>
          <p className="text-lg font-medium text-neutral-500">
            Last updated: April 13, 2026 • Version 1.0
          </p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-12 text-[15px] leading-relaxed text-neutral-700">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">1. Agreement to Terms</h2>
            <p>
              By accessing or using KudosWall (the "Service"), you agree to be bound by these Terms
              of Service. If you do not agree to all the terms and conditions of this agreement,
              then you may not access the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="border-l-4 border-orange-500 py-1 pl-4 text-2xl font-bold text-neutral-900">
              2. Description of Service
            </h2>
            <p>
              KudosWall provides a platform for collecting, managing, and displaying testimonials.
              We offer various tools including embeddable widgets, hosted collection pages, and
              analytics.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
                <BookOpen className="mb-3 size-5 text-orange-500" />
                <h4 className="mb-1 font-bold text-neutral-900">Usage Rights</h4>
                <p className="text-[13px] text-neutral-500">
                  We grant you a limited, non-exclusive, non-transferable license to use the Service
                  for your business or personal needs.
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
                <UserCheck className="mb-3 size-5 text-green-500" />
                <h4 className="mb-1 font-bold text-neutral-900">Your Content</h4>
                <p className="text-[13px] text-neutral-500">
                  You retain all rights to the testimonials and content you collect. You grant us a
                  license to host and display this content on your behalf.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">3. Account Responsibilities</h2>
            <p>
              To use most features of KudosWall, you must register for an account. You are
              responsible for maintaining the confidentiality of your account credentials and for
              all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">4. Payment and Subscriptions</h2>
            <div className="rounded-2xl bg-neutral-50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <CreditCard className="size-5 text-blue-600" />
                <h3 className="font-bold text-neutral-900">Billing Terms</h3>
              </div>
              <ul className="space-y-3 text-[14px]">
                <li className="flex gap-2">
                  <span className="font-bold text-neutral-900">•</span>
                  <span>Subscription fees are billed in advance on a monthly or annual basis.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-neutral-900">•</span>
                  <span>All fees are non-refundable except where required by law.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-neutral-900">•</span>
                  <span>We reserve the right to change our prices with 30 days' notice.</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">5. Prohibited Conduct</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Violate any laws or regulations</li>
              <li>Post or collect fraudulent or misleading testimonials</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Reverse engineer any part of the Service</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">6. Limitation of Liability</h2>
            <div className="rounded-2xl border border-red-100 bg-red-50/30 p-6">
              <div className="mb-4 flex items-center gap-3 text-red-700">
                <ShieldAlert className="size-5" />
                <h3 className="font-bold">Important Disclaimer</h3>
              </div>
              <p className="text-[14px] text-red-900/80">
                In no event shall KudosWall, its directors, or employees be liable for any indirect,
                incidental, special, consequential or punitive damages resulting from your use of
                the service. The service is provided "as is" without warranty of any kind.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">7. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the Service immediately,
              without prior notice or liability, under our sole discretion, for any reason
              whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <div className="rounded-3xl bg-neutral-900 p-8 text-white shadow-xl">
            <h3 className="mb-4 text-xl font-bold">Questions?</h3>
            <p className="mb-6 text-[14px] text-neutral-400">
              If you have any questions about these Terms, please contact our legal team at
              legal@kudoswall.org.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-bold">
                Clear Terms
              </div>
              <div className="rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-bold">
                No Hidden Fees
              </div>
              <div className="rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-bold">
                User-Centric
              </div>
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
              className="text-[13px] font-bold text-neutral-900 underline transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/dpa"
              className="text-[13px] font-bold text-neutral-400 transition-colors hover:text-neutral-900"
            >
              DPA
            </Link>
            <Link
              href="/security/responsible-disclosure"
              className="text-[13px] font-bold text-neutral-400 transition-colors hover:text-neutral-900"
            >
              Security
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
