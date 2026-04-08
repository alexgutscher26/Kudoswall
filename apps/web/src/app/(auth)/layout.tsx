import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white p-4 text-neutral-900">
      {/* 20px dot-grid texture overlay — exactly matching the landing page hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.16) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Soft white radial glow center to fade out dots under the card, matching hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-5 flex items-center justify-center"
      >
        <div
          className="h-[600px] w-[800px] rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
        />
      </div>

      <div className="relative z-10 mt-12 w-full max-w-[420px]">{children}</div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-[0.2em] whitespace-nowrap text-neutral-300 uppercase opacity-60">
        KudosWall &mdash; Established 2026
      </div>
    </div>
  );
}
