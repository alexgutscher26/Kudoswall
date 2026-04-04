"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@my-better-t-app/ui/components/button";
import { authClient } from "@/lib/auth-client";
import UserMenu from "./user-menu";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it Works" },
  { href: "#pricing", label: "Pricing" },
] as const;

// Navbar is always light — no dark: variants
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
      <nav
        className="flex items-center justify-between backdrop-blur-md rounded-full px-4 py-2 shadow-sm"
        style={{
          backgroundColor: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(0,0,0,0.09)",
        }}
      >
        {/* Left: Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors rounded-full hover:bg-neutral-100"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Center: Logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-xl font-bold tracking-tight text-neutral-900 select-none"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          TestimonialWall
        </Link>

        {/* Right: Auth actions */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          {!isPending && session ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="text-sm font-bold text-neutral-700 hover:text-neutral-900 transition-colors"
                style={{ fontFamily: "inherit" }}
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <>
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors px-3 py-1.5 mr-2"
              >
                Dashboard
              </Link>
              <a href="/login">
                <Button
                  variant="outline"
                  className="rounded-full text-sm px-4 h-8 border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                >
                  Log in
                </Button>
              </a>
              <a href="/login">
                <Button
                  className="rounded-full text-sm px-4 h-8 text-white hover:bg-neutral-700 transition-all active:scale-95"
                  style={{ backgroundColor: "#171717" }}
                >
                  Get started →
                </Button>
              </a>
            </>
          )}
        </div>

        {/* Mobile: Hamburger */}
        <button
          type="button"
          className="md:hidden ml-auto p-2 rounded-full hover:bg-neutral-100 transition-colors"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="size-5 text-neutral-700" />
          ) : (
            <Menu className="size-5 text-neutral-700" />
          )}
        </button>
      </nav>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div
          className="md:hidden mt-2 rounded-2xl shadow-lg px-4 py-3 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(0,0,0,0.09)",
          }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="py-2 px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              {label}
            </a>
          ))}
          {!isPending && session ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="py-2 px-3 text-sm font-bold text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await authClient.signOut();
                  setMenuOpen(false);
                }}
                className="py-2 px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-xl text-left"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <hr className="my-2 border-neutral-200" />
              <a
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="py-2 px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-xl"
              >
                Log in
              </a>
              <a href="/login" onClick={() => setMenuOpen(false)}>
                <Button
                  className="w-full rounded-xl text-sm mt-1 text-white"
                  style={{ backgroundColor: "#171717" }}
                >
                  Get started →
                </Button>
              </a>
            </>
          )}
        </div>
      )}
    </header>
  );
}
