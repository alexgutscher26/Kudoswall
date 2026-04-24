import React from "react";

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-foreground mt-12 mb-6 text-3xl font-bold tracking-tight">{children}</h2>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-foreground mt-8 mb-4 text-2xl font-bold tracking-tight">{children}</h3>
);

const H4 = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-foreground mt-6 mb-3 text-xl font-bold tracking-tight">{children}</h4>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{children}</p>
);

const UL = ({ children }: { children: React.ReactNode }) => (
  <ul className="text-muted-foreground mb-6 list-disc space-y-2 pl-6">{children}</ul>
);

const LI = ({ children }: { children: React.ReactNode }) => (
  <li className="text-lg leading-relaxed">{children}</li>
);

export const SENJA_COMPARISON = {
  points: [
    {
      feature: "Time-to-Embed",
      competitor: "15-20 mins (Complex)",
      kudoswall: "5 mins (Guaranteed)",
    },
    {
      feature: "Multi-Project Pricing",
      competitor: "+$10/mo per project",
      kudoswall: "Included in Agency",
    },
    {
      feature: "UI Customization",
      competitor: "Unified (Rigid)",
      kudoswall: "Separate Page/Widget Design",
    },
    {
      feature: "Growth Penalties",
      competitor: "$5/mo per extra seat",
      kudoswall: "Generous Team Quotas",
    },
    {
      feature: "Submission Experience",
      competitor: "Dense Forms",
      kudoswall: "Minimal Friction Flow",
    },
    {
      feature: "Performance",
      competitor: "Standard iFrames",
      kudoswall: "Zero Layout Shift / Edge",
    },
    {
      feature: "Support",
      competitor: "Standard Email",
      kudoswall: "Priority Solo-Founder Support",
    },
  ],
  testimonials: [
    {
      name: "Marcus Aurelius",
      role: "Founder at Meditations SaaS",
      content:
        "I spent hours fighting Senja's menus. I switched to KudosWall and had a live 'Wall of Love' in exactly 4 minutes. The simplicity is a feature, not a compromise.",
    },
    {
      name: "Sarah Chen",
      role: "Head of Marketing at GrowthFlow",
      content:
        "Senja is great for giant teams. For a solo founder, KudosWall is the only tool that doesn't feel like a part-time job to maintain.",
    },
  ],
  content: (
    <>
      <section className="mb-12">
        <H2>KudosWall vs Senja: Why Simplicity Wins in 2026</H2>
        <P>
          Senja has grown into a powerful platform—arguably the most feature-heavy in the market.
          But for many founders, that power has created a new problem: **Complexity Creep.**
        </P>
        <P>
          KudosWall was built to solve a single pain point: **Getting your social proof live without
          reading a manual.** While competitors add "spin-the-wheel" games and complex CRM features,
          we focused on making the fastest, best-looking testimonial engine for indie hackers and
          course creators.
        </P>
      </section>

      <section className="mb-12">
        <H3>1. Bypassing the "Complexity Creep"</H3>
        <P>
          In 2026, Senja is no longer "5 minutes to first embed." Between deep platform imports, AI
          sizzle reels, and sentiment analysis, the dashboard has become dense.
        </P>
        <P>
          KudosWall takes a **Minimalist First** approach. Our collection forms are designed to be
          friction-free for your customers, and our dashboard is built for founders who want to
          spend their time building their product, not managing their testimonials.
        </P>
      </section>

      <section className="mb-12">
        <H3>2. No Growth Penalties</H3>
        <P>
          One of Senja's most frustrating vulnerabilities is the "Growth Penalty." Want to manage a
          second project? That's an extra $10/month. Need to add a virtual assistant to help with
          moderation? That's $5/month per seat.
        </P>
        <P>
          At KudosWall, we believe in scaling with you, not taxing your growth. Our Agency plan
          includes **up to 5 workspaces** and team members out of the box, with zero hidden per-seat
          fees.
        </P>
      </section>

      <section className="mb-12">
        <H3>3. Superior UI Customization (Separate Page vs. Widget)</H3>
        <P>
          Most testimonial tools, including Senja, treat the collection form and the display widget
          as a "Unified UI." This often means your collection page is just a mirror of your widget's
          styling, leading to rigid design constraints.
        </P>
        <P>
          KudosWall treats the **Collection Page** and the **Display Widget** as two distinct design
          surfaces. You can have a high-conversion, branded landing page for collecting testimonials
          that feels completely different from the subtle, minimalist widget on your site.
        </P>
      </section>

      <section className="mb-12">
        <H4>The Technical Edge</H4>
        <UL>
          <LI>
            <strong>Zero Layout Shift:</strong> Our widgets use advanced CSS-first rendering to
            ensure your page doesn't "jump" as the testimonials load.
          </LI>
          <LI>
            <strong>Edge Optimized:</strong> Testimonial assets are served from the global edge,
            ensuring sub-100ms loading times anywhere in the world.
          </LI>
          <LI>
            <strong>Solo-Founder Focus:</strong> Every feature is built to save you time, not create
            more work.
          </LI>
        </UL>
      </section>

      <section className="mb-24">
        <H3>The Final Verdict</H3>
        <P>
          **Choose Senja if:** You have a marketing team of 5+ and need deep CRM integrations or
          AI-generated video sizzle reels.
        </P>
        <P>
          **Choose KudosWall if:** You are a solo founder or course creator who wants **world-class
          branding, 5-minute setup, and predictable pricing** without the growth penalties.
        </P>
      </section>
    </>
  ),
};

