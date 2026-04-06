import { Link2, Sparkles, Globe } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Link2,
    title: "Create your collection",
    description:
      "Create a collection wall in seconds and get a unique link. Share it via email, SMS, or social — anywhere you reach customers.",
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
      className="relative overflow-hidden px-4 py-24"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Dot grid bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <span
            className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-widest uppercase"
            style={{ color: "#7c3aed", backgroundColor: "#f5f3ff" }}
          >
            How it works
          </span>
          <h2 className="text-3xl leading-tight font-bold text-neutral-900 sm:text-4xl md:text-5xl">
            Up and running in <span style={{ color: "#e8527a" }}>under 5 minutes</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-500">
            No technical setup. No complex integrations. Just share, collect, and embed.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Connector line (desktop) */}
          <div
            aria-hidden="true"
            className="absolute top-12 right-[calc(33.33%+12px)] left-[calc(33.33%+12px)] hidden h-px md:block"
            style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
          />

          {STEPS.map(({ number, icon: Icon, title, description, color, bg }) => (
            <div
              key={number}
              className="relative flex flex-col items-center rounded-2xl border border-white/70 p-6 text-center shadow-sm sm:p-8"
              style={{ backgroundColor: "#ffffff" }}
            >
              {/* Step number badge */}
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold"
                style={{ backgroundColor: color, color: "#ffffff" }}
              >
                {number}
              </div>

              {/* Icon */}
              <div
                className="mt-2 mb-5 flex size-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: bg }}
              >
                <Icon className="size-6" style={{ color }} />
              </div>

              <h3 className="mb-3 text-xl font-semibold text-neutral-900">{title}</h3>
              <p className="text-sm leading-relaxed text-neutral-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
