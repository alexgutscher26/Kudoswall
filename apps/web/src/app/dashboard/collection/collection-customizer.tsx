"use client";

import Image from "next/image";
import { Eye } from "lucide-react";
import type { CollectionCustomizerProps } from "@/components/collection-customizer/types";
import { useCollectionCustomizer } from "@/components/collection-customizer/use-collection-customizer";
import { SettingsSidebar } from "@/components/collection-customizer/settings-sidebar";
import { CollectionWizardPreview } from "@/components/collection-customizer/collection-wizard-preview";

export function CollectionCustomizer({
  project,
  workspace,
  isPro: isProProp,
}: CollectionCustomizerProps) {
  const {
    settings,
    setSettings,
    mockStep,
    setMockStep,
    activeTab,
    setActiveTab,
    isPro,
    updateSettings,
    handleSave,
    setNestedSetting,
  } = useCollectionCustomizer({ project, workspace, isProProp });

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      <SettingsSidebar
        settings={settings}
        setNestedSetting={setNestedSetting}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isPro={isPro}
        project={project}
        updateSettings={updateSettings}
        handleSave={handleSave}
        setSettings={setSettings}
      />

      {/* Main Area - Preview */}
      <div
        className="relative flex flex-1 flex-col overflow-hidden overflow-y-auto rounded-3xl border border-neutral-100 transition-colors duration-300"
        style={{ backgroundColor: settings.backgroundColor }}
      >
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
                  <Image
                    src={settings.logoUrl || workspace.logoUrl}
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
