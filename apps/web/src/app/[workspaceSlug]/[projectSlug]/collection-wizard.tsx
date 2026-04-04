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
  Video,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ImageCropper, type CropArea } from "@/components/collection/image-cropper";
import { submitTestimonial } from "./actions";

interface CollectionWizardProps {
  project: {
    id: string;
    name: string;
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
  const [video, setVideo] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [tagline, setTagline] = useState("");
  const [loading, setLoading] = useState(false);

  const nextStep = () => {
    const sequence: Step[] = [
      "rating",
      "text",
      "photo",
      "video",
      "details",
      "success",
    ];
    const currentIndex = sequence.indexOf(step);
    if (currentIndex < sequence.length - 1) {
      setStep(sequence[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const sequence: Step[] = [
      "rating",
      "text",
      "photo",
      "video",
      "details",
      "success",
    ];
    const currentIndex = sequence.indexOf(step);
    if (currentIndex > 0) {
      setStep(sequence[currentIndex - 1]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!(name && content)) {
      toast.error("Please fill in your name and testimonial");
      setStep("details");
      return;
    }

    setLoading(true);
    try {
      await submitTestimonial(project.id, {
        rating,
        content,
        authorName: name,
        authorEmail: email,
        authorImage: photo || undefined,
        authorCompany: company || undefined,
        authorLinkedin: linkedin || undefined,
        authorTagline: tagline || undefined,
        // videoUrl will be handled when storage is ready
      });

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ec4899", "#171717", "#ffffff"],
      });

      setStep("success");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="mx-auto w-full max-w-xl">
      <div className="relative flex min-h-[500px] flex-col overflow-hidden rounded-[40px] border border-neutral-100 bg-card text-card-foreground shadow-2xl shadow-neutral-200/50 dark:shadow-none">
        {/* Progress Bar */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-neutral-50">
          <motion.div
            animate={{
              width: `${(Object.keys(steps).indexOf(step) / 5) * 100}%`,
            }}
            className="h-full bg-pink-500"
          />
        </div>

        <div className="flex flex-1 flex-col p-8 sm:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-1 flex-col"
              exit={{ opacity: 0, x: -20 }}
              initial={{ opacity: 0, x: 20 }}
              key={step}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {step === "rating" && (
                <div className="flex flex-1 flex-col items-center justify-center space-y-8 py-4 text-center">
                  <div className="flex size-16 animate-bounce items-center justify-center rounded-2xl bg-pink-50">
                    <Sparkles className="size-8 text-pink-500" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="font-bold text-3xl text-neutral-900 tracking-tight">
                      How was your experience?
                    </h2>
                    <p className="mx-auto max-w-xs text-neutral-500">
                      We value your feedback and want to know how we did.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        className="p-1 transition-transform hover:scale-110 active:scale-95"
                        key={s}
                        onClick={() => {
                          setRating(s);
                          setTimeout(nextStep, 300);
                        }}
                        onMouseEnter={() => setHoveredRating(s)}
                        onMouseLeave={() => setHoveredRating(0)}
                        type="button"
                      >
                        <Star
                          className={`size-12 transition-all duration-300 ${
                            s <= (hoveredRating || rating)
                              ? "fill-pink-500 text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.3)]"
                              : "fill-neutral-100 text-neutral-100"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === "text" && (
                <div className="flex flex-1 flex-col space-y-6">
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-900">
                      <Quote className="size-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-neutral-900 text-xl tracking-tight">
                        Share your story
                      </h2>
                      <p className="font-medium text-[12px] text-neutral-400">
                        What made you choose {project.name}?
                      </p>
                    </div>
                  </div>
                    <textarea
                    autoFocus
                    className="w-full flex-1 resize-none rounded-3xl border border-neutral-100 bg-secondary/30 p-6 pb-20 font-medium text-[16px] leading-relaxed text-foreground outline-none transition-all placeholder:text-neutral-400 focus:border-pink-300 focus:bg-card focus:ring-4 focus:ring-pink-500/5"
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tell us about your experience..."
                    value={content}
                  />
                  <div className="flex justify-end pt-4">
                    <button
                      className="flex items-center gap-2 rounded-2xl bg-[#171717] px-8 py-4 font-bold text-[15px] text-white shadow-black/10 shadow-xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-30"
                      disabled={!content}
                      onClick={nextStep}
                    >
                      Continue
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === "photo" && (
                <div className="flex flex-1 flex-col items-center justify-center space-y-8 text-center">
                  <div className="group relative flex size-24 cursor-pointer items-center justify-center overflow-hidden rounded-[32px] border-2 border-neutral-200 border-dashed bg-neutral-50 transition-all hover:border-pink-300">
                    {photo ? (
                      <img
                        alt="Preview"
                        className="size-full object-cover"
                        src={photo}
                      />
                    ) : (
                      <Camera className="size-8 text-neutral-300 group-hover:text-pink-400" />
                    )}
                    <input
                      accept="image/*"
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={handleFileUpload}
                      type="file"
                    />
                  </div>
                  <div className="space-y-3">
                    <h2 className="font-bold text-2xl text-neutral-900">
                      Add a face to your words
                    </h2>
                    <p className="mx-auto max-w-xs text-neutral-500">
                      This helps build trust. Don't worry, you can skip this if
                      you're shy.
                    </p>
                  </div>
                  <div className="flex w-full gap-4">
                    <button
                      className="flex-1 rounded-2xl border border-neutral-100 py-4 font-bold text-[15px] text-neutral-400 transition-all hover:bg-neutral-50"
                      onClick={nextStep}
                    >
                      Skip this
                    </button>
                    <button
                      className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#171717] py-4 font-bold text-[15px] text-white shadow-black/10 shadow-xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-30"
                      disabled={!photo}
                      onClick={() => nextStep()}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {step === "video" && (
                <div className="flex flex-1 flex-col items-center justify-center space-y-8 text-center">
                  <div className="flex size-24 items-center justify-center rounded-[32px] bg-pink-50">
                    <Video className="size-10 text-pink-500" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="font-bold text-2xl text-neutral-900">
                      Record a video review?
                    </h2>
                    <p className="mx-auto max-w-xs text-neutral-500">
                      Video testimonials convert 4x better. It only takes 30
                      seconds!
                    </p>
                  </div>
                  <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 font-medium text-[13px] text-neutral-400">
                    Coming soon: Direct recording from your browser.
                  </div>
                  <div className="flex w-full gap-4">
                    <button
                      className="flex-1 rounded-2xl border border-neutral-100 py-4 font-bold text-[15px] text-neutral-400 transition-all hover:bg-neutral-50"
                      onClick={nextStep}
                    >
                      No thanks
                    </button>
                    <div className="relative flex-1">
                      <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-pink-500 py-4 font-bold text-[15px] text-white shadow-pink-500/20 shadow-xl transition-all hover:opacity-90 active:scale-[0.98]">
                        <Upload className="size-4" />
                        Upload Video
                      </button>
                      <input
                        accept="video/*"
                        className="absolute inset-0 cursor-pointer opacity-0"
                        onChange={() => nextStep()}
                        type="file"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === "details" && (
                <div className="flex flex-1 flex-col space-y-6">
                  <div className="space-y-4">
                    <h2 className="font-bold text-2xl text-neutral-900">
                      Finish your profile
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="pl-1 font-bold text-[11px] text-neutral-400 uppercase tracking-widest">
                          Name
                        </label>
                        <input
                          className="w-full rounded-2xl border border-neutral-100 bg-neutral-50/50 px-5 py-3.5 outline-none transition-all focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-500/5"
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Jane Doe"
                          required
                          value={name}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="pl-1 font-bold text-[11px] text-neutral-400 uppercase tracking-widest">
                          Email
                        </label>
                        <input
                          className="w-full rounded-2xl border border-neutral-100 bg-neutral-50/50 px-5 py-3.5 outline-none transition-all focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-500/5"
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="jane@example.com"
                          type="email"
                          value={email}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 border-neutral-50 border-t pt-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 pl-1 font-bold text-[11px] text-neutral-400 uppercase tracking-widest">
                          <Building2 className="size-3" /> Company Name
                        </label>
                        <input
                          className="w-full rounded-2xl border border-neutral-100 bg-neutral-50/50 px-5 py-3.5 outline-none transition-all focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-500/5"
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Acme Inc."
                          value={company}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 pl-1 font-bold text-[11px] text-neutral-400 uppercase tracking-widest">
                            <Linkedin className="size-3" /> LinkedIn URL
                          </label>
                          <input
                            className="w-full rounded-2xl border border-neutral-100 bg-neutral-50/50 px-5 py-3.5 outline-none transition-all focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-500/5"
                            onChange={(e) => setLinkedin(e.target.value)}
                            placeholder="linkedin.com/in/jane"
                            value={linkedin}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="pl-1 font-bold text-[11px] text-neutral-400 uppercase tracking-widest">
                            Tagline / Title
                          </label>
                          <input
                          className="w-full rounded-2xl border border-neutral-100 bg-secondary/50 px-5 py-3.5 text-foreground outline-none transition-all focus:border-pink-300 focus:bg-card focus:ring-4 focus:ring-pink-500/5"
                          onChange={(e) => setTagline(e.target.value)}
                          placeholder="CEO at Acme"
                          value={tagline}
                        />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#171717] py-4 font-bold text-[15px] text-white shadow-black/10 shadow-xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-30"
                    disabled={loading || !name}
                    onClick={handleSubmit}
                  >
                    {loading ? (
                      <div className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <>
                        Post my testimonial
                        <Sparkles className="size-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {step === "success" && (
                <div className="flex flex-1 flex-col items-center justify-center space-y-8 px-4 py-8 text-center">
                  <div className="flex size-20 items-center justify-center rounded-[32px] bg-emerald-50">
                    <CheckCircle2 className="size-10 text-emerald-500" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="font-bold text-3xl text-neutral-900 tracking-tight">
                      You're awesome!
                    </h2>
                    <p className="text-neutral-500">
                      Your feedback has been sent to {project.name}. It helps us
                      more than you know.
                    </p>
                  </div>
                  <button
                    className="rounded-2xl border border-neutral-100 bg-neutral-50 px-8 py-4 font-bold text-[14px] text-neutral-600 shadow-sm transition-all hover:bg-white"
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
            className="absolute top-6 left-6 p-2 text-neutral-300 transition-colors hover:text-neutral-900"
            onClick={prevStep}
          >
            <ChevronLeft className="size-6" />
          </button>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-8 flex items-center justify-center gap-2 text-neutral-300">
        <div className="flex size-5 items-center justify-center rounded-md bg-neutral-100 font-bold text-[10px]">
          T
        </div>
        <p className="font-medium text-[12px] uppercase tracking-[0.2em]">
          Powered by TestimonialWall
        </p>
      </div>
    </div>
  );
}

const steps = {
  rating: 0,
  text: 1,
  photo: 2,
  video: 3,
  details: 4,
  success: 5,
};
