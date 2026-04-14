const PRODUCT_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
] as const;

const COMPANY_LINKS = [{ label: "Twitter / X", href: "https://twitter.com" }] as const;

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
              KudosWall
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-neutral-500">
              The easiest way to collect and display beautiful customer testimonials.
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

          {/* Connect */}
          <div>
            <p className="mb-4 text-xs font-semibold tracking-widest text-neutral-400 uppercase">
              Connect
            </p>
            <ul className="flex flex-col gap-2.5">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
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
                  href="/dpa"
                  className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                >
                  DPA (Data Processing)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-neutral-100 pt-8 sm:flex-row">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <p className="text-xs font-bold text-neutral-900">Built by Alex G.</p>
            <p className="max-w-xs text-xs text-neutral-400">
              A solo founder who got tired of ugly testimonial widgets.
            </p>
          </div>
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} KudosWall. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
