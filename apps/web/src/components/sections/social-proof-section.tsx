import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Owner, Bloom Bakery",
    avatar: "SC",
    avatarColor: "#e8527a",
    rating: 5,
    quote:
      "KudosWall completely changed how I showcase customer love. Within a week I had 20 reviews on my site and my conversion rate jumped 30%.",
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
    <section style={{ backgroundColor: "#ffffff" }} className="relative overflow-hidden px-4 py-24">
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
        <div className="mb-12 text-center">
          <span
            className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-widest uppercase"
            style={{ color: "#e8527a", backgroundColor: "#fff5f7" }}
          >
            Social proof
          </span>
          <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl md:text-5xl">
            Businesses that trust <span style={{ color: "#e8527a" }}>KudosWall</span>
          </h2>
        </div>

        {/* Logo strip */}
        <div className="mb-16 flex flex-wrap justify-center gap-4">
          {LOGO_COMPANIES.map((name) => (
            <div
              key={name}
              className="rounded-full border border-neutral-200 px-5 py-2.5 text-sm font-semibold text-neutral-500"
              style={{ backgroundColor: "#fafafa" }}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {TESTIMONIALS.map(({ name, role, avatar, avatarColor, rating, quote }) => (
            <div
              key={name}
              className="flex flex-col gap-4 rounded-2xl border border-neutral-100 p-6 shadow-sm"
              style={{ backgroundColor: "#fafafa" }}
            >
              {/* Quote icon */}
              <Quote className="size-8 text-neutral-200" />

              {/* Stars */}
              <StarRow count={rating} />

              {/* Quote text */}
              <p className="flex-1 text-sm leading-relaxed text-neutral-700">"{quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-neutral-100 pt-2">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
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
            <strong className="text-neutral-900">4.9 / 5</strong> from business owners
          </p>
        </div>
      </div>
    </section>
  );
}
