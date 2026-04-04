import { Star, Quote, Play, MoreHorizontal } from "lucide-react";

const WIDGET_TESTIMONIALS = [
  {
    name: "Jordan K.",
    role: "Customer",
    avatar: "JK",
    avatarColor: "#e8527a",
    rating: 5,
    text: "Absolutely love this product. The quality is outstanding and shipping was super fast!",
    type: "text",
  },
  {
    name: "Aisha M.",
    role: "Verified buyer",
    avatar: "AM",
    avatarColor: "#7c3aed",
    rating: 5,
    text: "Changed my business completely. I recommend it to everyone.",
    type: "video",
  },
  {
    name: "Tom B.",
    role: "Customer",
    avatar: "TB",
    avatarColor: "#0ea5e9",
    rating: 5,
    text: "Best purchase this year. The support team is also incredibly responsive.",
    type: "text",
  },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static rating stars
        <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function WidgetPreviewSection() {
  return (
    <section
      className="py-24 px-4 relative overflow-hidden"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Dot grid */}
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
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
            style={{ color: "#0ea5e9", backgroundColor: "#f0f9ff" }}
          >
            Live preview
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 leading-tight">
            A widget your visitors will{" "}
            <span style={{ color: "#e8527a" }}>actually trust</span>
          </h2>
          <p className="mt-4 text-neutral-500 text-lg max-w-xl mx-auto">
            Here's what the embeddable widget looks like on your site — fully customizable to match your brand.
          </p>
        </div>

        {/* Browser chrome mock */}
        <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-neutral-200">
          {/* Browser bar */}
          <div
            className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200"
            style={{ backgroundColor: "#f0efeb" }}
          >
            <div className="flex gap-1.5">
              <span className="size-3 rounded-full bg-red-400" />
              <span className="size-3 rounded-full bg-amber-400" />
              <span className="size-3 rounded-full bg-green-400" />
            </div>
            <div
              className="flex-1 mx-4 rounded-full px-3 py-1 text-xs text-neutral-400"
              style={{ backgroundColor: "#e8e7e3" }}
            >
              yourwebsite.com
            </div>
            <MoreHorizontal className="size-4 text-neutral-400" />
          </div>

          {/* Widget content */}
          <div className="p-4 sm:p-6" style={{ backgroundColor: "#ffffff" }}>
            {/* Widget header */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
              <div>
                <h3 className="font-bold text-neutral-900 text-lg">What our customers say</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: static stars
                      <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-500">4.9 · 128 reviews</span>
                </div>
              </div>
              <span
                className="hidden sm:inline text-[10px] font-semibold px-2 py-1 rounded-full shrink-0"
                style={{ backgroundColor: "#fff5f7", color: "#e8527a" }}
              >
                Powered by TestimonialWall
              </span>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {WIDGET_TESTIMONIALS.map(({ name, role, avatar, avatarColor, rating, text, type }) => (
                <div
                  key={name}
                  className="rounded-xl p-4 border border-neutral-100 relative"
                  style={{ backgroundColor: "#fafafa" }}
                >
                  {type === "video" && (
                    <div
                      className="h-24 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: "#e8527a22" }}
                    >
                      <div
                        className="size-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#e8527a" }}
                      >
                        <Play className="size-3.5 text-white fill-white" />
                      </div>
                      <span className="absolute bottom-2 right-2 text-[10px] text-neutral-500 bg-white rounded px-1">
                        0:32
                      </span>
                    </div>
                  )}
                  {type === "text" && (
                    <Quote className="size-5 text-neutral-200 mb-2" />
                  )}
                  <StarRow count={rating} />
                  <p className="text-xs text-neutral-600 leading-relaxed mt-2 mb-3">"{text}"</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="size-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {avatar}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-800">{name}</p>
                      <p className="text-[10px] text-neutral-400">{role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