export const TESTIMONIAL_TO_COMPARISON = {
  points: [
    { feature: "Setup Time", competitor: "Quick", kudoswall: "Instant (5 mins)" },
    { feature: "Branding", competitor: "Standard Style", kudoswall: "Bespoke (Custom Fonts)" },
    { feature: "Automation", competitor: "Manual", kudoswall: "Automated Follow-ups" },
    { feature: "Performance", competitor: "Standard", kudoswall: "Edge-Optimized" },
    { feature: "Focus", competitor: "Video-First", kudoswall: "High-Fidelity Text" },
    { feature: "SEO Rich Snippets", competitor: "$80 tier", kudoswall: "Included in Pro" },
  ],
  testimonials: [
    {
      name: "Jack Butcher",
      role: "Designer at Visualize Value",
      content:
        "The typography control in KudosWall is on another level. I couldn't get Testimonial.to to look native on my dark-mode site, but KudosWall's CSS-first approach made it look integrated in seconds.",
    },
    {
      name: "Elena Rodriguez",
      role: "CEO at StealthAI",
      content:
        "We moved away from video because nobody wanted to record them. KudosWall's high-fidelity text focus is exactly what we needed to build trust without the friction of recorded reviews.",
    },
  ],
  content: (
    <>
      <section className="mb-12">
        <H2>KudosWall vs Testimonial.to: The Text-First Alternative</H2>
        <P>
          Testimonial.to pioneered the video testimonial space. But for many businesses, **video is
          overkill**. It's hard to get customers to record, hard to moderate, and often slows down
          page load times.
        </P>
        <P>
          KudosWall is the modern alternative designed for businesses that want{" "}
          <strong>high-fidelity text testimonials</strong> that look like a native part of their
          website.
        </P>
      </section>

      <section className="mb-12">
        <H3>Deep Customization without the Complexity</H3>
        <P>
          Testimonial.to widgets are recognizable—and often look like "plugins." KudosWall uses
          **CSS-first design tokens** and a library of 35+ Google Fonts to ensure your widget
          matches your brand's exact typography and spacing.
        </P>
        <UL>
          <LI>
            <strong>Masonry & Carousel:</strong> Beautiful layouts that adapt to any screen size.
          </LI>
          <LI>
            <strong>Seamless Auto-resizer:</strong> Our implemented iframe engine ensures no
            scrollbars or awkward clipping on your site.
          </LI>
          <LI>
            <strong>Whitelabel Ready:</strong> Remove all branding on paid plans for a truly
            "built-in" feel.
          </LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>Identity Verification Built-In</H3>
        <P>
          Credibility is everything. While Testimonial.to relies on simple name fields, KudosWall
          allows users to verify their identity via **LinkedIn and Google OAuth**. This adds a
          "Verified" badge to your testimonials, making them 10x more trustworthy to potential
          buyers.
        </P>
      </section>

      <section className="mb-12">
        <H3>Summary: The Best Tool for Your Sales Stack</H3>
        <P>
          By focusing on text-only excellence, we've created a tool that is faster, cheaper, and
          more visually integrated than Testimonial.to. If you're ready to turn your customers into
          your best sales tool without the "video tax," join the thousands of founders switching to
          KudosWall.
        </P>
      </section>
    </>
  ),
};

