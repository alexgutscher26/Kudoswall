"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  Camera,
  CheckCircle2,
  Quote,
  Star,
  Video as VideoIcon,
  BadgeCheck,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  User,
  SkipForward,
} from "lucide-react";
import { useLocale } from "@/lib/collection-i18n";
import { useState, useMemo, useEffect } from "react";
import { uploadFiles } from "@/utils/uploadthing";
import { gooeyToast as toast } from "goey-toast";
import { ImageCropper } from "@/components/collection/image-cropper";
import VideoRecorder from "@/components/collection/video-recorder";
import { submitTestimonial } from "./actions";
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";

interface CollectionWizardProps {
  project: {
    id: string;
    name: string;
    workspaceId: string;
    thankYouMessage?: string | null;
    collectionSettingsJson?: string | null;
    workspace: {
      isPro: boolean;
      branding: {
        accentColor: string;
        logoUrl?: string | null;
        font: string;
      };
    };
  };
}

type Step = "rating" | "choice" | "text" | "video" | "details" | "review" | "success";

interface CollectionSettings {
  fontFamily?: string;
  backgroundColor?: string;
  form?: {
    starRating?: { enabled: boolean };
    minCharCount?: number;
    fields?: {
      fullName?: { label?: string; required?: boolean };
      email?: { label?: string; required?: boolean; enabled?: boolean };
      content?: { label?: string; placeholder?: string };
      jobTitle?: { label?: string; enabled?: boolean };
      company?: { label?: string; enabled?: boolean };
      linkedin?: { label?: string; enabled?: boolean; required?: boolean };
    };
  };
  privacyPolicyUrl?: string;
  video?: {
    prompt?: string;
    maxLength?: number;
  };
  redirectUrl?: string;
  pageContent?: {
    subheading?: string;
    thankYou?: {
      headline?: string;
      body?: string;
      cta?: { enabled: boolean; text: string; url: string };
    };
  };
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
}

/**
 * Detects system color scheme preference via `prefers-color-scheme`.
 * Returns `false` when `enabled` is `false` (e.g. project has explicit bg).
 */
function useDarkMode(enabled: boolean): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [enabled]);

  return isDark;
}

/**
 * Framer Motion variants for directional slide+fade step transitions.
 * Uses `transform: translateX` for GPU acceleration (no layout thrash).
 */
const SLIDE_VARIANTS = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
} as const;

const SLIDE_TRANSITION = {
  duration: 0.25,
  ease: [0.4, 0, 0.2, 1] as const,
};

/** Scoped CSS custom properties for light/dark color themes. */
const THEME_CSS = `
  .cw-root {
    --cw-card: #ffffff;
    --cw-surface: #f2f4f6;
    --cw-badge: #e6e8ea;
    --cw-border-20: rgba(198, 198, 205, 0.2);
    --cw-border-30: rgba(198, 198, 205, 0.3);
    --cw-border-60: rgba(198, 198, 205, 0.65);
    --cw-text-primary: #191c1e;
    --cw-text-secondary: #45464d;
    --cw-text-muted: #76777d;
    --cw-fg: #000000;
    --cw-fg-inv: #ffffff;
    --cw-blue-tint-30: rgba(213, 227, 253, 0.3);
    --cw-blue-tint-40: rgba(213, 227, 253, 0.4);
    --cw-blue-tint-border: #d5e3fd;
    --cw-star-empty: #e0e3e5;
    --cw-green: #009668;
    --cw-progress-track: #e6e8ea;
    --cw-anim-bg: rgba(213, 227, 253, 0.3);
  }
  .cw-root[data-dark="true"] {
    --cw-card: #1c1c1f;
    --cw-surface: #27272a;
    --cw-badge: #3f3f46;
    --cw-border-20: rgba(255, 255, 255, 0.06);
    --cw-border-30: rgba(255, 255, 255, 0.1);
    --cw-border-60: rgba(255, 255, 255, 0.22);
    --cw-text-primary: #fafafa;
    --cw-text-secondary: #a1a1aa;
    --cw-text-muted: #71717a;
    --cw-fg: #ffffff;
    --cw-fg-inv: #18181b;
    --cw-blue-tint-30: rgba(63, 63, 70, 0.5);
    --cw-blue-tint-40: rgba(63, 63, 70, 0.6);
    --cw-blue-tint-border: rgba(255, 255, 255, 0.1);
    --cw-star-empty: #3f3f46;
    --cw-green: #34d399;
    --cw-progress-track: #3f3f46;
    --cw-anim-bg: rgba(63, 63, 70, 0.3);
  }
  /* Interactive field styles using CSS vars for hover/focus states */
  .cw-root .cw-field {
    background-color: var(--cw-surface);
    color: var(--cw-text-primary);
    border: 1px solid var(--cw-border-30);
    transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.15s ease;
  }
  .cw-root .cw-field::placeholder {
    color: var(--cw-text-muted);
    opacity: 1;
  }
  .cw-root .cw-field:hover {
    border-color: var(--cw-border-60);
  }
  .cw-root .cw-field:focus {
    outline: none;
    background-color: var(--cw-card);
    box-shadow: 0 0 0 2px var(--cw-fg);
    border-color: transparent;
  }
  /* Choice card button hover */
  .cw-root .cw-choice-btn {
    background-color: var(--cw-card);
    border: 1px solid var(--cw-border-30);
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease;
  }
  .cw-root .cw-choice-btn:hover {
    border-color: var(--cw-border-60);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
  .cw-root .cw-choice-btn:active {
    transform: scale(0.98);
  }
`;

