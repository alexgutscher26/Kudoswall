"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  Globe,
  Terminal,
  Image as LucideImage,
  Layers,
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import { gooeyToast as toast } from "goey-toast";
import { UploadButton } from "@/utils/uploadthing";
import { Type } from "lucide-react";

interface CollectionCustomizerProps {
  project: {
    id: string;
    name: string;
    slug: string;
    collectionSlug?: string | null;
    collectionSettingsJson?: string | null;
    customDomain?: string | null;
    customDomainVerified?: boolean | null;
    customDomainVerificationToken?: string | null;
    customDomainVerificationError?: string | null;
    customCss?: string | null;
    emailFromName?: string | null;
  };
  workspace: {
    id: string;
    name: string;
    plan: "free" | "plan_1" | "plan_2" | "plan_3" | "ltd";
    logoUrl?: string | null;
  };
  isPro: boolean;
  permissions?: {
    features: {
      video: boolean;
    };
  };
}

export type CollectionSettings = {
  thankYouMessage?: string;
  workspaceName?: string;
  logoUrl?: string;
  faviconUrl?: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  customFontUrl?: string;
  customFontName?: string;
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
  privacyPolicyUrl?: string;
  compliance?: {
    cookieConsent: {
      enabled: boolean;
      message: string;
      buttonText: string;
    };
    showFooterPrivacy: boolean;
    footerPrivacyText: string;
    privacyPolicyContent?: string;
  };
  background?: {
    type: "color" | "gradient" | "image";
    gradient?: string;
    imageUrl?: string;
    imageOpacity?: number;
    imageBlur?: number;
    isAnimated?: boolean;
  };
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
    enabled: false,
    prompt: "Tell us about your experience",
    maxLength: 30,
  },
  compliance: {
    cookieConsent: {
      enabled: false,
      message: "We use cookies to ensure you get the best experience on our website.",
      buttonText: "Got it!",
    },
    showFooterPrivacy: true,
    footerPrivacyText: "Privacy Policy",
    privacyPolicyContent: "",
  },
  background: {
    type: "color",
    imageOpacity: 1,
    imageBlur: 0,
    isAnimated: false,
  },
};

