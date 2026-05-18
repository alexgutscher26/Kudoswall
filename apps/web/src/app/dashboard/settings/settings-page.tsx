"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Globe,
  CreditCard,
  Users,
  Save,
  Link,
  Zap,
  Trash2,
  Shield,
  AlertTriangle,
  FileText,
  Lock,
  Database,
  Check,
  ExternalLink,
  Download,
  Upload,
  History,
} from "lucide-react";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";
import { useWorkspace } from "@/components/dashboard/WorkspaceContext";
import { trpc } from "@/utils/trpc";
import { gooeyToast as toast } from "goey-toast";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/utils/trpc";
import TeamTab from "./team-tab";
import SessionTab from "./session-tab";
import { type Plan, PLANS } from "@my-better-t-app/api/config/plans";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "general" | "collection" | "billing" | "team" | "compliance" | "sessions";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const { activeWorkspaceId } = useWorkspace();
  const router = useRouter();

  const { data: dashboardData, isLoading } = useQuery({
    ...trpc.dashboard.getData.queryOptions({
      workspaceId: activeWorkspaceId,
    }),
  });

  const workspace = dashboardData?.workspace;
  const billing = dashboardData?.billing;

  const updateWorkspace = useMutation({
    ...trpc.dashboard.updateWorkspace.mutationOptions(),
    onSuccess: () => {
      toast.success("Workspace updated!");
      router.refresh();
      // Invalidate dashboard data
      queryClient.invalidateQueries(trpc.dashboard.getData.queryOptions());
    },
    onError: (err) => {
      toast.error("Failed to update workspace: " + err.message);
    },
  });

  const deleteWorkspace = useMutation({
    ...trpc.dashboard.deleteWorkspace.mutationOptions(),
    onSuccess: () => {
      toast.success("Workspace deleted!");
      window.location.href = "/dashboard";
    },
    onError: (err) => {
      toast.error("Failed to delete workspace: " + err.message);
    },
  });

  const acceptDpa = useMutation({
    ...trpc.dashboard.acceptDpa.mutationOptions(),
    onSuccess: () => {
      toast.success("DPA signed and accepted!");
      queryClient.invalidateQueries(trpc.dashboard.getData.queryOptions());
    },
    onError: (err) => {
      toast.error("Failed to sign DPA: " + err.message);
    },
  });

  const updateProject = useMutation({
    ...trpc.dashboard.updateProjectSettings.mutationOptions(),
    onSuccess: () => {
      toast.success("Collection settings updated!");
      queryClient.invalidateQueries(trpc.dashboard.getData.queryOptions());
    },
    onError: (err) => {
      toast.error("Failed to update collection: " + err.message);
    },
  });

  const [workspaceName, setWorkspaceName] = useState("");
  const [slug, setSlug] = useState("");
  const [retentionEnabled, setRetentionEnabled] = useState(false);
  const [retentionDays, setRetentionDays] = useState(365);
  const [instantAlerts, setInstantAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");

  const [headline, setHeadline] = useState("");
  const [subheading, setSubheading] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  const {
    data: searchData,
    refetch: searchRespondent,
    isFetching: isSearching,
  } = useQuery({
    ...trpc.dashboard.findRespondentData.queryOptions({
      email: searchEmail,
    }),
    enabled: false,
  });

  const { refetch: exportRespondent, isFetching: isExporting } = useQuery({
    ...trpc.dashboard.exportRespondentData.queryOptions({
      email: searchEmail,
    }),
    enabled: false,
  });

  const handleExport = async () => {
    const { data } = await exportRespondent();
    if (!data) return;

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kudoswall-export-${searchEmail.replace("@", "-at-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully!");
  };

  const deleteRespondent = useMutation({
    ...trpc.dashboard.deleteRespondentData.mutationOptions(),
    onSuccess: (data) => {
      toast.success(`Succesfully deleted ${data.count} records.`);
      searchRespondent();
    },
    onError: (err) => {
      toast.error("Failed to delete respondent data: " + err.message);
    },
  });

  const createCheckout = useMutation({
    ...trpc.billing.createCheckoutSession.mutationOptions(),
    onSuccess: ({ url }) => {
      if (url) window.location.href = url;
    },
    onError: (err) => {
      toast.error("Failed to start checkout: " + err.message);
    },
  });

  const createPortal = useMutation({
    ...trpc.billing.createPortalSession.mutationOptions(),
    onSuccess: ({ url }) => {
      if (url) window.location.href = url;
    },
    onError: (err) => {
      toast.error("Failed to open billing portal: " + err.message);
    },
  });

  useEffect(() => {
    if (dashboardData?.workspace) {
      setWorkspaceName(dashboardData.workspace.name);
      setSlug(dashboardData.workspace.slug);
      setRetentionEnabled(dashboardData.workspace.retentionEnabled);
      setRetentionDays(dashboardData.workspace.retentionDays || 365);

      if (dashboardData.workspace.notificationSettingsJson) {
        try {
          const notifications = JSON.parse(dashboardData.workspace.notificationSettingsJson);
          setInstantAlerts(notifications.instantAlerts !== false); // default to true
          setDailySummary(notifications.dailySummary === true);
        } catch (e) {
          console.error("Failed to parse notification settings", e);
        }
      }
    }

    if (dashboardData?.projects?.[0]) {
      const project = dashboardData.projects[0];
      try {
        const settings = project.collectionSettingsJson
          ? JSON.parse(project.collectionSettingsJson)
          : {};
        setHeadline(settings.pageContent?.headline || "Help us grow by sharing your story!");
        setSubheading(
          settings.pageContent?.subheading ||
            "How has our product helped you achieve your goals this month?",
        );
        setRedirectUrl(settings.redirectUrl || "");
      } catch (e) {
        console.error("Failed to parse project settings", e);
      }
    }
  }, [dashboardData]);

  const handleSave = () => {
    updateWorkspace.mutate({
      name: workspaceName,
      slug: slug,
      notificationSettingsJson: JSON.stringify({ instantAlerts, dailySummary }),
      retentionEnabled: retentionEnabled,
      retentionDays: retentionDays,
    });
  };

  const handleSaveCollection = () => {
    if (!dashboardData?.projects?.[0]) {
      toast.error("No project found to update.");
      return;
    }

    const firstProject = dashboardData.projects[0];
    let existingSettings = {};
    try {
      existingSettings = firstProject.collectionSettingsJson
        ? JSON.parse(firstProject.collectionSettingsJson)
        : {};
    } catch (e) {
      console.error(e);
    }

    const newSettings = {
      ...existingSettings,
      redirectUrl: redirectUrl,
      pageContent: {
        ...(existingSettings as any).pageContent,
        headline,
        subheading,
      },
    };

    updateProject.mutate({
      projectId: firstProject.id,
      settings: newSettings,
    });
  };

  const handleDelete = () => {
    toast("Delete this workspace?", {
      description:
        "This action cannot be undone and will delete all associated projects and testimonials.",
      action: {
        label: "Delete Workspace",
        onClick: () => deleteWorkspace.mutate(),
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-pink-500/20 border-t-pink-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 md:flex-row">
      {/* ── Left Navigation ────────────────────────────────────────────── */}
      <div className="w-full space-y-1 md:w-64">
        {[
          { id: "general", label: "General", icon: Settings },
          { id: "collection", label: "Collection Page", icon: Globe },
          { id: "billing", label: "Billing & Plans", icon: CreditCard },
          { id: "team", label: "Team Members", icon: Users },
          { id: "compliance", label: "Compliance & DPA", icon: Shield },
          { id: "sessions", label: "Sessions", icon: History },
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

        <div className="mt-6 space-y-3 border-t border-neutral-100 pt-6">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteWorkspace.isPending || (dashboardData?.workspaceCount ?? 0) <= 1}
            className="group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[14px] font-bold text-rose-500 transition-all hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <Trash2 className="size-4 transition-transform group-hover:scale-110" />
            {deleteWorkspace.isPending ? "Deleting..." : "Delete Workspace"}
          </button>

          {(dashboardData?.workspaceCount ?? 0) <= 1 && (
            <div className="mx-2 flex gap-3 rounded-2xl border border-amber-100/50 bg-amber-50/30 p-4 text-[11px] text-amber-700/80">
              <AlertTriangle className="size-4 shrink-0 text-amber-500" />
              <div className="space-y-1">
                <p className="font-bold text-amber-900/80">Last Workspace</p>
                <p className="leading-relaxed">
                  You must have at least one workspace. Create a new one before deleting this one.
                </p>
              </div>
            </div>
          )}
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
                      kudoswall.org/
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
                    id: "dailySummary",
                    label: "Daily Summary",
                    desc: "Receive a digest of your new testimonials every 24h.",
                    enabled: dailySummary,
                    setEnabled: setDailySummary,
                  },
                  {
                    id: "instantAlerts",
                    label: "Instant Alerts",
                    desc: "A notification email for every new submission.",
                    enabled: instantAlerts,
                    setEnabled: setInstantAlerts,
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
                      onClick={() => pref.setEnabled(!pref.enabled)}
                      className={`relative flex h-5 w-10 items-center rounded-full px-1 transition-all ${
                        pref.enabled ? "bg-emerald-500" : "bg-neutral-200"
                      }`}
                    >
                      <div
                        className={`size-3.5 rounded-full bg-white shadow-sm transition-all ${
                          pref.enabled ? "translate-x-4.5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={updateWorkspace.isPending}
                className="flex items-center gap-2 rounded-full px-6 py-2.5 text-[14px] font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                style={{ backgroundColor: "#171717" }}
              >
                <Save className="size-4" />
                {updateWorkspace.isPending ? "Saving..." : "Save Changes"}
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
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Help us grow by sharing your story!"
                    className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-2.5 text-[14px] font-medium outline-none focus:border-pink-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Question to customers
                  </label>
                  <textarea
                    rows={3}
                    value={subheading}
                    onChange={(e) => setSubheading(e.target.value)}
                    placeholder="How has our product helped you achieve your goals this month?"
                    className="w-full resize-none rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-2.5 text-[14px] font-medium outline-none focus:border-pink-500"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6 border-t border-neutral-50 pt-8">
              <h3 className="text-lg font-bold tracking-tight text-neutral-900">Post-Submission</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Custom Redirect URL
                    {billing?.plan === "free" && <Lock className="size-3" />}
                  </label>
                  <div className="relative">
                    <Link className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-neutral-300" />
                    <input
                      type="url"
                      disabled={billing?.plan === "free"}
                      value={redirectUrl}
                      onChange={(e) => setRedirectUrl(e.target.value)}
                      placeholder={
                        billing?.plan === "free"
                          ? "Available on Pro plans"
                          : "https://yourwebsite.com/welcome"
                      }
                      className={`w-full rounded-xl border border-neutral-100 bg-neutral-50 py-2.5 pr-4 pl-11 text-[14px] font-medium transition-all outline-none focus:border-pink-500 ${
                        billing?.plan === "free" ? "cursor-not-allowed opacity-60" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={handleSaveCollection}
                disabled={updateProject.isPending}
                className="flex items-center gap-2 rounded-full px-6 py-2.5 text-[14px] font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                style={{ backgroundColor: "#171717" }}
              >
                <Save className="size-4" />
                {updateProject.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" &&
          (() => {
            const planConfig = PLANS[(billing?.plan || "free") as Plan];

            const isPaid = billing?.plan !== "free";

            return (
              <div className="space-y-8 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
                <section className="space-y-6">
                  <h3 className="text-lg font-bold tracking-tight text-neutral-900">Active Plan</h3>

                  <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl bg-neutral-900 p-6 text-white sm:flex-row">
                    <div className="absolute top-[-20%] right-[-10%] size-64 rounded-full bg-pink-500/20 blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] size-48 rounded-full bg-blue-500/10 blur-[80px]" />

                    <div className="z-10 flex-1">
                      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/20 px-2.5 py-1 text-[10px] font-bold tracking-widest text-pink-300 uppercase">
                        <Zap className="size-3" /> {planConfig.name}
                      </div>
                      {isPaid ? (
                        <h4 className="text-3xl font-bold tracking-tight">
                          {planConfig.priceLabel}
                          <span className="text-lg font-medium text-neutral-400"></span>
                        </h4>
                      ) : (
                        <h4 className="text-3xl font-bold tracking-tight">Free Forever</h4>
                      )}
                      <p className="mt-2 text-[13px] text-neutral-400">
                        Status:{" "}
                        <strong className="capitalize">
                          {dashboardData?.billing?.status || "active"}
                        </strong>
                      </p>
                    </div>

                    <div className="z-10 flex w-full flex-col gap-2 sm:w-auto">
                      {isPaid ? (
                        <button
                          type="button"
                          onClick={() => createPortal.mutate()}
                          disabled={createPortal.isPending}
                          className="rounded-full bg-white px-6 py-2.5 text-[13px] font-bold text-neutral-900 shadow-sm transition-all hover:bg-neutral-50 active:scale-[0.98] disabled:opacity-50"
                        >
                          {createPortal.isPending
                            ? "Connecting..."
                            : dashboardData?.billing?.plan === "ltd"
                              ? "Manage Billing"
                              : "Manage Subscription"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveTab("billing")}
                          className="rounded-full bg-pink-600 px-6 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-pink-500/20 transition-all hover:bg-pink-700 active:scale-[0.98]"
                        >
                          Select a Plan
                        </button>
                      )}
                      {isPaid && dashboardData?.billing?.plan !== "ltd" && (
                        <button
                          type="button"
                          onClick={() => createPortal.mutate()}
                          disabled={createPortal.isPending}
                          className="rounded-full border border-neutral-700 bg-neutral-800 px-6 py-2.5 text-[13px] font-bold text-white transition-all hover:bg-neutral-700 disabled:opacity-50"
                        >
                          View Invoices
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-12 space-y-8">
                    <h4 className="text-center text-sm font-bold tracking-widest text-neutral-400 uppercase">
                      Available Plans
                    </h4>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {["plan_1", "plan_2"].map((pid) => {
                        const p = PLANS[pid as Plan];
                        return (
                          <div
                            key={pid}
                            className={`group relative flex flex-col rounded-[2.5rem] border-2 p-8 transition-all hover:shadow-2xl ${
                              dashboardData?.billing?.plan === pid
                                ? "border-pink-500 bg-neutral-50/50 shadow-lg"
                                : "border-neutral-100 bg-white hover:border-pink-100"
                            }`}
                          >
                            {dashboardData?.billing?.plan === pid && (
                              <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-pink-500 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase shadow-lg">
                                <Check className="size-3" /> Current Plan
                              </div>
                            )}

                            <div className="mb-6">
                              <h5 className="text-[14px] font-black text-neutral-900">{p.name}</h5>
                              <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-4xl font-black tracking-tighter text-neutral-900">
                                  {p.priceLabel.split("/")[0]}
                                </span>
                                <span className="text-[12px] font-bold text-neutral-400">
                                  /{p.priceLabel.split("/")[1] || "mo"}
                                </span>
                              </div>
                            </div>
                            <ul className="mb-10 flex-1 space-y-4">
                              {p.displayFeatures.map((feature: string) => (
                                <li
                                  key={feature}
                                  className="flex items-center gap-3 text-[13px] font-bold text-neutral-600"
                                >
                                  <div className="flex size-5 items-center justify-center rounded-full bg-emerald-100/50">
                                    <Check className="size-3.5 text-emerald-600" />
                                  </div>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            <button
                              type="button"
                              disabled={
                                dashboardData?.billing?.plan === pid ||
                                createCheckout.isPending ||
                                !p.stripePriceIdMonthly
                              }
                              onClick={() =>
                                createCheckout.mutate({
                                  priceId: p.stripePriceIdMonthly!,
                                })
                              }
                              className={`w-full rounded-2xl py-3.5 text-[13px] font-black transition-all active:scale-[0.98] ${
                                dashboardData?.billing?.plan === pid
                                  ? "bg-neutral-100 text-neutral-400"
                                  : "bg-neutral-900 text-white shadow-lg hover:bg-neutral-800"
                              }`}
                            >
                              {createCheckout.isPending
                                ? "Starting..."
                                : dashboardData?.billing?.plan === pid
                                  ? "Active Plan"
                                  : "Select Plan"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                      {
                        label: "Testimonials",
                        value:
                          planConfig.limits.maxTestimonials === Infinity
                            ? "∞"
                            : planConfig.limits.maxTestimonials,
                      },
                      {
                        label: "Projects",
                        value:
                          planConfig.limits.maxProjects === Infinity
                            ? "∞"
                            : planConfig.limits.maxProjects,
                      },
                      {
                        label: "Video",
                        value: planConfig.features.video ? "Available" : "No",
                      },
                      {
                        label: "Team",
                        value: planConfig.features.memberInvites ? "Available" : "No",
                      },
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
            );
          })()}
        {/* Team Tab */}
        {activeTab === "team" && <TeamTab />}

        {activeTab === "compliance" && (
          <div className="space-y-8 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
            <section className="space-y-6">
              <h3 className="text-lg font-bold tracking-tight text-neutral-900">
                Data Processing Agreement (DPA)
              </h3>
              <p className="text-[13px] text-neutral-400">
                To comply with GDPR and CCPA, you can sign our Data Processing Agreement. This
                document outlines how we handle data on behalf of your workspace.
              </p>

              <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-white shadow-sm">
                      <FileText className="size-6 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-neutral-800">
                        KudosWall DPA (v1.2)
                      </h4>
                      <p className="text-[11px] font-medium text-neutral-400">
                        Standard GDPR & CCPA compliant contract.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href="/dpa"
                      target="_blank"
                      className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[12px] font-bold text-neutral-900 transition-all hover:bg-neutral-50"
                    >
                      Review <ExternalLink className="size-3.5" />
                    </a>

                    {!dashboardData?.workspace?.dpaAcceptedAt ? (
                      <button
                        onClick={() => acceptDpa.mutate()}
                        disabled={acceptDpa.isPending}
                        className="rounded-full bg-pink-600 px-6 py-2 text-[12px] font-bold text-white shadow-sm transition-all hover:bg-pink-700 disabled:opacity-50"
                      >
                        {acceptDpa.isPending ? "Signing..." : "Accept & Sign DPA"}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-[12px] font-bold text-emerald-600">
                        <Check className="size-3.5" /> Signed on{" "}
                        {new Date(
                          dashboardData?.workspace?.dpaAcceptedAt as string,
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6 border-t border-neutral-50 pt-8">
              <h3 className="text-lg font-bold tracking-tight text-neutral-900">
                Right to be Forgotten
              </h3>
              <p className="text-[13px] text-neutral-400">
                To comply with GDPR, you can delete all data associated with a specific individual's
                email address across this workspace.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  placeholder="respondent@example.com"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="flex-1 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13px] outline-none focus:border-pink-500"
                />
                <button
                  type="button"
                  onClick={() => searchRespondent()}
                  disabled={isSearching || !searchEmail.includes("@")}
                  className="rounded-full bg-neutral-900 px-6 py-2 text-[12px] font-bold text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
                >
                  {isSearching ? "Searching..." : "Search Records"}
                </button>
              </div>

              {searchData && searchData.count > 0 && (
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-pink-100 bg-pink-50/50 p-6">
                  <div>
                    <p className="text-[14px] font-bold text-neutral-900">
                      Found {searchData.count} testimonials for this email.
                    </p>
                    <p className="text-[12px] text-neutral-500">
                      Deleting will permanently remove all text and video testimonials.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      disabled={isExporting}
                      onClick={handleExport}
                      className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[12px] font-bold text-neutral-900 transition-all hover:bg-neutral-50 disabled:opacity-50"
                    >
                      <Download className="size-3.5 text-neutral-400" />
                      {isExporting ? "Exporting..." : "Export (.JSON)"}
                    </button>
                    <button
                      type="button"
                      disabled={deleteRespondent.isPending}
                      onClick={() => {
                        toast("Are you sure? This will permanently delete all respondent data.", {
                          action: {
                            label: "Delete All",
                            onClick: () =>
                              deleteRespondent.mutate({
                                email: searchEmail,
                              }),
                          },
                        });
                      }}
                      className="flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-[12px] font-bold text-white shadow-sm transition-all hover:bg-rose-700 disabled:opacity-50"
                    >
                      <Trash2 className="size-3.5" />
                      {deleteRespondent.isPending ? "Deleting..." : "Delete All"}
                    </button>
                  </div>
                </div>
              )}

              {searchData && searchData.count === 0 && (
                <p className="inline-block rounded-full bg-emerald-50 px-4 py-2 text-[12px] font-medium text-emerald-600">
                  No records found for this email address.
                </p>
              )}
            </section>

            <section className="space-y-6 border-t border-neutral-50 pt-8">
              <h3 className="text-lg font-bold tracking-tight text-neutral-900">
                Privacy Features
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="group rounded-2xl border border-neutral-50 p-5 transition-all hover:bg-neutral-50/50">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                    <Lock className="size-5" />
                  </div>
                  <h4 className="text-[14px] font-bold text-neutral-800">Cookie-less Tracking</h4>
                  <p className="mt-1 text-[11px] leading-relaxed font-medium text-neutral-400">
                    All widget impressions are tracked using IP/UA fingerprinting. No tracking
                    cookies are placed on your visitors' browsers.
                  </p>
                </div>
                <div className="group rounded-2xl border border-neutral-50 p-5 transition-all hover:bg-neutral-50/50">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                    <Database className="size-5" />
                  </div>
                  <h4 className="text-[14px] font-bold text-neutral-800">GDPR Compliance</h4>
                  <p className="mt-1 text-[11px] leading-relaxed font-medium text-neutral-400">
                    We are fully compliant with GDPR. Your users can request data deletion or export
                    at any time.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6 border-t border-neutral-50 pt-8">
              <h3 className="text-lg font-bold tracking-tight text-neutral-900">
                Data Retention Policy
              </h3>
              <p className="text-[13px] text-neutral-400">
                Automatically delete testimonials after a certain period of time to comply with your
                local data retention laws.
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-neutral-50 p-4 transition-all hover:bg-neutral-50/50">
                  <div>
                    <h4 className="text-[14px] font-bold text-neutral-800">
                      Auto-delete Testimonials
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      If enabled, testimonials will be permanently deleted after the retention
                      period.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRetentionEnabled(!retentionEnabled)}
                    className={`relative flex h-5 w-10 items-center rounded-full px-1 transition-all ${
                      retentionEnabled ? "bg-pink-600" : "bg-neutral-200"
                    }`}
                  >
                    <div
                      className={`size-3.5 rounded-full bg-white transition-all ${
                        retentionEnabled ? "translate-x-4.5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {retentionEnabled && (
                  <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
                    <div className="flex items-start gap-3">
                      <Database className="mt-1 size-5 text-amber-600" />
                      <div className="flex-1">
                        <h4 className="text-[14px] font-bold text-neutral-800">Retention Period</h4>
                        <p className="mb-4 text-[11px] text-neutral-400">
                          Configure how long you want to keep testimonials before they are
                          permanently deleted.
                        </p>
                        <div className="flex items-center gap-3">
                          <select
                            value={retentionDays}
                            onChange={(e) => setRetentionDays(Number(e.target.value))}
                            className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[13px] font-medium outline-none focus:border-amber-500"
                          >
                            <option value={30}>30 Days</option>
                            <option value={90}>90 Days</option>
                            <option value={180}>180 Days</option>
                            <option value={365}>1 Year</option>
                            <option value={730}>2 Years</option>
                            <option value={1095}>3 Years</option>
                            <option value={1825}>5 Years</option>
                          </select>
                          <span className="text-[12px] font-medium text-amber-700">
                            Warning: Deletion is permanent and cannot be undone.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={updateWorkspace.isPending}
                className="flex items-center gap-2 rounded-full px-6 py-2.5 text-[14px] font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                style={{ backgroundColor: "#171717" }}
              >
                <Save className="size-4" />
                {updateWorkspace.isPending ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        )}
        {/* Sessions Tab */}
        {activeTab === "sessions" && <SessionTab />}
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
