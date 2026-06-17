import {
  ChevronLeft,
  Shield,
  Lock,
  Eye,
  Database,
  Globe,
  UserCheck,
  Activity,
  Mic,
  Smartphone,
  Trash2,
  AlertTriangle,
  Mail,
  Calendar,
  Layers,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | AquaIQ - AI-Powered Hydration Tracker",
  description:
    "Protecting your privacy is our top priority. Read the AquaIQ Privacy Policy to understand how we collect, use, store, and protect your data.",
};

export default function AquaIQPrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-cyan-100 selection:text-cyan-900">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[14px] font-bold text-slate-400 transition-colors hover:text-slate-900"
          >
            <ChevronLeft className="size-4" />
            Back to KudosWall
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-600 text-[12px] font-black text-white">
              H₂
            </span>
            <span className="text-[15px] font-black tracking-tight text-slate-900 uppercase">
              AquaIQ
            </span>
          </div>
          <div className="w-24" /> {/* Spacer */}
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-4xl px-6 pt-32 pb-24">
        {/* Hero Section */}
        <div className="mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3.5 py-1 text-[11px] font-bold tracking-wider text-cyan-700 uppercase">
            <Lock className="size-3" /> Privacy Policy
          </div>
          <h1
            className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Privacy Policy for AquaIQ
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4 text-slate-400" />
              Effective Date: June 17, 2026
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            <span>Last Updated: June 17, 2026</span>
          </div>
        </div>

        {/* Intro Banner */}
        <div className="mb-12 rounded-2xl border border-cyan-100/80 bg-gradient-to-br from-cyan-50/30 to-blue-50/20 p-6 shadow-sm">
          <p className="text-base leading-relaxed text-slate-700">
            At <strong>AquaIQ</strong>, accessible via our mobile application and related services,
            protecting your privacy is our top priority. This Privacy Policy describes how AquaIQ
            collects, uses, stores, and protects your information, as well as your rights regarding
            your data.
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-16 text-[15px] leading-relaxed text-slate-700">
          {/* Section 1 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 font-bold text-cyan-600">
                1
              </span>
              <h2 className="text-2xl font-bold text-slate-900">Information We Collect</h2>
            </div>
            <p className="text-slate-600">
              We collect information to provide a better, customized hydration tracking and
              AI-coaching experience.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <UserCheck className="size-5" />
                </div>
                <h3 className="mb-2 font-bold text-slate-900">A. Personal Account Data</h3>
                <p className="text-[13px] leading-relaxed text-slate-500">
                  If you register or log in using an email account or Google Sign-In: name, email
                  address, password, custom username, and profile picture URL.
                </p>
                <div className="mt-3 text-[11px] font-semibold text-slate-400 italic">
                  * Note: Guest accounts operate locally and do not transmit credentials.
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Activity className="size-5" />
                </div>
                <h3 className="mb-2 font-bold text-slate-900">B. Health & Hydration Metrics</h3>
                <p className="text-[13px] leading-relaxed text-slate-500">
                  Biological sex, weight, height, age, BMI ranges, logs of daily beverage
                  consumption, progress rates, goal achievements, and historical hydration charts.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <Mic className="size-5" />
                </div>
                <h3 className="mb-2 font-bold text-slate-900">C. Voice & Audio Data</h3>
                <p className="text-[13px] leading-relaxed text-slate-500">
                  When using the AI Hydration Coach voice feature, microphone access is requested.
                  Voice recordings are processed locally or via secure APIs to translate
                  speech-to-text.
                </p>
                <div className="mt-3 inline-block rounded bg-cyan-50/50 px-2 py-1 text-[11px] font-semibold text-cyan-600">
                  Audio recordings are NOT stored on our servers.
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                  <Smartphone className="size-5" />
                </div>
                <h3 className="mb-2 font-bold text-slate-900">D. Device & App Usage Data</h3>
                <p className="text-[13px] leading-relaxed text-slate-500">
                  Application settings, notification preferences (interval, alert windows, active
                  days), and local database versions stored using local caching utilities.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 font-bold text-cyan-600">
                2
              </span>
              <h2 className="text-2xl font-bold text-slate-900">How We Use Your Information</h2>
            </div>
            <p className="text-slate-600">
              We use the collected information for the following purposes:
            </p>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "Calculating your daily baseline water intake goals based on biological sex, weight, height, and age.",
                "Generating personalized hydration answers, weekly summaries, and physical wellness suggestions from the AI Coach.",
                "Creating weekly, monthly, and yearly historical calendars, wave charts, and completion badges.",
                "Triggering automatic remind alerts during your selected waking hours via local notifications.",
                "Verifying in-app purchases and billing validation status for removing advertisements.",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex gap-3 rounded-xl border border-slate-100 bg-white/60 p-4 text-[13.5px] text-slate-600"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-[11px] font-bold text-cyan-700">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 font-bold text-cyan-600">
                3
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                Data Storage, Security, and Caching
              </h2>
            </div>
            <p className="text-slate-600">
              We utilize robust data protection mechanisms to keep your inputs safe:
            </p>
            <div className="space-y-4">
              <div className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <Database className="size-6 shrink-0 text-cyan-600" />
                <div>
                  <h4 className="font-bold text-slate-900">Local Storage (Offline First)</h4>
                  <p className="mt-1 text-[13px] text-slate-500">
                    All personal statistics, water intake history, timeline rows, and AI Coach
                    conversations are stored directly on your physical device inside a secure{" "}
                    <strong>Hive Database</strong> and <strong>SharedPreferences</strong>.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <Lock className="size-6 shrink-0 text-blue-600" />
                <div>
                  <h4 className="font-bold text-slate-900">Cloud Security (Firebase Auth)</h4>
                  <p className="mt-1 text-[13px] text-slate-500">
                    User account credentials and login sessions are managed securely by{" "}
                    <strong>Firebase Authentication</strong> using standard encryption algorithms.
                    We do not store plain-text passwords.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <Globe className="size-6 shrink-0 text-emerald-600" />
                <div>
                  <h4 className="font-bold text-slate-900">Data Transmission</h4>
                  <p className="mt-1 text-[13px] text-slate-500">
                    All communications between the app and external services (e.g., Firebase, AI
                    endpoints) utilize secure HTTPS protocols.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 font-bold text-cyan-600">
                4
              </span>
              <h2 className="text-2xl font-bold text-slate-900">Third-Party Services</h2>
            </div>
            <p className="text-slate-600">
              AquaIQ integrates the following third-party processors to operate purchase processes
              and cloud authentications:
            </p>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 font-bold text-slate-900">
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4">Processor / Service</th>
                    <th className="px-6 py-4">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      Google Play Services / Apple App Store Billing
                    </td>
                    <td className="px-6 py-4">
                      For processing premium purchases and removing advertisements.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      Firebase Services (Google LLC)
                    </td>
                    <td className="px-6 py-4">
                      For identity validation and cloud login synchronization.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="rounded-xl bg-slate-100/80 p-4.5 text-center text-xs font-semibold text-slate-500">
              We do not sell, rent, or lease your personal data to advertising networks or external
              third parties.
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 font-bold text-cyan-600">
                5
              </span>
              <h2 className="text-2xl font-bold text-slate-900">Your Rights and Data Deletion</h2>
            </div>
            <p className="text-slate-600">
              We believe in complete transparency and your right to control your digital footprint.
            </p>

            <div className="space-y-4 rounded-2xl border border-amber-100 bg-amber-50/40 p-6">
              <div className="text-amber-850 flex items-center gap-2 text-sm font-bold">
                <Trash2 className="size-5 text-amber-600" />
                In-App Data Deletion Instructions
              </div>
              <p className="text-sm text-slate-600">
                You can permanently delete your data at any time directly within the application:
              </p>
              <ol className="list-inside list-decimal space-y-2 text-sm font-medium text-slate-700">
                <li>
                  Open the application and navigate to the{" "}
                  <span className="font-bold">Settings</span> screen.
                </li>
                <li>
                  Tap the <span className="font-bold text-rose-600">Delete Account</span> button
                  (visible to authenticated users).
                </li>
                <li>Confirm your choice in the verification dialog.</li>
              </ol>
            </div>

            <div className="mt-6 space-y-4">
              <h4 className="text-base font-bold text-slate-900">
                What Happens Upon Account Deletion:
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-white p-4">
                  <h5 className="mb-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Firebase Auth Account
                  </h5>
                  <p className="text-[13px] text-slate-600">
                    Your cloud identity and authentication record are deleted permanently from
                    Firebase.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-4">
                  <h5 className="mb-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Local Profiles Wiped
                  </h5>
                  <p className="text-[13px] text-slate-600">
                    Your locally saved custom username, email cache, and profile avatar images are
                    permanently deleted.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-4">
                  <h5 className="mb-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
                    Database Purging
                  </h5>
                  <p className="text-[13px] text-slate-600">
                    All Hive storage files (water logs, custom presets, reminders, and chat history)
                    are fully erased from your device's local directories.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white p-4">
                  <h5 className="mb-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
                    SharedPreferences Cleared
                  </h5>
                  <p className="text-[13px] text-slate-600">
                    All custom notification schedules, units, intervals, and dark mode flags are
                    reset to factory defaults.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 font-bold text-cyan-600">
                6
              </span>
              <h2 className="text-2xl font-bold text-slate-900">Children's Privacy</h2>
            </div>
            <p className="text-slate-600">
              Our services are not directed at individuals under the age of 13. We do not knowingly
              collect personal identifiable information from children under 13. If we discover that
              a child under 13 has provided us with personal credentials, we will delete it
              immediately from our servers.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 font-bold text-cyan-600">
                7
              </span>
              <h2 className="text-2xl font-bold text-slate-900">Changes to This Privacy Policy</h2>
            </div>
            <p className="text-slate-600">
              We may update our Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy document on this page and updating the "Effective
              Date" at the top.
            </p>
          </section>

          {/* Section 8 & Contact Card */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 font-bold text-cyan-600">
                8
              </span>
              <h2 className="text-2xl font-bold text-slate-900">Contact Us</h2>
            </div>
            <p className="text-slate-600">
              If you have any questions or suggestions regarding our Privacy Policy, please contact
              us:
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <a
                href="mailto:support@your-saas-website.com"
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-cyan-200 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Email Support</h4>
                  <p className="mt-0.5 text-[13px] text-slate-500">support@your-saas-website.com</p>
                </div>
              </a>

              <a
                href="https://your-saas-website.com/aquaiq/support"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-cyan-200 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Globe className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Website Support</h4>
                  <p className="mt-0.5 text-[13px] text-slate-500">
                    your-saas-website.com/aquaiq/support
                  </p>
                </div>
              </a>
            </div>
          </section>
        </div>

        {/* ── Privacy Shield Badge ────────────────────────────────────────── */}
        <div className="relative mt-16 overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -bottom-10 text-[150px] font-black opacity-5 select-none"
          >
            H₂O
          </div>
          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3">
              <Shield className="size-6 text-cyan-400" />
              <h3 className="text-xl font-bold">Privacy-First Hydration Coaching</h3>
            </div>
            <p className="mb-6 max-w-xl text-[14px] leading-relaxed text-slate-400">
              AquaIQ is dedicated to providing secure, local-first hydration tracking. We do not
              sell your health data, and we collect only what is necessary to compute goals and run
              your AI Coach.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-semibold text-slate-200">
                Offline-First Hive DB
              </div>
              <div className="rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-semibold text-slate-200">
                No Cloud Audio Storage
              </div>
              <div className="rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-semibold text-slate-200">
                GDPR & HIPAA Compliant Data Flow
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 bg-white px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-[13px] text-slate-400">© 2026 KudosWall. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-[13px] font-bold text-slate-400 transition-colors hover:text-slate-900"
            >
              KudosWall Privacy
            </Link>
            <Link
              href="/terms"
              className="text-[13px] font-bold text-slate-400 transition-colors hover:text-slate-900"
            >
              Terms of Service
            </Link>
            <Link
              href="/dpa"
              className="text-[13px] font-bold text-slate-400 transition-colors hover:text-slate-900"
            >
              DPA
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
