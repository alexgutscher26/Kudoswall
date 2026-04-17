import { Link2, Palette, Code2, ShieldCheck, BarChart2, Camera } from "lucide-react";

const FEATURES = [
  {
    icon: Camera,
    title: "Photo social proof",
    description:
      "Allow customers to upload their photo with their testimonial to build trust and authenticity.",
    accent: "#e8527a",
    bg: "#fff5f7",
  },
  {
    icon: Code2,
    title: "One embed snippet",
    description:
      "Drop a single line of code into your site to display your beautiful Wall of Love instantly.",
    accent: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    icon: Link2,
    title: "Filter by use case",
    description:
      "Easily organize and display specific testimonials based on product categories or customer personas.",
    accent: "#0ea5e9",
    bg: "#f0f9ff",
  },
  {
    icon: Palette,
    title: "Custom branding",
    description:
      "Customize the colors, fonts, and layout of your widgets to perfectly match your brand identity.",
    accent: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    icon: BarChart2,
    title: "CSV export",
    description:
      "Export all your collected testimonials into a clean CSV format for offline analysis or archiving.",
    accent: "#ea580c",
    bg: "#fff7ed",
  },
  {
    icon: ShieldCheck,
    title: "Viral badge",
    description:
      "Let your satisfied customers spread the word with a subtle brand badge that generates new leads.",
    accent: "#0891b2",
    bg: "#ecfeff",
  },
] as const;

export default function FeaturesSection() {
  return (
    <section
      id="features"
      style={{ backgroundColor: "#ffffff" }}
      className="relative overflow-hidden px-4 py-24"
    >
      {/* Dot-grid texture */}
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
        <div className="mb-14 text-center">
          <span
            className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-widest uppercase"
            style={{ color: "#e8527a", backgroundColor: "#fff5f7" }}
          >
            Features
          </span>
          <h2 className="text-3xl leading-tight font-bold text-neutral-900 sm:text-4xl md:text-5xl">
            Everything you need to collect{" "}
            <span style={{ color: "#e8527a" }}>social proof that converts</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-500">
            Built specifically for small businesses who don't have time to wrestle with clunky
            tools.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description, accent, bg }) => (
            <div
              key={title}
              className="rounded-2xl border border-neutral-100 p-5 transition-shadow hover:shadow-md sm:p-6"
              style={{ backgroundColor: bg }}
            >
              <div
                className="mb-4 inline-flex size-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${accent}18` }}
              >
                <Icon className="size-5" style={{ color: accent }} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-neutral-900">{title}</h3>
              <p className="text-sm leading-relaxed text-neutral-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
