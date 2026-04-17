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
    type: "text",
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
    <section className="relative overflow-hidden px-4 py-24" style={{ backgroundColor: "#ffffff" }}>
      {/* Dot grid */}
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
            style={{ color: "#0ea5e9", backgroundColor: "#f0f9ff" }}
          >
            Live preview
          </span>
          <h2 className="text-3xl leading-tight font-bold text-neutral-900 sm:text-4xl md:text-5xl">
            A widget your visitors will <span style={{ color: "#e8527a" }}>actually trust</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-500">
            Here's what the embeddable widget looks like on your site — fully customizable to match
            your brand.
          </p>
        </div>

        {/* Browser chrome mock */}
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-neutral-200 shadow-2xl">
          {/* Browser bar */}
          <div
            className="flex items-center gap-2 border-b border-neutral-200 px-4 py-3"
            style={{ backgroundColor: "#f0efeb" }}
          >
            <div className="flex gap-1.5">
              <span className="size-3 rounded-full bg-red-400" />
              <span className="size-3 rounded-full bg-amber-400" />
              <span className="size-3 rounded-full bg-green-400" />
            </div>
            <div
              className="mx-4 flex-1 rounded-full px-3 py-1 text-xs text-neutral-400"
              style={{ backgroundColor: "#e8e7e3" }}
            >
              yourwebsite.com
            </div>
            <MoreHorizontal className="size-4 text-neutral-400" />
          </div>

          {/* Widget content */}
          <div className="p-4 sm:p-6" style={{ backgroundColor: "#ffffff" }}>
            {/* Widget header */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">What our customers say</h3>
                <div className="mt-1 flex items-center gap-2">
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
                className="hidden shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold sm:inline"
                style={{ backgroundColor: "#fff5f7", color: "#e8527a" }}
              >
                Powered by KudosWall
              </span>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {WIDGET_TESTIMONIALS.map(
                ({ name, role, avatar, avatarColor, rating, text, type }) => (
                  <div
                    key={name}
                    className="relative rounded-xl border border-neutral-100 p-4"
                    style={{ backgroundColor: "#fafafa" }}
                  >
                    {type === "video" && (
                      <div
                        className="relative mb-3 flex h-24 items-center justify-center overflow-hidden rounded-lg"
                        style={{ backgroundColor: "#e8527a22" }}
                      >
                        <div
                          className="flex size-8 items-center justify-center rounded-full"
                          style={{ backgroundColor: "#e8527a" }}
                        >
                          <Play className="size-3.5 fill-white text-white" />
                        </div>
                        <span className="absolute right-2 bottom-2 rounded bg-white px-1 text-[10px] text-neutral-500">
                          0:32
                        </span>
                      </div>
                    )}
                    {type === "text" && <Quote className="mb-2 size-5 text-neutral-200" />}
                    <StarRow count={rating} />
                    <p className="mt-2 mb-3 text-xs leading-relaxed text-neutral-600">"{text}"</p>
                    <div className="flex items-center gap-2">
                      <div
                        className="flex size-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
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
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
