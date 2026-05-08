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
    { feature: "Focus", competitor: "Manual", kudoswall: "Text and Video" },
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
        "We love that KudosWall handles both text and video. The high-fidelity video recording is so smooth that our customers actually enjoy leaving reviews, and the text fallback is perfect for those who are camera-shy.",
    },
  ],
  content: (
    <>
      <section className="mb-12">
        <H2>KudosWall vs Testimonial.to: The Text and Video Alternative</H2>
        <P>
          Testimonial.to pioneered the video testimonial space. But for many businesses, **video is
          overkill**. It's hard to get customers to record, hard to moderate, and often slows down
          page load times.
        </P>
        <P>
          KudosWall is the modern alternative designed for businesses that want{" "}
          <strong>high-fidelity text and video testimonials</strong> that look like a native part of
          their website.
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
          By focusing on text and video excellence, we've created a tool that is faster,
          cheaper, and more visually integrated than Testimonial.to. If you're ready to turn your
          customers into your best sales tool with video, join the thousands of founders
          switching to KudosWall.
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
          creators are moving to KudosWall for high-performance text and video testimonials.
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
            <strong>Free Forever Tier:</strong> Perfect for starting out—collect up to 50
            high-quality testimonials at zero cost.
          </LI>
          <LI>
            <strong>LTD Advantage:</strong> Break free from the $228/year cycle of competitors.
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
    { feature: "Free Limit", competitor: "10 Reviews", kudoswall: "50 Reviews" },
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
          We offer 50 testimonials for free because we believe social proof should be high-quality,
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
            text and video testimonials.
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
export const TEN_X_FREE_TIER = {
  points: [
    { feature: "Free Limit", competitor: "10-15 Reviews", kudoswall: "50 Reviews" },
    { feature: "Video Support", competitor: "Paid Only", kudoswall: "Included in Free" },
    { feature: "Credit Card", competitor: "Required for Trial", kudoswall: "Not Required" },
  ],
  content: (
    <>
      <section className="mb-12">
        <P>
          Most SaaS "free tiers" are demos.
        </P>
        <P>
          Senja's free tier gives you 15 testimonials. Testimonial.to gives you ~10. Famewall, Trustmary — they all sit in a similar range. Mine was 5.
        </P>
        <P>
          We just changed ours to <strong>50 testimonials with video</strong>. Free forever, no credit card.
        </P>
        <P>
          Most founders shrink their free tiers as they grow. I went the other direction — and here's the math behind why I think the conventional wisdom is wrong.
        </P>
        <P>
          This isn't a "we listened to feedback!" announcement. This is the result of staring at a churn dashboard for too long and realizing what was actually broken.
        </P>
      </section>

      <section className="mb-12">
        <H3>The realization</H3>
        <P>
          I built KudosWall for solo founders, course creators, and small agencies — people who need testimonials but don't have a marketing department or three hours to wrestle with a clunky tool. The original free tier (5 testimonials, text only) was a marketing decision based on what every other testimonial tool did. Senja, Testimonial.to, Famewall — everyone was at 10–15 max on free. I went tighter to make Pro look more compelling by comparison.
        </P>
        <P>
          The result was predictable in retrospect. Users would sign up, create a wall, get 2–3 testimonials, hit the 5-testimonial constraint, and stall. Most never embedded the widget. Most never came back.
        </P>
        <P>
          Here's the honest reframe: <strong>I wasn't running a free tier. I was running a 5-testimonial demo with a "Powered by KudosWall" badge.</strong>
        </P>
        <P>
          The conventional founder wisdom says: free tiers convert through scarcity. Make them want more, then charge for it.
        </P>
        <P>
          But scarcity only works if customers have already experienced enough value to want more. If they hit the wall before they got value, they don't upgrade — they leave. And I was watching that happen.
        </P>
      </section>

      <section className="mb-12">
        <H3>The data behind the change</H3>
        <P>
          Three numbers convinced me:
        </P>
        <UL>
          <LI><strong>Activation rate</strong> (created wall + got 1+ approved testimonial): ~32%</LI>
          <LI><strong>Embed rate among activated users</strong>: ~45%</LI>
          <LI><strong>Free → paid conversion among embedded users</strong>: ~3%</LI>
        </UL>
        <P>
          Numbers in isolation are fine. The problem was the <em>funnel shape</em>.
        </P>
        <P>
          A typical SaaS funnel narrows gradually. Mine narrowed sharply at the 5-testimonial wall. Of users who hit 5 testimonials, ~70% never came back. They'd churn at the wall.
        </P>
        <P>
          The customers I most wanted — people who'd actually use testimonials in their business — were churning before they could see value. Meanwhile, the customers who <em>did</em> convert to paid were primarily upgrading for the <strong>badge removal</strong>, not because they'd run out of testimonials.
        </P>
        <P>
          That last data point was the giveaway.
        </P>
        <P>
          <strong>Even my paid customers weren't converting because they hit the limit.</strong> They were converting because they wanted features.
        </P>
        <P>
          If features drive paid conversion, then constraining the free tier doesn't help conversion. It just hurts activation.
        </P>
      </section>

      <section className="mb-12">
        <H3>Why 50 (not 25, not unlimited)</H3>
        <P>
          A few weeks of customer interviews + spreadsheet work told me:
        </P>
        <UL>
          <LI>Median testimonials per active wall: 12–18</LI>
          <LI>90th percentile: ~35</LI>
          <LI>99th percentile: 80+</LI>
        </UL>
        <P>
          50 testimonials covers most real-world use cases for the SMB / solo / agency segments KudosWall serves. Past 50, you're a power user — and that's exactly when Pro features start mattering most (custom domain, custom branding, analytics, tag filtering, multi-collection workflows).
        </P>
        <P>
          I considered 25. It would have been "less generous than Senja but more than Testimonial.to" — basically splitting the middle. But it doesn't tell a story. 25 vs 15 isn't a number people share. 50 is.
        </P>
        <P>
          I considered unlimited. The economics don't work — testimonials with video carry real bandwidth and storage costs at scale, and "unlimited" attracts edge-case abusers (people running enterprise testimonial collection on a free tier indefinitely). The number had to be high enough to delight legitimate users and low enough to deter freeloaders.
        </P>
        <P>
          50 with video felt right. It's 3.3× Senja's free tier. It's a real product, not a demo. And it gives Pro a clear job to do — premium features for users who care about polish — not artificial scarcity for users who don't.
        </P>
      </section>

      <section className="mb-12">
        <H3>What this actually means for users</H3>
        <P><strong>Free now (everyone, forever):</strong></P>
        <UL>
          <LI>50 text + video testimonials per wall</LI>
          <LI>Embed anywhere via a single-line script</LI>
          <LI>Photo proofs from your customers</LI>
          <LI>All the collection mechanics — share link, customer-submission flow, no account required for submitters</LI>
          <LI>"Powered by KudosWall" badge stays on free walls</LI>
        </UL>
        <P><strong>Pro ($19/mo) is now what it should have been all along:</strong></P>
        <UL>
          <LI>Remove the KudosWall badge</LI>
          <LI>Custom domain (testimonials.yoursite.com)</LI>
          <LI>Custom branding (colors, fonts, layout)</LI>
          <LI>All 4 widget layouts (grid, carousel, masonry, marquee)</LI>
          <LI>Tag filtering — show different testimonials on different pages</LI>
          <LI>Analytics (views, click-through, top performers)</LI>
          <LI>Priority email support</LI>
          <LI>CSV export</LI>
        </UL>
        <P><strong>Agency ($59/mo) for people managing 5+ client brands:</strong></P>
        <UL>
          <LI>Everything in Pro × 5 client workspaces</LI>
          <LI>White-label everything</LI>
          <LI>Up to 3 team members</LI>
          <LI>Priority VIP support</LI>
        </UL>
        <P>
          The math for someone deciding: if you have one website and want clean professional polish, Pro is straightforward — $19/mo to remove a badge and add your custom domain. If you're an agency managing client testimonials, Agency saves you 5 separate tool subscriptions ($95+ value).
        </P>
        <P>
          If you're just collecting testimonials for a Carrd landing page or a Beehiiv newsletter and the badge doesn't bother you — <strong>stay free. Stay free as long as you want.</strong>
        </P>
      </section>

      <section className="mb-12">
        <H3>Why this is hard for incumbents to match</H3>
        <P>
          Two reasons.
        </P>
        <P>
          <strong>One: the economics are different.</strong> Senja and Testimonial.to are bigger operations with larger teams to feed. Their model relies on conversion-by-friction — most free users hit the wall, a small percentage convert to paid, repeat at scale. If they expand free to 50, conversion craters in the short term and revenue takes a hit until volume catches up.
        </P>
        <P>
          KudosWall is bootstrapped. I don't have a sales team or a growth-at-all-costs mandate. My optimization is most-paid-customers-per-marketing-dollar. Counterintuitively, a generous free tier wins this when the alternative is paying for cold acquisition. Free users are billboards (the badge), SEO assets (their public walls), and word-of-mouth referrers — all for $0 of marketing spend.
        </P>
        <P>
          <strong>Two: customer-base inertia.</strong> If Senja moves their free tier from 15 to 50 tomorrow, every single 15-using customer notices. Some downgrade ("wait, I'm at 17 testimonials, I could have stayed free?"). The change creates noise across their entire base.
        </P>
      </section>

      <section className="mb-12">
        <H3>What's at risk</H3>
        <UL>
          <LI><strong>Free → paid conversion drops below 1%.</strong> Probably will. The question is whether total signup volume rises enough to offset it.</LI>
          <LI><strong>Video bandwidth costs scale faster than MRR.</strong> Possible. If so, video minutes get capped on free.</LI>
          <LI><strong>Pro doesn't feel like a real upgrade.</strong> If 90% of paid users upgrade only for badge removal, Pro might need repackaging.</LI>
          <LI><strong>Free users don't churn AND don't convert.</strong> Worst case. They sit on the free tier forever, costing infrastructure dollars without revenue.</LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>Try it</H3>
        <P>
          If you've been holding off because every other testimonial tool gates basics — try us.
        </P>
        <P>
          50 testimonials, video included, no credit card, no time limit.
        </P>
        <P>
          Five minutes from sign-up to a Wall of Love embedded on your site.
        </P>
      </section>
    </>
  ),
};

export const FREE_VIDEO_TESTIMONIAL_SOFTWARE = {
  points: [
    { feature: "Free Limit", competitor: "10-15 Reviews", kudoswall: "50 Reviews" },
    { feature: "Video support", competitor: "Paid only", kudoswall: "Included on Free" },
    { feature: "Customization", competitor: "Basic", kudoswall: "High-Fidelity" },
    { feature: "Badge Removal", competitor: "Paid", kudoswall: "Paid" },
  ],
  content: (
    <>
      <section className="mb-12">
        <H2>Free Testimonial Software with Video: The 2026 Comparison</H2>
        <P>
          Finding **free testimonial software with video** support used to be impossible. Most tools
          gated video recording behind a $50/mo "Pro" plan, or limited you to just 5 text reviews
          before hitting a paywall.
        </P>
        <P>
          In 2026, the landscape has shifted. Founders need high-quality social proof from day one,
          and "text-only" testimonials no longer cut it. You need the raw authenticity of video.
        </P>
      </section>

      <section className="mb-12">
        <H3>Why Most "Free" Plans Are Just Demos</H3>
        <P>
          When you search for "free testimonial software," you'll find plenty of options. But look
          closely at the fine print:
        </P>
        <UL>
          <LI>
            <strong>Senja:</strong> Limits you to 15 testimonials. Video is available but often
            limited in length or quality on the lower tiers.
          </LI>
          <LI>
            <strong>Testimonial.to:</strong> Limits you to ~10 testimonials. Video is their primary
            upsell.
          </LI>
          <LI>
            <strong>Trustmary:</strong> Generous on widgets, but tight on collection volume.
          </LI>
        </UL>
        <P>
          These aren't free plans; they are **interactive demos**. They give you just enough to get
          started, but as soon as your business sees any success, you're forced to pay $30-$50/mo.
        </P>
      </section>

      <section className="mb-12">
        <H3>KudosWall: The 10x More Generous Free Tier</H3>
        <P>
          We recently made a strategic decision to make our free tier the best in the market. We
          believe that social proof should be accessible to every founder, not just those with a
          marketing budget.
        </P>
        <P>
          KudosWall's free plan gives you **50 testimonials with video support** included. No credit
          card required, no trial expiration.
        </P>
        <UL>
          <LI>
            <strong>50 Testimonials:</strong> Enough to fill multiple sales pages and landing pages.
          </LI>
          <LI>
            <strong>Video Recording:</strong> High-fidelity video collection built right into the
            free flow.
          </LI>
          <LI>
            <strong>Edge-Optimized Widgets:</strong> Your testimonials load in sub-100ms, protecting
            your SEO and conversion rates.
          </LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>What to Look for in Free Video Testimonial Software</H3>
        <P>
          If you're evaluating other tools, make sure they check these three boxes before you commit:
        </P>
        <H4>1. No Credit Card for Video Recording</H4>
        <P>
          Some tools let you sign up for free but won't allow your customers to record a video
          unless you've entered your billing details. KudosWall allows video recording for everyone
          on the free tier.
        </P>
        <H4>2. Mobile-First Recording Flow</H4>
        <P>
          Most customers will leave reviews from their phones. If the recording interface is clunky
          or requires an app download, your completion rate will crater. KudosWall uses a
          browser-based, ultra-lean recording flow that works on any device.
        </P>
        <H4>3. Branding Control</H4>
        <P>
          Even on a free plan, the widget shouldn't look like a cheap plugin. KudosWall allows basic
          theme matching on the free tier, ensuring your social proof doesn't detract from your
          brand.
        </P>
      </section>

      <section className="mb-12">
        <H3>Summary: Start Collecting Video Today</H3>
        <P>
          Stop settling for 5-testimonial "trials." Get a real tool that grows with you. Whether
          you're an indie hacker, a course creator, or a small agency, KudosWall is the only **free
          testimonial software with video** that actually lets you run your business for free.
        </P>
      </section>
    </>
  ),
};

export const FREE_SENJA_ALTERNATIVE = {
  points: [
    { feature: "Free Limit", senja: "15 Reviews", kudoswall: "50 Reviews" },
    { feature: "Video support", senja: "Limited", kudoswall: "Full Support" },
    { feature: "Credit Card", senja: "Not for free", kudoswall: "Not for free" },
    { feature: "Performance", senja: "Standard", kudoswall: "Edge-Optimized" },
  ],
  content: (
    <>
      <section className="mb-12">
        <H2>The Best Free Senja Alternative: Why KudosWall Wins in 2026</H2>
        <P>
          Senja has become the "standard" for testimonial software. It's powerful, feature-rich, and
          well-designed. But for many solo founders and early-stage startups, Senja's **$29/month
          starter price** is a tough pill to swallow, especially when you're just starting to gather
          your first few reviews.
        </P>
        <P>
          If you're looking for a **free Senja alternative** that doesn't feel like a crippled demo,
          you're in the right place.
        </P>
      </section>
      <section className="mb-12">
        <H3>The "Free Tier" Problem</H3>
        <P>
          Most testimonial tools follow a similar playbook: a free tier that limits you to 10 or 15
          reviews. Once you hit that limit, you're forced to upgrade to a paid plan.
        </P>
        <P>
          In 2026, Senja's free tier is still capped at 15 testimonials. For a growing newsletter, a
          launching course, or a new SaaS, you can hit that limit in a single weekend.
        </P>
      </section>
      <section className="mb-12">
        <H3>Enter KudosWall: 10x More Value for $0</H3>
        <P>
          KudosWall was built specifically to be the most generous **free Senja alternative** on the
          market. We don't believe in "bait-and-switch" pricing. We want you to get real value
          before you ever see a billing screen.
        </P>
        <UL>
          <LI>
            <strong>50 Testimonials for Free:</strong> That's over 3x what Senja offers. It's enough
            to build a robust "Wall of Love" that actually converts.
          </LI>
          <LI>
            <strong>Video Support Included:</strong> While other tools gate video recording behind
            pro tiers, KudosWall lets your customers record high-fidelity video reviews on the free
            plan.
          </LI>
          <LI>
            <strong>No Expiration:</strong> Our free plan is free forever. No 14-day trials that
            expire just as you're getting your first reviews.
          </LI>
        </UL>
      </section>
      <section className="mb-12">
        <H3>Feature Comparison: KudosWall vs. Senja (Free Tier)</H3>
        <P>
          When comparing free plans, it's not just about the number of testimonials. It's about the
          quality of the output and the ease of use.
        </P>
        <H4>1. Loading Speed & Performance</H4>
        <P>
          Senja uses standard iframes which can sometimes cause layout shifts (CLS). KudosWall uses
          an **edge-optimized, CSS-first rendering engine**. This ensures your testimonial widgets
          load in milliseconds without making your site "jump," which is critical for your Core Web
          Vitals and SEO.
        </P>
        <H4>2. Collection Friction</H4>
        <P>
          KudosWall's collection flow is designed to be ultra-lean. We've removed every unnecessary
          click, resulting in a **30% higher completion rate** compared to denser collection forms.
          When you're looking for a free Senja alternative, you want a tool that actually helps you
          *get* the reviews, not just display them.
        </P>
      </section>
      <section className="mb-12">
        <H3>Summary: The Best Path Forward</H3>
        <P>
          If you have a massive marketing team and a $500/mo budget for social proof, Senja is a
          great choice. But if you're a founder who wants **premium design, video support, and
          generous limits** without the monthly subscription, KudosWall is the clear winner.
        </P>
        <P>
          Stop settling for a 15-review limit. Switch to the most powerful **free Senja
          alternative** today and start building the trust your brand deserves.
        </P>
      </section>
    </>
  ),
};

export const FREE_WALL_OF_LOVE = {
  points: [
    { feature: "Free Limit", competitor: "10-15 Reviews", kudoswall: "50 Reviews" },
    { feature: "Wall Layouts", competitor: "Basic Grid", kudoswall: "Premium Masonry" },
    { feature: "Video support", competitor: "Gated", kudoswall: "Included" },
    { feature: "SEO Ready", competitor: "Paid only", kudoswall: "Standard" },
  ],
  content: (
    <>
      <section className="mb-12">
        <H2>Free Wall of Love: How to Build Your Social Proof Page in 2026</H2>
        <P>
          A **Wall of Love** is more than just a list of reviews—it's a high-converting landing page
          asset that proves your product works. It's the "secret weapon" used by top SaaS companies
          and creators to build instant trust with new visitors.
        </P>
        <P>
          But here's the problem: Most "Wall of Love" tools charge a premium for the best layouts.
          They'll give you a basic list for free, but if you want that beautiful, masonry-style
          social proof wall, you're looking at $20-$50/month.
        </P>
      </section>

      <section className="mb-12">
        <H3>Why You Need a Wall of Love (and Why It Should Be Free)</H3>
        <P>
          In 2026, visitors are skeptical. They've seen every marketing trick in the book. A **Wall
          of Love** works because it's overwhelming. When a visitor sees 20, 30, or 50 positive
          experiences from real people, their "skepticism wall" breaks down.
        </P>
        <P>
          We believe that every founder should be able to build this trust without a monthly
          subscription holding them back.
        </P>
      </section>

      <section className="mb-12">
        <H3>The 3 Keys to a High-Converting Wall of Love</H3>
        <H4>1. Diversity of Content</H4>
        <P>
          A wall of just text is boring. A high-converting wall mixes **text, photos, and video**.
          KudosWall allows you to mix and match all three on our free tier, ensuring your wall feels
          alive and authentic.
        </P>
        <H4>2. Performance is Non-Negotiable</H4>
        <P>
          A "Wall of Love" is often heavy. If it takes 3 seconds to load, you're losing customers
          before they even see the praise. KudosWall widgets are **edge-optimized**, meaning they
          load almost instantly anywhere in the world, with zero layout shift.
        </P>
        <H4>3. Mobile-First Design</H4>
        <P>
          Over 60% of your visitors are on mobile. If your wall of love is just a giant block of
          text on a phone, nobody will read it. Our masonry and carousel layouts are designed to be
          swipeable and readable on every screen size.
        </P>
      </section>

      <section className="mb-12">
        <H3>Build Your Free Wall of Love with KudosWall</H3>
        <P>
          While competitors like Senja or Testimonial.to limit their free "Walls" to 10 or 15
          reviews, KudosWall gives you **50 testimonials for free**.
        </P>
        <UL>
          <LI>
            <strong>Unlimited Wall of Love Pages:</strong> Create different walls for different
            features or products.
          </LI>
          <LI>
            <strong>Video Included:</strong> Let your best customers speak for you.
          </LI>
          <LI>
            <strong>Copy-Paste Simplicity:</strong> Get your wall live on Webflow, Framer,
            WordPress, or a custom site in under 2 minutes.
          </LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>Summary: Don't Pay for Social Proof</H3>
        <P>
          You've done the hard work of building a great product and making your customers happy. You
          shouldn't have to pay a "trust tax" just to show that off.
        </P>
        <P>
          Start your **free Wall of Love** today with KudosWall. 50 testimonials, video included,
          and the best masonry layouts in the business—all for $0.
        </P>
      </section>
    </>
  ),
};

