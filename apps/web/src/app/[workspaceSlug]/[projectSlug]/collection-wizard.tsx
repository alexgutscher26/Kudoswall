"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  Building2,
  Camera,
  CheckCircle2,
  ChevronLeft,
  Linkedin,
  Quote,
  Star,
  Video as VideoIcon,
  Loader2,
  BadgeCheck,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Gauge,
  Headset,
  User,
} from "lucide-react";
import { useState, useMemo, useEffect, type SetStateAction } from "react";
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

  const DRAFT_KEY = `t-wall-draft-${project.id}`;

  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
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
      } catch (e) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [DRAFT_KEY, rating, content, photo, name, email, company, linkedin, tagline, mode, step]);

  useEffect(() => {
    trackEvent.mutate({
      workspaceId: project.workspaceId,
      projectId: project.id,
      eventType: "view",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPro = project.workspace.isPro;

  const stepsData = useMemo(() => {
    const mapping: Record<Step, { percent: number; text: string; title: string }> = {
      rating: { percent: 25, text: "Step 1 of 4", title: "Overall Satisfaction" },
      choice: { percent: 50, text: "Step 2 of 4", title: "Format Choice" },
      text: { percent: 50, text: "Step 2 of 4", title: "Detailed Feedback" },
      video: { percent: 50, text: "Step 2 of 4", title: "Record Video" },
      details: { percent: 75, text: "Step 3 of 4", title: "Identity & Photo" },
      review: { percent: 100, text: "Step 4 of 4", title: "Final Review" },
      success: { percent: 100, text: "Complete", title: "Thank You" },
    };
    return mapping[step];
  }, [step]);

  const currentStepInfo = stepsData;

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
    if (step === "text") return setStep("details");
    if (step === "video") return setStep("details");
    if (step === "details") return setStep("review");
    if (step === "review") return setStep("success");
  };

  const prevStep = () => {
    if (step === "choice") return setStep("rating");
    if (step === "text" || step === "video") {
      if (initialType) return setStep("rating");
      return setStep("choice");
    }
    if (step === "details") {
      if (mode === "video") return setStep("video");
      return setStep("text");
    }
    if (step === "review") return setStep("details");
  };

  const fireConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(() => {
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
        const reader = new FileReader();
        videoUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(videoBlob);
        });
      }

      await submitTestimonial(project.id, {
        rating,
        content: mode === "video" && !content ? "Video Testimonial" : content,
        authorName: name,
        authorEmail: email,
        authorImage: photo || undefined,
        authorCompany: company || undefined,
        authorLinkedin: linkedin || undefined,
        authorTagline: tagline || undefined,
        videoUrl,
      });

      localStorage.removeItem(DRAFT_KEY);
      fireConfetti();
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
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
      className="mx-auto w-full max-w-lg"
      style={{
        fontFamily:
          settings?.fontFamily && !["sans", "serif", "mono"].includes(settings.fontFamily)
            ? `"${settings.fontFamily}", sans-serif`
            : settings?.fontFamily === "mono"
              ? "monospace"
              : settings?.fontFamily === "serif"
                ? "serif"
                : "var(--font-sans), sans-serif",
      }}
    >
      {settings?.fontFamily && !["sans", "serif", "mono"].includes(settings.fontFamily) && (
        <style
          dangerouslySetInnerHTML={{
            __html: `@import url('https://fonts.googleapis.com/css2?family=${settings.fontFamily.replace(/\s+/g, "+")}:wght@400;700;800&display=swap');`,
          }}
        />
      )}
      {/* Step Indicator */}
      {step !== "success" && (
        <div className="mb-8">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <span className="text-[11px] tracking-[0.1em] text-[#45464d] uppercase">
                {currentStepInfo.text}
              </span>
              <h2 className="mt-1 text-lg font-bold text-[#191c1e]">{currentStepInfo.title}</h2>
            </div>
            <span className="text-xs font-medium text-[#45464d]">
              {currentStepInfo.percent}% Complete
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e6e8ea]">
            <div
              className="h-full rounded-full bg-[#000000] transition-all duration-500"
              style={{ width: `${currentStepInfo.percent}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Central Editorial Card */}
      <div className="group relative overflow-hidden rounded-xl border border-[#c6c6cd]/20 bg-[#ffffff] p-5 shadow-sm md:p-8">
        {/* Abstract Subtle Background Element */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#d5e3fd]/30 blur-3xl transition-colors duration-700 group-hover:bg-[#d5e3fd]/50"></div>

        <div className="relative z-10 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {step === "rating" && (
                <>
                  <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-[#191c1e] md:text-3xl">
                    How would you rate your experience?
                  </h1>
                  <p className="mx-auto mb-8 max-w-sm text-base text-[#45464d]">
                    Your feedback helps us grow and provides authentic proof to others considering
                    our services.
                  </p>

                  {/* Star Rating Component */}
                  <div className="mb-10 flex justify-center gap-2 md:gap-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onMouseEnter={() => setHoveredRating(s)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => {
                          setRating(s);
                        }}
                        className="group/star outline-none"
                      >
                        <Star
                          className={`size-10 transition-all duration-200 group-hover/star:scale-110 ${
                            (hoveredRating || rating) >= s
                              ? "fill-[#000000] text-[#000000]"
                              : "text-[#e0e3e5]"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Trust Signals */}
                  <div className="mb-8 flex flex-wrap justify-center gap-3">
                    <div className="flex items-center gap-2 rounded-lg bg-[#e6e8ea] px-3 py-1.5">
                      <BadgeCheck className="size-[16px] text-[#009668]" strokeWidth={2.5} />
                      <span className="text-[11px] font-semibold tracking-wider text-[#45464d] uppercase">
                        Verified User
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-[#e6e8ea] px-3 py-1.5">
                      <ShieldCheck className="size-[16px] text-[#7c839b]" strokeWidth={2.5} />
                      <span className="text-[11px] font-semibold tracking-wider text-[#45464d] uppercase">
                        Privacy Guaranteed
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={nextStep}
                    className="mx-auto flex w-full items-center justify-center gap-2 rounded-lg bg-[#000000] px-6 py-3 font-bold text-[#ffffff] transition-all hover:opacity-90 md:w-auto md:min-w-[180px]"
                  >
                    Next Step
                    <ArrowRight className="size-4" />
                  </button>
                </>
              )}

              {step === "choice" && (
                <>
                  <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-[#191c1e] md:text-3xl">
                    How would you like to share?
                  </h1>
                  <p className="mx-auto mb-8 max-w-sm text-base text-[#45464d]">
                    Choose the format that works best for you.
                  </p>
                  <div className="mb-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                    <button
                      onClick={() => {
                        setMode("video");
                        setStep("video");
                      }}
                      className="group relative flex flex-col items-center gap-3 rounded-xl border border-[#c6c6cd]/30 bg-white p-6 transition-all hover:border-[#c6c6cd]/60 hover:shadow-md active:scale-[0.98]"
                    >
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f2f4f6]">
                        <VideoIcon className="size-6 text-[#000000]" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#191c1e]">Video</h3>
                        <p className="text-[11px] font-medium text-[#76777d]">Quick & Personal</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setMode("text");
                        setStep("text");
                      }}
                      className="group relative flex flex-col items-center gap-3 rounded-xl border border-[#c6c6cd]/30 bg-white p-6 transition-all hover:border-[#c6c6cd]/60 hover:shadow-md active:scale-[0.98]"
                    >
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-[#000000]">
                        <Quote className="size-6 text-[#ffffff]" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#191c1e]">Text</h3>
                        <p className="text-[11px] font-medium text-[#76777d]">Simple & Classic</p>
                      </div>
                    </button>
                  </div>
                </>
              )}

              {step === "text" && (
                <div className="text-left">
                  <label
                    htmlFor="feedback"
                    className="mb-2 block text-lg leading-tight font-bold text-[#191c1e]"
                  >
                    {settings?.form?.fields?.content?.label ||
                      "Tell us more about your experience."}
                  </label>
                  <p className="mb-4 max-w-lg text-sm leading-relaxed text-[#45464d]">
                    {settings?.video?.prompt ||
                      "What stood out the most? Sharing specific details helps others understand the true value of our service."}
                  </p>

                  <div className="group relative">
                    <textarea
                      id="feedback"
                      name="feedback"
                      autoFocus
                      className="w-full resize-none rounded-xl border-none bg-[#f2f4f6] p-4 text-sm leading-relaxed text-[#191c1e] shadow-inner transition-all duration-300 placeholder:text-[#76777d] focus:bg-[#ffffff] focus:ring-2 focus:ring-[#000000]"
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={
                        settings?.form?.fields?.content?.placeholder ||
                        "It was an incredible experience because..."
                      }
                      value={content}
                      rows={5}
                    />
                    <div className="absolute right-4 bottom-4 flex items-center gap-2">
                      <span
                        className={`text-xs ${isContentValid ? "text-[#009668]" : "text-[#76777d]"}`}
                      >
                        {charCount} / {minCount}
                      </span>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="mt-6 flex items-center justify-between border-t border-[#c6c6cd]/20 pt-4">
                    <button
                      onClick={prevStep}
                      className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#45464d] uppercase transition-colors hover:text-[#000000]"
                    >
                      <ArrowLeft className="size-4" />
                      Back
                    </button>
                    <button
                      className="flex items-center gap-3 rounded-md bg-[#000000] px-10 py-4 text-xs font-bold tracking-widest text-[#ffffff] uppercase transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
                      disabled={!isContentValid}
                      onClick={nextStep}
                    >
                      Next Step
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}
              {step === "video" && (
                <div className="w-full text-left">
                  <h1 className="mb-3 text-center text-2xl font-extrabold tracking-tight text-[#191c1e] md:text-3xl">
                    Record your video
                  </h1>
                  <p className="mx-auto mb-6 max-w-sm text-center text-base text-[#45464d]">
                    {settings?.video?.prompt ||
                      "What stood out the most? Sharing specific details helps others."}
                  </p>

                  <VideoRecorder
                    isPro={project.workspace.isPro}
                    onConfirm={(blob: Blob) => {
                      setVideoBlob(blob);
                      nextStep();
                    }}
                    maxLength={settings?.video?.maxLength || 120}
                    prompt={settings?.video?.prompt}
                    accentColor={project.workspace.branding.accentColor}
                  />
                </div>
              )}

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
                        <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#c6c6cd]/30 bg-[#f2f4f6] transition-colors group-hover:border-[#000000]/30">
                          {!photo ? (
                            <User className="size-6 text-[#45464d]/40" strokeWidth={1.5} />
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
                        <div className="pointer-events-none absolute -right-1 -bottom-1 rounded-full bg-[#000000] p-1.5 text-[#ffffff] shadow-lg transition-transform group-hover:scale-105">
                          <Camera className="size-3" />
                        </div>
                      </div>
                      <div className="text-left">
                        <label className="mb-0.5 block text-xs font-semibold text-[#000000]">
                          Upload Profile Photo
                        </label>
                        <p className="text-[10px] text-[#45464d]">Recommended: 400x400px</p>
                      </div>
                    </div>

                    {/* Input Fields */}
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-1">
                        <label
                          className="block text-[11px] font-bold tracking-widest text-[#45464d] uppercase"
                          htmlFor="full_name"
                        >
                          {settings?.form?.fields?.fullName?.label || "Full Name"}{" "}
                          {settings?.form?.fields?.fullName?.required !== false && "*"}
                        </label>
                        <input
                          id="full_name"
                          className="h-9 w-full rounded-lg border border-[#c6c6cd]/30 bg-[#f2f4f6] px-3 text-[13px] text-[#191c1e] transition-all outline-none hover:border-[#c6c6cd]/80 focus:bg-[#ffffff] focus:ring-2 focus:ring-[#000000]"
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alex Rivera"
                          value={name}
                        />
                      </div>

                      {settings?.form?.fields?.email?.enabled !== false && (
                        <div className="space-y-1">
                          <label
                            className="block text-[11px] font-bold tracking-widest text-[#45464d] uppercase"
                            htmlFor="email"
                          >
                            {settings?.form?.fields?.email?.label || "Email"}{" "}
                            {settings?.form?.fields?.email?.required && "*"}
                          </label>
                          <input
                            id="email"
                            className="h-9 w-full rounded-lg border border-[#c6c6cd]/30 bg-[#f2f4f6] px-3 text-[13px] text-[#191c1e] transition-all outline-none hover:border-[#c6c6cd]/80 focus:bg-[#ffffff] focus:ring-2 focus:ring-[#000000]"
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
                              className="block text-[11px] font-bold tracking-widest text-[#45464d] uppercase"
                              htmlFor="job_title"
                            >
                              {settings?.form?.fields?.jobTitle?.label || "Job Title"}
                            </label>
                            <input
                              id="job_title"
                              className="h-9 w-full rounded-lg border border-[#c6c6cd]/30 bg-[#f2f4f6] px-3 text-[13px] text-[#191c1e] transition-all outline-none hover:border-[#c6c6cd]/80 focus:bg-[#ffffff] focus:ring-2 focus:ring-[#000000]"
                              onChange={(e) => setTagline(e.target.value)}
                              placeholder="Head of Growth"
                              value={tagline}
                            />
                          </div>
                        )}
                        {settings?.form?.fields?.company?.enabled !== false && (
                          <div className="space-y-1">
                            <label
                              className="block text-[11px] font-bold tracking-widest text-[#45464d] uppercase"
                              htmlFor="company"
                            >
                              {settings?.form?.fields?.company?.label || "Company"}
                            </label>
                            <input
                              id="company"
                              className="h-9 w-full rounded-lg border border-[#c6c6cd]/30 bg-[#f2f4f6] px-3 text-[13px] text-[#191c1e] transition-all outline-none hover:border-[#c6c6cd]/80 focus:bg-[#ffffff] focus:ring-2 focus:ring-[#000000]"
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
                            className="block text-[11px] font-bold tracking-widest text-[#45464d] uppercase"
                            htmlFor="linkedin"
                          >
                            {settings?.form?.fields?.linkedin?.label || "LinkedIn Profile"}{" "}
                            {settings?.form?.fields?.linkedin?.required && "*"}
                          </label>
                          <input
                            id="linkedin"
                            className="h-10 w-full rounded-lg border border-[#c6c6cd]/30 bg-[#f2f4f6] px-4 text-[15px] text-[#191c1e] transition-all outline-none hover:border-[#c6c6cd]/80 focus:bg-[#ffffff] focus:ring-2 focus:ring-[#000000]"
                            onChange={(e) => setLinkedin(e.target.value)}
                            placeholder="https://linkedin.com/in/alex"
                            value={linkedin}
                          />
                        </div>
                      )}
                    </div>

                    {/* Trust Verification Signal */}
                    <div className="mt-1 flex items-center gap-3 rounded-lg bg-[#f2f4f6] px-3 py-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#e6e8ea]">
                        <ShieldCheck className="size-3.5 text-[#009668]" />
                      </div>
                      <div>
                        <p className="text-xs leading-none font-semibold text-[#191c1e]">
                          Identity Verification
                        </p>
                        <p className="mt-1 text-[10px] leading-relaxed text-[#45464d]">
                          Your name and title are verified to build trust.
                        </p>
                      </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex flex-col items-center justify-between gap-4 pt-4 md:flex-row">
                      <button
                        onClick={prevStep}
                        className="order-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#e6e8ea] px-6 py-2.5 text-[11px] font-bold tracking-widest text-[#45464d] uppercase transition-colors hover:opacity-90 md:order-1 md:w-auto"
                        type="button"
                      >
                        Back
                      </button>
                      <button
                        className="order-1 flex w-full items-center justify-center gap-2 rounded-lg bg-[#000000] px-6 py-2.5 text-[11px] font-bold tracking-widest text-[#ffffff] uppercase transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 md:order-2 md:flex-1"
                        disabled={settings?.form?.fields?.fullName?.required !== false && !name}
                        onClick={(e) => {
                          e.preventDefault();
                          const minCount = settings?.form?.minCharCount ?? 50;
                          const isNameRequired =
                            settings?.form?.fields?.fullName?.required !== false;
                          if (
                            mode === "text" &&
                            ((isNameRequired && !name) || content.length < minCount)
                          ) {
                            toast.error(
                              `Please ensure your name is filled and testimonial is at least ${minCount} characters.`,
                            );
                            return;
                          }
                          nextStep();
                        }}
                        type="button"
                      >
                        Review Testimonial
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {step === "review" && (
                <div className="mx-auto w-full text-left">
                  <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-[#191c1e] md:text-3xl">
                    Ready to submit?
                  </h1>
                  <p className="mb-4 max-w-sm text-sm text-[#45464d]">
                    Everything looks great. Take one last look at how your testimonial will appear
                    to others before you hit the button.
                  </p>

                  <div className="relative mt-2 mb-5">
                    <div className="absolute -top-3 -left-3 z-10 rounded-sm bg-[#e6e8ea] px-3 py-1 text-[10px] font-bold tracking-widest text-[#45464d] uppercase shadow-sm">
                      Live Preview
                    </div>
                    <div className="relative rounded-xl border border-[#c6c6cd]/30 bg-[#f2f4f6] p-5 shadow-inner">
                      <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#e6e8ea]">
                            {photo ? (
                              <Image
                                src={photo}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                                alt="Profile"
                              />
                            ) : (
                              <User className="m-2.5 size-5 text-[#45464d]" />
                            )}
                          </div>
                          <div className="text-left">
                            <h3 className="text-lg leading-tight font-bold text-[#191c1e]">
                              {name}
                            </h3>
                            <p className="text-xs text-[#45464d]">
                              {tagline} {tagline && company && "at "} {company}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1 rounded-lg border border-[#d5e3fd] bg-[#d5e3fd]/40 px-2.5 py-1">
                          <BadgeCheck className="size-3.5 text-[#000000]" />
                          <span className="text-[10px] font-bold tracking-tighter text-[#000000] uppercase">
                            Verified
                          </span>
                        </div>
                      </div>
                      <div className="relative mt-2 text-left">
                        <Quote className="absolute -top-2 -left-3 z-0 size-10 rotate-180 text-[#c6c6cd]/30" />
                        <p className="relative z-10 text-sm leading-relaxed text-[#191c1e] italic">
                          &quot;{content || "Video Testimonial Attached"}&quot;
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-[#c6c6cd]/20 pt-4">
                        <div className="flex gap-0.5 text-[#000000]">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`size-3 ${i < rating ? "fill-current" : "text-[#c6c6cd]/40"}`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] tracking-widest text-[#45464d] uppercase">
                          {new Date().toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full flex-col items-center gap-3 sm:flex-row">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full rounded-lg bg-[#000000] py-3.5 text-[13px] font-bold text-[#ffffff] shadow-xl shadow-black/10 transition-all duration-200 hover:opacity-90 active:scale-95 sm:flex-1"
                    >
                      {loading ? "Submitting..." : "Submit Testimonial"}
                    </button>
                    <button
                      onClick={prevStep}
                      className="flex w-full items-center justify-center gap-2 px-6 py-3.5 text-[11px] font-semibold tracking-widest text-[#45464d] uppercase transition-colors hover:text-[#000000] sm:w-auto"
                    >
                      Edit details
                    </button>
                  </div>
                  <p className="mt-4 px-4 text-center text-[10px] leading-relaxed text-[#45464d]">
                    By submitting, you agree to our Terms of Service. Your testimonial will be
                    shared with the team for review and publishing.
                  </p>
                </div>
              )}

              {step === "success" && (
                <>
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#d5e3fd]/40">
                    <CheckCircle2 className="size-8 text-[#009668]" />
                  </div>
                  <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-[#191c1e] md:text-3xl">
                    {settings?.pageContent?.thankYou?.headline || "You're awesome!"}
                  </h1>
                  <p className="mx-auto mb-8 max-w-sm text-base text-[#45464d]">
                    {settings?.pageContent?.thankYou?.body ||
                      project.thankYouMessage ||
                      `Your feedback helps us grow and provides authentic proof to others considering our services.`}
                  </p>

                  <div className="flex flex-col items-center gap-3">
                    {settings?.pageContent?.thankYou?.cta?.enabled &&
                      settings?.pageContent?.thankYou?.cta?.text && (
                        <a
                          href={settings.pageContent.thankYou.cta.url}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#000000] px-6 py-2.5 text-sm font-bold text-[#ffffff] transition-all hover:opacity-90"
                        >
                          {settings.pageContent.thankYou.cta.text}
                          <ArrowRight className="size-4" />
                        </a>
                      )}
                    <button
                      className="text-[13px] font-medium text-[#45464d] hover:underline"
                      onClick={() => window.location.reload()}
                    >
                      Post another review
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Contextual Trust Signal */}
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
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[#c6c6cd]/30 shadow-sm">
                <img
                  alt="User Profile"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnwURMqB09STDN41e7qt-xuLxbpmHSCoo5P8sCojYtZ02Z7nvKDQTuikw3hXwP9EZUj779oQH-S3DQz6MVDTqkLGS6WGOJjq8hsGLfkuugpR4_TjVuzf-wId9IxlMYY5a0baUcBCbsjDTrRZFBekzTq6z7NRxEcQVDNH7e-0wYSMthyLCAt12P3HkBz0V4LrAsy4hjawTOCIwtuFc33v8GXEnQIM66FqJ5MGmO5N2R_JgTqOdeEPrdfKl9rWg3Bv7p4T12fj3Z_w4"
                />
              </div>
            </div>
            <p className="px-4 text-xs leading-relaxed text-[#45464d] italic">
              &quot;Real feedback like yours is what makes our community thrive. Thank you for your
              time.&quot;
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer-ish Meta Info */}
      <p className="mt-4 px-4 text-center text-[10px] leading-relaxed font-medium text-[#45464d] opacity-60">
        By continuing, you agree to our terms of service and acknowledge that your rating may be
        used for marketing purposes.
      </p>
    </div>
  );
}
