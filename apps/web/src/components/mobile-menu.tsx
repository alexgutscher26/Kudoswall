"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@my-better-t-app/ui/components/button";
import { authClient } from "@/lib/auth-client";

interface MobileMenuProps {
  session: any;
  navLinks: readonly { href: string; label: string }[];
}

export default function MobileMenu({ session, navLinks }: MobileMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Morphing Hamburger Button */}
      <button
        type="button"
        className="relative flex size-8 flex-col items-center justify-center rounded-full p-1 md:hidden focus:outline-none"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span
          className={`h-0.5 w-4 rounded-full bg-neutral-900 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            menuOpen ? "absolute translate-y-0 rotate-45" : "-translate-y-1"
          }`}
        />
        <span
          className={`h-0.5 w-4 rounded-full bg-neutral-900 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            menuOpen ? "absolute translate-y-0 -rotate-45" : "translate-y-1"
          }`}
        />
      </button>

      {/* Screen Filling Glass Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 top-0 left-0 z-40 flex h-screen w-screen flex-col justify-between bg-white/95 p-6 backdrop-blur-3xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden">
          {/* Top header spacing */}
          <div className="flex items-center justify-between pt-4">
            <span className="text-sm font-bold text-neutral-900">KudosWall</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-neutral-100 p-2 text-xs font-semibold text-neutral-800"
            >
              Close
            </button>
          </div>

          {/* Staggered Navigation Links */}
          <div className="flex flex-col gap-6 py-12">
            {navLinks.map(({ href, label }, idx) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-bold tracking-tight text-neutral-900 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{
                  animation: `slideUpFade 0.4s cubic-bezier(0.32,0.72,0,1) forwards ${idx * 60 + 100}ms`,
                }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col gap-3 pb-8">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-neutral-900 py-3 text-center text-sm font-semibold text-white"
                >
                  Go to dashboard
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await authClient.signOut();
                    setMenuOpen(false);
                    window.location.reload();
                  }}
                  className="rounded-xl border border-neutral-200 py-2.5 text-center text-sm font-medium text-neutral-600"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl bg-neutral-900 py-3.5 text-center text-base font-semibold text-white shadow-lg"
                >
                  Start free trial
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl border border-neutral-200 py-3 text-center text-sm font-medium text-neutral-700"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