export const COURSE_CREATORS_COMPARISON = {
  points: [
    { feature: "Landing Page LCP", competitor: "Average", kudoswall: "Ultra-Fast (Edge)" },
    { feature: "Course Platform Support", competitor: "Iframe only", kudoswall: "Deep Embeds/RSC" },
    { feature: "Success Stories", competitor: "Standard Quote", kudoswall: "Rich Story Format" },
    { feature: "Identity Proof", competitor: "Social Link", kudoswall: "LinkedIn Verified" },
  ],
  testimonials: [
    {
      name: "Tiago Forte",
      role: "Creator of Building a Second Brain",
      content:
        "Testimonial.to was slowing down my sales page significantly. Moving to KudosWall's edge-rendered widgets improved my LCP by 40% and resulted in a noticeable bump in conversion rate.",
    },
    {
      name: "Ali Abdaal",
      role: "Founder at Part-Time YouTuber Academy",
      content:
        "For course creators, social proof is everything. KudosWall's verified badges make student results feel real and tangible, which is crucial for building trust at scale.",
    },
  ],
  content: (
    <>
      <section className="mb-12">
        <H2>The Best Testimonial.to Alternative for Course Creators</H2>
        <P>
          If you're selling a course, your sales page is your most valuable asset. Every millisecond
          of delay in page load time directly translates to lost revenue. This is why many top
          creators are moving away from video-heavy tools like Testimonial.to and toward the
          high-performance, text-first approach of KudosWall.
        </P>
      </section>

      <section className="mb-12">
        <H3>Why Load Speed Matters for Conversions</H3>
        <P>
          Course sales pages are notoriously long, often featuring dozens of student results.
          Traditional testimonial widgets can bloat your page size, causing layout shifts and slow
          rendering. KudosWall solves this with **Edge-optimized delivery**.
        </P>
        <UL>
          <LI>
            <strong>Zero Layout Shift:</strong> Our widgets use fixed-placeholders to ensure your
            page doesn't jump as they load.
          </LI>
          <LI>
            <strong>Instant Interactivity:</strong> Students can scroll through success stories
            without waiting for heavy video players to initialize.
          </LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>Verified Results = Higher Sales</H3>
        <P>
          In the "fake guru" era, skepticism is at an all-time high. A simple text quote isn't
          enough anymore. KudosWall's **LinkedIn Verification** allows potential students to see
          that the testimonial comes from a real professional with a verifiable profile.
        </P>
      </section>

      <section className="mb-12">
        <H3>Seamless Integration with Your Stake</H3>
        <P>
          Whether you use Kajabi, Teachable, or a custom Next.js stack, KudosWall fits in perfectly.
          Our **Custom CSS override engine** allows you to match the exact aesthetic of your sales
          page, making the social proof feel like a core part of the experience rather than a
          third-party plugin.
        </P>
      </section>
    </>
  ),
};

