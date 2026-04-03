import { Link2, Sparkles, Globe } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Link2,
    title: "Share your collection link",
    description:
      "After signing up, you instantly get a unique link. Share it via email, SMS, or social — anywhere you reach customers.",
    color: "#e8527a",
    bg: "#fff5f7",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Customers leave a review",
    description:
      "They click the link and record a short video or type a written review — no account needed, takes under 60 seconds.",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    number: "03",
    icon: Globe,
    title: "Publish a beautiful widget",
    description:
      "Approve the testimonials you love, customize the widget to match your brand, then embed it with a single line of code.",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
] as const;

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-4 relative overflow-hidden"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Dot grid bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
            style={{ color: "#7c3aed", backgroundColor: "#f5f3ff" }}
          >
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
            Up and running in{" "}
            <span style={{ color: "#e8527a" }}>under 5 minutes</span>
          </h2>
          <p className="mt-4 text-neutral-500 text-lg max-w-xl mx-auto">
            No technical setup. No complex integrations. Just share, collect, and embed.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line (desktop) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-12 left-[calc(33.33%+12px)] right-[calc(33.33%+12px)] h-px"
            style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
          />

          {STEPS.map(({ number, icon: Icon, title, description, color, bg }) => (
            <div
              key={number}
              className="relative flex flex-col items-center text-center p-8 rounded-2xl border border-white/70 shadow-sm"
              style={{ backgroundColor: "#ffffff" }}
            >
              {/* Step number badge */}
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: color, color: "#ffffff" }}
              >
                {number}
              </div>

              {/* Icon */}
              <div
                className="flex items-center justify-center size-14 rounded-2xl mb-5 mt-2"
                style={{ backgroundColor: bg }}
              >
                <Icon className="size-6" style={{ color }} />
              </div>

              <h3 className="font-semibold text-neutral-900 text-xl mb-3">{title}</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
