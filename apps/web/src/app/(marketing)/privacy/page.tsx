"use client";

import { ChevronLeft, Shield, Lock, Eye, Database, Globe } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold tracking-widest text-blue-600 uppercase">
            <Lock className="size-3" /> Privacy Policy
          </div>
          <h1
            className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Privacy Policy
          </h1>
          <p className="text-lg font-medium text-neutral-500">
            Last updated: April 13, 2026 • Version 1.0
          </p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-12 text-[15px] leading-relaxed text-neutral-700">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">1. Introduction</h2>
            <p>
              At KudosWall, we take your privacy seriously. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you visit our website and
              use our platform to manage testimonials.
            </p>
            <p>
              By accessing or using KudosWall, you agree to the terms of this Privacy Policy. If you
              do not agree with the terms of this policy, please do not access the site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="border-l-4 border-blue-500 py-1 pl-4 text-2xl font-bold text-neutral-900">
              2. Information We Collect
            </h2>
            <p>We collect information that you provide directly to us, including:</p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
                <Database className="mb-3 size-5 text-blue-500" />
                <h4 className="mb-1 font-bold text-neutral-900">Account Data</h4>
                <p className="text-[13px] text-neutral-500">
                  Name, email address, and profile information provided during registration or OAuth
                  login (Google/GitHub).
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
                <Eye className="mb-3 size-5 text-purple-500" />
                <h4 className="mb-1 font-bold text-neutral-900">Usage Data</h4>
                <p className="text-[13px] text-neutral-500">
                  Analytics on how you interact with our dashboard, including configuration choices
                  and project settings.
                </p>
              </div>
            </div>
            <p className="mt-4 italic">
              * Note: For widget visitors, we use cookie-less tracking via anonymized hashing to
              respect visitor privacy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">3. How We Use Your Information</h2>
            <p>We use the collected information for various purposes, including to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Provide, operate, and maintain our platform</li>
              <li>Improve, personalize, and expand our services</li>
              <li>Understand and analyze how you use our platform</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you for customer service, updates, and marketing</li>
              <li>Process your transactions and manage your subscription</li>
              <li>Find and prevent fraud</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">4. Third-Party Services</h2>
            <p>
              We use trusted third-party services to help us operate KudosWall. Your data may be
              processed by:
            </p>
            <div className="overflow-hidden rounded-2xl border border-neutral-100">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-neutral-50 font-bold text-neutral-900">
                  <tr>
                    <th className="px-4 py-3">Provider</th>
                    <th className="px-4 py-3">Purpose</th>
                    <th className="px-4 py-3">Region</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  <tr>
                    <td className="px-4 py-3 font-bold">Vercel</td>
                    <td className="px-4 py-3">Hosting & Edge Functions</td>
                    <td className="px-4 py-3">USA/Global</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold">Neon</td>
                    <td className="px-4 py-3">Database Storage</td>
                    <td className="px-4 py-3">USA</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold">Resend</td>
                    <td className="px-4 py-3">Transactional Emails</td>
                    <td className="px-4 py-3">USA</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold">UploadThing</td>
                    <td className="px-4 py-3">File & Asset Storage</td>
                    <td className="px-4 py-3">Global</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">5. Data Security</h2>
            <p>
              We prioritize the security of your data. All communication is encrypted via TLS, and
              sensitive data is stored using industry-standard AES-256 encryption. While we strive
              to use commercially acceptable means to protect your personal information, we cannot
              guarantee its absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">6. Your Rights</h2>
            <p>
              Depending on your location, you may have the following rights regarding your personal
              data:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>The right to access the data we have on you</li>
              <li>The right to rectification (correcting inaccurate information)</li>
              <li>The right to erasure ("right to be forgotten")</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
          </section>

          <div className="rounded-3xl bg-neutral-900 p-8 text-white shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <Globe className="size-6 text-blue-400" />
              <h3 className="text-xl font-bold">Privacy-First Pledge</h3>
            </div>
            <p className="mb-6 text-[14px] text-neutral-400">
              KudosWall was built from the ground up to be privacy-compliant. We do not sell your
              data, and we collect only the minimum information required to deliver the service.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-bold">
                No Ad Cookies
              </div>
              <div className="rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-bold">
                GDPR Compliant
              </div>
              <div className="rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-bold">
                CCPA Compliant
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
              className="text-[13px] font-bold text-neutral-900 underline transition-colors"
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
