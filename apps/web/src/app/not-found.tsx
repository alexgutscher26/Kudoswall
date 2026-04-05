import Link from "next/link";
import { ArrowLeft, LifeBuoy } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fafafa]">
      {/* Premium Background Patterns */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Soft radial glows */}
        <div className="absolute top-[-20%] right-[-10%] size-[600px] rounded-full bg-pink-500/5 blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[-10%] size-[700px] rounded-full bg-blue-500/5 blur-[150px]" />

        {/* Dot grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,1) 1.5px, transparent 1.5px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg px-6 text-center">
        <div className="mx-auto mb-10 flex size-24 items-center justify-center rounded-[32px] border border-neutral-100 bg-white shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-12">
          <LifeBuoy className="size-12 text-pink-500" />
        </div>

        <h1
          className="mb-6 text-6xl font-black tracking-tight text-neutral-900 sm:text-7xl"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          404
        </h1>

        <h2 className="mb-4 text-xl font-bold tracking-tight text-neutral-800">
          Oops! This page is lost at sea.
        </h2>

        <p className="mb-12 text-[15px] leading-relaxed font-bold text-neutral-500">
          The page you are looking for might have been moved, deleted, or simply never existed in
          the first place.
        </p>

        <div className="flex flex-col items-center gap-6">
          <Link
            href="/"
            className="group flex w-full items-center justify-center gap-2 rounded-full px-10 py-5 text-[15px] font-bold text-white shadow-2xl transition-all hover:opacity-90 active:scale-[0.98] sm:w-auto"
            style={{ backgroundColor: "#171717" }}
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Navigate back home
          </Link>

          <Link
            href="/dashboard"
            className="text-[13px] font-bold text-neutral-400 underline underline-offset-4 transition-colors hover:text-neutral-900"
          >
            Go to your dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
