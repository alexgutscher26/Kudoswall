import { Link2, Palette, Code2, ShieldCheck, BarChart2, Video } from "lucide-react";

const FEATURES = [
  {
    icon: Link2,
    title: "One shareable link",
    description:
      "Send customers a single link. They record a video or type a testimonial — no account, no friction.",
    span: "col-span-2",
    accent: "#e8527a",
    bg: "#fff5f7",
  },
  {
    icon: Video,
    title: "Video & text",
    description: "Accept both video recordings and written quotes from the same form.",
    span: "col-span-1",
    accent: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    icon: Palette,
    title: "Brand-matched widget",
    description: "Pick your colors, fonts, and layout. Preview changes live before you publish.",
    span: "col-span-1",
    accent: "#0ea5e9",
    bg: "#f0f9ff",
  },
  {
    icon: Code2,
    title: "Embed anywhere",
    description:
      "Copy one `<script>` tag. Drop it into Webflow, WordPress, Squarespace, or any HTML page.",
    span: "col-span-1",
    accent: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    icon: ShieldCheck,
    title: "Content moderation",
    description: "Review, approve, or flag testimonials before they go live on your site.",
    span: "col-span-1",
    accent: "#ea580c",
    bg: "#fff7ed",
  },
  {
    icon: BarChart2,
    title: "Analytics dashboard",
    description: "See which testimonials get the most engagement and drive conversions.",
    span: "col-span-2",
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

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description, span, accent, bg }) => (
            <div
              key={title}
              className={`${span === "col-span-2" ? "md:col-span-2" : "md:col-span-1"} rounded-2xl border border-neutral-100 p-5 transition-shadow hover:shadow-md sm:p-6`}
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
