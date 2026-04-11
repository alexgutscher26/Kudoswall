import { useEffect } from "react";
import { Star, CheckCircle2, Shield, Video, Quote, Camera } from "lucide-react";
import type { CollectionSettings } from "./types";
import type { ActiveTab, MockStep } from "./use-collection-customizer";

export function CollectionWizardPreview({
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
  activeTab: ActiveTab;
  mockStep: MockStep;
  setMockStep: (step: MockStep) => void;
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
              <span className="font-sans text-[10px] tracking-widest text-[#45464d] uppercase">
                {info.text}
              </span>
              <h2 className="mt-0.5 text-base font-bold text-[#191c1e]">{info.title}</h2>
            </div>
            <span className="font-sans text-[11px] font-medium text-[#45464d]">
              {info.percent}% Complete
            </span>
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
                onClick={() => setMockStep("choice")}
                className="rounded-lg bg-[#000000] px-8 py-2.5 text-[11px] font-bold tracking-widest text-white uppercase transition-all hover:opacity-90"
              >
                Next Step →
              </button>
            </div>
          )}

          {/* Choice Step */}
          {mockStep === "choice" && (
            <div className="py-2 text-center">
              <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-[#191c1e]">
                How would you like to share?
              </h1>
              <p className="mb-6 text-sm text-[#45464d]">
                Choose the format that works best for you.
              </p>
              <div className="mb-6 grid grid-cols-2 gap-3">
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

          {/* Video Step */}
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
