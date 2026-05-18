import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@my-better-t-app/ui/components/button";
import Link from "next/link";
import { Check, Zap, PlayCircle, X } from "lucide-react";
import type { PlatformPageData } from "@/lib/platform-pages";

interface FreePlatformTemplateProps {
  platform: PlatformPageData;
}

export default function FreePlatformTemplate({ platform }: FreePlatformTemplateProps) {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="from-primary/5 via-background to-background absolute top-0 left-1/2 -z-10 h-[500px] w-full -translate-x-1/2 bg-linear-to-b" />
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <div className="bg-primary/10 border-primary/20 text-primary mb-8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium">
            New: 50 Free Testimonials + Video
          </div>
          <h1 className="from-foreground to-foreground/70 mb-6 bg-linear-to-r bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-7xl">
            {platform.heroTitle}
          </h1>
          <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-xl leading-relaxed md:text-2xl">
            The most generous testimonial tool for {platform.name} users. Collect 50 testimonials
            for free, including high-fidelity video recording.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button
                size="lg"
                className="shadow-primary/20 h-16 rounded-full px-10 text-xl font-bold shadow-xl transition-all hover:scale-105"
              >
                Start Free on {platform.name}
              </Button>
            </Link>
            <p className="text-muted-foreground text-sm">No credit card required</p>
          </div>
        </div>
      </section>

      {/* 2. What's actually free + what unlocks Pro */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-muted/10 mx-auto max-w-4xl rounded-3xl border p-12">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">Transparent Pricing</h2>
              <p className="text-muted-foreground">
                We believe in activation-led growth, not paywalls.
              </p>
            </div>
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                  <Check className="text-green-500" /> What's actually free
                </h3>
                <ul className="text-muted-foreground space-y-4">
                  <li>50 Testimonials (Text + Video)</li>
                  <li>Native Video Recording Flow</li>
                  <li>Masonry Grid Layout</li>
                  <li>Unlimited Collection Links</li>
                  <li>Edge-Optimized Widget</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                  <Zap className="text-primary" /> What unlocks Pro
                </h3>
                <ul className="text-muted-foreground space-y-4">
                  <li>Remove KudosWall Branding</li>
                  <li>Custom Domains</li>
                  <li>All 4 Layouts (Carousel, etc.)</li>
                  <li>Advanced Tag Filtering</li>
                  <li>Custom CSS & Branding</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 5-minute setup on [Platform] */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-16 text-center text-3xl font-bold">
              5-Minute Setup on {platform.name}
            </h2>
            <div className="grid gap-8">
              {platform.setupSteps.map((step, i) => (
                <div key={i} className="bg-background flex gap-6 rounded-3xl border p-8 shadow-sm">
                  <div className="bg-primary text-primary-foreground flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why [Platform] users particularly benefit */}
      <section className="py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-8 text-3xl font-bold">Why {platform.name} Users Choose KudosWall</h2>
          <p className="text-muted-foreground text-xl leading-relaxed">{platform.useCaseFraming}</p>
        </div>
      </section>

      {/* 5. Live example on a real [Platform] site */}
      <section className="bg-primary/5 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-12 text-3xl font-bold">See it in Action</h2>
          <div className="bg-muted mx-auto aspect-video max-w-4xl overflow-hidden rounded-3xl border-8 shadow-2xl">
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-4">
              <PlayCircle className="h-16 w-16 opacity-20" />
              <p className="font-medium">Live Widget Preview on {platform.name}</p>
            </div>
          </div>
          <p className="text-muted-foreground mt-8 text-sm italic">
            Captured from a real customer wall on {platform.name}
          </p>
        </div>
      </section>

      {/* 6. Comparison Table */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold">How we compare</h2>
            <div className="bg-background overflow-hidden rounded-3xl border">
              <table className="w-full border-collapse">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="p-6 text-left">Feature</th>
                    <th className="p-6 text-center">{platform.name} Native</th>
                    <th className="p-6 text-center">Other Tools</th>
                    <th className="bg-primary/5 text-primary p-6 text-center font-bold">
                      KudosWall
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-6 font-medium">Free Limit</td>
                    <td className="p-6 text-center text-slate-600 dark:text-slate-400">
                      Very Limited
                    </td>
                    <td className="p-6 text-center text-slate-600 dark:text-slate-400">10-15</td>
                    <td className="bg-primary/5 text-primary p-6 text-center font-bold italic">
                      50 + Video
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-6 font-medium">Video Recording</td>
                    <td className="flex justify-center p-6 text-center">
                      <X className="text-destructive" />
                    </td>
                    <td className="flex justify-center p-6 text-center">
                      <X className="text-destructive" />
                    </td>
                    <td className="bg-primary/5 flex justify-center p-6 text-center">
                      <Check className="text-primary" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-6 font-medium">Setup Time</td>
                    <td className="p-6 text-center text-slate-600 dark:text-slate-400">Manual</td>
                    <td className="p-6 text-center text-slate-600 dark:text-slate-400">15 mins</td>
                    <td className="bg-primary/5 text-primary p-6 text-center font-bold italic">
                      5 mins
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ specific to free + [Platform] */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-8">
            {platform.faq.map((item, i) => (
              <div key={i} className="bg-background rounded-2xl border p-8 shadow-sm">
                <h3 className="mb-4 text-xl font-bold">{item.q}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA + signup */}
      <section className="py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-foreground text-background relative mx-auto max-w-3xl overflow-hidden rounded-[3rem] p-12 shadow-2xl">
            <div className="bg-primary/20 absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">Start free, no card</h2>
            <p className="text-muted-foreground mb-10 text-lg md:text-xl">
              Get your first {platform.name} testimonial in 5 minutes.
            </p>
            <Link href="/login">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-16 rounded-full px-10 text-xl font-bold"
              >
                Join KudosWall Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
