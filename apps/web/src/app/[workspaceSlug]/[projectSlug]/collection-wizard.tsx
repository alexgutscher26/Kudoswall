"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  Building2,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Linkedin,
  Quote,
  Sparkles,
  Star,
  Upload,
  Video as VideoIcon,
  MessageCircle,
  Clock,
  Layout,
  Loader2,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
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

type Step = "rating" | "choice" | "text" | "photo" | "video" | "details" | "success";

export default function CollectionWizard({
  project,
  initialType,
}: CollectionWizardProps & { initialType?: "text" | "video" | null }) {
  const settings = useMemo(() => {
    try {
      return project.collectionSettingsJson ? JSON.parse(project.collectionSettingsJson) : null;
    } catch (e) {
      return null;
    }
  }, [project.collectionSettingsJson]);

  const [mode, setMode] = useState<"text" | "video" | null>(initialType || null);
  const [step, setStep] = useState<Step>(() => {
    if (settings?.form?.starRating?.enabled === false) {
      if (initialType) return initialType === "video" ? "video" : "text";
      return "choice";
    }
    return "rating";
  });
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [tagline, setTagline] = useState("");
  const [loading, setLoading] = useState(false);
  const trackEvent = useMutation(trpc.analytics.trackEvent.mutationOptions());

  // Track View
  useEffect(() => {
    trackEvent.mutate({
      workspaceId: project.workspaceId,
      projectId: project.id,
      eventType: "view",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accentColor = settings?.accentColor || project.workspace.branding.accentColor || "#e8527a";
  const isPro = project.workspace.isPro;

  const steps: Record<Step, number> = useMemo(
    () => ({
      rating: 0,
      choice: 0.5,
      text: 1,
      photo: 2,
      video: 3,
      details: 4,
      success: 5,
    }),
    [],
  );

  const nextStep = () => {
    if (step === "rating") {
      if (mode === "video") return setStep("video");
      if (mode === "text") return setStep("text");
      return setStep("choice");
    }

    if (step === "choice") {
      if (mode === "video") return setStep("video");
      return setStep("text");
    }

    if (step === "text") return setStep("photo");
    if (step === "photo") return setStep("details");
    if (step === "video") return setStep("details");
    if (step === "details") return setStep("success");
  };

  const prevStep = () => {
    if (step === "choice") return setStep("rating");
    if (step === "text") {
      if (initialType) return setStep("rating");
      return setStep("choice");
    }
    if (step === "video") {
      if (initialType) return setStep("rating");
      return setStep("choice");
    }
    if (step === "photo") return setStep("text");
    if (step === "details") {
      if (mode === "video") return setStep("video");
      return setStep("photo");
    }
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

    if ((isNameRequired && !name) || content.length < minCount) {
      toast.error(
        `Please ensure your name is filled and testimonial is at least ${minCount} characters.`,
      );
      return;
    }

    setLoading(true);
    try {
      // 1. Simulate Upload for Video
      let videoUrl: string | undefined;
      if (videoBlob) {
        // TODO: In a real app, you'd upload this to R2 / Vercel Blob / S3
        // For development, we'll use a data URL (not recommended for production due to size)
        const reader = new FileReader();
        videoUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(videoBlob);
        });
      }

      await submitTestimonial(project.id, {
        rating,
        content,
        authorName: name,
        authorEmail: email,
        authorImage: photo || undefined,
        authorCompany: company || undefined,
        authorLinkedin: linkedin || undefined,
        authorTagline: tagline || undefined,
        videoUrl: videoUrl,
      });

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: [accentColor, "#171717", "#ffffff"],
      });

      setStep("success");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const charCount = content.length;
  const minCount = settings?.form?.minCharCount ?? 50;
  const isContentValid = charCount >= minCount;

  if (isCropping && photo) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
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

  return (
    <div
      className="mx-auto w-full max-w-xl px-4 lg:px-0"
      style={{
        fontFamily:
          settings?.font === "serif"
            ? "serif"
            : settings?.font === "mono"
              ? "monospace"
              : "inherit",
      }}
    >
      <div className="text-card-foreground relative flex min-h-[500px] flex-col overflow-hidden rounded-[40px] border border-white/50 bg-white/70 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        {/* Progress Bar */}
        <div className="absolute top-0 right-0 left-0 h-1 overflow-hidden bg-neutral-100/30">
          <motion.div
            animate={{
              width: `${(steps[step === "choice" ? "rating" : step] / 5) * 100}%`,
            }}
            className="h-full transition-all duration-500 ease-out"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-8 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-1 flex-col"
              exit={{ opacity: 0, y: -20 }}
              initial={{ opacity: 0, y: 20 }}
              key={step}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {step === "rating" && (
                <div className="flex flex-1 flex-col items-center justify-center space-y-8 py-2 text-center">
                  <div
                    className="animate-in zoom-in flex size-20 items-center justify-center rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] duration-500"
                    style={{ backgroundColor: `${accentColor}15` }}
                  >
                    <Sparkles className="size-10" style={{ color: accentColor }} />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl leading-tight font-black tracking-tighter text-neutral-900">
                      How was your experience?
                    </h2>
                    <p className="mx-auto max-w-xs text-[16px] font-medium text-neutral-500/80">
                      We value your feedback and want to know how we did.
                    </p>
                  </div>
                  <div className="flex w-full flex-col items-center space-y-6">
                    <div className="flex items-center gap-1 sm:gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div className="group relative p-2 transition-all hover:scale-110" key={s}>
                          {/* Invisible half-star triggers */}
                          <div className="absolute inset-0 z-20 flex px-2 py-2">
                            <div
                              className="h-full w-1/2 cursor-pointer"
                              onMouseEnter={() => setHoveredRating(s - 0.5)}
                              onMouseLeave={() => setHoveredRating(0)}
                              onClick={() => {
                                setRating(s - 0.5);
                                setTimeout(nextStep, 300);
                              }}
                            />
                            <div
                              className="h-full w-1/2 cursor-pointer"
                              onMouseEnter={() => setHoveredRating(s)}
                              onMouseLeave={() => setHoveredRating(0)}
                              onClick={() => {
                                setRating(s);
                                setTimeout(nextStep, 300);
                              }}
                            />
                          </div>

                          <div className="relative">
                            <Star
                              className="size-12 fill-none text-neutral-200 transition-all duration-300 sm:size-14"
                              style={{ strokeWidth: 1.5 }}
                            />

                            {/* Half Star Overlay */}
                            {(hoveredRating || rating) >= s - 0.5 &&
                              (hoveredRating || rating) < s && (
                                <div className="pointer-events-none absolute inset-0 z-10 w-1/2 overflow-hidden">
                                  <Star
                                    className="size-12 fill-current sm:size-14"
                                    style={{
                                      color: accentColor,
                                      filter: `drop-shadow(0 0 15px ${accentColor}30)`,
                                    }}
                                  />
                                </div>
                              )}

                            {/* Full Star Overlay */}
                            {(hoveredRating || rating) >= s && (
                              <div className="pointer-events-none absolute inset-0 z-10">
                                <Star
                                  className="size-12 fill-current sm:size-14"
                                  style={{
                                    color: accentColor,
                                    filter: `drop-shadow(0 0 15px ${accentColor}30)`,
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex w-full max-w-[280px] justify-between text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                      <span>Poor</span>
                      <span>Amazing</span>
                    </div>
                  </div>
                </div>
              )}

              {step === "choice" && (
                <div className="flex flex-1 flex-col items-center justify-center space-y-8 py-2 text-center">
                  <div
                    className="flex size-16 items-center justify-center rounded-[22px] shadow-lg shadow-neutral-900/5"
                    style={{ backgroundColor: `${accentColor}10` }}
                  >
                    <Layout className="size-8 text-neutral-900" style={{ color: accentColor }} />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl leading-tight font-black tracking-tighter text-neutral-900">
                      How would you like to share?
                    </h2>
                    <p className="mx-auto max-w-[280px] text-[15px] font-medium text-neutral-500/80">
                      Choose the format that works best for you.
                    </p>
                  </div>

                  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                    <button
                      onClick={() => {
                        setMode("video");
                        nextStep();
                      }}
                      className="group relative flex flex-col items-center gap-4 rounded-[32px] border border-neutral-100 bg-white p-8 transition-all hover:border-neutral-200 hover:shadow-xl active:scale-[0.98]"
                    >
                      <div
                        className="flex size-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${accentColor}10` }}
                      >
                        <VideoIcon className="size-7" style={{ color: accentColor }} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-black tracking-tight text-neutral-900">
                          Video
                        </h3>
                        <p className="text-xs font-bold text-neutral-400">Quick & Personal</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setMode("text");
                        nextStep();
                      }}
                      className="group relative flex flex-col items-center gap-4 rounded-[32px] border border-neutral-100 bg-white p-8 transition-all hover:border-neutral-200 hover:shadow-xl active:scale-[0.98]"
                    >
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-neutral-900 transition-transform group-hover:scale-110">
                        <Quote className="size-7 text-white" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-black tracking-tight text-neutral-900">Text</h3>
                        <p className="text-xs font-bold text-neutral-400">Simple & Classic</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {step === "text" && (
                <div className="flex flex-1 flex-col space-y-6">
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-[18px] bg-neutral-900 shadow-xl shadow-neutral-900/10">
                      <Quote className="size-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-tighter text-neutral-900">
                        {settings?.form?.fields?.content?.label || "Share your story"}
                      </h2>
                      <p className="text-[11px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                        {settings?.video?.prompt || "What results did you achieve?"}
                      </p>
                    </div>
                  </div>

                  <div className="group relative flex flex-1 flex-col">
                    <textarea
                      autoFocus
                      className="w-full flex-1 resize-none rounded-[32px] border border-neutral-100 bg-neutral-50/30 p-8 pt-10 text-[18px] leading-relaxed font-medium text-neutral-900 transition-all outline-none focus:border-neutral-200 focus:bg-white focus:ring-[6px]"
                      style={{ "--tw-ring-color": `${accentColor}08` } as any}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={
                        settings?.form?.fields?.content?.placeholder ||
                        "I chose TestimonialWall because..."
                      }
                      value={content}
                    />

                    {/* Character Count Badge */}
                    <div className="absolute right-8 bottom-6 flex items-center gap-4">
                      <span
                        className={`text-[11px] font-black tracking-widest uppercase transition-colors ${isContentValid ? "text-emerald-500" : "text-neutral-400"}`}
                      >
                        {charCount} / {minCount} MIN
                      </span>
                      <div className="h-4 w-[1px] bg-neutral-200" />
                      <button
                        className="flex items-center gap-2 rounded-2xl px-6 py-3.5 text-[14px] font-bold text-white shadow-xl transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-20"
                        style={{
                          backgroundColor: accentColor,
                          boxShadow: `0 10px 25px -5px ${accentColor}40`,
                        }}
                        disabled={!isContentValid}
                        onClick={nextStep}
                      >
                        Next
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === "photo" && (
                <div className="flex flex-1 flex-col items-center justify-center space-y-8 py-2 text-center">
                  <div className="group relative">
                    <div
                      className="absolute -inset-4 rounded-[48px] opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
                      style={{ backgroundColor: accentColor }}
                    />
                    <div className="relative flex size-32 cursor-pointer items-center justify-center overflow-hidden rounded-[32px] border-2 border-dashed border-neutral-200 bg-white/50 shadow-inner transition-all group-active:scale-95 hover:border-neutral-300 hover:bg-white">
                      {photo ? (
                        <Image
                          alt="Preview"
                          className="size-full object-cover"
                          src={photo}
                          width={128}
                          height={128}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="rounded-xl bg-neutral-50 p-3 transition-colors group-hover:bg-neutral-100">
                            <Camera className="size-6 text-neutral-400 group-hover:text-neutral-600" />
                          </div>
                          <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                            Photo
                          </span>
                        </div>
                      )}
                      <input
                        accept="image/*"
                        className="absolute inset-0 cursor-pointer opacity-0"
                        onChange={handlePhotoUpload}
                        type="file"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-black tracking-tighter text-neutral-900">
                      Add a face
                    </h2>
                    <p className="mx-auto max-w-xs text-[14px] font-medium text-neutral-500/80">
                      Build trust and make your review pop.
                    </p>
                  </div>
                  <div className="flex w-full gap-4 pt-4">
                    <button
                      className="flex-1 rounded-2xl border border-neutral-100 bg-white py-4.5 text-[15px] font-bold text-neutral-400 transition-all hover:bg-neutral-50 hover:text-neutral-600 active:scale-95"
                      onClick={nextStep}
                    >
                      Maybe later
                    </button>
                    <button
                      className="flex-1 items-center justify-center rounded-2xl py-4.5 text-[15px] font-bold text-white shadow-xl transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-20"
                      style={{
                        backgroundColor: photo ? accentColor : "#171717",
                        boxShadow: photo ? `0 10px 25px -5px ${accentColor}40` : undefined,
                      }}
                      onClick={() => nextStep()}
                    >
                      {photo ? "Looking good!" : "Select photo"}
                    </button>
                  </div>
                </div>
              )}

              {step === "video" && (
                <div className="flex flex-1 flex-col space-y-8 py-4">
                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
                      One last thing...
                    </h2>
                    <p className="text-sm font-medium text-neutral-500">
                      Video testimonials convert 4x better. It only takes 30 seconds!
                    </p>
                  </div>

                  <VideoRecorder
                    isPro={isPro}
                    accentColor={accentColor}
                    maxLength={settings?.video?.maxLength || 60}
                    prompt={settings?.video?.prompt}
                    onConfirm={(blob) => {
                      setVideoBlob(blob);
                      nextStep();
                    }}
                  />

                  {!videoBlob && (
                    <button
                      onClick={nextStep}
                      className="text-center text-[12px] font-bold text-neutral-400 underline underline-offset-4 transition-colors hover:text-neutral-600"
                    >
                      Skip video recording
                    </button>
                  )}
                </div>
              )}

              {step === "details" && (
                <div className="flex flex-1 flex-col space-y-6">
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-[18px] bg-neutral-900 shadow-xl shadow-neutral-900/10">
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
                          {settings?.form?.fields?.fullName?.label || "Full Name"}{" "}
                          {settings?.form?.fields?.fullName?.required !== false ? "*" : ""}
                        </label>
                        <input
                          className="w-full rounded-xl border border-neutral-100 bg-neutral-50/30 px-5 py-3.5 transition-all outline-none focus:border-neutral-200 focus:bg-white focus:ring-[4px]"
                          style={{ "--tw-ring-color": `${accentColor}08` } as any}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={settings?.form?.fields?.fullName?.placeholder || "Jane Doe"}
                          required={settings?.form?.fields?.fullName?.required !== false}
                          value={name}
                        />
                      </div>
                      {settings?.form?.fields?.email?.enabled !== false && (
                        <div className="space-y-1.5">
                          <label className="pl-1 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                            {settings?.form?.fields?.email?.label || "Email"}{" "}
                            {settings?.form?.fields?.email?.required ? "*" : ""}
                          </label>
                          <input
                            className="w-full rounded-xl border border-neutral-100 bg-neutral-50/30 px-5 py-3.5 transition-all outline-none focus:border-neutral-200 focus:bg-white focus:ring-[4px]"
                            style={{ "--tw-ring-color": `${accentColor}08` } as any}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={
                              settings?.form?.fields?.email?.placeholder || "jane@example.com"
                            }
                            type="email"
                            required={settings?.form?.fields?.email?.required}
                            value={email}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 border-t border-neutral-100/50 pt-5">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {settings?.form?.fields?.company?.enabled !== false && (
                          <div className="space-y-1.5">
                            <label className="flex items-center gap-2 pl-1 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                              <Building2 className="size-3" />{" "}
                              {settings?.form?.fields?.company?.label || "Company"}{" "}
                              {settings?.form?.fields?.company?.required ? "*" : ""}
                            </label>
                            <input
                              className="w-full rounded-xl border border-neutral-100 bg-neutral-50/30 px-5 py-3.5 transition-all outline-none focus:border-neutral-200 focus:bg-white focus:ring-[4px]"
                              style={{ "--tw-ring-color": `${accentColor}08` } as any}
                              onChange={(e) => setCompany(e.target.value)}
                              placeholder={
                                settings?.form?.fields?.company?.placeholder || "Acme Inc."
                              }
                              required={settings?.form?.fields?.company?.required}
                              value={company}
                            />
                          </div>
                        )}
                        {settings?.form?.fields?.jobTitle?.enabled !== false && (
                          <div className="space-y-1.5">
                            <label className="pl-1 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                              {settings?.form?.fields?.jobTitle?.label || "Job Title"}{" "}
                              {settings?.form?.fields?.jobTitle?.required ? "*" : ""}
                            </label>
                            <input
                              className="w-full rounded-xl border border-neutral-100 bg-neutral-50/30 px-5 py-3.5 transition-all outline-none focus:border-neutral-200 focus:bg-white focus:ring-[4px]"
                              style={{ "--tw-ring-color": `${accentColor}08` } as any}
                              onChange={(e) => setTagline(e.target.value)}
                              placeholder={settings?.form?.fields?.jobTitle?.placeholder || "CEO"}
                              required={settings?.form?.fields?.jobTitle?.required}
                              value={tagline}
                            />
                          </div>
                        )}
                      </div>
                      {settings?.form?.fields?.linkedin?.enabled && (
                        <div className="space-y-1.5">
                          <label className="flex items-center gap-2 pl-1 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                            <Linkedin className="size-3" />{" "}
                            {settings?.form?.fields?.linkedin?.label || "LinkedIn Profile"}{" "}
                            {settings?.form?.fields?.linkedin?.required ? "*" : ""}
                          </label>
                          <input
                            className="w-full rounded-xl border border-neutral-100 bg-neutral-50/30 px-5 py-3.5 transition-all outline-none focus:border-neutral-200 focus:bg-white focus:ring-[4px]"
                            style={{ "--tw-ring-color": `${accentColor}08` } as any}
                            onChange={(e) => setLinkedin(e.target.value)}
                            placeholder={
                              settings?.form?.fields?.linkedin?.placeholder ||
                              "https://linkedin.com/in/jane"
                            }
                            required={settings?.form?.fields?.linkedin?.required}
                            value={linkedin}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    className="mt-4 flex w-full items-center justify-center gap-3 rounded-[20px] py-4.5 text-[16px] font-black tracking-tight text-white shadow-2xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-30"
                    style={{
                      backgroundColor: name ? accentColor : "#171717",
                      boxShadow: name ? `0 15px 30px -10px ${accentColor}50` : undefined,
                    }}
                    disabled={
                      loading || (settings?.form?.fields?.fullName?.required !== false && !name)
                    }
                    onClick={handleSubmit}
                  >
                    {loading ? (
                      <Loader2 className="size-6 animate-spin" />
                    ) : (
                      <>
                        Submit review
                        <Sparkles className="size-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {step === "success" && (
                <div className="flex flex-1 flex-col items-center justify-center space-y-8 px-4 py-4 text-center">
                  <div className="relative">
                    <div
                      className="absolute -inset-6 rounded-full opacity-20 blur-2xl"
                      style={{ backgroundColor: "#10b981" }}
                    />
                    <div className="relative flex size-20 items-center justify-center rounded-[32px] bg-emerald-500 shadow-xl shadow-emerald-500/20">
                      <CheckCircle2 className="size-10 text-white" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl leading-tight font-black tracking-tighter text-neutral-900">
                      {settings?.pageContent?.thankYou?.headline || "You're awesome!"}
                    </h2>
                    <p className="text-md mx-auto max-w-sm leading-relaxed font-medium text-neutral-500/80">
                      {settings?.pageContent?.thankYou?.body ||
                        project.thankYouMessage ||
                        `Your feedback has been sent to ${project.name}. It helps us more than you know.`}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {settings?.pageContent?.thankYou?.cta?.enabled &&
                      settings?.pageContent?.thankYou?.cta?.text && (
                        <a
                          href={settings.pageContent.thankYou.cta.url}
                          className="rounded-full px-8 py-3.5 text-[15px] font-black text-white shadow-xl transition-all hover:opacity-90 active:scale-95"
                          style={{
                            backgroundColor: accentColor,
                            boxShadow: `0 10px 25px -5px ${accentColor}40`,
                          }}
                        >
                          {settings.pageContent.thankYou.cta.text}
                          <ChevronRight className="ml-2 inline size-4" />
                        </a>
                      )}
                    <button
                      className="rounded-[18px] border border-neutral-100 bg-white px-8 py-3.5 text-[14px] font-bold text-neutral-600 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:bg-neutral-50 hover:text-neutral-900 active:scale-95"
                      onClick={() => window.location.reload()}
                    >
                      Post another one
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Back Button */}
        {step !== "rating" && step !== "success" && (
          <button
            className="absolute top-8 left-8 z-20 p-2 text-neutral-300 transition-colors hover:text-neutral-900"
            onClick={prevStep}
          >
            <ChevronLeft className="size-8" />
          </button>
        )}
      </div>

      {/* Footer Branding */}
      {!project.workspace.isPro && (
        <div className="mt-8 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 opacity-30 transition-opacity hover:opacity-80">
            <div className="flex size-5 items-center justify-center rounded-[6px] bg-neutral-900 text-[10px] font-black text-white">
              T
            </div>
            <p className="text-[11px] font-black tracking-[0.2em] text-neutral-900 uppercase">
              Powered by TestimonialWall
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
