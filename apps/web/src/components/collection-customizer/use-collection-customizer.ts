import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { gooeyToast as toast } from "goey-toast";
import type { CollectionSettings } from "./types";
import { DEFAULT_SETTINGS } from "./types";

export type MockStep = "rating" | "choice" | "text" | "video" | "details" | "success";
export type ActiveTab = "branding" | "fields" | "content" | "video" | "share" | "advanced";

export function useCollectionCustomizer({
  project,
  workspace,
  isProProp,
}: {
  project: any;
  workspace: any;
  isProProp?: boolean;
}) {
  const [settings, setSettings] = useState<CollectionSettings>(() => {
    try {
      return project.collectionSettingsJson
        ? JSON.parse(project.collectionSettingsJson)
        : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  const [mockStep, setMockStep] = useState<MockStep>("rating");
  const [activeTab, setActiveTab] = useState<ActiveTab>("branding");
  const isPro = isProProp ?? workspace.isPro;

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
      updateSettings.mutate({ projectId: project.id, settings });
    }, 1500);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [settings]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
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

  return {
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
  };
}
