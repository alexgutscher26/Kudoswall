import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@my-better-t-app/ui/components/button";
import Link from "next/link";
import { Users, Layout, ShieldCheck, Zap, BarChart, Settings, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "The Best Testimonial Tool for Agencies: Manage 5 Brands for $59/mo",
  description: "Manage 5 client brands, white-label everything, $59/mo flat. Built for agencies that collect testimonials for clients — not just themselves.",
  alternates: {
    canonical: "https://kudoswall.org/agencies",
  },
};

const AGENCY_FEATURES = [
  {
    title: "5 Client Workspaces",
    description: "Manage multiple brands from a single login. No more juggling different subscriptions.",
    icon: Users,
  },
  {
    title: "White-Label Everything",
    description: "Remove all KudosWall branding. Your clients see your brand, not ours.",
    icon: Layout,
  },
  {
    title: "Team Collaboration",
    description: "Invite your team members to manage testimonials and widgets without extra per-seat costs.",
    icon: ShieldCheck,
  },
  {
    title: "5-Minute Setup",
    description: "Go from client sign-off to a live Wall of Love in minutes, not hours.",
    icon: Zap,
  },
  {
    title: "Client Analytics",
    description: "Show your value with views and click-through data for every testimonial widget.",
    icon: BarChart,
  },
  {
    title: "Custom branding",
    description: "Match your client's exact brand colors and typography for a native feel.",
    icon: Settings,
  },
];

export default function AgenciesPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="from-primary/10 via-background to-background absolute top-0 left-1/2 -z-10 h-[600px] w-full -translate-x-1/2 bg-linear-to-b opacity-50" />
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="bg-primary/10 border-primary/20 text-primary mb-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-bold tracking-tight">
            FOR MARKETING & WEB AGENCIES
          </div>
          <h1 className="mb-6 text-4xl font-black tracking-tight text-neutral-900 md:text-7xl">
            The agency-friendly <br className="hidden md:block" />
            <span style={{ color: "#e8527a" }}>testimonial tool.</span>
          </h1>
          <p className="text-muted-foreground mb-10 text-xl leading-relaxed md:text-2xl">
            Manage 5 client brands, white-label everything, $59/mo flat. Built for agencies that collect testimonials for clients — not just themselves.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button
                size="lg"
                className="h-16 rounded-full px-10 text-xl font-bold shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-12 md:grid-cols-3">
            {AGENCY_FEATURES.map((feature) => (
              <div key={feature.title} className="flex flex-col gap-4">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl">
                  <feature.icon className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-neutral-50 py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-5xl tracking-tight">One flat price. Five client brands.</h2>
          <p className="text-muted-foreground mb-12 text-lg md:text-xl">
            Stop paying per-seat and per-project fees. KudosWall's Agency plan is designed to be the most cost-effective solution for multi-client management.
          </p>
          <div className="grid gap-8">
            <div className="rounded-3xl border bg-white p-12 shadow-sm text-left">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black">Agency Plan</h3>
                  <p className="text-neutral-500">Perfect for agencies & freelancers</p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black">$59</span>
                  <span className="text-neutral-400">/mo</span>
                </div>
              </div>
              <ul className="grid gap-4 md:grid-cols-2">
                <li className="flex items-center gap-3">
                  <Check className="text-green-500 h-5 w-5" />
                  <span>5 Client Workspaces</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500 h-5 w-5" />
                  <span>White-label Everything</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500 h-5 w-5" />
                  <span>Unlimited Testimonials</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500 h-5 w-5" />
                  <span>Priority VIP Support</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500 h-5 w-5" />
                  <span>Team Collaboration</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="text-green-500 h-5 w-5" />
                  <span>All Widget Layouts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-neutral-900 text-white relative mx-auto max-w-4xl overflow-hidden rounded-[3rem] p-12 shadow-2xl">
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">Ready to look like a pro?</h2>
            <p className="text-neutral-400 mb-10 text-lg md:text-xl">
              Start your agency workspace in under 5 minutes.
            </p>
            <Link href="/login">
              <Button
                size="lg"
                className="bg-white text-neutral-900 hover:bg-neutral-100 h-16 rounded-full px-10 text-xl font-bold"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
