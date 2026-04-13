import WidgetLoader from "./widget-loader";

/**
 * SocialProofSection
 *
 * This is the LIVE Wall of Love.
 * It dynamically pulls your approved testimonials (Aisha, Tom, Sarah)
 * using the drop-in KudosWall script.
 */
export default function SocialProofSection() {
  return (
    <section id="social-proof" className="relative w-full overflow-hidden bg-white py-24 sm:py-32">
      {/* Background Decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
            Our <span className="text-pink-600">Wall of Love</span>
          </h2>
          <p className="mt-4 text-lg text-neutral-500">
            Real feedback from our amazing community, synced live via KudosWall.
          </p>
        </div>

        {/* The Widget Area */}
        <div className="relative mx-auto max-w-5xl">
          <WidgetLoader widgetId="5475dd90-24ad-49b3-99a1-609c939ae199" />
        </div>
      </div>
    </section>
  );
}
