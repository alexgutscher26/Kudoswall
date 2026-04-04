import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Owner, Bloom Bakery",
    avatar: "SC",
    avatarColor: "#e8527a",
    rating: 5,
    quote:
      "TestimonialWall completely changed how I showcase customer love. Within a week I had 20 reviews on my site and my conversion rate jumped 30%.",
  },
  {
    name: "Marcus Rivera",
    role: "Founder, FitCoach Pro",
    avatar: "MR",
    avatarColor: "#7c3aed",
    rating: 5,
    quote:
      "I was spending hours chasing testimonials over email. Now I just send a link and the reviews come in automatically. It's a game changer.",
  },
  {
    name: "Priya Nair",
    role: "CEO, Nair Legal Services",
    avatar: "PN",
    avatarColor: "#0ea5e9",
    rating: 5,
    quote:
      "The widget looks incredibly polished — clients actually comment on how professional our website looks now. Worth every penny.",
  },
];

const LOGO_COMPANIES = [
  "Bloom Studio",
  "RapidLaunch",
  "CoachHQ",
  "Petal & Co.",
  "GrowthKit",
  "NestLocal",
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static rating stars
        <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function SocialProofSection() {
  return (
    <section style={{ backgroundColor: "#ffffff" }} className="relative overflow-hidden py-24 px-4">
      {/* Dot-grid texture */}
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
        <div className="text-center mb-12">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
            style={{ color: "#e8527a", backgroundColor: "#fff5f7" }}
          >
            Social proof
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900">
            Businesses that trust{" "}
            <span style={{ color: "#e8527a" }}>TestimonialWall</span>
          </h2>
        </div>

        {/* Logo strip */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {LOGO_COMPANIES.map((name) => (
            <div
              key={name}
              className="px-5 py-2.5 rounded-full border border-neutral-200 text-sm font-semibold text-neutral-500"
              style={{ backgroundColor: "#fafafa" }}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, role, avatar, avatarColor, rating, quote }) => (
            <div
              key={name}
              className="rounded-2xl p-6 border border-neutral-100 shadow-sm flex flex-col gap-4"
              style={{ backgroundColor: "#fafafa" }}
            >
              {/* Quote icon */}
              <Quote className="size-8 text-neutral-200" />

              {/* Stars */}
              <StarRow count={rating} />

              {/* Quote text */}
              <p className="text-neutral-700 text-sm leading-relaxed flex-1">"{quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
                <div
                  className="size-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: avatarColor }}
                >
                  {avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{name}</p>
                  <p className="text-xs text-neutral-400">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate rating */}
        <div className="mt-12 flex flex-col items-center gap-2">
          <StarRow count={5} />
          <p className="text-sm text-neutral-500">
            <strong className="text-neutral-900">4.9 / 5</strong> from over 1,200 business owners
          </p>
        </div>
      </div>
    </section>
  );
}
