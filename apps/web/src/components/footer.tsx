


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
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
            <a
              href="/"
              className="text-xl font-bold text-neutral-900"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              TestimonialWall
            </a>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
              The easiest way for small businesses to collect and display customer testimonials.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4">
              Product
            </p>
            <ul className="flex flex-col gap-2.5">
              {PRODUCT_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4">
              Company
            </p>
            <ul className="flex flex-col gap-2.5">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal — uses real routes so <Link> is correct here */}
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-4">
              Legal
            </p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href="/privacy"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Privacy policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Terms of service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Cookie policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 border-t border-neutral-100">
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
