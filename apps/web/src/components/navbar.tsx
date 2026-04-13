import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@my-better-t-app/auth";
import { Button } from "@my-better-t-app/ui/components/button";
import MobileMenu from "./mobile-menu";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it Works" },
  { href: "#pricing", label: "Pricing" },
] as const;

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
          {session ? (
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
              <Link href="/login">
                <Button
                  variant="outline"
                  className="h-8 rounded-full border-neutral-300 px-4 text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  className="h-8 rounded-full px-4 text-sm text-white transition-all hover:bg-neutral-700 active:scale-95"
                  style={{ backgroundColor: "#171717" }}
                >
                  Get started →
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile: Hamburger & Menu */}
        <MobileMenu session={session} navLinks={NAV_LINKS} />
      </nav>
    </header>
  );
}
