"use client";

import { useState } from "react";
import {
  Settings,
  Globe,
  Bell,
  CreditCard,
  Users,
  ShieldAlert,
  Save,
  Upload,
  Link,
  ChevronRight,
  ExternalLink,
  Mail,
  Zap,
  Trash2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "general" | "collection" | "billing" | "team";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [workspaceName, setWorkspaceName] = useState("Acme Marketing");
  const [slug, setSlug] = useState("acme-marketing");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 md:flex-row">
      {/* ── Left Navigation ────────────────────────────────────────────── */}
      <div className="w-full space-y-1 md:w-64">
        {[
          { id: "general", label: "General", icon: Settings },
          { id: "collection", label: "Collection Page", icon: Globe },
          { id: "billing", label: "Billing & Plans", icon: CreditCard },
          { id: "team", label: "Team Members", icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[14px] font-bold transition-all ${
              activeTab === tab.id
                ? "border border-neutral-100 bg-white text-neutral-900 shadow-sm"
                : "text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600"
            }`}
          >
            <tab.icon className={`size-4 ${activeTab === tab.id ? "text-pink-600" : ""}`} />
            {tab.label}
          </button>
        ))}

        <div className="mt-6 border-t border-neutral-100 pt-6">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[14px] font-bold text-rose-500 transition-all hover:bg-rose-50"
          >
            <Trash2 className="size-4" />
            Delete Workspace
          </button>
        </div>
      </div>

      {/* ── Right Content ─────────────────────────────────────────────── */}
      <div className="flex-1 space-y-6">
        {/* General Tab */}
        {activeTab === "general" && (
          <div className="space-y-8 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
            <section className="space-y-6">
              <h3 className="text-lg font-bold tracking-tight text-neutral-900">
                Workspace Identity
              </h3>

              {/* Logo Upload */}
              <div className="flex items-center gap-6">
                <div className="group flex size-16 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 transition-all hover:border-pink-300">
                  <Upload className="size-5 text-neutral-300 group-hover:text-pink-400" />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-neutral-800">Workspace Logo</h4>
                  <p className="mt-0.5 text-[11px] text-neutral-400">JPG, PNG or SVG. Max 2MB.</p>
                </div>
              </div>

              {/* Name & Slug */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-2.5 text-[14px] font-medium transition-all outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    URL Slug
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 text-[13px] font-medium text-neutral-300">
                      wall.me/
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-2.5 text-[14px] font-medium transition-all outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6 border-t border-neutral-50 pt-8">
              <h3 className="text-lg font-bold tracking-tight text-neutral-900">
                Email Notifications
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Daily Summary",
                    desc: "Receive a digest of your new testimonials every 24h.",
                  },
                  {
                    label: "Instant Alerts",
                    desc: "A notification email for every new submission.",
                  },
                ].map((pref) => (
                  <div
                    key={pref.label}
                    className="flex items-center justify-between rounded-2xl border border-neutral-50 p-4 transition-all hover:bg-neutral-50/50"
                  >
                    <div>
                      <h4 className="text-[14px] font-bold text-neutral-800">{pref.label}</h4>
                      <p className="text-[11px] text-neutral-400">{pref.desc}</p>
                    </div>
                    <button
                      type="button"
                      className="relative flex h-5 w-10 items-center rounded-full bg-emerald-500 px-1"
                    >
                      <div className="size-3.5 translate-x-4.5 rounded-full bg-white" />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex justify-end pt-6">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full px-6 py-2.5 text-[14px] font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: "#171717" }}
              >
                <Save className="size-4" />
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Collection Tab */}
        {activeTab === "collection" && (
          <div className="space-y-8 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
            <section className="space-y-6">
              <h3 className="text-lg font-bold tracking-tight text-neutral-900">
                Sender Experience
              </h3>
              <p className="text-[13px] text-neutral-400">
                Customize what your customers see when they record a testimonial.
              </p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Headline
                  </label>
                  <input
                    type="text"
                    defaultValue="Help us grow by sharing your story!"
                    className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-2.5 text-[14px] font-medium outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Question to customers
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="How has our product helped you achieve your goals this month?"
                    className="w-full resize-none rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-2.5 text-[14px] font-medium outline-none"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6 border-t border-neutral-50 pt-8">
              <h3 className="text-lg font-bold tracking-tight text-neutral-900">Post-Submission</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Custom Redirect URL
                  </label>
                  <div className="relative">
                    <Link className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-neutral-300" />
                    <input
                      type="url"
                      placeholder="https://yourwebsite.com/welcome"
                      className="w-full rounded-xl border border-neutral-100 bg-neutral-50 py-2.5 pr-4 pl-11 text-[14px] font-medium outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-end pt-6">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full px-6 py-2.5 text-[14px] font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: "#171717" }}
              >
                <Save className="size-4" />
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <div className="space-y-8 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
            <section className="space-y-6">
              <h3 className="text-lg font-bold tracking-tight text-neutral-900">Active Plan</h3>

              <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl bg-neutral-900 p-6 text-white sm:flex-row">
                <div className="absolute top-[-20%] right-[-10%] size-64 rounded-full bg-pink-500/20 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] size-48 rounded-full bg-blue-500/10 blur-[80px]" />

                <div className="z-10 flex-1">
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/20 px-2.5 py-1 text-[10px] font-bold tracking-widest text-pink-300 uppercase">
                    <Zap className="size-3" /> Premium Plan
                  </div>
                  <h4 className="text-3xl font-bold tracking-tight">
                    $29<span className="text-lg font-medium text-neutral-400">/mo</span>
                  </h4>
                  <p className="mt-2 text-[13px] text-neutral-400">
                    Next billing date: <strong>April 28, 2026</strong>
                  </p>
                </div>

                <div className="z-10 flex w-full flex-col gap-2 sm:w-auto">
                  <button
                    type="button"
                    className="rounded-full bg-white px-6 py-2.5 text-[13px] font-bold text-neutral-900 transition-all hover:bg-neutral-100"
                  >
                    Manage Subscription
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-neutral-700 bg-neutral-800 px-6 py-2.5 text-[13px] font-bold text-white transition-all hover:bg-neutral-700"
                  >
                    View Invoices
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: "Testimonials", value: "∞" },
                  { label: "Workspaces", value: "1 / 3" },
                  { label: "Uploads", value: "Unlimited" },
                  { label: "Team", value: "3 Members" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-neutral-100 bg-white p-4"
                  >
                    <p className="mb-1.5 text-[10px] leading-none font-bold tracking-widest text-neutral-400 uppercase">
                      {stat.label}
                    </p>
                    <p className="text-[18px] leading-none font-bold text-neutral-900">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === "team" && (
          <div className="space-y-6 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-tight text-neutral-900">Team Members</h3>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[12px] font-bold text-neutral-900 transition-all hover:bg-neutral-50"
              >
                <Users className="size-3.5 text-neutral-400" />
                Invite Member
              </button>
            </div>

            <div className="divide-y divide-neutral-50">
              {[
                { name: "John Doe", email: "john@acme.com", role: "Owner" },
                { name: "Jane Smith", email: "jane@acme.com", role: "Editor" },
                { name: "Mike Ross", email: "mike@acme.com", role: "Viewer" },
              ].map((member) => (
                <div key={member.email} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-neutral-100 font-bold text-neutral-400">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-[14px] leading-none font-bold text-neutral-800">
                        {member.name}
                      </h4>
                      <p className="mt-1 text-[12px] text-neutral-400">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded-full border border-neutral-100 bg-neutral-50 px-2 py-0.5 text-[11px] font-bold text-neutral-400 uppercase">
                      {member.role}
                    </span>
                    <button
                      type="button"
                      className="text-neutral-300 transition-colors hover:text-neutral-500"
                    >
                      <ArrowUpRight className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}
