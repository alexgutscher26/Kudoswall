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
    <header className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2">
      <nav
        className="flex items-center justify-between rounded-full px-4 py-2 shadow-sm backdrop-blur-md"
        style={{
          backgroundColor: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(0,0,0,0.09)",
        }}
      >
        {/* Left: Nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
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
          KudosWall
        </Link>

        {/* Right: Auth actions */}
        <div className="ml-auto hidden items-center gap-2 md:flex">
          {!isPending && session ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-bold text-neutral-700 transition-colors hover:text-neutral-900"
                style={{ fontFamily: "inherit" }}
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="mr-2 px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              >
                Dashboard
              </Link>
              <a href="/login">
                <Button
                  variant="outline"
                  className="h-8 rounded-full border-neutral-300 px-4 text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  Log in
                </Button>
              </a>
              <a href="/login">
                <Button
                  className="h-8 rounded-full px-4 text-sm text-white transition-all hover:bg-neutral-700 active:scale-95"
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
          className="ml-auto rounded-full p-2 transition-colors hover:bg-neutral-100 md:hidden"
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
          className="animate-in fade-in slide-in-from-top-2 mt-2 flex flex-col gap-1 rounded-2xl px-4 py-3 shadow-lg md:hidden"
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
              className="rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
            >
              {label}
            </a>
          ))}
          {!isPending && session ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-bold text-neutral-900 transition-colors hover:bg-neutral-100"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await authClient.signOut();
                  setMenuOpen(false);
                }}
                className="rounded-xl px-3 py-2 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-100"
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
                className="rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Log in
              </a>
              <a href="/login" onClick={() => setMenuOpen(false)}>
                <Button
                  className="mt-1 w-full rounded-xl text-sm text-white"
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
