"use client";

import { ChevronLeft, FileText, Shield, Globe, Lock, Scale } from "lucide-react";
import Link from "next/link";

export default function DPAPage() {
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
            <Shield className="size-5 text-pink-600" />
            <span className="text-[15px] font-black tracking-tight text-neutral-900 uppercase">
              KudosWall
            </span>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pt-32 pb-24">
        <div className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-[11px] font-bold tracking-widest text-pink-600 uppercase">
            <FileText className="size-3" /> Legal Document
          </div>
          <h1
            className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Data Processing Agreement
          </h1>
          <p className="text-lg font-medium text-neutral-500">
            Last updated: April 13, 2026 • Version 1.0
          </p>
        </div>

        <div className="prose prose-neutral max-w-none space-y-12 text-[15px] leading-relaxed text-neutral-700">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">1. Introduction</h2>
            <p>
              This Data Processing Agreement ("DPA") forms part of the Master Subscription Agreement
              or other written or electronic agreement between KudosWall and the Customer for the
              purchase of online services from KudosWall (the "Agreement") to reflect the parties'
              agreement with regard to the Processing of Personal Data.
            </p>
            <p>
              By using our services, the Customer enters into this DPA on behalf of itself and, to
              the extent required under applicable Data Protection Laws, in the name and on behalf
              of its Authorized Affiliates.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">2. Definitions</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>"Data Protection Laws":</strong> means all laws and regulations, including
                laws and regulations of the European Union, the European Economic Area and their
                member states, Switzerland and the United Kingdom, applicable to the Processing of
                Personal Data under the Agreement.
              </li>
              <li>
                <strong>"GDPR":</strong> means the Regulation (EU) 2016/679 of the European
                Parliament and of the Council (General Data Protection Regulation).
              </li>
              <li>
                <strong>"Personal Data":</strong> means any information relating to an identified or
                identifiable natural person.
              </li>
              <li>
                <strong>"Processing":</strong> means any operation or set of operations which is
                performed upon Personal Data.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="border-l-4 border-pink-500 py-1 pl-4 text-2xl font-bold text-neutral-900">
              3. Privacy-First Commitment
            </h2>
            <p className="font-medium text-neutral-900">
              KudosWall is designed with a "Privacy by Design" architecture.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
                <Globe className="mb-3 size-5 text-pink-500" />
                <h4 className="mb-1 font-bold text-neutral-900">Cookie-less Tracking</h4>
                <p className="text-[13px] text-neutral-500">
                  We use anonymized IP/User-Agent hashing for impression tracking. No tracking
                  cookies are used for widget visitors.
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5">
                <Lock className="mb-3 size-5 text-blue-500" />
                <h4 className="mb-1 font-bold text-neutral-900">Encryption</h4>
                <p className="text-[13px] text-neutral-500">
                  All data is encrypted in transit via TLS and at rest via AES-256 encryption
                  standards.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">4. Processing of Personal Data</h2>
            <p>
              KudosWall shall Process Personal Data only for the purposes described in this DPA and
              in accordance with Customer's documented instructions. Customer instructs KudosWall to
              Process Personal Data to provide the Services and related technical support.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900">5. Sub-processors</h2>
            <p>KudosWall currently uses the following sub-processors to provide the services:</p>
            <div className="overflow-hidden rounded-2xl border border-neutral-100">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-neutral-50 font-bold text-neutral-900">
                  <tr>
                    <th className="px-4 py-3">Sub-processor</th>
                    <th className="px-4 py-3">Entity Type</th>
                    <th className="px-4 py-3">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  <tr>
                    <td className="px-4 py-3 font-bold">Vercel Inc.</td>
                    <td className="px-4 py-3">Cloud Hosting</td>
                    <td className="px-4 py-3">USA</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold">Neon Database</td>
                    <td className="px-4 py-3">Database Hosting</td>
                    <td className="px-4 py-3">USA</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold">Cloudflare R2</td>
                    <td className="px-4 py-3">Storage (Videos)</td>
                    <td className="px-4 py-3">Global</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold">Resend</td>
                    <td className="px-4 py-3">Email Service</td>
                    <td className="px-4 py-3">USA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="rounded-3xl bg-neutral-900 p-8 text-white shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <Scale className="size-6 text-pink-400" />
              <h3 className="text-xl font-bold">Compliance Verification</h3>
            </div>
            <p className="mb-6 text-[14px] text-neutral-400">
              This DPA ensures that all data processed by KudosWall is handled according to the
              highest security standards. You can sign this agreement instantly from your Workspace
              Settings.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-bold">
                GDPR Ready
              </div>
              <div className="rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-bold">
                CCPA Compliant
              </div>
              <div className="rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-bold">
                SOC2 Aligned
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
              className="text-[13px] font-bold text-neutral-400 transition-colors hover:text-neutral-900"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
