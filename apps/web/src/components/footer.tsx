import Link from "next/link";

const PRODUCT_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Free Plan", href: "/free" },
  { label: "Docs", href: "https://kudoswall.mintlify.app/introduction" },
] as const;

const ALTERNATIVES_LINKS = [
  { label: "Compare All", href: "/vs" },
  { label: "vs Senja", href: "/vs/senja" },
  { label: "vs Testimonial.to", href: "/vs/testimonial-to" },
  { label: "vs Vouch", href: "/vs/vouch" },
] as const;

const PLATFORM_LINKS = [
  { label: "For Agencies", href: "/agencies" },
  { label: "For Carrd", href: "/free-testimonials-for/carrd" },
  { label: "For Beehiiv", href: "/free-testimonials-for/beehiiv" },
  { label: "For Webflow", href: "/free-testimonials-for/webflow" },
  { label: "View All Platforms", href: "/free-testimonials-for" },
] as const;

const RESOURCES_LINKS = [
  { label: "Free Testimonial Widgets", href: "/blog/free-testimonial-widget-comparison" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "DPA (Data Processing)", href: "/dpa" },
  { label: "Security", href: "/security/responsible-disclosure" },
] as const;

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden border-t border-neutral-200 px-4 py-16"
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
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-16 grid grid-cols-2 gap-10 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Link
              href="/"
              className="text-2xl font-bold text-neutral-900"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              KudosWall
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-neutral-500">
              The testimonial tool for small businesses that just want their wall live.
            </p>
            <a
              href="https://www.scrolllaunch.com/products/kudoswall?utm_source=badge&utm_medium=embed&utm_campaign=kudoswall&ref=scrolllaunch"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block transition-all"
            >
              <img
                src="https://www.scrolllaunch.com/api/badge/kudoswall"
                alt="Featured on ScrollLaunch"
                width={220}
                height={48}
                loading="lazy"
                className="h-auto w-44"
              />
            </a>
            <a
              href="https://www.producthunt.com/products/kudoswall?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-kudoswall-2"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block transition-all"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1133229&theme=light&t=1777492433080"
                alt="KudosWall - Turn happy customers into your best sales tool. | Product Hunt"
                width={220}
                height={48}
                className="h-auto w-44"
              />
            </a>
          </div>

          {/* Product */}
          <div>
            <p className="mb-5 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
              Product
            </p>
            <ul className="flex flex-col gap-3">
              {PRODUCT_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Alternatives */}
          <div>
            <p className="mb-5 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
              Alternatives
            </p>
            <ul className="flex flex-col gap-3">
              {ALTERNATIVES_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platforms */}
          <div>
            <p className="mb-5 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
              Use Cases
            </p>
            <ul className="flex flex-col gap-3">
              {PLATFORM_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Resources */}
          <div>
            <p className="mb-5 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
              Resources
            </p>
            <ul className="flex flex-col gap-3">
              {RESOURCES_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-8 border-t border-neutral-100 pt-10 sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
              AG
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-bold text-neutral-900">Crafted by Alex G.</p>
              <p className="text-[10px] text-neutral-400">Solo Founder • Software Engineer</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="https://x.com/snackforcode"
              className="text-xs text-neutral-400 transition-colors hover:text-neutral-900"
            >
              Twitter
            </Link>
            <p className="text-[10px] font-medium text-neutral-300">
              © {new Date().getFullYear()} KudosWall. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
