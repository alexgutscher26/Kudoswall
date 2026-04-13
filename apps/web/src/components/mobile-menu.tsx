"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
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

      {menuOpen && (
        <div
          className="animate-in fade-in slide-in-from-top-2 absolute top-full left-0 mt-2 flex w-full flex-col gap-1 rounded-2xl px-4 py-3 shadow-lg md:hidden"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(0,0,0,0.09)",
          }}
        >
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
            >
              {label}
            </a>
          ))}
          {session ? (
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
                  window.location.reload();
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
    </>
  );
}
