"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Palette,
  FormInput,
  MessageSquare,
  Video,
  Shield,
  Eye,
  Star,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Command,
  Lock,
  Quote,
  Camera,
  Building2,
  Linkedin,
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface CollectionCustomizerProps {
  project: any;
  workspace: any;
}

export type CollectionSettings = {
  thankYouMessage?: string;
  workspaceName?: string;
  logoUrl?: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: "sans" | "serif" | "mono";
  form: {
    fields: {
      fullName: { enabled: boolean; required: boolean; label: string; placeholder: string };
      email: { enabled: boolean; required: boolean; label: string; placeholder: string };
      company: { enabled: boolean; required: boolean; label: string; placeholder: string };
      jobTitle: { enabled: boolean; required: boolean; label: string; placeholder: string };
      linkedin: { enabled: boolean; required: boolean; label: string; placeholder: string };
    };
    starRating: { enabled: boolean };
    minCharCount: number;
    additionalContext?: {
      enabled: boolean;
      label: string;
      options: string[];
    };
  };
  pageContent: {
    headline: string;
    subheading: string;
    showTestimonialCount: boolean;
    thankYou: {
      headline: string;
      body: string;
      cta: { enabled: boolean; text: string; url: string };
    };
  };
  video: {
    enabled: boolean;
    prompt: string;
    maxLength: number;
  };
  customDomain?: string;
  passwordProtection?: string;
  expiryDate?: string;
  redirectUrl?: string;
};

const DEFAULT_SETTINGS: CollectionSettings = {
  accentColor: "#e8527a",
  backgroundColor: "#fafafa",
  fontFamily: "sans",
  form: {
    fields: {
      fullName: { enabled: true, required: true, label: "Full Name", placeholder: "Jane Doe" },
      email: { enabled: true, required: false, label: "Email", placeholder: "jane@example.com" },
      company: { enabled: true, required: false, label: "Company", placeholder: "Acme Inc." },
      jobTitle: { enabled: true, required: false, label: "Job Title", placeholder: "CEO" },
      linkedin: {
        enabled: false,
        required: false,
        label: "LinkedIn Profile",
        placeholder: "https://linkedin.com/in/jane",
      },
    },
    starRating: { enabled: true },
    minCharCount: 50,
  },
  pageContent: {
    headline: "Share your experience",
    subheading: "We value your feedback and want to know how we did.",
    showTestimonialCount: false,
    thankYou: {
      headline: "You're awesome!",
      body: "Your feedback has been sent. It helps us more than you know.",
      cta: { enabled: false, text: "", url: "" },
    },
  },
  video: {
    enabled: true,
    prompt: "Tell us about your experience",
    maxLength: 30,
  },
};