export function CollectionCustomizer({
  project,
  workspace,
  isPro,
  permissions,
}: CollectionCustomizerProps) {
  const router = useRouter();
  const videoEnabled = permissions?.features?.video ?? isPro;

  const [settings, setSettings] = useState<CollectionSettings>(() => {
    try {
      const parsed = project.collectionSettingsJson
        ? JSON.parse(project.collectionSettingsJson)
        : {};

      // Deep merge basic structure to ensure missing fields from old projects don't cause crashes
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        form: {
          ...DEFAULT_SETTINGS.form,
          ...(parsed.form || {}),
          fields: {
            ...DEFAULT_SETTINGS.form.fields,
            ...(parsed.form?.fields || {}),
          },
          starRating: {
            ...DEFAULT_SETTINGS.form.starRating,
            ...(parsed.form?.starRating || {}),
          },
        },
        pageContent: {
          ...DEFAULT_SETTINGS.pageContent,
          ...(parsed.pageContent || {}),
          thankYou: {
            ...DEFAULT_SETTINGS.pageContent?.thankYou,
            ...(parsed.pageContent?.thankYou || {}),
          },
        },
        video: {
          ...DEFAULT_SETTINGS.video,
          ...(parsed.video || {}),
        },
        background: {
          ...DEFAULT_SETTINGS.background!,
          ...(parsed.background || {}),
        },
        compliance: {
          ...DEFAULT_SETTINGS.compliance!,
          ...(parsed.compliance || {}),
          cookieConsent: {
            ...DEFAULT_SETTINGS.compliance!.cookieConsent,
            ...(parsed.compliance?.cookieConsent || {}),
          },
        },
      };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  const [mockStep, setMockStep] = useState<"rating" | "text" | "video" | "details" | "success">(
    "rating",
  );

  const [projectName, setProjectName] = useState(project.name);
  const [collectionSlug, setCollectionSlug] = useState(project.collectionSlug || project.slug);
  const [customCss, setCustomCss] = useState(project.customCss || "");
  const [emailFromName, setEmailFromName] = useState(project.emailFromName || "");

  const [activeTab, setActiveTab] = useState<
    "branding" | "fields" | "content" | "video" | "share" | "advanced" | "domain"
  >("branding");

  const [domain, setDomain] = useState(project.customDomain || "");
  const [isDomainVerified, setIsDomainVerified] = useState(!!project.customDomainVerified);
  const [verificationError, setVerificationError] = useState(
    project.customDomainVerificationError || "",
  );

  const updateDomainMutation = useMutation(
    trpc.dashboard.updateProjectDomain.mutationOptions({
      onSuccess: (data) => {
        toast.success("Domain updated!");
        setIsDomainVerified(data.verified);
        setVerificationError(data.verificationError || "");
        router.refresh();
      },
      onError: (e) => {
        toast.error(e instanceof Error ? e.message : "Failed to update domain");
      },
    }),
  );

  const verifyDomainMutation = useMutation(
    trpc.dashboard.verifyProjectDomain.mutationOptions({
      onSuccess: (data) => {
        if (data.verified) {
          toast.success("Domain verified successfully!");
        } else {
          toast.error(
            "Verification failed: " + (data.verificationError || "Please check your DNS settings"),
          );
        }
        setIsDomainVerified(data.verified);
        setVerificationError(data.verificationError || "");
        router.refresh();
      },
      onError: (e) => {
        toast.error(e instanceof Error ? e.message : "Verification failed");
      },
    }),
  );

  const updateSettings = useMutation(
    trpc.dashboard.updateProjectSettings.mutationOptions({
      onSuccess: () => {
        toast.success("Settings saved!");
        router.refresh();
      },
      onError: (e) => {
        toast.error(e instanceof Error ? e.message : "Failed to save settings");
      },
    }),
  );

  // Debounced auto-save: fires 1.5s after the last change
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      updateSettings.mutate({
        projectId: project.id,
        settings,
        name: projectName,
        collectionSlug,
        customCss,
        emailFromName,
      });
    }, 1500);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [settings, projectName, collectionSlug, customCss, emailFromName]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    updateSettings.mutate({
      projectId: project.id,
      settings,
      name: projectName,
      collectionSlug,
      customCss,
      emailFromName,
    });
  };

  const setNestedSetting = (path: string, value: unknown) => {
    setSettings((prev) => {
      const next = { ...prev };
      const keys = path.split(".");
      let current: Record<string, unknown> = next as unknown as Record<string, unknown>;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...(current[keys[i]] as any) };
        current = current[keys[i]] as Record<string, unknown>;
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
    icon: React.ElementType;
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
          {videoEnabled && (
            <button
              onClick={() => setActiveTab("video")}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${activeTab === "video" ? "bg-pink-50 text-pink-500" : "text-neutral-400 hover:bg-neutral-50"}`}
            >
              Video
            </button>
          )}
          <button
            onClick={() => setActiveTab("advanced")}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${activeTab === "advanced" ? "bg-pink-50 text-pink-500" : "text-neutral-400 hover:bg-neutral-50"}`}
          >
            Adv
          </button>
          <button
            onClick={() => setActiveTab("domain")}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${activeTab === "domain" ? "bg-pink-50 text-pink-500" : "text-neutral-400 hover:bg-neutral-50"}`}
          >
            Domain
          </button>
          <button
            onClick={() => setActiveTab("share")}
            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${activeTab === "share" ? "bg-pink-50 text-pink-500" : "text-neutral-400 hover:bg-neutral-50"}`}
          >
            Share
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
                  <div
                    className="relative"
                    onClick={() => {
                      if (!isPro) {
                        toast.error("Pro Feature", {
                          description: "Upgrade to Pro to use custom accent colors.",
                        });
                      }
                    }}
                  >
                    <input
                      className={`size-8 cursor-pointer rounded-lg border-0 p-0 ${!isPro ? "opacity-50 grayscale" : ""}`}
                      disabled={!isPro}
                      onChange={(e) => setNestedSetting("accentColor", e.target.value)}
                      type="color"
                      value={settings.accentColor}
                    />
                  </div>
                </div>
                <div className="space-y-4 rounded-2xl border border-neutral-100 bg-neutral-50/30 p-4">
                  <div className="flex items-center gap-2">
                    <LucideImage className="size-3.5 text-neutral-400" />
                    <span className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                      Background Design
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "color", label: "Solid", icon: Palette },
                      { id: "gradient", label: "Gradient", icon: Layers },
                      { id: "image", label: "Image", icon: LucideImage },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          if (!isPro && t.id !== "color") {
                            toast.error("Pro Feature", {
                              description: "Upgrade to Pro to use premium background designs.",
                            });
                            return;
                          }
                          setNestedSetting("background.type", t.id);
                        }}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition-all ${
                          settings.background?.type === t.id
                            ? "border-pink-500 bg-pink-50 text-pink-500"
                            : "border-neutral-100 bg-white text-neutral-400 hover:bg-neutral-50"
                        } ${!isPro && t.id !== "color" ? "opacity-40" : ""}`}
                      >
                        <t.icon className="size-4" />
                        <span className="text-[10px] font-bold">{t.label}</span>
                      </button>
                    ))}
                  </div>

                  {settings.background?.type === "color" && (
                    <div className="animate-in fade-in slide-in-from-top-2 flex items-center justify-between pt-2 duration-300">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase">
                        Select Color
                      </label>
                      <input
                        className="size-8 cursor-pointer rounded-lg border-0 p-0"
                        disabled={!isPro}
                        onChange={(e) => setNestedSetting("backgroundColor", e.target.value)}
                        type="color"
                        value={settings.backgroundColor}
                      />
                    </div>
                  )}

                  {settings.background?.type === "gradient" && (
                    <div className="animate-in fade-in slide-in-from-top-2 space-y-3 pt-2 duration-300">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase">
                          CSS Gradient
                        </label>
                        <textarea
                          className="h-20 w-full resize-none rounded-xl border border-neutral-100 bg-white px-3 py-2 text-[11px] font-medium outline-none focus:border-pink-500"
                          disabled={!isPro}
                          onChange={(e) => setNestedSetting("background.gradient", e.target.value)}
                          placeholder="linear-gradient(135deg, #fce7f3 0%, #fae8ff 100%)"
                          value={settings.background?.gradient || ""}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "linear-gradient(135deg, #fce7f3 0%, #fae8ff 100%)",
                          "linear-gradient(135deg, #ffedfa 0%, #f3e8ff 100%)",
                          "linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)",
                          "linear-gradient(to right, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
                          "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
                          "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
                        ].map((g) => (
                          <button
                            key={g}
                            onClick={() => setNestedSetting("background.gradient", g)}
                            className="size-6 rounded-lg border border-neutral-100 shadow-sm transition-transform hover:scale-110"
                            style={{ background: g }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase">
                          Animate Gradient
                        </span>
                        <input
                          checked={settings.background?.isAnimated || false}
                          className="accent-pink-500"
                          disabled={!isPro}
                          onChange={(e) =>
                            setNestedSetting("background.isAnimated", e.target.checked)
                          }
                          type="checkbox"
                        />
                      </div>
                    </div>
                  )}

                  {settings.background?.type === "image" && (
                    <div className="animate-in fade-in slide-in-from-top-2 space-y-4 pt-2 duration-300">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase">
                          Upload Image
                        </label>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            if (res?.[0]) {
                              setNestedSetting("background.imageUrl", res[0].url);
                              toast.success("Background uploaded!");
                            }
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(`Error: ${error.message}`);
                          }}
                          appearance={{
                            button:
                              "w-full h-8 text-[11px] font-bold bg-neutral-900 border-none rounded-xl",
                            allowedContent: "hidden",
                          }}
                        />
                      </div>

                      {settings.background?.imageUrl && (
                        <>
                          <div className="space-y-1.5">
                            <div className="flex justify-between">
                              <label className="text-[10px] font-bold text-neutral-500 uppercase">
                                Opacity
                              </label>
                              <span className="text-[10px] font-bold text-neutral-400">
                                {Math.round((settings.background?.imageOpacity || 1) * 100)}%
                              </span>
                            </div>
                            <input
                              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-pink-500"
                              max="1"
                              min="0"
                              onChange={(e) =>
                                setNestedSetting(
                                  "background.imageOpacity",
                                  parseFloat(e.target.value),
                                )
                              }
                              step="0.01"
                              type="range"
                              value={settings.background?.imageOpacity ?? 1}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between">
                              <label className="text-[10px] font-bold text-neutral-500 uppercase">
                                Blur
                              </label>
                              <span className="text-[10px] font-bold text-neutral-400">
                                {settings.background?.imageBlur || 0}px
                              </span>
                            </div>
                            <input
                              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-pink-500"
                              max="20"
                              min="0"
                              onChange={(e) =>
                                setNestedSetting("background.imageBlur", parseInt(e.target.value))
                              }
                              step="1"
                              type="range"
                              value={settings.background?.imageBlur ?? 0}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
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
                    <optgroup label="System Defaults">
                      <option value="sans">Sans-serif (Modern)</option>
                      <option value="serif">Serif (Classic)</option>
                      <option value="mono">Monospace (Minimal)</option>
                    </optgroup>
                    <optgroup label="Google Fonts">
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Lato">Lato</option>
                      <option value="Oswald">Oswald</option>
                      <option value="Raleway">Raleway</option>
                      <option value="Nunito">Nunito</option>
                      <option value="Playfair Display">Playfair Display</option>
                      <option value="Merriweather">Merriweather</option>
                      <option value="Ubuntu">Ubuntu</option>
                      <option value="PT Sans">PT Sans</option>
                      <option value="Source Sans Pro">Source Sans Pro</option>
                      <option value="Quicksand">Quicksand</option>
                      <option value="Josefin Sans">Josefin Sans</option>
                      <option value="Mulish">Mulish</option>
                      <option value="Arvo">Arvo</option>
                      <option value="Alegreya">Alegreya</option>
                      <option value="Crimson Text">Crimson Text</option>
                      <option value="Libre Baskerville">Libre Baskerville</option>
                      <option value="EB Garamond">EB Garamond</option>
                      <option value="Cormorant Garamond">Cormorant Garamond</option>
                      <option value="Work Sans">Work Sans</option>
                      <option value="Fira Sans">Fira Sans</option>
                      <option value="Space Mono">Space Mono</option>
                      <option value="DM Sans">DM Sans</option>
                      <option value="Outfit">Outfit</option>
                      <option value="Lexend">Lexend</option>
                      <option value="Urbanist">Urbanist</option>
                      <option value="Syne">Syne</option>
                      <option value="Sora">Sora</option>
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                      <option value="Jost">Jost</option>
                      <option value="Fraunces">Fraunces</option>
                    </optgroup>
                    <optgroup label="Custom Branding">
                      <option value="custom">Custom Font (.woff2)</option>
                    </optgroup>
                  </select>

                  {settings.fontFamily === "custom" && (
                    <div className="animate-in fade-in slide-in-from-top-2 mt-2 space-y-2 rounded-2xl border border-neutral-100 bg-neutral-50 p-3 duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-tighter text-neutral-400 uppercase">
                          Upload .woff2
                        </span>
                        {settings.customFontUrl && (
                          <span className="text-[10px] font-bold text-emerald-500">Ready</span>
                        )}
                      </div>
                      <UploadButton
                        endpoint="fontUploader"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]) {
                            setNestedSetting("customFontUrl", res[0].url);
                            setNestedSetting("customFontName", res[0].name.replace(".woff2", ""));
                            toast.success("Font uploaded!");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Error: ${error.message}`);
                        }}
                        appearance={{
                          button:
                            "w-full h-8 text-[11px] font-bold bg-neutral-900 border-none rounded-xl",
                          allowedContent: "hidden",
                        }}
                      />
                      {settings.customFontName && (
                        <div className="flex items-center gap-2 truncate overflow-hidden rounded-lg border border-neutral-100 bg-white px-2 py-1.5">
                          <Type className="size-3 shrink-0 text-neutral-400" />
                          <span className="truncate text-[10px] font-bold text-neutral-600">
                            {settings.customFontName}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Favicon
                  </label>
                  <div className="flex items-center gap-3">
                    {settings.faviconUrl ? (
                      <div className="relative flex size-10 items-center justify-center rounded-xl border border-neutral-100 bg-white">
                        <Image
                          src={settings.faviconUrl}
                          alt="Favicon preview"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                        {isPro && (
                          <button
                            onClick={() => setNestedSetting("faviconUrl", undefined)}
                            className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white hover:bg-red-600"
                            type="button"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50">
                        <Globe className="size-5 text-neutral-300" />
                      </div>
                    )}
                    <div
                      className="flex-1"
                      onClickCapture={(e) => {
                        if (!isPro) {
                          e.stopPropagation();
                          e.preventDefault();
                          toast.error("Pro Feature", {
                            description: "Upgrade to Pro to use a custom favicon.",
                          });
                        }
                      }}
                    >
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]) {
                            setNestedSetting("faviconUrl", res[0].url);
                            toast.success("Favicon uploaded!");
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast.error(`Error: ${error.message}`);
                        }}
                        appearance={{
                          button: `w-full h-8 text-[11px] font-bold bg-neutral-900 border-none rounded-xl ${
                            !isPro ? "pointer-events-none opacity-50" : ""
                          }`,
                          allowedContent: "hidden",
                        }}
                      />
                    </div>
                  </div>
                </div> */}
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
                    className="h-20 w-full resize-none rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium outline-none focus:border-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!isPro}
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
                    disabled={!videoEnabled}
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
                        disabled={!videoEnabled}
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
                        disabled={!videoEnabled}
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

          {activeTab === "domain" && (
            <div className="space-y-6">
              <SectionHeader icon={Globe} pro title="Custom Domain" />
              <p className="text-[11px] leading-relaxed font-medium text-neutral-500">
                Connect your own domain to your collection page. Use a subdomain like{" "}
                <code className="text-pink-500">testimonials.yourdomain.com</code>.
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Domain Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-2.5 text-sm font-medium outline-none focus:border-pink-500"
                      onClick={() => {
                        if (!isPro) {
                          toast.error("Pro Feature", {
                            description: "Upgrade to Pro to use your own custom domain.",
                          });
                        }
                      }}
                      disabled={!isPro || updateDomainMutation.isPending}
                      onChange={(e) => setDomain(e.target.value.toLowerCase().trim())}
                      placeholder={isPro ? "testimonials.example.com" : "Available on Pro plans"}
                      type="text"
                      value={domain}
                    />
                    <button
                      className="rounded-xl bg-neutral-900 px-6 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      onClick={() => {
                        if (!isPro) {
                          toast.error("Pro Feature", {
                            description: "Upgrade to Pro to use your own custom domain.",
                          });
                          return;
                        }
                        updateDomainMutation.mutate({ projectId: project.id, domain });
                      }}
                      disabled={
                        (!isPro && domain === "") ||
                        updateDomainMutation.isPending ||
                        domain === (project.customDomain || "")
                      }
                    >
                      {updateDomainMutation.isPending ? "Saving..." : "Save Domain"}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div
                    className={`rounded-2xl border p-4 transition-all duration-300 ${isDomainVerified ? "border-emerald-100 bg-emerald-50/50" : "border-neutral-100 bg-neutral-50/30"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isDomainVerified ? (
                          <CheckCircle2 className="size-4 text-emerald-500" />
                        ) : (
                          <div className="flex size-4 items-center justify-center rounded-full bg-amber-100">
                            <Sparkles className="size-2 text-amber-500" />
                          </div>
                        )}
                        <span
                          className={`text-[10px] font-bold ${isDomainVerified ? "text-emerald-700" : "text-neutral-600"}`}
                        >
                          {isDomainVerified ? "Verified & Ready" : "Setup Required"}
                        </span>
                      </div>
                      {domain && project.customDomain === domain && (
                        <button
                          className="rounded-lg bg-neutral-900 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-95 disabled:opacity-50"
                          disabled={verifyDomainMutation.isPending}
                          onClick={() => verifyDomainMutation.mutate({ projectId: project.id })}
                        >
                          {verifyDomainMutation.isPending ? "Checking..." : "Verify DNS Now"}
                        </button>
                      )}
                    </div>

                    {!isDomainVerified && (
                      <div className="mt-4 space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[8px] font-black text-white">
                            1
                          </div>
                          <p className="text-[10px] font-bold text-neutral-800">
                            Configure your DNS provider
                          </p>
                        </div>

                        <p className="pl-6 text-[10px] leading-normal text-neutral-500">
                          Add the following CNAME record to point your subdomain to your collection
                          page.
                        </p>

                        <div className="ml-6 overflow-hidden rounded-xl border border-neutral-100 bg-white p-0">
                          <div className="flex items-center justify-between border-b border-neutral-50 px-3 py-2">
                            <span className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase">
                              Type
                            </span>
                            <span className="font-mono text-[10px] font-bold text-neutral-900">
                              CNAME
                            </span>
                          </div>
                          <div className="flex items-center justify-between border-b border-neutral-50 px-3 py-2">
                            <span className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase">
                              Host
                            </span>
                            <span className="font-mono text-[10px] font-bold text-pink-500">
                              {domain ? domain.split(".")[0] : "subdomain"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between px-3 py-2">
                            <span className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase">
                              Target
                            </span>
                            <span className="font-mono text-[10px] font-bold text-neutral-900">
                              kudoswall.org
                            </span>
                          </div>
                        </div>

                        {domain && project.customDomain !== domain && (
                          <div className="flex items-start gap-2 pt-1 pl-6">
                            <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[8px] font-black text-white">
                              2
                            </div>
                            <p className="text-[10px] font-bold text-neutral-800">
                              Hit "Save" to start verification
                            </p>
                          </div>
                        )}

                        {verificationError && (
                          <div className="mt-2 ml-6 rounded-lg border border-rose-100 bg-rose-50 p-2">
                            <p className="mb-1 text-[9px] font-bold tracking-widest text-rose-600 uppercase">
                              Last Error
                            </p>
                            <p className="text-[9px] font-medium text-rose-500">
                              {verificationError}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {!isPro && (
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-center">
                  <Lock className="mx-auto mb-2 size-4 text-neutral-300" />
                  <p className="mb-2 text-[11px] font-bold text-neutral-500">
                    Upgrade to Pro to use custom domains
                  </p>
                  <button className="w-full rounded-xl bg-neutral-900 py-2 text-[11px] font-bold text-white transition-opacity hover:opacity-90">
                    Upgrade Now
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "share" && (
            <div className="space-y-6">
              <SectionHeader icon={Command} pro title="Share Links" />
              <p className="text-[11px] leading-relaxed font-medium text-neutral-500">
                Use these specialized links to guide your customers to a specific testimonial
                format.
              </p>

              <div className="space-y-4">
                {[
                  {
                    label: "Direct Collection Link",
                    desc: "Send customers to leave a text review",
                    param: "",
                    icon: Quote,
                  },
                  {
                    label: "Video Only Link",
                    desc: "Direct to video recorder",
                    param: "?t=v",
                    icon: Video,
                  },
                ].map((link) => {
                  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/collect/${collectionSlug}${link.param}`;
                  return (
                    <div
                      key={link.label}
                      className="group rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 transition-all hover:bg-white hover:shadow-md"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <link.icon className="size-3 text-pink-500" />
                          <span className="text-[10px] font-black tracking-widest text-neutral-900 uppercase">
                            {link.label}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(url);
                            toast.success(`${link.label} copied!`);
                          }}
                          className="rounded-lg bg-neutral-900 px-2.5 py-1 text-[9px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="mb-2 text-[10px] font-medium text-neutral-400">{link.desc}</p>
                      <div className="truncate rounded-lg bg-white px-2 py-1.5 font-mono text-[9px] text-neutral-500 italic ring-1 ring-neutral-100">
                        {url}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "advanced" && (
            <div className="space-y-6">
              <SectionHeader icon={Terminal} pro title="Custom CSS" />
              <div className="space-y-2">
                <p className="text-[10px] leading-normal text-neutral-400">
                  Override styles on your collection page with custom CSS. Use this to fine-tune
                  colors, spacing, or add custom animations.
                </p>
                <div className="relative">
                  <textarea
                    className="h-40 w-full resize-none rounded-xl border border-neutral-100 bg-neutral-900 p-3 font-mono text-[11px] text-emerald-400 outline-none focus:ring-1 focus:ring-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!isPro}
                    onChange={(e) => setCustomCss(e.target.value)}
                    placeholder="/* .collect-heading { color: red; } */"
                    spellCheck={false}
                    value={customCss}
                  />
                  {!isPro && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-neutral-900/10 backdrop-blur-[1px]">
                      <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 shadow-xl">
                        <Lock className="size-3 text-neutral-400" />
                        <span className="text-[10px] font-bold text-neutral-600">Pro Feature</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <SectionHeader icon={Command} title="General Info" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Collection Name
                  </label>
                  <input
                    className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium outline-none focus:border-pink-500"
                    onChange={(e) => setProjectName(e.target.value)}
                    type="text"
                    value={projectName}
                  />
                  <p className="text-[10px] text-neutral-400">
                    Only visible to you, used to identify it later.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    URL Slug
                  </label>
                  <input
                    className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium outline-none focus:border-pink-500"
                    onChange={(e) =>
                      setCollectionSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
                    }
                    type="text"
                    value={collectionSlug}
                  />
                  <p className="text-[10px] text-neutral-400">
                    The public URL path for your collection page.
                  </p>
                </div>
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

              <SectionHeader icon={Shield} pro title="Legal & Compliance" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                    Privacy Policy URL
                  </label>
                  <input
                    className="w-full rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium outline-none focus:border-pink-500"
                    disabled={!isPro}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, privacyPolicyUrl: e.target.value }))
                    }
                    placeholder="https://yourwebsite.com/privacy"
                    type="url"
                    value={settings.privacyPolicyUrl || ""}
                  />
                  <p className="text-[10px] text-neutral-400">
                    Linked in the collection form consent checkbox.
                  </p>
                </div>

                <div className="space-y-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-neutral-900 uppercase">
                      Email "From" Name {isPro && <Sparkles className="size-3 text-pink-500" />}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-medium text-neutral-500">
                      Customize the sender name for confirmation emails sent to authors.
                    </p>
                    <input
                      className="w-full rounded-lg border border-neutral-100 bg-white px-3 py-1.5 text-[11px] font-medium outline-none focus:border-pink-500 disabled:opacity-50"
                      disabled={!isPro}
                      onChange={(e) => setEmailFromName(e.target.value)}
                      placeholder="e.g. Alex from KudosWall"
                      type="text"
                      value={emailFromName}
                    />
                    {!isPro && (
                      <p className="text-[9px] font-bold text-pink-500 uppercase">
                        Requires Pro Plan
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-widest text-neutral-900 uppercase">
                      Cookie Consent Banner
                    </span>
                    <input
                      checked={settings.compliance?.cookieConsent?.enabled || false}
                      className="accent-pink-500"
                      disabled={!isPro}
                      onChange={(e) =>
                        setNestedSetting("compliance.cookieConsent.enabled", e.target.checked)
                      }
                      type="checkbox"
                    />
                  </div>
                  {(settings.compliance?.cookieConsent?.enabled || false) && (
                    <div className="animate-in fade-in slide-in-from-top-2 space-y-3 duration-300">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">
                          Banner Message
                        </label>
                        <textarea
                          className="h-16 w-full resize-none rounded-lg border border-neutral-100 bg-white px-3 py-2 text-[11px] font-medium outline-none focus:border-pink-500"
                          onChange={(e) =>
                            setNestedSetting("compliance.cookieConsent.message", e.target.value)
                          }
                          value={settings.compliance?.cookieConsent?.message || ""}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">
                          Button Text
                        </label>
                        <input
                          className="w-full rounded-lg border border-neutral-100 bg-white px-3 py-1.5 text-[11px] font-medium outline-none focus:border-pink-500"
                          onChange={(e) =>
                            setNestedSetting("compliance.cookieConsent.buttonText", e.target.value)
                          }
                          type="text"
                          value={settings.compliance?.cookieConsent?.buttonText || ""}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-widest text-neutral-900 uppercase">
                      Show Footer Privacy Link
                    </span>
                    <input
                      checked={settings.compliance?.showFooterPrivacy ?? true}
                      className="accent-pink-500"
                      disabled={!isPro}
                      onChange={(e) =>
                        setNestedSetting("compliance.showFooterPrivacy", e.target.checked)
                      }
                      type="checkbox"
                    />
                  </div>
                  {(settings.compliance?.showFooterPrivacy ?? true) && (
                    <div className="animate-in fade-in slide-in-from-top-2 space-y-3 duration-300">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-400 uppercase">
                          Footer Link Text
                        </label>
                        <input
                          className="w-full rounded-lg border border-neutral-100 bg-white px-3 py-1.5 text-[11px] font-medium outline-none focus:border-pink-500"
                          onChange={(e) =>
                            setNestedSetting("compliance.footerPrivacyText", e.target.value)
                          }
                          type="text"
                          value={settings.compliance?.footerPrivacyText || "Privacy Policy"}
                        />
                      </div>

                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">
                            Privacy Policy Content (Markdown)
                          </label>
                          <button
                            onClick={() => {
                              const template = `## Privacy Policy for ${project.name}\n\nWe value your privacy. This policy explains how ${workspace.name} ("we", "us", or "our") collects, uses, and shares information when you provide a testimonial for ${project.name}.\n\n### 1. Information We Collect\nWhen you submit a testimonial, we collect your name, email address, and any other information you choose to provide (such as your photo, company name, or social media links).\n\n### 2. How We Use Your Information\nWe use your information to display your testimonial on our website and marketing materials. You grant us a non-exclusive, world-wide, perpetual license to use your content.\n\n### 3. Sharing Your Information\nYour testimonial (including your name and photo) will be publicly visible. Your email address will not be shared publicly.\n\n### 4. Your Rights\nYou can request the removal of your testimonial at any time by contacting us at support@example.com.`;
                              setNestedSetting("compliance.privacyPolicyContent", template);
                            }}
                            className="text-[10px] font-bold text-pink-500 hover:underline"
                          >
                            Generate Template
                          </button>
                        </div>
                        <textarea
                          className="h-32 w-full resize-none rounded-lg border border-neutral-100 bg-white px-3 py-2 text-[11px] leading-relaxed font-medium outline-none focus:border-pink-500"
                          onChange={(e) =>
                            setNestedSetting("compliance.privacyPolicyContent", e.target.value)
                          }
                          placeholder="Markdown supported..."
                          value={settings.compliance?.privacyPolicyContent || ""}
                        />
                        <p className="text-[10px] text-neutral-400 italic">
                          If empty, we'll use your Privacy Policy URL above.
                        </p>
                      </div>
                    </div>
                  )}
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
      <div
        id="collection-preview-area"
        className={`relative flex flex-1 flex-col overflow-hidden overflow-y-auto rounded-3xl border border-neutral-100 transition-colors duration-300 ${
          settings.background?.type === "gradient" && settings.background?.isAnimated
            ? "animate-gradient"
            : ""
        }`}
        style={{
          backgroundColor:
            settings.background?.type === "color" ? settings.backgroundColor : undefined,
          backgroundImage:
            settings.background?.type === "gradient" ? settings.background.gradient : undefined,
          fontFamily:
            settings?.fontFamily === "custom" && settings.customFontUrl
              ? "'CustomFont', sans-serif"
              : settings?.fontFamily && !["sans", "serif", "mono"].includes(settings.fontFamily)
                ? `"${settings.fontFamily}", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`
                : settings?.fontFamily === "mono"
                  ? "monospace"
                  : settings?.fontFamily === "serif"
                    ? "serif"
                    : "var(--font-sans), sans-serif",
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes gradient-shift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-gradient {
              background-size: 400% 400% !important;
              animation: gradient-shift 15s ease infinite !important;
            }
          `,
          }}
        />
        {settings.background?.type === "image" && settings.background.imageUrl && (
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${settings.background.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: settings.background.imageOpacity ?? 1,
              filter: `blur(${settings.background.imageBlur ?? 0}px)`,
            }}
          />
        )}
        {settings?.fontFamily === "custom" && settings.customFontUrl && (
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @font-face {
                  font-family: 'CustomFont';
                  src: url('${settings.customFontUrl}') format('woff2');
                  font-weight: 300 900;
                  font-style: normal;
                  font-display: swap;
                }
                #collection-preview-area, #collection-preview-area * {
                  font-family: 'CustomFont', system-ui, sans-serif !important;
                }
              `,
            }}
          />
        )}
        {settings?.fontFamily &&
          !["sans", "serif", "mono", "custom"].includes(settings.fontFamily) && (
            <style
              dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800;900&display=swap');
                #collection-preview-area, #collection-preview-area * {
                  font-family: inherit !important;
                }
              `,
              }}
            />
          )}
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
              { id: "choice", label: "Choice" },
              { id: "text", label: "Story" },
              ...(isPro ? [{ id: "video", label: "Video" }] : []),
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
                  <Image
                    src={(settings.logoUrl || workspace.logoUrl) as string}
                    alt={workspace.name}
                    width={56}
                    height={56}
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
              workspaceIsPro={isPro}
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
  mockStep: "rating" | "choice" | "text" | "video" | "details" | "success";
  setMockStep: (step: any) => void;
}) {
  useEffect(() => {
    if (activeTab === "fields") setMockStep("details");
    // Content tab: headline/subheading are on the rating step; thankYou is on success.
    // Show rating so users immediately see their headline/subheading changes reflected.
    else if (activeTab === "content") setMockStep("rating");
    else if (activeTab === "video") setMockStep("video");
    else if (activeTab === "branding" || activeTab === "advanced") setMockStep("rating");
    else if (activeTab === "share") setMockStep("rating");
  }, [activeTab, setMockStep]);

  const stepInfo: Record<string, { text: string; title: string; percent: number }> = {
    rating: { text: "Step 1 of 4", title: "Rate Your Experience", percent: 25 },
    choice: { text: "Step 1 of 4", title: "Choose Format", percent: 25 },
    text: { text: "Step 2 of 4", title: "Detailed Feedback", percent: 50 },
    video: { text: "Step 2 of 4", title: "Record Video", percent: 50 },
    details: { text: "Step 3 of 4", title: "Identity & Photo", percent: 75 },
    success: { text: "Complete", title: "Thank You", percent: 100 },
  };
  const info = stepInfo[mockStep];

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Step Indicator */}
      {mockStep !== "success" && (
        <div className="mb-6">
          <div className="mb-2 flex items-end justify-between">
            <div>
              <span className="text-[10px] tracking-widest text-[#45464d] uppercase">
                {info.text}
              </span>
              <h2 className="mt-0.5 text-base font-bold text-[#191c1e]">{info.title}</h2>
            </div>
            <span className="text-[11px] font-medium text-[#45464d]">{info.percent}% Complete</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e6e8ea]">
            <div
              className="h-full rounded-full bg-[#000000] transition-all duration-500"
              style={{ width: `${info.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Card */}
      <div className="relative overflow-hidden rounded-xl border border-[#c6c6cd]/20 bg-white p-5 shadow-sm">
        <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-[#d5e3fd]/20 blur-3xl" />

        <div className="relative z-10">
          {/* Rating Step */}
          {mockStep === "rating" && (
            <div className="py-2 text-center">
              <p className="mb-1 text-[11px] font-semibold tracking-widest text-[#45464d] uppercase">
                {settings.pageContent.subheading || "We value your feedback"}
              </p>
              <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-[#191c1e]">
                {settings.pageContent.headline || "How was your experience?"}
              </h1>
              {settings.form.starRating.enabled && (
                <div className="mb-8 flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`size-9 transition-all ${s <= 4 ? "fill-[#000000] text-[#000000]" : "text-[#e0e3e5]"}`}
                    />
                  ))}
                </div>
              )}
              <div className="mb-6 flex flex-wrap justify-center gap-2">
                <div className="flex items-center gap-1.5 rounded-lg bg-[#e6e8ea] px-3 py-1">
                  <CheckCircle2 className="size-3.5 text-[#009668]" />
                  <span className="text-[10px] font-semibold tracking-wider text-[#45464d] uppercase">
                    Verified User
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-[#e6e8ea] px-3 py-1">
                  <Shield className="size-3.5 text-[#7c839b]" />
                  <span className="text-[10px] font-semibold tracking-wider text-[#45464d] uppercase">
                    Privacy Guaranteed
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMockStep("text")}
                className="rounded-lg bg-[#000000] px-8 py-2.5 text-[11px] font-bold tracking-widest text-white uppercase transition-all hover:opacity-90"
              >
                Next Step →
              </button>
            </div>
          )}

          {mockStep === "choice" && (
            <div className="py-2 text-center">
              <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-[#191c1e]">
                How would you like to share?
              </h1>
              <p className="mb-6 text-sm text-[#45464d]">
                Choose the format that works best for you.
              </p>
              <div
                className={`mb-6 grid w-full gap-3 ${workspaceIsPro ? "grid-cols-2" : "grid-cols-1"}`}
              >
                {workspaceIsPro && (
                  <button
                    onClick={() => setMockStep("video")}
                    className="flex flex-col items-center gap-2 rounded-xl border border-[#c6c6cd]/30 bg-white p-5 transition-all hover:shadow-md"
                  >
                    <div className="flex size-10 items-center justify-center rounded-xl bg-[#f2f4f6]">
                      <Video className="size-5 text-[#000000]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#191c1e]">Video</h3>
                      <p className="text-[10px] text-[#76777d]">Quick & Personal</p>
                    </div>
                  </button>
                )}
                <button
                  onClick={() => setMockStep("text")}
                  className="flex flex-col items-center gap-2 rounded-xl border border-[#c6c6cd]/30 bg-white p-5 transition-all hover:shadow-md"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#000000]">
                    <Quote className="size-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#191c1e]">Text</h3>
                    <p className="text-[10px] text-[#76777d]">Simple & Classic</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Text Step */}
          {mockStep === "text" && (
            <div className="text-left">
              <label className="mb-1 block text-base font-bold text-[#191c1e]">
                {settings.form.fields?.fullName?.label || "Tell us about your experience."}
              </label>
              <p className="mb-3 text-xs leading-relaxed text-[#45464d]">
                {settings.video?.prompt ||
                  "What stood out the most? Specific details help others the most."}
              </p>
              <div className="relative">
                <div className="flex h-28 w-full items-start rounded-xl bg-[#f2f4f6] p-3 text-xs text-[#76777d] italic">
                  I chose {projectName} because...
                </div>
                <span className="absolute right-3 bottom-3 text-[10px] text-[#76777d]">
                  0 / {settings.form.minCharCount}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[#c6c6cd]/20 pt-3">
                <button
                  onClick={() => setMockStep("rating")}
                  className="text-[10px] font-bold tracking-widest text-[#45464d] uppercase"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setMockStep("details")}
                  className="rounded-lg bg-[#000000] px-6 py-2 text-[10px] font-bold tracking-widest text-white uppercase"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {mockStep === "video" && (
            <div className="text-center">
              <h1 className="mb-1 text-xl font-extrabold text-[#191c1e]">Record your video</h1>
              <p className="mb-4 text-xs text-[#45464d]">
                {settings.video?.prompt || "Tell us about your experience"}
              </p>
              <div className="mb-4 flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl bg-[#191c1e]">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/10">
                  <Camera className="size-5 text-white" />
                </div>
                <p className="text-[10px] font-bold tracking-widest text-white/60 uppercase">
                  Camera Preview
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-[#c6c6cd]/20 pt-3">
                <button
                  onClick={() => setMockStep("choice")}
                  className="text-[10px] font-bold tracking-widest text-[#45464d] uppercase"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setMockStep("details")}
                  className="rounded-lg bg-[#000000] px-6 py-2 text-[10px] font-bold tracking-widest text-white uppercase"
                >
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* Details Step */}
          {mockStep === "details" && (
            <div className="space-y-3 text-left">
              <h1 className="mb-1 text-xl font-extrabold text-[#191c1e]">Almost done!</h1>
              <p className="mb-3 text-xs text-[#45464d]">
                Add your details so we can attribute your testimonial.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[10px] font-bold tracking-widest text-[#45464d] uppercase">
                    {settings.form.fields.fullName.label}{" "}
                    {settings.form.fields.fullName.required ? "*" : ""}
                  </label>
                  <div className="flex h-8 w-full items-center rounded-lg bg-[#f2f4f6] px-3 text-[10px] text-[#76777d]">
                    {settings.form.fields.fullName.placeholder}
                  </div>
                </div>
                {settings.form.fields.email.enabled && (
                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-widest text-[#45464d] uppercase">
                      {settings.form.fields.email.label}{" "}
                      {settings.form.fields.email.required ? "*" : ""}
                    </label>
                    <div className="flex h-8 w-full items-center rounded-lg bg-[#f2f4f6] px-3 text-[10px] text-[#76777d]">
                      {settings.form.fields.email.placeholder}
                    </div>
                  </div>
                )}
                {settings.form.fields.company.enabled && (
                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-widest text-[#45464d] uppercase">
                      {settings.form.fields.company.label}
                    </label>
                    <div className="flex h-8 w-full items-center rounded-lg bg-[#f2f4f6] px-3 text-[10px] text-[#76777d]">
                      {settings.form.fields.company.placeholder}
                    </div>
                  </div>
                )}
                {settings.form.fields.jobTitle.enabled && (
                  <div>
                    <label className="mb-1 block text-[10px] font-bold tracking-widest text-[#45464d] uppercase">
                      {settings.form.fields.jobTitle.label}
                    </label>
                    <div className="flex h-8 w-full items-center rounded-lg bg-[#f2f4f6] px-3 text-[10px] text-[#76777d]">
                      {settings.form.fields.jobTitle.placeholder}
                    </div>
                  </div>
                )}
              </div>
              {settings.form.fields.linkedin.enabled && (
                <div className="mt-2">
                  <label className="mb-1 block text-[10px] font-bold tracking-widest text-[#45464d] uppercase">
                    {settings.form.fields.linkedin.label}
                    {settings.form.fields.linkedin.required ? " *" : ""}
                  </label>
                  <div className="flex h-8 w-full items-center rounded-lg bg-[#f2f4f6] px-3 text-[10px] text-[#76777d]">
                    {settings.form.fields.linkedin.placeholder}
                  </div>
                </div>
              )}
              <div className="mt-2 flex items-center justify-between border-t border-[#c6c6cd]/20 pt-3">
                <button
                  onClick={() => setMockStep("text")}
                  className="text-[10px] font-bold tracking-widest text-[#45464d] uppercase"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setMockStep("success")}
                  className="rounded-lg bg-[#000000] px-6 py-2 text-[10px] font-bold tracking-widest text-white uppercase"
                >
                  Review Testimonial →
                </button>
              </div>
            </div>
          )}

          {/* Success Step */}
          {mockStep === "success" && (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#d5e3fd]/40">
                <CheckCircle2 className="size-7 text-[#000000]" />
              </div>
              <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-[#191c1e]">
                {settings.pageContent.thankYou.headline || "You're awesome!"}
              </h1>
              <p className="mx-auto mb-6 max-w-xs text-sm text-[#45464d]">
                {settings.pageContent.thankYou.body ||
                  "Your feedback has been sent. It helps us more than you know."}
              </p>
              {settings.pageContent.thankYou.cta.enabled &&
                settings.pageContent.thankYou.cta.text && (
                  <button className="mb-3 rounded-lg bg-[#000000] px-8 py-2.5 text-[11px] font-bold tracking-widest text-white uppercase transition-all hover:opacity-90">
                    {settings.pageContent.thankYou.cta.text}
                  </button>
                )}
              <div className="mt-4">
                <button
                  onClick={() => setMockStep("rating")}
                  className="text-[10px] font-bold text-[#45464d] underline"
                >
                  Preview from start
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