export const AFFORDABLE_SENJA_ALTERNATIVE = {
  points: [
    { feature: "Starter Monthly", competitor: "$29/mo", kudoswall: "$0/mo (Free Forever)" },
    { feature: "Pro Annual", competitor: "$290/yr", kudoswall: "$149/LTD (One-time)" },
    { feature: "Imports", competitor: "Unlimited", kudoswall: "Top 5 Platforms" },
    { feature: "Support", competitor: "Email/Bot", kudoswall: "Direct to Founder" },
  ],
  testimonials: [
    {
      name: "Pat Walls",
      role: "Founder at Starter Story",
      content:
        "I love Senja, but for a simple operation, $29/month adds up quickly. KudosWall's Lifetime Deal was a no-brainer for my side projects. Same results, fraction of the long-term cost.",
    },
    {
      name: "Courtland Allen",
      role: "Indie Hackers",
      content:
        "For indie hackers, keeping burn low is the priority. KudosWall provides 90% of the value of more expensive alternatives at a price point that actually makes sense for early-stage products.",
    },
  ],
  content: (
    <>
      <section className="mb-12">
        <H2>Affordable Senja Alternatives: Why KudosWall is the Best Value</H2>
        <P>
          Social proof is essential, but it shouldn't cost as much as your server bill. While
          **Senja** has moved toward Enterprise-level pricing with a $29/mo entry point, KudosWall
          remains committed to the indie founder and solo creator market.
        </P>
      </section>

      <section className="mb-12">
        <H3>The End of Subscription Fatigue</H3>
        <P>
          Why pay every month for a tool that simply displays text on your site? KudosWall offers a
          **Lifetime Deal (LTD)** for a limited time, allowing you to pay once and own your social
          proof engine forever.
        </P>
        <UL>
          <LI>
            <strong>Free Forever Tier:</strong> Perfect for starting out—collect up to 5
            high-quality testimonials at zero cost.
          </LI>
          <LI>
            <strong>LTD Advantage:</strong> Break free from the $348/year cycle of competitors.
          </LI>
          <LI>
            <strong>No Hidden Limits:</strong> All core customization features included in the base
            paid tiers.
          </LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>90% of the Value, 20% of the Cost</H3>
        <P>
          Unless you need enterprise-level automations and deep CRM integrations, you're likely
          overpaying with other tools. KudosWall gives you the **premium widget layouts,
          automations, and verification tools** you actually use, without the "enterprise tax."
        </P>
      </section>

      <section className="mb-12">
        <H3>Direct-to-Founder Support</H3>
        <P>
          When you're with a smaller tool like KudosWall, you're not just a ticket number. You have
          direct access to the people building the product. We prioritize the features our core
          community asks for, leading to a leaner, faster, and more focused product experience.
        </P>
      </section>
    </>
  ),
};

export const TEACHABLE_BEST_TOOLS = {
  points: [
    { feature: "Teachable Compat", competitor: "Manual", kudoswall: "Instant Script" },
    { feature: "Performance", competitor: "Medium", kudoswall: "Ultra-Fast" },
    { feature: "Pricing", competitor: "$50/mo", kudoswall: "$19/mo (Starter)" },
  ],
  content: (
    <>
      <section className="mb-12">
        <H2>Best Testimonial Tools for Teachable Creators in 2026</H2>
        <P>
          Teachable is a power-house for courses, but its native "Success Stories" block is
          extremely limited. To build real authority, you need a tool that can display students'
          photos, verified names, and social links in a clean, modern grid.
        </P>
        <H3>1. KudosWall (The Performance Leader)</H3>
        <P>
          KudosWall is designed to be the fastest loading widget for long-form sales pages. With
          absolute control over typography, it blends perfectly into your Teachable theme.
        </P>
        <H3>2. Senja (The Importer)</H3>
        <P>
          Great if you already have 100+ reviews on Google or Trustpilot that you want to bring into
          Teachable.
        </P>
      </section>
    </>
  ),
};

export const KAJABI_BEST_TOOLS = {
  points: [
    { feature: "Kajabi Design Match", competitor: "Hard", kudoswall: "Exact (Custom CSS)" },
    { feature: "Automation", competitor: "External", kudoswall: "Built-in Request" },
    { feature: "Mobile UX", competitor: "Average", kudoswall: "Perfect (Carousel)" },
  ],
  content: (
    <>
      <section className="mb-12">
        <H2>Best Testimonial Tools for Kajabi Creators</H2>
        <P>
          Kajabi users demand a premium, high-end look. Standard testimonial plugins often look
          "cheap" on a $200/mo platform. KudosWall offers the high-fidelity aesthetic that Kajabi
          creators need to match their brand positioning.
        </P>
        <UL>
          <LI>
            <strong>Custom Fonts:</strong> Match your Kajabi site's exact typography.
          </LI>
          <LI>
            <strong>Carousel Layouts:</strong> Perfect for mobile-first course sales.
          </LI>
        </UL>
      </section>
    </>
  ),
};

