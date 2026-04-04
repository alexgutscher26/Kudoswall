"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
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
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { ImageCropper } from "@/components/collection/image-cropper";
import VideoRecorder from "@/components/collection/video-recorder";
import { submitTestimonial } from "./actions";

interface CollectionWizardProps {
  project: {
    id: string;
    name: string;
    thankYouMessage?: string | null;
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

type Step = "rating" | "text" | "photo" | "video" | "details" | "success";

export default function CollectionWizard({ project }: CollectionWizardProps) {
  const [step, setStep] = useState<Step>("rating");
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

  const accentColor = project.workspace.branding.accentColor || "#e8527a";
  const isPro = project.workspace.isPro;

  const steps: Record<Step, number> = {
    rating: 0,
    text: 1,
    photo: 2,
    video: 3,
    details: 4,
    success: 5,
  };

  const nextStep = () => {
    const sequence: Step[] = ["rating", "text", "photo", "video", "details", "success"];
    const currentIndex = sequence.indexOf(step);
    if (currentIndex < sequence.length - 1) {
      setStep(sequence[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const sequence: Step[] = ["rating", "text", "photo", "video", "details", "success"];
    const currentIndex = sequence.indexOf(step);
    if (currentIndex > 0) {
      setStep(sequence[currentIndex - 1]);
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
    if (!name || content.length < 50) {
      toast.error("Please ensure your name is filled and testimonial is at least 50 characters.");
      return;
    }

    setLoading(true);
    try {
      // In a real app, we'd upload the videoBlob and photo to storage here
      // and get the URL. For now, we'll simulate the text submission.
      await submitTestimonial(project.id, {
        rating,
        content,
        authorName: name,
        authorEmail: email,
        authorImage: photo || undefined,
        authorCompany: company || undefined,
        authorLinkedin: linkedin || undefined,
        authorTagline: tagline || undefined,
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
  const isContentValid = charCount >= 50;

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
    <div className="mx-auto w-full max-w-xl px-4 lg:px-0">
      <div className="text-card-foreground relative flex min-h-[550px] flex-col overflow-hidden rounded-[48px] border border-neutral-100 bg-white shadow-2xl shadow-neutral-200/50">
        {/* Progress Bar */}
        <div className="absolute top-0 right-0 left-0 h-1.5 overflow-hidden bg-neutral-50">
          <motion.div
            animate={{
              width: `${(steps[step] / 5) * 100}%`,
            }}
            className="h-full"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-10 lg:p-12">
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
                <div className="flex flex-1 flex-col items-center justify-center space-y-10 py-4 text-center">
                  <div
                    className="animate-in zoom-in flex size-20 items-center justify-center rounded-3xl shadow-lg duration-500"
                    style={{ backgroundColor: `${accentColor}10` }}
                  >
                    <Sparkles className="size-10" style={{ color: accentColor }} />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl leading-tight font-black tracking-tight text-neutral-900 sm:text-4xl">
                      How was your experience?
                    </h2>
                    <p className="mx-auto max-w-xs text-[15px] font-medium text-neutral-500">
                      We value your feedback and want to know how we did.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        className="p-1.5 transition-all hover:scale-110 active:scale-90"
                        key={s}
                        onClick={() => {
                          setRating(s);
                          setTimeout(nextStep, 200);
                        }}
                        onMouseEnter={() => setHoveredRating(s)}
                        onMouseLeave={() => setHoveredRating(0)}
                        type="button"
                      >
                        <Star
                          className={`size-12 transition-all duration-300 sm:size-14 ${
                            s <= (hoveredRating || rating)
                              ? "fill-current"
                              : "fill-neutral-100 text-neutral-100"
                          }`}
                          style={{
                            color: s <= (hoveredRating || rating) ? accentColor : undefined,
                            filter:
                              s <= (hoveredRating || rating)
                                ? `drop-shadow(0 0 12px ${accentColor}40)`
                                : undefined,
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === "text" && (
                <div className="flex flex-1 flex-col space-y-6">
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-neutral-900 shadow-xl">
                      <Quote className="size-6 text-white" />
                    </div>
                    <div>
                      <h2 className="mb-1 text-2xl leading-none font-bold tracking-tight text-neutral-900">
                        Share your story
                      </h2>
                      <p className="text-[12px] font-medium tracking-widest text-neutral-400 uppercase">
                        What result did you achieve?
                      </p>
                    </div>
                  </div>

                  <div className="group relative flex flex-1 flex-col">
                    <textarea
                      autoFocus
                      className="w-full flex-1 resize-none rounded-[32px] border border-neutral-100 bg-neutral-50/50 p-8 pt-10 text-[17px] leading-relaxed font-medium text-neutral-900 transition-all outline-none placeholder:text-neutral-300 focus:border-neutral-200 focus:bg-white focus:ring-4"
                      style={{ "--tw-ring-color": `${accentColor}10` } as any}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="I chose TestimonialWall because..."
                      value={content}
                    />

                    {/* Character Count Badge */}
                    <div className="absolute right-8 bottom-6 flex items-center gap-3">
                      <span
                        className={`text-[11px] font-black tracking-widest uppercase transition-colors ${isContentValid ? "text-emerald-500" : "text-neutral-400"}`}
                      >
                        {charCount} / 50 MIN
                      </span>
                      <div className="h-6 w-[1px] bg-neutral-100" />
                      <button
                        className="flex items-center gap-2 rounded-xl px-6 py-3 text-[14px] font-bold text-white shadow-xl transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-20"
                        style={{ backgroundColor: accentColor }}
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
                <div className="flex flex-1 flex-col items-center justify-center space-y-10 py-4 text-center">
                  <div className="group relative flex size-32 cursor-pointer items-center justify-center overflow-hidden rounded-[40px] border-2 border-dashed border-neutral-200 bg-neutral-50/50 shadow-inner transition-all hover:border-pink-300 hover:bg-white">
                    {photo ? (
                      <img alt="Preview" className="size-full object-cover" src={photo} />
                    ) : (
                      <Camera className="size-10 text-neutral-300 transition-colors group-hover:text-pink-400" />
                    )}
                    <input
                      accept="image/*"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={handlePhotoUpload}
                      type="file"
                    />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                      Add a face to your words
                    </h2>
                    <p className="mx-auto max-w-xs font-medium text-neutral-500">
                      This helps build trust and makes your testimonial look amazing.
                    </p>
                  </div>
                  <div className="flex w-full gap-4 pt-4">
                    <button
                      className="flex-1 rounded-2xl border border-neutral-100 py-4 text-[15px] font-bold text-neutral-400 transition-all hover:bg-neutral-50 hover:text-neutral-600"
                      onClick={nextStep}
                    >
                      Maybe later
                    </button>
                    <button
                      className="flex-1 items-center justify-center rounded-2xl py-4 text-[15px] font-bold text-white shadow-xl transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-20"
                      style={{ backgroundColor: photo ? accentColor : "#171717" }}
                      onClick={() => nextStep()}
                    >
                      {photo ? "Looking good!" : "Click to upload"}
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
                <div className="flex flex-1 flex-col space-y-8">
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-neutral-900 shadow-xl">
                      <Layout className="size-6 text-white" />
                    </div>
                    <div>
                      <h2 className="mb-1 text-2xl leading-none font-bold tracking-tight text-neutral-900">
                        Nearly there!
                      </h2>
                      <p className="text-[12px] font-medium tracking-widest text-neutral-400 uppercase">
                        Who are we reviewing today?
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="pl-1 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                          Full Name *
                        </label>
                        <input
                          className="w-full rounded-2xl border border-neutral-100 bg-neutral-50/50 px-5 py-4 transition-all outline-none focus:border-neutral-200 focus:bg-white focus:ring-4"
                          style={{ "--tw-ring-color": `${accentColor}10` } as any}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Jane Doe"
                          required
                          value={name}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="pl-1 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                          Email (Internal only)
                        </label>
                        <input
                          className="w-full rounded-2xl border border-neutral-100 bg-neutral-50/50 px-5 py-4 transition-all outline-none focus:border-neutral-200 focus:bg-white focus:ring-4"
                          style={{ "--tw-ring-color": `${accentColor}10` } as any}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="jane@example.com"
                          type="email"
                          value={email}
                        />
                      </div>
                    </div>

                    <div className="space-y-5 border-t border-neutral-50 pt-6">
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 pl-1 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                            <Building2 className="size-3" /> Company
                          </label>
                          <input
                            className="w-full rounded-2xl border border-neutral-100 bg-neutral-50/50 px-5 py-4 transition-all outline-none focus:border-neutral-200 focus:bg-white focus:ring-4"
                            style={{ "--tw-ring-color": `${accentColor}10` } as any}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Acme Inc."
                            value={company}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="pl-1 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                            Job Title / Role
                          </label>
                          <input
                            className="w-full rounded-2xl border border-neutral-100 bg-neutral-50/50 px-5 py-4 transition-all outline-none focus:border-neutral-200 focus:bg-white focus:ring-4"
                            style={{ "--tw-ring-color": `${accentColor}10` } as any}
                            onChange={(e) => setTagline(e.target.value)}
                            placeholder="CEO"
                            value={tagline}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 pl-1 text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                          <Linkedin className="size-3" /> LinkedIn Profile
                        </label>
                        <input
                          className="w-full rounded-2xl border border-neutral-100 bg-neutral-50/50 px-5 py-4 transition-all outline-none focus:border-neutral-200 focus:bg-white focus:ring-4"
                          style={{ "--tw-ring-color": `${accentColor}10` } as any}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="linkedin.com/in/jane"
                          value={linkedin}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-[24px] py-5 text-[16px] font-bold text-white shadow-2xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-30"
                    style={{ backgroundColor: name ? accentColor : "#171717" }}
                    disabled={loading || !name}
                    onClick={handleSubmit}
                  >
                    {loading ? (
                      <Loader2 className="size-6 animate-spin" />
                    ) : (
                      <>
                        Submit my review
                        <Sparkles className="size-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {step === "success" && (
                <div className="flex flex-1 flex-col items-center justify-center space-y-10 px-4 py-8 text-center">
                  <div className="flex size-24 items-center justify-center rounded-[40px] bg-emerald-50 shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 className="size-12 text-emerald-500" />
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-4xl leading-tight font-black tracking-tight text-neutral-900">
                      You're awesome!
                    </h2>
                    <p className="mx-auto max-w-sm text-lg leading-relaxed font-medium text-neutral-500">
                      {project.thankYouMessage ||
                        `Your feedback has been sent to ${project.name}. It helps us more than you know.`}
                    </p>
                  </div>
                  <button
                    className="rounded-2xl border border-neutral-100 bg-neutral-50 px-10 py-4 text-[14px] font-bold text-neutral-600 shadow-sm transition-all hover:bg-white hover:text-neutral-900"
                    onClick={() => window.location.reload()}
                  >
                    Post another one
                  </button>
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
        <div className="mt-12 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-neutral-300">
            <div className="flex size-6 items-center justify-center rounded-lg bg-neutral-100 text-[11px] font-bold">
              T
            </div>
            <p className="text-[12px] font-bold tracking-[0.25em] uppercase">
              Powered by TestimonialWall
            </p>
          </div>
          <p className="text-[10px] font-black tracking-widest text-neutral-200 uppercase">
            The simplest way to collect social proof
          </p>
        </div>
      )}
    </div>
  );
}