export function CollectionCustomizer({ project, workspace }: CollectionCustomizerProps) {
  const [settings, setSettings] = useState<CollectionSettings>(() => {
    try {
      return project.collectionSettingsJson
        ? JSON.parse(project.collectionSettingsJson)
        : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  const [mockStep, setMockStep] = useState<"rating" | "text" | "video" | "details" | "success">(
    "rating",
  );

  const [activeTab, setActiveTab] = useState<
    "branding" | "fields" | "content" | "video" | "advanced"
  >("branding");
  const isPro = workspace.isPro;

  const updateSettings = useMutation(
    trpc.dashboard.updateProjectSettings.mutationOptions({
      onSuccess: () => {
        toast.success("Settings saved!");
      },
      onError: (e: any) => {
        toast.error(e.message);
      },
    }),
  );

  const handleSave = () => {
    updateSettings.mutate({
      projectId: project.id,
      settings,
    });
  };

  const setNestedSetting = (path: string, value: any) => {
    setSettings((prev) => {
      const next = { ...prev };
      const keys = path.split(".");
      let current: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const ProBadge = () => (
    <span className="ml-2 inline-flex items-center rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-bold tracking-widest text-pink-500 uppercase ring-1 ring-pink-100 ring-inset">
      Pro
    </span>
  );

  const SectionHeader = ({
    title,
    icon: Icon,
    pro,
  }: {
    title: string;
    icon: any;
    pro?: boolean;
  }) => (
    <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-2">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-neutral-400" />
        <h3 className="text-sm font-bold text-neutral-900">{title}</h3>
        {pro && <ProBadge />}
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* Sidebar - Settings */}
      <div className="flex w-96 shrink-0 flex-col overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-neutral-100 p-4">
          <button
            onClick={() => setActiveTab("branding")}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${activeTab === "branding" ? "bg-pink-50 text-pink-500" : "text-neutral-400 hover:bg-neutral-50"}`}
          >
            Branding
          </button>
          <button
            onClick={() => setActiveTab("fields")}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${activeTab === "fields" ? "bg-pink-50 text-pink-500" : "text-neutral-400 hover:bg-neutral-50"}`}
          >
            Form
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${activeTab === "content" ? "bg-pink-50 text-pink-500" : "text-neutral-400 hover:bg-neutral-50"}`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${activeTab === "video" ? "bg-pink-50 text-pink-500" : "text-neutral-400 hover:bg-neutral-50"}`}
          >
            Video
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${activeTab === "advanced" ? "bg-pink-50 text-pink-500" : "text-neutral-400 hover:bg-neutral-50"}`}
          >
            Adv
          </button>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto p-4">
          {activeTab === "branding" && (
            <div className="space-y-6">
              <SectionHeader icon={Palette} pro title="Visual Branding" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Accent Color
                  </label>
                  <input
                    className="size-8 cursor-pointer rounded-lg border-0 p-0"
                    disabled={!isPro}
                    onChange={(e) => setNestedSetting("accentColor", e.target.value)}
                    type="color"
                    value={settings.accentColor}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Background
                  </label>
                  <input
                    className="size-8 cursor-pointer rounded-lg border-0 p-0"
                    disabled={!isPro}
                    onChange={(e) => setNestedSetting("backgroundColor", e.target.value)}
                    type="color"
                    value={settings.backgroundColor}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Font Family
                  </label>
                  <select
                    className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium outline-none focus:border-pink-500"
                    disabled={!isPro}
                    onChange={(e) => setNestedSetting("fontFamily", e.target.value)}
                    value={settings.fontFamily}
                  >
                    <option value="sans">Sans-serif (Modern)</option>
                    <option value="serif">Serif (Classic)</option>
                    <option value="mono">Monospace (Minimal)</option>
                  </select>
                </div>
              </div>

              {!isPro && (
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-center">
                  <Lock className="mx-auto mb-2 size-4 text-neutral-300" />
                  <p className="mb-2 text-[11px] font-bold text-neutral-500">
                    Upgrade to Pro to unlock branding
                  </p>
                  <button className="w-full rounded-xl bg-neutral-900 py-2 text-[11px] font-bold text-white transition-opacity hover:opacity-90">
                    Upgrade Now
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "fields" && (
            <div className="space-y-6">
              <SectionHeader icon={FormInput} pro title="Form Fields" />
              <div className="space-y-4 divide-y divide-neutral-50">
                {Object.entries(settings.form.fields).map(([key, field]) => (
                  <div className="pt-4 first:pt-0" key={key}>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[11px] font-bold tracking-widest text-neutral-900 uppercase">
                        {key === "linkedin" ? "LinkedIn" : key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <div className="flex items-center gap-4">
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            checked={field.enabled}
                            className="accent-pink-500"
                            disabled={key === "fullName" || !isPro}
                            onChange={(e) =>
                              setNestedSetting(`form.fields.${key}.enabled`, e.target.checked)
                            }
                            type="checkbox"
                          />
                          <span className="text-[10px] font-bold tracking-wider text-neutral-400">
                            Show
                          </span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            checked={field.required}
                            className="accent-pink-500"
                            disabled={!isPro || !field.enabled}
                            onChange={(e) =>
                              setNestedSetting(`form.fields.${key}.required`, e.target.checked)
                            }
                            type="checkbox"
                          />
                          <span className="text-[10px] font-bold tracking-wider text-neutral-400">
                            Required
                          </span>
                        </label>
                      </div>
                    </div>
                    {field.enabled && isPro && (
                      <div className="space-y-2">
                        <input
                          className="w-full rounded-lg border border-neutral-100 bg-neutral-50 px-2.5 py-1.5 text-[11px] font-medium outline-none focus:border-pink-500"
                          onChange={(e) =>
                            setNestedSetting(`form.fields.${key}.label`, e.target.value)
                          }
                          placeholder="Label override"
                          type="text"
                          value={field.label}
                        />
                        <input
                          className="w-full rounded-lg border border-neutral-100 bg-neutral-50 px-2.5 py-1.5 text-[11px] font-medium outline-none focus:border-pink-500"
                          onChange={(e) =>
                            setNestedSetting(`form.fields.${key}.placeholder`, e.target.value)
                          }
                          placeholder="Placeholder override"
                          type="text"
                          value={field.placeholder}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <SectionHeader icon={Star} pro title="Star Rating" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                  Enable Rating
                </span>
                <input
                  checked={settings.form.starRating.enabled}
                  className="accent-pink-500"
                  disabled={!isPro}
                  onChange={(e) => setNestedSetting("form.starRating.enabled", e.target.checked)}
                  type="checkbox"
                />
              </div>

              <SectionHeader icon={Shield} pro title="Constraints" />
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                  Min Character Count
                </label>
                <input
                  className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium outline-none focus:border-pink-500"
                  disabled={!isPro}
                  min={0}
                  onChange={(e) => setNestedSetting("form.minCharCount", parseInt(e.target.value))}
                  type="number"
                  value={settings.form.minCharCount}
                />
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div className="space-y-6">
              <SectionHeader icon={MessageSquare} pro title="Copy & Messaging" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Headline
                  </label>
                  <input
                    className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium outline-none focus:border-pink-500"
                    disabled={!isPro}
                    onChange={(e) => setNestedSetting("pageContent.headline", e.target.value)}
                    type="text"
                    value={settings.pageContent.headline}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Instructions / Subheading
                  </label>
                  <textarea
                    className="h-20 w-full resize-none rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium outline-none focus:border-pink-500"
                    disabled={!isPro}
                    onChange={(e) => setNestedSetting("pageContent.subheading", e.target.value)}
                    value={settings.pageContent.subheading}
                  />
                </div>
              </div>

              <SectionHeader icon={CheckCircle2} pro title="Success Screen" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Thank You Title
                  </label>
                  <input
                    className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium outline-none focus:border-pink-500"
                    disabled={!isPro}
                    onChange={(e) =>
                      setNestedSetting("pageContent.thankYou.headline", e.target.value)
                    }
                    type="text"
                    value={settings.pageContent.thankYou.headline}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Thank You Message
                  </label>
                  <textarea
                    className="h-20 w-full resize-none rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium outline-none focus:border-pink-500"
                    onChange={(e) => setNestedSetting("pageContent.thankYou.body", e.target.value)}
                    value={settings.pageContent.thankYou.body}
                  />
                </div>
                <div className="pt-2">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-neutral-900 uppercase">
                      CTA Button {isPro && <Sparkles className="size-3 text-pink-500" />}
                    </span>
                    <input
                      checked={settings.pageContent.thankYou.cta.enabled}
                      className="accent-pink-500"
                      disabled={!isPro}
                      onChange={(e) =>
                        setNestedSetting("pageContent.thankYou.cta.enabled", e.target.checked)
                      }
                      type="checkbox"
                    />
                  </div>
                  {settings.pageContent.thankYou.cta.enabled && (
                    <div className="animate-in fade-in slide-in-from-top-2 space-y-2 duration-300">
                      <input
                        className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium outline-none focus:border-pink-500"
                        onChange={(e) =>
                          setNestedSetting("pageContent.thankYou.cta.text", e.target.value)
                        }
                        placeholder="Button text (e.g. Visit Website)"
                        type="text"
                        value={settings.pageContent.thankYou.cta.text}
                      />
                      <input
                        className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium outline-none focus:border-pink-500"
                        onChange={(e) =>
                          setNestedSetting("pageContent.thankYou.cta.url", e.target.value)
                        }
                        placeholder="https://yourwebsite.com"
                        type="url"
                        value={settings.pageContent.thankYou.cta.url}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "video" && (
            <div className="space-y-6">
              <SectionHeader icon={Video} pro title="Video Testimonials" />
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Enable Video
                  </span>
                  <input
                    checked={settings.video.enabled}
                    className="accent-pink-500"
                    disabled={!isPro}
                    onChange={(e) => setNestedSetting("video.enabled", e.target.checked)}
                    type="checkbox"
                  />
                </div>

                {settings.video.enabled && (
                  <div className="animate-in fade-in slide-in-from-top-2 space-y-4 duration-300">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                        Recording Prompt
                      </label>
                      <input
                        className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium outline-none focus:border-pink-500"
                        onChange={(e) => setNestedSetting("video.prompt", e.target.value)}
                        type="text"
                        value={settings.video.prompt}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                        Max Duration
                      </label>
                      <select
                        className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium outline-none focus:border-pink-500"
                        onChange={(e) =>
                          setNestedSetting("video.maxLength", parseInt(e.target.value))
                        }
                        value={settings.video.maxLength}
                      >
                        <option value={30}>30 Seconds</option>
                        <option value={60}>60 Seconds</option>
                        <option value={90}>90 Seconds</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "advanced" && (
            <div className="space-y-6">
              <SectionHeader icon={Command} pro title="Advanced" />
              <div className="space-y-4 overflow-hidden rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 p-4">
                <div className="flex items-center gap-3">
                  <Lock className="size-4 text-neutral-300" />
                  <div>
                    <h4 className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase transition-colors">
                      Future Features
                    </h4>
                    <p className="text-[10px] leading-snug text-neutral-400">
                      Custom domains, password protection, and expiry dates are coming soon.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Redirect after submit
                  </label>
                  <input
                    className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium outline-none focus:border-pink-500"
                    disabled={!isPro}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, redirectUrl: e.target.value }))
                    }
                    placeholder="https://yourwebsite.com/welcome"
                    type="url"
                    value={settings.redirectUrl}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-neutral-100 p-4">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-3 text-sm font-black text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            disabled={updateSettings.isPending}
            onClick={handleSave}
          >
            {updateSettings.isPending ? "Saving..." : "Save Settings"}
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Main Area - Preview */}
      <div className="relative flex flex-1 flex-col overflow-hidden overflow-y-auto rounded-3xl border border-neutral-100 bg-neutral-50">
        <div className="absolute top-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4 rounded-full border border-neutral-200 bg-white/80 px-5 py-1.5 shadow-sm backdrop-blur-md">
          <div className="mr-1 flex items-center gap-2 border-r border-neutral-100 pr-3">
            <Eye className="size-3.5 text-pink-500" />
            <span className="text-[10px] leading-none font-black tracking-widest text-neutral-900 uppercase">
              Live Preview
            </span>
          </div>

          <div className="flex items-center gap-3">
            {[
              { id: "rating", label: "Rating" },
              { id: "text", label: "Story" },
              { id: "video", label: "Video" },
              { id: "details", label: "Form" },
              { id: "success", label: "Success" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setMockStep(s.id as any)}
                className={`text-[9px] font-black tracking-wider uppercase transition-colors hover:text-pink-500 ${mockStep === s.id ? "text-pink-500" : "text-neutral-400"}`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-8 pt-16">
          <div className="pointer-events-none w-full max-w-2xl origin-top scale-[0.8] select-none lg:scale-[0.85]">
            <div className="mb-8 space-y-4 text-center">
              {(settings.logoUrl || workspace.logoUrl) && (
                <div className="group relative inline-block">
                  <div
                    className="absolute -inset-2 rounded-[24px] opacity-20 blur-xl transition-opacity group-hover:opacity-40"
                    style={{ backgroundColor: settings.accentColor }}
                  />
                  <img
                    src={settings.logoUrl || workspace.logoUrl}
                    alt={workspace.name}
                    className="relative mx-auto size-14 rounded-[18px] border border-neutral-100 bg-white object-cover p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                  />
                </div>
              )}
              <div className="space-y-1">
                <h1 className="text-3xl leading-tight font-black tracking-tighter text-neutral-900 sm:text-5xl">
                  {settings.pageContent.headline || "Share your story"}
                </h1>
                <p className="text-md mx-auto max-w-xl font-medium text-neutral-500">
                  {settings.pageContent.subheading || `You're leaving a review for ${project.name}`}
                </p>
              </div>
            </div>

            {/* Mock Collection Wizard with customized styles */}
            <CollectionWizardPreview
              settings={settings}
              projectName={project.name}
              workspaceIsPro={workspace.isPro}
              activeTab={activeTab}
              mockStep={mockStep}
              setMockStep={setMockStep}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CollectionWizardPreview({
  settings,
  projectName,
  workspaceIsPro,
  activeTab,
  mockStep,
  setMockStep,
}: {
  settings: CollectionSettings;
  projectName: string;
  workspaceIsPro: boolean;
  activeTab: string;
  mockStep: "rating" | "text" | "video" | "details" | "success";
  setMockStep: (step: any) => void;
}) {
  // Automatically switch preview step when tab changes
  useEffect(() => {
    if (activeTab === "fields") {
      setMockStep("details");
    } else if (activeTab === "content") {
      setMockStep("success");
    } else if (activeTab === "video") {
      setMockStep("video");
    } else if (activeTab === "branding") {
      setMockStep("rating");
    }
  }, [activeTab, setMockStep]);

  // Font family class mapping
  const fontClass =
    settings.fontFamily === "serif"
      ? "font-serif"
      : settings.fontFamily === "mono"
        ? "font-mono"
        : "font-sans";

  return (
    <div className={`mx-auto w-full max-w-xl ${fontClass}`}>
      <div className="text-card-foreground relative flex min-h-[450px] flex-col overflow-hidden rounded-[40px] border border-white/50 bg-white/70 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        {/* Progress Bar */}
        <div className="absolute top-0 right-0 left-0 h-1 overflow-hidden bg-neutral-100/30">
          <div className="h-full w-1/3" style={{ backgroundColor: settings.accentColor }} />
        </div>

        <div className="flex flex-1 flex-col p-8">
          {mockStep === "rating" && (
            <div className="flex flex-1 flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-4">
                <div
                  className="mx-auto flex size-20 items-center justify-center rounded-[28px]"
                  style={{ backgroundColor: `${settings.accentColor}15` }}
                >
                  <Sparkles className="size-10" style={{ color: settings.accentColor }} />
                </div>
                <h2 className="text-4xl leading-tight font-black tracking-tighter text-neutral-900">
                  How was your experience?
                </h2>
                <p className="mx-auto max-w-xs text-[16px] font-medium text-neutral-500/80">
                  We value your feedback and want to know how we did.
                </p>
              </div>
              {settings.form.starRating.enabled && (
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="size-12 fill-current"
                      style={{ color: s <= 4 ? settings.accentColor : "#f5f5f5" }}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={() => setMockStep("text")}
                className="rounded-2xl px-8 py-3.5 text-[14px] font-bold text-white shadow-xl transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  backgroundColor: settings.accentColor,
                  boxShadow: `0 10px 25px -5px ${settings.accentColor}40`,
                }}
              >
                Next Question
              </button>
            </div>
          )}

          {mockStep === "text" && (
            <div className="flex flex-1 flex-col space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-[18px] bg-neutral-900">
                  <MessageSquare className="size-6 text-white" />
                </div>
                <h2 className="text-2xl font-black tracking-tighter text-neutral-900">
                  Share your story
                </h2>
              </div>
              <div className="flex-1 rounded-[24px] border border-neutral-100 bg-neutral-50/50 p-6">
                <p className="text-sm font-medium text-neutral-300">
                  I chose {projectName} because...
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                  0 / {settings.form.minCharCount} MIN
                </span>
                <button
                  onClick={() => setMockStep(settings.video.enabled ? "video" : "details")}
                  className="rounded-full px-6 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {mockStep === "video" && (
            <div className="flex flex-1 flex-col space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-[18px] bg-neutral-900">
                  <Video className="size-6 text-white" />
                </div>
                <h2 className="text-2xl font-black tracking-tighter text-neutral-900">
                  Record a video
                </h2>
              </div>
              <div className="flex flex-1 items-center justify-center rounded-[24px] border-2 border-dashed border-neutral-200 bg-neutral-50/50">
                <div className="space-y-2 text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-neutral-200">
                    <Camera className="size-6 text-neutral-500" />
                  </div>
                  <p className="text-xs font-bold text-neutral-400">Click to record</p>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setMockStep("details")}
                  className="rounded-full px-6 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {mockStep === "details" && (
            <div className="flex flex-1 flex-col space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-[18px] bg-neutral-900">
                  <Quote className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tighter text-neutral-900">
                    Nearly there!
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="pl-1 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                      {settings.form.fields.fullName.label || "Full Name"}{" "}
                      {settings.form.fields.fullName.required !== false ? "*" : ""}
                    </label>
                    <div className="w-full rounded-xl border border-neutral-100 bg-neutral-50/30 px-5 py-3.5 text-xs text-neutral-300">
                      {settings.form.fields.fullName.placeholder || "Jane Doe"}
                    </div>
                  </div>
                  {settings.form.fields.email.enabled && (
                    <div className="space-y-1.5">
                      <label className="pl-1 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                        {settings.form.fields.email.label || "Email"}{" "}
                        {settings.form.fields.email.required ? "*" : ""}
                      </label>
                      <div className="w-full rounded-xl border border-neutral-100 bg-neutral-50/30 px-5 py-3.5 text-xs text-neutral-300">
                        {settings.form.fields.email.placeholder || "jane@example.com"}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 border-t border-neutral-100/50 pt-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {settings.form.fields.company.enabled && (
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 pl-1 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                          <Building2 className="size-3" />{" "}
                          {settings.form.fields.company.label || "Company"}{" "}
                          {settings.form.fields.company.required ? "*" : ""}
                        </label>
                        <div className="w-full rounded-xl border border-neutral-100 bg-neutral-50/30 px-5 py-3.5 text-xs text-neutral-300">
                          {settings.form.fields.company.placeholder || "Acme Inc."}
                        </div>
                      </div>
                    )}
                    {settings.form.fields.jobTitle.enabled && (
                      <div className="space-y-1.5">
                        <label className="pl-1 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                          {settings.form.fields.jobTitle.label || "Job Title"}{" "}
                          {settings.form.fields.jobTitle.required ? "*" : ""}
                        </label>
                        <div className="w-full rounded-xl border border-neutral-100 bg-neutral-50/30 px-5 py-3.5 text-xs text-neutral-300">
                          {settings.form.fields.jobTitle.placeholder || "CEO"}
                        </div>
                      </div>
                    )}
                  </div>
                  {settings.form.fields.linkedin.enabled && (
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 pl-1 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                        <Linkedin className="size-3" />{" "}
                        {settings.form.fields.linkedin.label || "LinkedIn Profile"}{" "}
                        {settings.form.fields.linkedin.required ? "*" : ""}
                      </label>
                      <div className="w-full rounded-xl border border-neutral-100 bg-neutral-50/30 px-5 py-3.5 text-xs text-neutral-300">
                        {settings.form.fields.linkedin.placeholder ||
                          "https://linkedin.com/in/jane"}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-[20px] py-4.5 text-[16px] font-black tracking-tight text-white shadow-2xl transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  backgroundColor: settings.accentColor,
                  boxShadow: `0 15px 30px -10px ${settings.accentColor}50`,
                }}
                onClick={() => setMockStep("success")}
              >
                Submit review
                <Sparkles className="size-4" />
              </button>
            </div>
          )}

          {mockStep === "success" && (
            <div className="animate-in zoom-in flex flex-1 flex-col items-center justify-center space-y-8 text-center duration-500">
              <div className="flex size-16 items-center justify-center rounded-[24px] bg-emerald-500">
                <CheckCircle2 className="size-8 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl leading-tight font-black tracking-tighter text-neutral-900">
                  {settings.pageContent.thankYou.headline}
                </h2>
                <p className="text-md mx-auto max-w-sm leading-relaxed font-medium text-neutral-500/80">
                  {settings.pageContent.thankYou.body}
                </p>
              </div>
              {settings.pageContent.thankYou.cta.enabled &&
                settings.pageContent.thankYou.cta.text && (
                  <div className="flex flex-col gap-3">
                    <button
                      className="rounded-xl px-8 py-3 text-xs font-bold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: settings.accentColor }}
                    >
                      {settings.pageContent.thankYou.cta.text}
                    </button>
                    <button
                      onClick={() => setMockStep("rating")}
                      className="text-[10px] font-bold text-neutral-400 underline"
                    >
                      Preview from start
                    </button>
                  </div>
                )}
              {(!settings.pageContent.thankYou.cta.enabled ||
                !settings.pageContent.thankYou.cta.text) && (
                <button
                  onClick={() => setMockStep("rating")}
                  className="rounded-xl border border-neutral-100 bg-white px-8 py-2.5 text-[11px] font-bold text-neutral-600 shadow-sm"
                >
                  Preview from start
                </button>
              )}
            </div>
          )}
          {/* Card Footer Space */}
          <div className="mt-auto h-0" />
        </div>
      </div>

      {/* Powered By Branding - OUTSIDE the card */}
      {!workspaceIsPro && (
        <div className="animate-in fade-in slide-in-from-bottom-2 mt-10 flex items-center justify-center gap-3 duration-500">
          <div className="flex size-6 items-center justify-center rounded-[7px] bg-neutral-400 text-[11px] font-black text-white shadow-sm ring-4 ring-neutral-100">
            T
          </div>
          <span className="text-[11px] leading-none font-black tracking-widest text-neutral-400 uppercase">
            Powered by TestimonialWall
          </span>
        </div>
      )}
    </div>
  );
}