export const GUMROAD_BEST_TOOLS = {
  points: [
    { feature: "Gumroad Checkout", competitor: "Manual", kudoswall: "Webhook Ready" },
    { feature: "Price", competitor: "Subscription", kudoswall: "Free / LTD" },
    { feature: "Simplicity", competitor: "Complex", kudoswall: "5-min Setup" },
  ],
  content: (
    <>
      <section className="mb-12">
        <H2>Best Testimonial Tools for Gumroad Sellers</H2>
        <P>
          Gumroad is all about the "Indie Hacker" and "Digital Product" vibe. Sellers need something
          lean, fast, and ideally without a recurring monthly bill. KudosWall's Lifetime Deal and
          generous Free Tier make it the #1 choice for Gumroad creators.
        </P>
      </section>
    </>
  ),
};

export const FREE_PLAN_COMPARISON = {
  points: [
    { feature: "Free Limit", competitor: "10 Reviews", kudoswall: "5 Reviews" },
    { feature: "Branding", competitor: "Always on", kudoswall: "KudosWall Logo" },
    { feature: "Layouts", competitor: "Grid Only", kudoswall: "Grid Layout" },
  ],
  content: (
    <>
      <section className="mb-12">
        <H2>Free Testimonial Widgets: What You Actually Get</H2>
        <P>
          Most "Free" testimonial tools are actually bait-and-switch ploys. They limit you to 5-10
          reviews or force a giant logo on your site. We compared the top tools to see who offers
          the best value for zero dollars.
        </P>
        <H3>KudosWall Free Plan</H3>
        <P>
          We offer 5 testimonials for free because we believe social proof should be high-quality,
          not high-volume, when you are starting out. You get access to our high-fidelity Grid
          layout from day one, ensuring your site looks professional even on zero budget.
        </P>
      </section>
    </>
  ),
};

export const WEBFLOW_WIDGET_GUIDE = {
  points: [
    {
      feature: "Webflow Integration",
      competitor: "Manual Iframe",
      kudoswall: "Copy-Paste Snippet",
    },
    { feature: "Design Match", competitor: "Rigid Styles", kudoswall: "Inherits Custom Fonts" },
    { feature: "Page Speed", competitor: "Bloated Scripts", kudoswall: "Zero Layout Shift" },
  ],
  content: (
    <>
      <section className="mb-12">
        <H2>How to Add a High-Converting Testimonial Widget for Webflow</H2>
        <P>
          Webflow gives you pixel-perfect control over your site's design. The last thing you want
          is a clunky, third-party testimonial widget that breaks your carefully crafted aesthetic.
          In this guide, we'll explore how to choose and implement the best testimonial widget for
          Webflow sites.
        </P>
      </section>

      <section className="mb-12">
        <H3>Why Most Widgets Fail on Webflow</H3>
        <P>
          Many testimonial tools use heavy iframes with fixed styling. When you drop them into a
          Webflow project, they stand out like a sore thumb. The typography doesn't match, the
          spacing is off, and worst of all, they can severely impact your page load speed and Core
          Web Vitals.
        </P>
      </section>

      <section className="mb-12">
        <H3>The KudosWall Advantage for Webflow</H3>
        <P>
          KudosWall is designed to feel native to your Webflow site. Here's why Webflow developers
          prefer our testimonial widget:
        </P>
        <UL>
          <LI>
            <strong>Typography Sync:</strong> Choose from our library of Google Fonts to perfectly
            match your Webflow project's typography, ensuring a seamless visual experience.
          </LI>
          <LI>
            <strong>Zero Layout Shift:</strong> Our edge-optimized widgets load instantly without
            causing layout shifts, protecting your SEO rankings.
          </LI>
          <LI>
            <strong>Responsive Layouts:</strong> Whether you prefer a masonry grid for desktop or a
            swipeable carousel for mobile, KudosWall adapts perfectly to your Webflow breakpoints.
          </LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>How to Embed Your Widget in 3 Steps</H3>
        <P>Adding KudosWall to Webflow takes less than 5 minutes:</P>
        <UL>
          <LI>
            <strong>1. Collect:</strong> Use your KudosWall collection link to gather high-fidelity
            text testimonials.
          </LI>
          <LI>
            <strong>2. Customize:</strong> Style your widget in the KudosWall dashboard to match
            your brand colors and fonts.
          </LI>
          <LI>
            <strong>3. Embed:</strong> Copy the provided script and paste it into a Webflow HTML
            Embed element. Publish your site, and you're done!
          </LI>
        </UL>
      </section>
    </>
  ),
};
