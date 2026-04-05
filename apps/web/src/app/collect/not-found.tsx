import Link from "next/link";
import { ArrowLeft, Ghost } from "lucide-react";

export default function CollectionNotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fafafa]">
      {/* Premium Background Patterns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] size-96 rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] size-[500px] rounded-full bg-blue-500/5 blur-[150px]" />
        {/* Dot grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,1) 1.5px, transparent 1.5px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 text-center">
        <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-3xl border border-neutral-100 bg-white shadow-2xl transition-transform hover:scale-105">
          <Ghost className="size-10 text-pink-500" />
        </div>

        <h1
          className="mb-4 text-4xl font-black tracking-tight text-neutral-900"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Collection Not Found
        </h1>

        <p className="mb-10 text-[15px] leading-relaxed font-bold text-neutral-500">
          This link might have expired, been deleted, or there&apos;s a typo in the URL. Please
          double-check with the business owner.
        </p>

        <div className="flex flex-col items-center gap-4">
          <Link
            href="/"
            className="group flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-[15px] font-bold text-white shadow-xl transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "#171717" }}
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <p className="text-[11px] font-bold tracking-widest text-neutral-300 uppercase">
            Powered by TestimonialWall
          </p>
        </div>
      </div>
    </main>
  );
}
