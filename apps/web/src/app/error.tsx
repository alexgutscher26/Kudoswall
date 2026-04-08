"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCcw, Home, MessageSquare, ChevronRight } from "lucide-react";
import { Button } from "@my-better-t-app/ui/components/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#fafafa] py-20 text-center">
      {/* Premium Background Patterns (Consistent with 404) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Soft radial glows - using a slightly warmer red for error */}
        <div className="absolute top-[-10%] right-[-5%] size-[500px] rounded-full bg-red-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] size-[600px] rounded-full bg-pink-500/5 blur-[120px]" />

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

      <div className="relative z-10 w-full max-w-xl px-6">
        <div className="mx-auto mb-10 flex size-20 items-center justify-center rounded-[28px] border border-red-100 bg-white shadow-xl">
          <AlertCircle className="size-10 text-red-500" />
        </div>

        <h1
          className="mb-4 text-7xl font-black tracking-tighter text-neutral-900"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Oops.
        </h1>

        <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-800">
          Something went wrong on our end.
        </h2>

        <p className="mx-auto mb-12 max-w-md text-[15px] leading-relaxed font-medium text-neutral-500">
          We encountered an unexpected technical glitch. Our team has been notified, and we&apos;re
          working to get things back on track.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            onClick={() => reset()}
            className="h-14 gap-2 rounded-2xl px-8 text-[15px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: "#171717" }}
          >
            <RefreshCcw className="size-4" />
            Try again
          </Button>

          <Link href="/">
            <Button
              variant="outline"
              className="h-14 gap-2 rounded-2xl border-neutral-200 px-8 text-[15px] font-bold transition-all hover:bg-neutral-50"
            >
              <Home className="size-4" />
              Return home
            </Button>
          </Link>
        </div>

        <div className="mt-16 border-t border-neutral-100 pt-10">
          <p className="mb-6 text-[13px] font-bold text-neutral-400">Need immediate help?</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/"
              className="group flex items-center gap-2 text-[14px] font-medium text-neutral-600 transition-colors hover:text-pink-500"
            >
              <MessageSquare className="size-4" />
              Contact Support
              <ChevronRight className="size-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>
            <a
              href="https://status.kudoswall.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-[14px] font-medium text-neutral-600 transition-colors hover:text-pink-500"
            >
              <div className="size-2 animate-pulse rounded-full bg-green-500" />
              System Status
              <ChevronRight className="size-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
            </a>
          </div>
        </div>

        {error.digest && (
          <p className="mt-12 font-mono text-[11px] tracking-widest text-neutral-300 uppercase">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
