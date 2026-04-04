const PRODUCT_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Widget preview", href: "#preview" },
] as const;

const COMPANY_LINKS = [
  { label: "About", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
] as const;

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden border-t border-neutral-200 px-4 py-14"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Dot-grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-12 grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
            <a
              href="/"
              className="text-xl font-bold text-neutral-900"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              TestimonialWall
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-neutral-500">
              The easiest way for small businesses to collect and display customer testimonials.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="mb-4 text-xs font-semibold tracking-widest text-neutral-400 uppercase">
              Product
            </p>
            <ul className="flex flex-col gap-2.5">
              {PRODUCT_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="mb-4 text-xs font-semibold tracking-widest text-neutral-400 uppercase">
              Company
            </p>
            <ul className="flex flex-col gap-2.5">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal — uses real routes so <Link> is correct here */}
          <div>
            <p className="mb-4 text-xs font-semibold tracking-widest text-neutral-400 uppercase">
              Legal
            </p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href="/privacy"
                  className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  Privacy policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  Terms of service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  Cookie policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-neutral-100 pt-8 sm:flex-row">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} TestimonialWall. All rights reserved.
          </p>
          <p className="text-xs text-neutral-400">
            Built for small business owners who mean business.
          </p>
        </div>
      </div>
    </footer>
  );
}
