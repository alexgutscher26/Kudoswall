import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@my-better-t-app/auth";
import { Button } from "@my-better-t-app/ui/components/button";
import { Logo } from "@my-better-t-app/ui/components/logo";
import MobileMenu from "./mobile-menu";

const NAV_LINKS = [
  { href: "#features", label: "Benefits" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
] as const;

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="fixed top-6 left-1/2 z-50 w-max max-w-[calc(100%-2rem)] -translate-x-1/2">
      <nav
        className="flex items-center gap-6 rounded-full border border-neutral-200/80 bg-white/90 px-4 py-2 shadow-sm backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-neutral-300"
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <Logo showText size={26} />
        </Link>

        {/* Center: Nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-900"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="hidden items-center gap-2 md:flex">
          {session ? (
            <Link
              href="/dashboard"
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-neutral-900 transition-colors hover:bg-neutral-100"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="h-8 rounded-full px-3 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  className="h-8 rounded-full bg-neutral-900 px-3.5 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:bg-neutral-800 active:scale-95"
                >
                  Start free trial
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Morph */}
        <MobileMenu session={session} navLinks={NAV_LINKS} />
      </nav>
    </header>
  );
}
