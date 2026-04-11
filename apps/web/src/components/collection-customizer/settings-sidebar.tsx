import {
  Palette,
  FormInput,
  MessageSquare,
  Video,
  Shield,
  Star,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Command,
  Lock,
  Quote,
} from "lucide-react";
import { gooeyToast as toast } from "goey-toast";
import type { CollectionSettings } from "./types";
import type { ActiveTab } from "./use-collection-customizer";

export interface SettingsSidebarProps {
  settings: CollectionSettings;
  setNestedSetting: (path: string, value: any) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isPro: boolean;
  project: any;
  updateSettings: any;
  handleSave: () => void;
  setSettings: React.Dispatch<React.SetStateAction<CollectionSettings>>;
}

const ProBadge = () => (
  <span className="ml-2 inline-flex items-center rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-bold tracking-widest text-pink-500 uppercase ring-1 ring-pink-100 ring-inset">
    Pro
  </span>
);

const SectionHeader = ({ title, icon: Icon, pro }: { title: string; icon: any; pro?: boolean }) => (
  <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-2">
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-neutral-400" />
      <h3 className="text-sm font-bold text-neutral-900">{title}</h3>
      {pro && <ProBadge />}
    </div>
  </div>
);

export function SettingsSidebar({
  settings,
  setNestedSetting,
  activeTab,
  setActiveTab,
  isPro,
  project,
  updateSettings,
  handleSave,
  setSettings,
}: SettingsSidebarProps) {
  return (
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

        {activeTab === "share" && (
          <div className="space-y-6">
            <SectionHeader icon={Command} pro title="Share Links" />
            <p className="text-[11px] leading-relaxed font-medium text-neutral-500">
              Use these specialized links to guide your customers to a specific testimonial format.
            </p>

            <div className="space-y-4">
              {[
                {
                  label: "Smart Choice Link",
                  desc: "Let customers choose Video or Text",
                  param: "",
                  icon: Sparkles,
                },
                {
                  label: "Video Only Link",
                  desc: "Direct to video recorder",
                  param: "?t=v",
                  icon: Video,
                },
                {
                  label: "Text Only Link",
                  desc: "Direct to text review form",
                  param: "?t=t",
                  icon: Quote,
                },
              ].map((link) => {
                const url = `${typeof window !== "undefined" ? window.location.origin : ""}/collect/${project.collectionSlug || project.slug}${link.param}`;
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
            <SectionHeader icon={Command} pro title="Advanced" />

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
  );
}