export default function CollectionWizard({
  project,
  initialType,
}: CollectionWizardProps & { initialType?: "text" | "video" | null }) {
  const settings = useMemo<CollectionSettings | null>(() => {
    try {
      return project.collectionSettingsJson ? JSON.parse(project.collectionSettingsJson) : null;
    } catch {
      return null;
    }
  }, [project.collectionSettingsJson]);

  // Force light mode for now as per user request (will avoid following system theme)
  const isDark = false;

  // i18n — auto-detected from navigator.language
  const { t, dir } = useLocale();

  // Slide direction: 1 = forward (enter from right), -1 = backward (enter from left)
  const [direction, setDirection] = useState(1);

  const [mode, setMode] = useState<"text" | "video" | null>(() => {
    if (initialType === "video" && project.workspace.isPro) return "video";
    return initialType ?? null;
  });
  const [step, setStep] = useState<Step>(() => {
    if (settings?.form?.starRating?.enabled === false) {
      // Force text even if initialType was video
      return "text";
    }
    return "rating";
  });
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [tagline, setTagline] = useState("");
  const [loading, setLoading] = useState(false);
  // Consent state — gating the Submit button on the review step
  const [hasConsented, setHasConsented] = useState(false);
  const trackEvent = useMutation(trpc.analytics.trackEvent.mutationOptions());

  const DRAFT_KEY = `t-wall-draft-${project.id}`;

  // Restore draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft) as Partial<{
          rating: number;
          content: string;
          photo: string;
          name: string;
          email: string;
          company: string;
          linkedin: string;
          tagline: string;
          mode: "text" | "video";
          step: Step;
          hasConsented: boolean;
        }>;
        if (draft.rating) setRating(draft.rating);
        if (draft.content) setContent(draft.content);
        if (draft.photo) setPhoto(draft.photo);
        if (draft.name) setName(draft.name);
        if (draft.email) setEmail(draft.email);
        if (draft.company) setCompany(draft.company);
        if (draft.linkedin) setLinkedin(draft.linkedin);
        if (draft.tagline) setTagline(draft.tagline);
        if (draft.mode) setMode(draft.mode);
        if (draft.step && draft.step !== "success") setStep(draft.step);
        if (draft.hasConsented) setHasConsented(draft.hasConsented);
      } catch {
        // Ignore malformed draft
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist draft to localStorage on change
  useEffect(() => {
    if (step === "success") return;
    const draft = {
      rating,
      content,
      photo,
      name,
      email,
      company,
      linkedin,
      tagline,
      mode,
      step,
      hasConsented,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [
    DRAFT_KEY,
    rating,
    content,
    photo,
    name,
    email,
    company,
    linkedin,
    tagline,
    mode,
    step,
    hasConsented,
  ]);

  // Track page view
  useEffect(() => {
    trackEvent.mutate(
      { workspaceId: project.workspaceId, projectId: project.id, eventType: "view" },
      { onError: (err) => console.error("[KudosWall Analytics] trackEvent failed:", err.message) },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stepsData = useMemo(() => {
    const mapping: Record<Step, { percent: number; text: string; title: string }> = {
      rating: { percent: 25, text: t.step1of4, title: t.titleRating },
      choice: { percent: 50, text: t.step2of4, title: t.titleChoice },
      text: { percent: 50, text: t.step2of4, title: t.titleText },
      video: { percent: 50, text: t.step2of4, title: t.titleVideo },
      details: { percent: 75, text: t.step3of4, title: t.titleDetails },
      review: { percent: 100, text: t.step4of4, title: t.titleReview },
      success: { percent: 100, text: t.complete, title: t.titleSuccess },
    };
    return mapping[step];
  }, [step, t]);

  const nextStep = () => {
    setDirection(1);
    const nextStepName = (() => {
      if (step === "rating") {
        if (project.workspace.isPro) {
          return "choice";
        }
        setMode("text");
        return "text";
      }
      if (step === "text") return "details";
      if (step === "details") return "review";
      if (step === "review") return "success";
      return null;
    })();

    if (nextStepName) {
      trackEvent.mutate({
        workspaceId: project.workspaceId,
        projectId: project.id,
        eventType: "click",
        metadataJson: JSON.stringify({ action: "next_step", from: step, to: nextStepName }),
      });
      setStep(nextStepName as Step);
    }
  };

  const prevStep = () => {
    setDirection(-1);
    if (step === "choice") return setStep("rating");
    if (step === "text") {
      return setStep("rating");
    }
    if (step === "details") {
      return setStep("text");
    }
    if (step === "review") return setStep("details");
  };

  const fireConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#000000", "#ffffff"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#000000", "#ffffff"],
      });
    }, 250);

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#000000", "#ffffff"],
      gravity: 1.2,
      scalar: 1.2,
      zIndex: 100,
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const minCount = settings?.form?.minCharCount ?? 50;
    const isNameRequired = settings?.form?.fields?.fullName?.required !== false;

    if (mode === "text" && ((isNameRequired && !name) || content.length < minCount)) {
      toast.error(
        `Please ensure your name is filled and testimonial is at least ${minCount} characters.`,
      );
      return;
    }
    if (mode === "video" && isNameRequired && !name) {
      toast.error("Please ensure your name is filled.");
      return;
    }

    setLoading(true);
    try {
      let videoUrl: string | undefined;
      if (videoBlob) {
        // Upload via UploadThing
        const extension = videoBlob.type.includes("mp4") ? "mp4" : "webm";
        const file = new File([videoBlob], `video.${extension}`, {
          type: videoBlob.type,
        });

        const uploadRes = await uploadFiles("videoUploader", {
          files: [file],
        });

        if (!uploadRes?.[0]?.url) {
          throw new Error("Failed to upload video to storage");
        }

        videoUrl = uploadRes[0].url;
      }

      await submitTestimonial(project.id, {
        rating,
        content: mode === "video" && !content ? "Video Testimonial" : content,
        authorName: name,
        authorEmail: email,
        authorImage: photo ?? undefined,
        authorCompany: company || undefined,
        authorLinkedin: linkedin || undefined,
        authorTagline: tagline || undefined,
        videoUrl,
      });

      localStorage.removeItem(DRAFT_KEY);
      fireConfetti();
      setStep("success");

      // Handle custom redirect if configured
      const redirectUrl = settings?.redirectUrl;
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 2000);
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const charCount = content.length;
  const minCount = settings?.form?.minCharCount ?? 50;
  const isContentValid = charCount >= minCount;

  if (isCropping && photo) {
    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
        <ImageCropper
          image={photo}
          onCancel={() => setIsCropping(false)}
          onCropComplete={(croppedImage) => {
            setPhoto(croppedImage);
            setIsCropping(false);
          }}
        />
      </div>
    );
  }

  const fontFamily =
    settings?.fontFamily && !["sans", "serif", "mono"].includes(settings.fontFamily)
      ? `"${settings.fontFamily}", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`
      : settings?.fontFamily === "mono"
        ? "monospace"
        : settings?.fontFamily === "serif"
          ? "serif"
          : "var(--font-sans), sans-serif";

  return (
    <div
      className="cw-root mx-auto w-full max-w-lg"
      data-dark={isDark ? "true" : "false"}
      dir={dir}
      style={{ fontFamily }}
    >
      {/* Scoped CSS custom properties for adaptive color theming */}
      <style>{THEME_CSS}</style>

      {/* Google Font import (only for non-system fonts) */}
      {settings?.fontFamily && !["sans", "serif", "mono"].includes(settings.fontFamily) && (
        <style
          dangerouslySetInnerHTML={{
            __html: `@import url('https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(/\s+/g, "+")}:wght@300;400;500;600;700;800;900&display=swap');`,
          }}
        />
      )}

      {/* Step Indicator */}
      {step !== "success" && (
        <div className="mb-8">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <span
                className="text-[11px] tracking-widest uppercase"
                style={{ color: "var(--cw-text-secondary)" }}
              >
                {stepsData.text}
              </span>
              <h2 className="mt-1 text-lg font-bold" style={{ color: "var(--cw-text-primary)" }}>
                {stepsData.title}
              </h2>
            </div>
            <span className="text-xs font-medium" style={{ color: "var(--cw-text-secondary)" }}>
              {stepsData.percent}% Complete
            </span>
          </div>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--cw-progress-track)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${stepsData.percent}%`, backgroundColor: "var(--cw-fg)" }}
            />
          </div>
        </div>
      )}

      {/* Central Editorial Card */}
      <div
        className="group relative overflow-hidden rounded-xl p-5 shadow-sm md:p-8"
        style={{
          backgroundColor: "var(--cw-card)",
          border: "1px solid var(--cw-border-20)",
        }}
      >
        {/* Abstract background accent */}
        <div
          className="absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl transition-colors duration-700"
          style={{ backgroundColor: "var(--cw-anim-bg)" }}
        />

        <div className="relative z-10 text-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={SLIDE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              transition={SLIDE_TRANSITION}
            >
              {/* ─── RATING STEP ─── */}
              {step === "rating" && (
                <>
                  <h1
                    className="mb-3 text-2xl font-extrabold tracking-tight md:text-3xl"
                    style={{ color: "var(--cw-text-primary)" }}
                  >
                    {t.ratingHeadline}
                  </h1>
                  <p
                    className="mx-auto mb-8 max-w-sm text-base"
                    style={{ color: "var(--cw-text-secondary)" }}
                  >
                    {t.ratingSubtext}
                  </p>

                  {/* Star Rating */}
                  <div className="mb-10 flex justify-center gap-2 md:gap-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onMouseEnter={() => setHoveredRating(s)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(s)}
                        className="group/star outline-none"
                      >
                        <Star
                          className="size-10 transition-all duration-200 group-hover/star:scale-110"
                          style={{
                            color:
                              (hoveredRating || rating) >= s
                                ? "var(--cw-fg)"
                                : "var(--cw-star-empty)",
                            fill: (hoveredRating || rating) >= s ? "var(--cw-fg)" : "transparent",
                          }}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Trust Signals */}
                  <div className="mb-8 flex flex-wrap justify-center gap-3">
                    <div
                      className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                      style={{ backgroundColor: "var(--cw-badge)" }}
                    >
                      <BadgeCheck
                        className="size-[16px]"
                        strokeWidth={2.5}
                        style={{ color: "var(--cw-green)" }}
                      />
                      <span
                        className="text-[11px] font-semibold tracking-wider uppercase"
                        style={{ color: "var(--cw-text-secondary)" }}
                      >
                        {t.verifiedUser}
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                      style={{ backgroundColor: "var(--cw-badge)" }}
                    >
                      <ShieldCheck className="size-[16px] text-[#7c839b]" strokeWidth={2.5} />
                      <span
                        className="text-[11px] font-semibold tracking-wider uppercase"
                        style={{ color: "var(--cw-text-secondary)" }}
                      >
                        {t.privacyGuaranteed}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={nextStep}
                    className="mx-auto flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-bold transition-all hover:opacity-90 md:w-auto md:min-w-[180px]"
                    style={{
                      backgroundColor: "var(--cw-fg)",
                      color: "var(--cw-fg-inv)",
                    }}
                  >
                    {t.nextStep}
                    <ArrowRight className="size-4" />
                  </button>
                </>
              )}

              {/* ─── CHOICE STEP ─── */}
              {step === "choice" && (
                <>
                  <h1
                    className="mb-3 text-2xl font-extrabold tracking-tight md:text-3xl"
                    style={{ color: "var(--cw-text-primary)" }}
                  >
                    {t.choiceHeadline}
                  </h1>
                  <p
                    className="mx-auto mb-8 max-w-sm text-base"
                    style={{ color: "var(--cw-text-secondary)" }}
                  >
                    {t.choiceSubtext}
                  </p>
                  <div className="mb-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                    <button
                      onClick={() => {
                        setDirection(1);
                        setMode("video");
                        trackEvent.mutate({
                          workspaceId: project.workspaceId,
                          projectId: project.id,
                          eventType: "click",
                          metadataJson: JSON.stringify({ action: "choose_mode", mode: "video" }),
                        });
                        setStep("video");
                      }}
                      className="cw-choice-btn group relative flex flex-col items-center gap-3 rounded-xl p-6"
                    >
                      <div
                        className="flex size-12 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: "var(--cw-surface)" }}
                      >
                        <VideoIcon className="size-6" style={{ color: "var(--cw-fg)" }} />
                      </div>
                      <div>
                        <h3
                          className="text-base font-bold"
                          style={{ color: "var(--cw-text-primary)" }}
                        >
                          {t.choiceVideo}
                        </h3>
                        <p
                          className="text-[11px] font-medium"
                          style={{ color: "var(--cw-text-muted)" }}
                        >
                          {t.choiceVideoSub}
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setDirection(1);
                        setMode("text");
                        trackEvent.mutate({
                          workspaceId: project.workspaceId,
                          projectId: project.id,
                          eventType: "click",
                          metadataJson: JSON.stringify({ action: "choose_mode", mode: "text" }),
                        });
                        setStep("text");
                      }}
                      className="cw-choice-btn group relative flex flex-col items-center gap-3 rounded-xl p-6"
                    >
                      <div
                        className="flex size-12 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: "var(--cw-fg)" }}
                      >
                        <Quote className="size-6" style={{ color: "var(--cw-fg-inv)" }} />
                      </div>
                      <div>
                        <h3
                          className="text-base font-bold"
                          style={{ color: "var(--cw-text-primary)" }}
                        >
                          {t.choiceText}
                        </h3>
                        <p
                          className="text-[11px] font-medium"
                          style={{ color: "var(--cw-text-muted)" }}
                        >
                          {t.choiceTextSub}
                        </p>
                      </div>
                    </button>
                  </div>
                </>
              )}

              {/* ─── TEXT STEP ─── */}
              {step === "text" && (
                <div className="text-left">
                  <label
                    htmlFor="feedback"
                    className="mb-2 block text-lg leading-tight font-bold"
                    style={{ color: "var(--cw-text-primary)" }}
                  >
                    {settings?.form?.fields?.content?.label ??
                      "Tell us more about your experience."}
                  </label>
                  <p
                    className="mb-4 max-w-lg text-sm leading-relaxed"
                    style={{ color: "var(--cw-text-secondary)" }}
                  >
                    {settings?.pageContent?.subheading ||
                      settings?.video?.prompt ||
                      "What stood out the most? Sharing specific details helps others understand the true value of our service."}
                  </p>

                  <div className="group relative">
                    <textarea
                      id="feedback"
                      name="feedback"
                      autoFocus
                      className="cw-field w-full resize-none rounded-xl p-4 text-sm leading-relaxed"
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={
                        settings?.form?.fields?.content?.placeholder ?? t.textPlaceholder
                      }
                      value={content}
                      rows={5}
                    />
                    <div className="absolute right-4 bottom-4 flex items-center gap-2">
                      <span
                        className="text-xs"
                        style={{
                          color: isContentValid ? "var(--cw-green)" : "var(--cw-text-muted)",
                        }}
                      >
                        {charCount} / {minCount}
                      </span>
                    </div>
                  </div>

                  <div
                    className="mt-6 flex items-center justify-between border-t pt-4"
                    style={{ borderColor: "var(--cw-border-20)" }}
                  >
                    <button
                      onClick={prevStep}
                      className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
                      style={{ color: "var(--cw-text-secondary)" }}
                    >
                      <ArrowLeft className="size-4" />
                      {t.back}
                    </button>
                    <button
                      className="flex items-center gap-3 rounded-md px-10 py-4 text-xs font-bold tracking-widest uppercase transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
                      disabled={!isContentValid}
                      onClick={nextStep}
                      style={{
                        backgroundColor: "var(--cw-fg)",
                        color: "var(--cw-fg-inv)",
                      }}
                    >
                      {t.nextStep}
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Video Step disabled for now */}
              {/*
              {step === "video" && (
                <div className="w-full text-left">
                  <h1
                    className="mb-3 text-center text-2xl font-extrabold tracking-tight md:text-3xl"
                    style={{ color: "var(--cw-text-primary)" }}
                  >
                    {t.videoHeadline}
                  </h1>
                  <p
                    className="mx-auto mb-6 max-w-sm text-center text-base"
                    style={{ color: "var(--cw-text-secondary)" }}
                  >
                    {settings?.video?.prompt ?? t.videoSubtext}
                  </p>

                  <VideoRecorder
                    isPro={project.permissions?.video}
                    onConfirm={(blob: Blob) => {
                      setVideoBlob(blob);
                      const url = URL.createObjectURL(blob);
                      setVideoPreviewUrl(url);
                      nextStep();
                    }}
                    initialBlob={videoBlob}
                    initialPreviewUrl={videoPreviewUrl}
                    maxLength={settings?.video?.maxLength ?? 120}
                    prompt={settings?.video?.prompt}
                    accentColor={project.workspace.branding.accentColor}
                  />

                  <button
                    onClick={() => {
                      setVideoBlob(null);
                      setVideoPreviewUrl(null);
                      setMode("text");
                      setDirection(1);
                      setStep("text");
                    }}
                    className="mx-auto mt-5 flex items-center justify-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                    style={{ color: "var(--cw-text-muted)" }}
                    type="button"
                  >
                    <SkipForward className="size-3.5" />
                    {t.videoSkip}
                  </button>
                </div>
              )}
              */}

              {/* ─── DETAILS STEP ─── */}
              {step === "details" && (
                <div className="mx-auto w-full text-left">
                  <form
                    className="space-y-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      nextStep();
                    }}
                  >
                    {/* Profile Photo Upload */}
                    <div className="mb-1 flex items-center justify-start gap-4">
                      <div className="group relative shrink-0 overflow-visible">
                        <div
                          className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-colors"
                          style={{
                            borderColor: "var(--cw-border-30)",
                            backgroundColor: "var(--cw-surface)",
                          }}
                        >
                          {!photo ? (
                            <User
                              className="size-6 opacity-40"
                              style={{ color: "var(--cw-text-secondary)" }}
                              strokeWidth={1.5}
                            />
                          ) : (
                            <Image
                              alt="Preview"
                              className="h-full w-full object-cover transition-opacity"
                              src={photo}
                              width={56}
                              height={56}
                            />
                          )}
                          <input
                            accept="image/*"
                            className="absolute inset-0 z-10 cursor-pointer opacity-0"
                            onChange={handlePhotoUpload}
                            type="file"
                          />
                        </div>
                        <div
                          className="pointer-events-none absolute -right-1 -bottom-1 rounded-full p-1.5 shadow-lg transition-transform group-hover:scale-105"
                          style={{
                            backgroundColor: "var(--cw-fg)",
                            color: "var(--cw-fg-inv)",
                          }}
                        >
                          <Camera className="size-3" />
                        </div>
                      </div>
                      <div className="text-left">
                        <label
                          className="mb-0.5 flex items-center gap-1 text-xs font-semibold"
                          style={{ color: "var(--cw-fg)" }}
                        >
                          {t.detailsPhoto}
                          <span className="font-normal" style={{ color: "var(--cw-text-muted)" }}>
                            {t.detailsPhotoOptional}
                          </span>
                        </label>
                        <p className="text-[10px]" style={{ color: "var(--cw-text-secondary)" }}>
                          {t.detailsPhotoHint}
                        </p>
                      </div>
                    </div>

                    {/* Input Fields */}
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-1">
                        <label
                          className="block text-[11px] font-bold tracking-widest uppercase"
                          htmlFor="full_name"
                          style={{ color: "var(--cw-text-secondary)" }}
                        >
                          {settings?.form?.fields?.fullName?.label ?? t.detailsFullName}{" "}
                          {settings?.form?.fields?.fullName?.required !== false && "*"}
                        </label>
                        <input
                          id="full_name"
                          className="cw-field h-9 w-full rounded-lg px-3 text-[13px]"
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alex Rivera"
                          value={name}
                        />
                      </div>

                      {settings?.form?.fields?.email?.enabled !== false && (
                        <div className="space-y-1">
                          <label
                            className="block text-[11px] font-bold tracking-widest uppercase"
                            htmlFor="email"
                            style={{ color: "var(--cw-text-secondary)" }}
                          >
                            {settings?.form?.fields?.email?.label ?? t.detailsEmail}{" "}
                            {settings?.form?.fields?.email?.required && "*"}
                          </label>
                          <input
                            id="email"
                            className="cw-field h-9 w-full rounded-lg px-3 text-[13px]"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="alex@company.com"
                            type="email"
                            value={email}
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {settings?.form?.fields?.jobTitle?.enabled !== false && (
                          <div className="space-y-1">
                            <label
                              className="block text-[11px] font-bold tracking-widest uppercase"
                              htmlFor="job_title"
                              style={{ color: "var(--cw-text-secondary)" }}
                            >
                              {settings?.form?.fields?.jobTitle?.label ?? t.detailsJobTitle}
                            </label>
                            <input
                              id="job_title"
                              className="cw-field h-9 w-full rounded-lg px-3 text-[13px]"
                              onChange={(e) => setTagline(e.target.value)}
                              placeholder="Head of Growth"
                              value={tagline}
                            />
                          </div>
                        )}
                        {settings?.form?.fields?.company?.enabled !== false && (
                          <div className="space-y-1">
                            <label
                              className="block text-[11px] font-bold tracking-widest uppercase"
                              htmlFor="company"
                              style={{ color: "var(--cw-text-secondary)" }}
                            >
                              {settings?.form?.fields?.company?.label ?? t.detailsCompany}
                            </label>
                            <input
                              id="company"
                              className="cw-field h-9 w-full rounded-lg px-3 text-[13px]"
                              onChange={(e) => setCompany(e.target.value)}
                              placeholder="TechFlow"
                              value={company}
                            />
                          </div>
                        )}
                      </div>

                      {settings?.form?.fields?.linkedin?.enabled && (
                        <div className="space-y-1">
                          <label
                            className="block text-[11px] font-bold tracking-widest uppercase"
                            htmlFor="linkedin"
                            style={{ color: "var(--cw-text-secondary)" }}
                          >
                            {settings?.form?.fields?.linkedin?.label ?? t.detailsLinkedIn}{" "}
                            {settings?.form?.fields?.linkedin?.required && "*"}
                          </label>
                          <input
                            id="linkedin"
                            className="cw-field h-10 w-full rounded-lg px-4 text-[15px]"
                            onChange={(e) => setLinkedin(e.target.value)}
                            placeholder="https://linkedin.com/in/alex"
                            value={linkedin}
                          />
                        </div>
                      )}
                    </div>

                    {/* Trust Verification Signal */}
                    <div
                      className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2"
                      style={{ backgroundColor: "var(--cw-surface)" }}
                    >
                      <div
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded"
                        style={{ backgroundColor: "var(--cw-badge)" }}
                      >
                        <ShieldCheck className="size-3.5" style={{ color: "var(--cw-green)" }} />
                      </div>
                      <div>
                        <p
                          className="text-xs leading-none font-semibold"
                          style={{ color: "var(--cw-text-primary)" }}
                        >
                          {t.identityVerification}
                        </p>
                        <p
                          className="mt-1 text-[10px] leading-relaxed"
                          style={{ color: "var(--cw-text-secondary)" }}
                        >
                          {t.identityVerificationSub}
                        </p>
                      </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex flex-col items-center justify-between gap-4 pt-4 md:flex-row">
                      <button
                        onClick={prevStep}
                        className="order-2 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-[11px] font-bold tracking-widest uppercase transition-opacity hover:opacity-80 md:order-1 md:w-auto"
                        style={{
                          backgroundColor: "var(--cw-badge)",
                          color: "var(--cw-text-secondary)",
                        }}
                        type="button"
                      >
                        {t.back}
                      </button>
                      <button
                        className="order-1 flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-[11px] font-bold tracking-widest uppercase transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 md:order-2 md:flex-1"
                        disabled={settings?.form?.fields?.fullName?.required !== false && !name}
                        onClick={(e) => {
                          e.preventDefault();
                          const mc = settings?.form?.minCharCount ?? 50;
                          const isNameReq = settings?.form?.fields?.fullName?.required !== false;
                          if (mode === "text" && ((isNameReq && !name) || content.length < mc)) {
                            toast.error(
                              `Please ensure your name is filled and testimonial is at least ${mc} characters.`,
                            );
                            return;
                          }
                          nextStep();
                        }}
                        style={{
                          backgroundColor: "var(--cw-fg)",
                          color: "var(--cw-fg-inv)",
                        }}
                        type="button"
                      >
                        {t.reviewTestimonial}
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ─── REVIEW STEP ─── */}
              {step === "review" && (
                <div className="mx-auto w-full text-left">
                  <h1
                    className="mb-2 text-2xl font-extrabold tracking-tight md:text-3xl"
                    style={{ color: "var(--cw-text-primary)" }}
                  >
                    {t.reviewHeadline}
                  </h1>
                  <p
                    className="mb-4 max-w-sm text-sm"
                    style={{ color: "var(--cw-text-secondary)" }}
                  >
                    {t.reviewSubtext}
                  </p>

                  <div className="relative mt-2 mb-5">
                    <div
                      className="absolute -top-3 -left-3 z-10 rounded-sm px-3 py-1 text-[10px] font-bold tracking-widest uppercase shadow-sm"
                      style={{
                        backgroundColor: "var(--cw-badge)",
                        color: "var(--cw-text-secondary)",
                      }}
                    >
                      {t.reviewLivePreview}
                    </div>
                    <div
                      className="relative rounded-xl p-5"
                      style={{
                        backgroundColor: "var(--cw-surface)",
                        border: "1px solid var(--cw-border-30)",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 shrink-0 overflow-hidden rounded-full"
                            style={{ backgroundColor: "var(--cw-badge)" }}
                          >
                            {photo ? (
                              <Image
                                src={photo}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                                alt="Profile"
                              />
                            ) : (
                              <User
                                className="m-2.5 size-5"
                                style={{ color: "var(--cw-text-secondary)" }}
                              />
                            )}
                          </div>
                          <div className="text-left">
                            <h3
                              className="text-lg leading-tight font-bold"
                              style={{ color: "var(--cw-text-primary)" }}
                            >
                              {name}
                            </h3>
                            <p className="text-xs" style={{ color: "var(--cw-text-secondary)" }}>
                              {tagline} {tagline && company && "at "} {company}
                            </p>
                          </div>
                        </div>
                        <div
                          className="flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1"
                          style={{
                            backgroundColor: "var(--cw-blue-tint-40)",
                            border: "1px solid var(--cw-blue-tint-border)",
                          }}
                        >
                          <BadgeCheck className="size-3.5" style={{ color: "var(--cw-fg)" }} />
                          <span
                            className="text-[10px] font-bold tracking-tighter uppercase"
                            style={{ color: "var(--cw-fg)" }}
                          >
                            {t.reviewVerified}
                          </span>
                        </div>
                      </div>
                      <div className="relative mt-2 text-left">
                        <Quote
                          className="absolute -top-2 -left-3 z-0 size-10 rotate-180 opacity-25"
                          style={{ color: "var(--cw-text-muted)" }}
                        />
                        {videoPreviewUrl ? (
                          <div className="relative z-10 my-4 overflow-hidden rounded-xl bg-black shadow-lg">
                            <video
                              key={videoPreviewUrl}
                              src={videoPreviewUrl}
                              controls
                              className="aspect-video w-full object-cover"
                              playsInline
                            />
                          </div>
                        ) : (
                          <p
                            className="relative z-10 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap italic"
                            style={{ color: "var(--cw-text-primary)" }}
                          >
                            &quot;{content}&quot;
                          </p>
                        )}
                      </div>
                      <div
                        className="mt-4 flex items-center justify-between border-t pt-4"
                        style={{ borderColor: "var(--cw-border-20)" }}
                      >
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="size-3"
                              style={{
                                color: "var(--cw-fg)",
                                fill: i < rating ? "var(--cw-fg)" : "none",
                              }}
                            />
                          ))}
                        </div>
                        <span
                          className="text-[10px] tracking-widest uppercase"
                          style={{ color: "var(--cw-text-secondary)" }}
                        >
                          {new Date().toLocaleDateString(undefined, {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ── Consent Checkbox ── */}
                  <label
                    htmlFor="cw-consent"
                    className="mb-4 flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors"
                    style={{
                      backgroundColor: hasConsented
                        ? "var(--cw-blue-tint-30)"
                        : "var(--cw-surface)",
                      border: `1px solid ${
                        hasConsented ? "var(--cw-blue-tint-border)" : "var(--cw-border-30)"
                      }`,
                    }}
                  >
                    <input
                      id="cw-consent"
                      type="checkbox"
                      checked={hasConsented}
                      onChange={(e) => setHasConsented(e.target.checked)}
                      className="mt-0.5 size-4 shrink-0 cursor-pointer accent-current"
                      style={{ accentColor: "var(--cw-fg)" }}
                    />
                    <span
                      className="text-[11px] leading-relaxed"
                      style={{ color: "var(--cw-text-secondary)" }}
                    >
                      {t.consentLabel.replace("{projectName}", project.name)}{" "}
                      {settings?.privacyPolicyUrl ? (
                        <a
                          href={settings.privacyPolicyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 hover:opacity-80"
                          style={{ color: "var(--cw-text-primary)" }}
                        >
                          {t.consentPrivacyLink}
                        </a>
                      ) : null}
                    </span>
                  </label>

                  <div className="flex w-full flex-col items-center gap-3 sm:flex-row">
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !hasConsented}
                      className="w-full rounded-lg py-3.5 text-[13px] font-bold shadow-xl shadow-black/10 transition-all duration-200 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 sm:flex-1"
                      style={{
                        backgroundColor: "var(--cw-fg)",
                        color: "var(--cw-fg-inv)",
                      }}
                    >
                      {loading ? t.submittingButton : t.submitButton}
                    </button>
                    <button
                      onClick={prevStep}
                      className="flex w-full items-center justify-center gap-2 px-6 py-3.5 text-[11px] font-semibold tracking-widest uppercase transition-opacity hover:opacity-70 sm:w-auto"
                      style={{ color: "var(--cw-text-secondary)" }}
                    >
                      {t.editDetails}
                    </button>
                  </div>
                </div>
              )}

              {/* ─── SUCCESS STEP ─── */}
              {step === "success" && (
                <>
                  <div
                    className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: "var(--cw-blue-tint-40)" }}
                  >
                    <CheckCircle2 className="size-8" style={{ color: "var(--cw-green)" }} />
                  </div>
                  <h1
                    className="mb-3 text-2xl font-extrabold tracking-tight md:text-3xl"
                    style={{ color: "var(--cw-text-primary)" }}
                  >
                    {settings?.pageContent?.thankYou?.headline ?? t.defaultThankYouHeadline}
                  </h1>
                  <p
                    className="mx-auto mb-8 max-w-sm text-base"
                    style={{ color: "var(--cw-text-secondary)" }}
                  >
                    {settings?.pageContent?.thankYou?.body ??
                      project.thankYouMessage ??
                      t.defaultThankYouBody}
                  </p>

                  <div className="flex flex-col items-center gap-3">
                    {settings?.pageContent?.thankYou?.cta?.enabled &&
                      settings?.pageContent?.thankYou?.cta?.text && (
                        <a
                          href={settings?.pageContent?.thankYou?.cta?.url || "#"}
                          className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold transition-all hover:opacity-90"
                          style={{
                            backgroundColor: "var(--cw-fg)",
                            color: "var(--cw-fg-inv)",
                          }}
                        >
                          {settings?.pageContent?.thankYou?.cta?.text}
                          <ArrowRight className="size-4" />
                        </a>
                      )}
                    <button
                      className="text-[13px] font-medium hover:underline"
                      onClick={() => window.location.reload()}
                      style={{ color: "var(--cw-text-secondary)" }}
                    >
                      {t.postAnotherReview}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Contextual Trust Signal (text step only) */}
      <AnimatePresence>
        {step === "text" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-6 flex max-w-sm flex-col items-center text-center"
          >
            <div className="mb-2 flex justify-center">
              <div
                className="relative h-10 w-10 overflow-hidden rounded-full shadow-sm"
                style={{ border: "1px solid var(--cw-border-30)" }}
              >
                <img
                  alt="User Profile"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnwURMqB09STDN41e7qt-xuLxbpmHSCoo5P8sCojYtZ02Z7nvKDQTuikw3hXwP9EZUj779oQH-S3DQz6MVDTqkLGS6WGOJjq8hsGLfkuugpR4_TjVuzf-wId9IxlMYY5a0baUcBCbsjDTrRZFBekzTq6z7NRxEcQVDNH7e-0wYSMthyLCAt12P3HkBz0V4LrAsy4hjawTOCIwtuFc33v8GXEnQIM66FqJ5MGmO5N2R_JgTqOdeEPrdfKl9rWg3Bv7p4T12fj3Z_w4"
                />
              </div>
            </div>
            <p
              className="px-4 text-xs leading-relaxed italic"
              style={{ color: "var(--cw-text-secondary)" }}
            >
              {t.trustQuote}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer disclaimer */}
      <p
        className="mt-4 px-4 text-center text-[10px] leading-relaxed font-medium opacity-60"
        style={{ color: "var(--cw-text-secondary)" }}
      >
        {t.footerDisclaimer}
      </p>
    </div>
  );
}
