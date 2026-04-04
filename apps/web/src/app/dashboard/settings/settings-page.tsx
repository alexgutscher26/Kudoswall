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
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* ── Left Navigation ────────────────────────────────────────────── */}
        <div className="w-full md:w-64 space-y-1">
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
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-white text-neutral-900 shadow-sm border border-neutral-100"
                  : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <tab.icon className={`size-4 ${activeTab === tab.id ? "text-pink-600" : ""}`} />
              {tab.label}
            </button>
          ))}
          
          <div className="pt-6 mt-6 border-t border-neutral-100">
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-bold text-rose-500 hover:bg-rose-50 transition-all"
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
            <div className="bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 shadow-sm space-y-8">
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-neutral-900 tracking-tight">Workspace Identity</h3>
                
                {/* Logo Upload */}
                <div className="flex items-center gap-6">
                  <div className="size-16 rounded-2xl bg-neutral-50 border-2 border-dashed border-neutral-200 flex items-center justify-center group cursor-pointer hover:border-pink-300 transition-all">
                    <Upload className="size-5 text-neutral-300 group-hover:text-pink-400" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-neutral-800">Workspace Logo</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">JPG, PNG or SVG. Max 2MB.</p>
                  </div>
                </div>

                {/* Name & Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Workspace Name</label>
                    <input
                      type="text"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-100 bg-neutral-50 font-medium text-[14px] outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">URL Slug</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-neutral-300 font-medium shrink-0">wall.me/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-100 bg-neutral-50 font-medium text-[14px] outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-6 pt-8 border-t border-neutral-50">
                <h3 className="text-lg font-bold text-neutral-900 tracking-tight">Email Notifications</h3>
                <div className="space-y-4">
                  {[
                    { label: "Daily Summary", desc: "Receive a digest of your new testimonials every 24h." },
                    { label: "Instant Alerts", desc: "A notification email for every new submission." },
                  ].map((pref) => (
                    <div key={pref.label} className="flex items-center justify-between p-4 rounded-2xl border border-neutral-50 hover:bg-neutral-50/50 transition-all">
                      <div>
                        <h4 className="text-[14px] font-bold text-neutral-800">{pref.label}</h4>
                        <p className="text-[11px] text-neutral-400">{pref.desc}</p>
                      </div>
                      <button type="button" className="relative w-10 h-5 bg-emerald-500 rounded-full flex items-center px-1">
                        <div className="size-3.5 bg-white rounded-full translate-x-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <div className="pt-6 flex justify-end">
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-bold text-white shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
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
            <div className="bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 shadow-sm space-y-8">
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-neutral-900 tracking-tight">Sender Experience</h3>
                <p className="text-[13px] text-neutral-400">Customize what your customers see when they record a testimonial.</p>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Headline</label>
                    <input
                      type="text"
                      defaultValue="Help us grow by sharing your story!"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-100 bg-neutral-50 font-medium text-[14px] outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Question to customers</label>
                    <textarea
                      rows={3}
                      defaultValue="How has our product helped you achieve your goals this month?"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-100 bg-neutral-50 font-medium text-[14px] outline-none resize-none"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-6 pt-8 border-t border-neutral-50">
                <h3 className="text-lg font-bold text-neutral-900 tracking-tight">Post-Submission</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Custom Redirect URL</label>
                    <div className="relative">
                      <Link className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-neutral-300" />
                      <input
                        type="url"
                        placeholder="https://yourwebsite.com/welcome"
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-neutral-100 bg-neutral-50 font-medium text-[14px] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <div className="pt-6 flex justify-end">
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-bold text-white shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
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
            <div className="bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 shadow-sm space-y-8">
              <section className="space-y-6">
                <h3 className="text-lg font-bold text-neutral-900 tracking-tight">Active Plan</h3>
                
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl bg-neutral-900 text-white relative overflow-hidden">
                  <div className="absolute top-[-20%] right-[-10%] size-64 bg-pink-500/20 blur-[100px] rounded-full" />
                  <div className="absolute bottom-[-10%] left-[-5%] size-48 bg-blue-500/10 blur-[80px] rounded-full" />
                  
                  <div className="flex-1 z-10">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-[10px] font-bold text-pink-300 uppercase tracking-widest mb-3">
                      <Zap className="size-3" /> Premium Plan
                    </div>
                    <h4 className="text-3xl font-bold tracking-tight">$29<span className="text-lg font-medium text-neutral-400">/mo</span></h4>
                    <p className="text-[13px] text-neutral-400 mt-2">Next billing date: <strong>April 28, 2026</strong></p>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full sm:w-auto z-10">
                    <button type="button" className="px-6 py-2.5 rounded-full bg-white text-neutral-900 text-[13px] font-bold hover:bg-neutral-100 transition-all">
                      Manage Subscription
                    </button>
                    <button type="button" className="px-6 py-2.5 rounded-full bg-neutral-800 text-white text-[13px] font-bold border border-neutral-700 hover:bg-neutral-700 transition-all">
                      View Invoices
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Testimonials", value: "∞" },
                    { label: "Workspaces", value: "1 / 3" },
                    { label: "Uploads", value: "Unlimited" },
                    { label: "Team", value: "3 Members" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-2xl border border-neutral-100 bg-white">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                      <p className="text-[18px] font-bold text-neutral-900 leading-none">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Team Tab */}
          {activeTab === "team" && (
            <div className="bg-white rounded-3xl border border-neutral-100 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-neutral-900 tracking-tight">Team Members</h3>
                <button
                  type="button"
                  className="px-4 py-2 rounded-full bg-white text-neutral-900 text-[12px] font-bold border border-neutral-200 hover:bg-neutral-50 transition-all flex items-center gap-2"
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
                  <div key={member.email} className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-neutral-400">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-neutral-800 leading-none">{member.name}</h4>
                        <p className="text-[12px] text-neutral-400 mt-1">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase bg-neutral-50 px-2 py-0.5 rounded-full border border-neutral-100">
                        {member.role}
                      </span>
                      <button type="button" className="text-neutral-300 hover:text-neutral-500 transition-colors">
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
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
  )
}
