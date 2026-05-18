import React from "react";
import Link from "next/link";

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
      feature: "Free Tier",
      competitor: "15 (No Video)",
      kudoswall: "50 + Video (Generous)",
    },
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
          But for many founders, that power has created a new problem: Complexity Creep.
        </P>
        <P>
          KudosWall was built to solve a single pain point: Getting your social proof live without
          reading a manual. While competitors add "spin-the-wheel" games and complex CRM features,
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
          KudosWall takes a Minimalist First approach. Our collection forms are designed to be
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
          includes up to 5 workspaces and team members out of the box, with zero hidden per-seat
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
          KudosWall treats the Collection Page and the Display Widget as two distinct design
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
          Choose Senja if: You have a marketing team of 5+ and need deep CRM integrations or
          AI-generated video sizzle reels.
        </P>
        <P>
          Choose KudosWall if: You want the most generous free tier in the market (3× Senja's) to
          get your Wall of Love live in 5 minutes without the $29/mo paywall.
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
          Testimonial.to pioneered the video testimonial space. But for many businesses, video is
          overkill. It's hard to get customers to record, hard to moderate, and often slows down
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
          CSS-first design tokens and a library of 35+ Google Fonts to ensure your widget matches
          your brand's exact typography and spacing.
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
          allows users to verify their identity via LinkedIn and Google OAuth. This adds a
          "Verified" badge to your testimonials, making them 10x more trustworthy to potential
          buyers.
        </P>
      </section>

      <section className="mb-12">
        <H3>Summary: The Best Tool for Your Sales Stack</H3>
        <P>
          By focusing on text and video excellence, we've created a tool that is faster, cheaper,
          and more visually integrated than Testimonial.to. If you're ready to turn your customers
          into your best sales tool with video, join the thousands of founders switching to
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
          creators are moving to KudosWall for high-performance text and video testimonials.
        </P>
      </section>

      <section className="mb-12">
        <H3>Why Load Speed Matters for Conversions</H3>
        <P>
          Course sales pages are notoriously long, often featuring dozens of student results.
          Traditional testimonial widgets can bloat your page size, causing layout shifts and slow
          rendering. KudosWall solves this with Edge-optimized delivery.
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
          enough anymore. KudosWall's LinkedIn Verification allows potential students to see that
          the testimonial comes from a real professional with a verifiable profile.
        </P>
      </section>

      <section className="mb-12">
        <H3>Seamless Integration with Your Stake</H3>
        <P>
          Whether you use Kajabi, Teachable, or a custom Next.js stack, KudosWall fits in perfectly.
          Our Custom CSS override engine allows you to match the exact aesthetic of your sales page,
          making the social proof feel like a core part of the experience rather than a third-party
          plugin.
        </P>
      </section>
    </>
  ),
};

export const AFFORDABLE_SENJA_ALTERNATIVE = {
  points: [
    { feature: "Free Testimonials", competitor: "15 (No Video)", kudoswall: "50 + Video" },
    { feature: "Starter Monthly", competitor: "$29/mo", kudoswall: "$0/mo (Free Forever)" },
    { feature: "Pro Annual", competitor: "$290/yr", kudoswall: "$190/yr ($19/mo)" },
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
          Social proof is essential, but it shouldn't cost as much as your server bill. While Senja
          has moved toward Enterprise-level pricing with a $29/mo entry point, KudosWall remains
          committed to the indie founder and solo creator market.
        </P>
      </section>

      <section className="mb-12">
        <H3>The End of Subscription Fatigue</H3>
        <P>
          Why pay every month for a tool that simply displays text on your site? KudosWall offers a
          Lifetime Deal (LTD) for a limited time, allowing you to pay once and own your social proof
          engine forever.
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
          overpaying with other tools. KudosWall gives you the premium widget layouts, automations,
          and verification tools you actually use, without the "enterprise tax."
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
    { feature: "Marketing Strategy", competitor: "Scarcity-First", kudoswall: "Activation-First" },
  ],
  content: (
    <>
      <section className="mb-12">
        <H2>The "Testimonial Tax" and Why Most Free Tiers Are Broken</H2>
        <P>
          Most SaaS "free tiers" are not actually products. They are interactive demos designed to
          make you feel the pain of a paywall as quickly as possible.
        </P>
        <P>
          You know the drill: You spend 20 minutes setting up a tool, you send out a collection
          link, you get 10 excited customers to leave a review, and suddenly—<em>click</em>. The
          dashboard locks. You're told that "to see your 11th testimonial, please enter your credit
          card and pay $29/month."
        </P>
        <P>
          Senja's free tier gives you 15 testimonials. Testimonial.to gives you 10. Famewall,
          Trustmary, and almost every other incumbent in the space sits in that same 10–15 range.
          For a long time, KudosWall was even tighter. We offered 5.
        </P>
        <P>
          <strong>We just changed ours to 50 testimonials with video.</strong> Free forever, no
          credit card required, no "trial" expiration.
        </P>
        <P>
          This isn't a "we listened to feedback" announcement. This is a fundamental pivot in how we
          think about growth. Most founders shrink their free tiers as they scale. I'm going the
          other direction—and here is the math and the philosophy behind why I think the
          conventional SaaS wisdom is costing you (and me) more than it's making.
        </P>
      </section>

      <section className="mb-12">
        <H3>The Realization: Marketing Signaling vs. Customer Value</H3>
        <P>
          When I first built KudosWall, I did what every first-time founder does: I looked at the
          competitors and "benchmarked" my pricing. I saw Senja at 15 and Testimonial.to at 10, and
          I thought, "I'll go to 5. That way, users will feel the need to upgrade even faster."
        </P>
        <P>
          It was a marketing decision based on competitor signaling, not customer value. I was
          trying to force conversion through scarcity before I had even proven that the product
          worked for the user.
        </P>
        <P>
          The result was a classic activation disaster. Users would sign up, set up a "Wall of
          Love," get their first 2 or 3 testimonials, and then… they'd stall. They hadn't embedded
          the widget yet because 3 testimonials don't make a "wall." They hadn't seen the conversion
          lift yet. They hadn't experienced the "A-ha" moment where social proof actually moves the
          needle.
        </P>
        <P>
          And then they'd hit the 5-testimonial limit. At that moment, they didn't think "I should
          pay $19 to unlock more." They thought, "I guess I'm done with this experiment."
        </P>
        <P>
          <strong>
            Hiting the limit too early doesn't lead to upgrading; it leads to leaving.
          </strong>{" "}
          I was running a 5-testimonial demo with a "Powered by KudosWall" badge, and I was calling
          it a free tier. I was wrong.
        </P>
      </section>

      <section className="mb-12">
        <H3>The Data Behind the Change: The Churn at the Wall</H3>
        <P>
          I spent three weeks staring at our churn dashboard and segmenting users by how many
          testimonials they had collected. Three numbers stood out with terrifying clarity:
        </P>
        <UL>
          <LI>
            <strong>Activation Rate:</strong> ~32% of users got at least one approved testimonial.
          </LI>
          <LI>
            <strong>The Drop-Off Point:</strong> Of the users who hit exactly 5 testimonials, 72%
            never logged back in.
          </LI>
          <LI>
            <strong>The Embedding Miracle:</strong> Users who got to 12+ testimonials were 4.5x more
            likely to embed their widget on a live site.
          </LI>
        </UL>
        <P>
          The data told a story of "Premature Gating." I was asking for a marriage proposal (a
          subscription) before the first date (embedding the widget) was even finished.
        </P>
        <P>
          By capping the free tier at 5, I was preventing users from reaching the "Embed
          Threshold"—the point where the widget actually looks good enough to put on a sales page. A
          "Wall of Love" with 3 entries looks like a mistake. A "Wall of Love" with 15-20 entries
          looks like a movement.
        </P>
        <P>
          Furthermore, our paid conversion data showed something even more interesting. Our Pro
          users weren't upgrading because they ran out of slots. They were upgrading for{" "}
          <strong>control</strong>. They wanted to remove the badge. They wanted custom domains.
          They wanted tag filtering.
        </P>
        <P>
          If features drive paid conversion, then constraining the volume of the free tier doesn't
          help revenue. It just kills activation. It's a net negative for everyone involved.
        </P>
      </section>

      <section className="mb-12">
        <H3>Why 50? The "Median Success" Math</H3>
        <P>
          Once I decided to expand the tier, the question was: How big? I ran the numbers on what a
          "successful" SMB or solo founder actually looks like.
        </P>
        <UL>
          <LI>Median testimonials per active, high-converting wall: 12–18</LI>
          <LI>90th percentile for "Productive" users: ~35</LI>
          <LI>99th percentile (Power Users): 80+</LI>
        </UL>
        <P>
          Setting the limit at 50 covers 95% of real-world use cases for the people KudosWall is
          built for: course creators launching their first big cohort, indie hackers building in
          public, and small agencies showing off their portfolio.
        </P>
        <P>
          <strong>Why not 25?</strong> Because 25 feels like a compromise. "We're slightly better
          than Senja" isn't a story people tell. "We are 10x bigger than the old limit and 3x bigger
          than the market leader" is a story people share on X, Reddit, and Indie Hackers.
        </P>
        <P>
          <strong>Why not unlimited?</strong> Economics matter. Testimonials—especially with native
          video—carry real costs. There's storage, CDN bandwidth, and the infrastructure to process
          high-fidelity video. Unlimited plans attract "edge-case abusers"—enterprise-level
          operations trying to run 1,000+ testimonials on a free tool. By capping at 50, we protect
          our infrastructure while delighting legitimate users.
        </P>
        <P>
          50 with video is the "Sweet Spot." It's high enough that you'll never feel
          "nickel-and-dimed" as you grow, but it gives us a clear path to Pro for users who reach a
          level of scale where they need advanced management and branding.
        </P>
      </section>

      <section className="mb-12">
        <H3>What This Means for Users: An Honest ROI Framing</H3>
        <P>
          We've redesigned our tiers to be based on <strong>Value</strong>, not{" "}
          <strong>Scarcity</strong>. Here is the new deal, and we're being completely transparent
          about who should pay and who shouldn't.
        </P>
        <H4>The Free Plan: For Builders</H4>
        <UL>
          <LI>50 text + video testimonials (No hidden asterisks)</LI>
          <LI>Full video recording flow (Mobile & Desktop)</LI>
          <LI>High-fidelity Masonry Grid widget</LI>
          <LI>Unlimited collection links</LI>
          <LI>"Powered by KudosWall" badge</LI>
        </UL>
        <P>
          <em>Who it's for:</em> If you are just starting out, or if you're a solo builder on a
          budget and you don't mind a small, tasteful badge at the bottom of your wall—
          <strong>stay free.</strong>
          Stay free forever. We would rather have you as a happy, active free user than a churned
          paid user.
        </P>

        <H4>The Pro Plan ($19/mo): For Brands</H4>
        <UL>
          <LI>Remove the KudosWall badge (Total white-label)</LI>
          <LI>Custom Domains (e.g., reviews.yourbrand.com)</LI>
          <LI>All 4 layouts (Carousel, Marquee, List, Grid)</LI>
          <LI>Tag Filtering (Show specific reviews on specific sales pages)</LI>
          <LI>Analytics & Click-tracking</LI>
        </UL>
        <P>
          <em>Who it's for:</em> If you are doing $5k+/mo in revenue and your "Wall of Love" is a
          core part of your sales funnel, Pro is a no-brainer. Removing the badge and matching your
          exact brand fonts/colors adds that final 5% of polish that closes high-ticket deals.
        </P>

        <H4>The Agency Plan ($59/mo): For Partners</H4>
        <P>
          Everything in Pro, but across 5 separate client workspaces. We've seen agencies pay $29/mo
          *per client* to other tools. That's $145/mo for 5 clients. We're cutting that by 60%.
        </P>
      </section>

      <section className="mb-12">
        <H3>Why This Is Hard for Incumbents to Match</H3>
        <P>
          People ask: "If 50 is better for activation, why don't Senja or Testimonial.to just do it
          tomorrow?"
        </P>
        <P>
          The answer is <strong>Economics and Inertia.</strong>
        </P>
        <P>
          <strong>1. The "Burn Rate" Trap:</strong> Many of our competitors have taken venture
          funding or have large teams to support. Their entire business model is built on
          "conversion-by-friction." They *need* that $29/mo from users who hit the 15-testimonial
          wall. If they expanded their free tier to 50, their short-term revenue would crater. They
          are effectively locked into their scarcity model by their own overhead.
        </P>
        <P>
          <strong>2. The Bootstrapped Edge:</strong> KudosWall is lean. We don't have a sales team.
          We don't have a 20-person engineering department. Our efficiency is our competitive
          advantage. We can afford to be generous because our infrastructure is optimized and our
          CAC (Customer Acquisition Cost) is near zero. Our free users are our marketing.
        </P>
        <P>
          <strong>3. Customer Base Noise:</strong> If a major incumbent changes their free tier from
          15 to 50, thousands of paying customers who are currently at 17 testimonials would
          immediately downgrade. It would create a massive internal churn event. As a smaller,
          faster-moving player, we can make this pivot without that structural risk.
        </P>
      </section>

      <section className="mb-12">
        <H3>What We've Learned About "Free" Users</H3>
        <P>There is a myth in SaaS that "Free users are just a drain on resources."</P>
        <P>
          In the testimonial space, that couldn't be further from the truth. Every free wall is a
          billboard for KudosWall. Every customer who submits a testimonial through our flow sees
          how smooth the experience is. Every "Powered by KudosWall" badge is an SEO asset and a
          word-of-mouth seed.
        </P>
        <P>
          By expanding the tier to 50, we aren't just giving away a product; we are investing in a
          global marketing engine. We are betting that a founder who uses KudosWall to collect 40
          amazing video testimonials for free will be our biggest advocate for life.
        </P>
      </section>

      <section className="mb-12">
        <H3>The 5-Minute Challenge</H3>
        <P>
          If you've been holding off on collecting testimonials because every other tool feels like
          a "bait-and-switch," I want to invite you to try KudosWall.
        </P>
        <P>
          No credit card. No time limit. 50 testimonials with native video recording included from
          the jump.
        </P>
        <P>
          Go to our dashboard, create your first wall, and send the link to your favorite customer.
          You can have your first video testimonial and a live "Wall of Love" on your site in
          exactly five minutes.
        </P>
        <P>
          Social proof shouldn't be a luxury. It should be the foundation of your business. We're
          just making that foundation 10x bigger.
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
        <P>
          Finding free testimonial software with video support used to be impossible. Most tools
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
          These aren't free plans; they are interactive demos. They give you just enough to get
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
          KudosWall's free plan gives you 50 testimonials with video support included. No credit
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
          If you're evaluating other tools, make sure they check these three boxes before you
          commit:
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
          you're an indie hacker, a course creator, or a small agency, KudosWall is the only free
          testimonial software with video that actually lets you run your business for free.
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
        <P>
          Senja has become the "standard" for testimonial software. It's powerful, feature-rich, and
          well-designed. But for many solo founders and early-stage startups, Senja's $29/month
          starter price is a tough pill to swallow, especially when you're just starting to gather
          your first few reviews.
        </P>
        <P>
          If you're looking for a free Senja alternative that doesn't feel like a crippled demo,
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
          KudosWall was built specifically to be the most generous free Senja alternative on the
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
          an edge-optimized, CSS-first rendering engine. This ensures your testimonial widgets load
          in milliseconds without making your site "jump," which is critical for your Core Web
          Vitals and SEO.
        </P>
        <H4>2. Collection Friction</H4>
        <P>
          KudosWall's collection flow is designed to be ultra-lean. We've removed every unnecessary
          click, resulting in a 30% higher completion rate compared to denser collection forms. When
          you're looking for a free Senja alternative, you want a tool that actually helps you *get*
          the reviews, not just display them.
        </P>
      </section>
      <section className="mb-12">
        <H3>Summary: The Best Path Forward</H3>
        <P>
          If you have a massive marketing team and a $500/mo budget for social proof, Senja is a
          great choice. But if you're a founder who wants premium design, video support, and
          generous limits without the monthly subscription, KudosWall is the clear winner.
        </P>
        <P>
          Stop settling for a 15-review limit. Switch to the most powerful free Senja alternative
          today and start building the trust your brand deserves.
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
        <P>
          A Wall of Love is more than just a list of reviews—it's a high-converting landing page
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
          In 2026, visitors are skeptical. They've seen every marketing trick in the book. A Wall of
          Love works because it's overwhelming. When a visitor sees 20, 30, or 50 positive
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
          A wall of just text is boring. A high-converting wall mixes text, photos, and video.
          KudosWall allows you to mix and match all three on our free tier, ensuring your wall feels
          alive and authentic.
        </P>
        <H4>2. Performance is Non-Negotiable</H4>
        <P>
          A "Wall of Love" is often heavy. If it takes 3 seconds to load, you're losing customers
          before they even see the praise. KudosWall widgets are edge-optimized, meaning they load
          almost instantly anywhere in the world, with zero layout shift.
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
          reviews, KudosWall gives you 50 testimonials for free.
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
          Start your free Wall of Love today with KudosWall. 50 testimonials, video included, and
          the best masonry layouts in the business—all for $0.
        </P>
      </section>
    </>
  ),
};

export const COLLECT_TESTIMONIALS_GUIDE = {
  content: (
    <>
      <section className="mb-12">
        <P>
          In the digital economy, trust is the only currency that truly matters. You can have the
          best product in the world, but if nobody else is talking about it, your conversion rate
          will suffer. This is why learning <strong>how to get customer testimonials</strong> is one
          of the most important skills for any founder, marketer, or creator.
        </P>
        <P>
          Testimonials aren't just "nice to have." They are psychological triggers that reduce the
          perceived risk of a purchase. When a potential customer sees real people solving real
          problems with your solution, their brain moves from "Is this a scam?" to "Will this work
          for me too?"
        </P>
        <P>
          In this guide, we'll walk through the exact framework for collecting high-converting
          testimonials that don't just look good, but actually drive sales.
        </P>
      </section>

      <section className="mb-12">
        <H2>The Psychology of Why Testimonials Work</H2>
        <P>
          Before we dive into the "how," we need to understand the "why." Testimonials leverage
          three powerful psychological principles:
        </P>
        <UL>
          <LI>
            <strong>Social Proof:</strong> We look to others to determine correct behavior in
            uncertain situations.
          </LI>
          <LI>
            <strong>Authority:</strong> When someone we respect (or someone like us) praises a
            product, we transfer that trust to the product itself.
          </LI>
          <LI>
            <strong>Familiarity:</strong> Seeing a person's face and name makes the business feel
            human and reachable.
          </LI>
        </UL>
      </section>

      <section className="mb-12">
        <H2>Step 1: Timing is Everything</H2>
        <P>
          The biggest mistake founders make is asking for a testimonial three months after the
          customer used the product. By then, the "peak delight" has faded.
        </P>
        <P>
          The best time to ask for a testimonial is <strong>immediately after a "Win."</strong>
        </P>
        <UL>
          <LI>For SaaS: Right after they hit a milestone or finish an onboarding flow.</LI>
          <LI>For Courses: Immediately after they finish the final lesson or submit a project.</LI>
          <LI>For Services: Right after you deliver the final high-value asset.</LI>
        </UL>
      </section>

      <section className="mb-12">
        <H2>Step 2: Automate the Ask</H2>
        <P>
          If you're manually emailing every customer, you're going to miss opportunities. You need a
          system that works while you sleep.
        </P>
        <P>
          Using a tool like KudosWall, you can set up a dedicated collection page and link to it in
          your automated "Success" emails. This ensures every happy customer is given a frictionless
          way to share their experience.
        </P>
        <P>
          Check out our guide on{" "}
          <Link
            href="/blog/free-testimonial-software-with-video"
            className="text-primary underline"
          >
            free testimonial software with video
          </Link>{" "}
          to see how you can start automating this today for $0.
        </P>
      </section>

      <section className="mb-12">
        <H2>Step 3: Ask the Right Questions</H2>
        <P>
          Don't just ask for "a testimonial." That's too vague and leads to boring reviews like "It
          was great!"
        </P>
        <P>Instead, ask three specific questions to get a narrative-driven response:</P>
        <UL>
          <LI>1. What was the main problem you were facing before using [Product]?</LI>
          <LI>2. What was the "Aha!" moment when you realized it was working?</LI>
          <LI>3. What is the single biggest result you've seen so far?</LI>
        </UL>
        <P>
          This structure creates a "Before vs. After" story that is 10x more compelling to new
          visitors.
        </P>
      </section>

      <section className="mb-12">
        <H2>Step 4: Text vs. Video (The High-Fidelity Edge)</H2>
        <P>
          In 2026, text testimonials are the baseline.{" "}
          <strong>Video testimonials are the gold standard.</strong>
        </P>
        <P>
          Video adds a layer of authenticity that text simply can't match. It's much harder to fake
          a 30-second video of a real person talking than it is to fake a text quote.
        </P>
        <P>
          However, you should always offer both options. Some people are camera-shy but have
          incredible results to share. A good system (like KudosWall) lets the customer choose.
        </P>
      </section>

      <section className="mb-12">
        <H2>Step 5: Displaying for Maximum Impact</H2>
        <P>
          Once you've collected your testimonials, you need to put them where they'll do the most
          work.
        </P>
        <UL>
          <LI>
            <strong>The "Wall of Love":</strong> A dedicated page for all your praise. Learn{" "}
            <Link href="/blog/free-wall-of-love" className="text-primary underline">
              how to build a free Wall of Love
            </Link>{" "}
            in under 5 minutes.
          </LI>
          <LI>
            <strong>Checkout Pages:</strong> Use a carousel widget right next to the buy button to
            reduce last-minute anxiety.
          </LI>
          <LI>
            <strong>Hero Sections:</strong> A "social proof bar" below your main headline.
          </LI>
        </UL>
        <P>If you're using a specific platform, we have dedicated guides for you:</P>
        <UL>
          <LI>
            <Link href="/blog/testimonial-widget-for-webflow" className="text-primary underline">
              Testimonial Widget for Webflow
            </Link>
          </LI>
          <LI>
            <Link href="/blog/best-testimonial-tools-teachable" className="text-primary underline">
              Best Social Proof Tools for Teachable
            </Link>
          </LI>
          <LI>
            <Link href="/blog/best-testimonial-tools-kajabi" className="text-primary underline">
              Best Social Proof Tools for Kajabi
            </Link>
          </LI>
        </UL>
      </section>

      <section className="mb-12">
        <H2>Choosing the Right Tool</H2>
        <P>You have options. If you're comparing tools, we've done the deep dives for you:</P>
        <UL>
          <LI>
            <Link href="/blog/kudoswall-vs-senja" className="text-primary underline">
              KudosWall vs Senja
            </Link>
          </LI>
          <LI>
            <Link href="/blog/kudoswall-vs-testimonial-to" className="text-primary underline">
              KudosWall vs Testimonial.to
            </Link>
          </LI>
          <LI>
            <Link href="/blog/free-senja-alternative" className="text-primary underline">
              Top Free Senja Alternatives
            </Link>
          </LI>
        </UL>
      </section>

      <section className="mb-12">
        <H2>Summary: Start Today</H2>
        <P>
          The best time to start collecting testimonials was when you launched. The second best time
          is <strong>right now</strong>.
        </P>
        <P>
          Don't wait until you have a "perfect" system. Start by sending your first collection link
          today. At KudosWall, we make it incredibly easy to get started with a{" "}
          <strong>50-testimonial free plan</strong> that includes native video support.
        </P>
      </section>
    </>
  ),
};

export const BEST_FREE_TOOLS_2026 = {
  content: (
    <>
      <section className="mb-12">
        <P>
          In 2026, social proof is no longer optional—it's a requirement. But if you're just
          launching a side project, a newsletter, or a new SaaS, you probably don't want to add
          another $50/month subscription to your burn rate.
        </P>
        <P>
          The good news is that the market for testimonial software has become incredibly
          competitive. Many tools now offer generous free tiers that actually let you build a
          business. The bad news? Most "free" plans are designed to lock you in early and force an
          upgrade the second you see any success.
        </P>
        <P>
          We've analyzed the top 5 tools on the market to find the{" "}
          <strong>best free testimonial tool in 2026</strong>. We looked at three main criteria:
        </P>
        <UL>
          <LI>
            <strong>Testimonial Limits:</strong> How many reviews can you collect before paying?
          </LI>
          <LI>
            <strong>Video Support:</strong> Is video recording included or gated behind a paywall?
          </LI>
          <LI>
            <strong>Branding:</strong> How intrusive is the "Powered by" badge?
          </LI>
        </UL>
      </section>

      <section className="border-primary bg-primary/5 mb-12 rounded-r-xl border-l-4 py-2 pl-6">
        <H2>1. KudosWall (The Best Overall Value)</H2>
        <P>
          Yes, we are KudosWall. And yes, we put ourselves at the top. Why? Because we literally
          built our free tier to be 3x more generous than the next best competitor.
        </P>
        <UL>
          <LI>
            <strong>Free Limit:</strong> 50 Testimonials (10x more than others)
          </LI>
          <LI>
            <strong>Video Support:</strong> High-fidelity recording included on free
          </LI>
          <LI>
            <strong>Best for:</strong> Founders who want a tool that grows with them
          </LI>
        </UL>
      </section>

      <section className="mb-12">
        <H2>2. Senja</H2>
        <P>
          Senja is excellent for importing reviews from social media. However, their 15-testimonial
          free limit is quite restrictive, and video recording is often gated or limited in the free
          version.
        </P>
      </section>

      <section className="mb-12">
        <H2>3. Testimonial.to</H2>
        <P>
          The original "Wall of Love" tool. It's robust and trusted, but their free plan is
          extremely limited (usually only 2 videos) and serves primarily as a demo.
        </P>
      </section>

      <section className="mb-12">
        <H2>4. Trustmary</H2>
        <P>
          Great for surveys and NPS, but the testimonial collection side can be complex and
          expensive once you move past their entry-level free tier.
        </P>
      </section>

      <section className="mb-12">
        <H2>5. Famewall</H2>
        <P>
          A solid, simple option for building a wall of love. It's fast and focused, but has fewer
          advanced collection features compared to KudosWall on the free plan.
        </P>
      </section>
    </>
  ),
};

export const CARRD_EMBED_GUIDE = {
  content: (
    <>
      <section className="mb-12">
        <H2>How to Embed Testimonials on Carrd in 5 Minutes</H2>
        <P>
          Carrd is the gold standard for minimalist, one-page websites. Whether you're building a
          personal brand, a landing page for a digital product, or a simple signup form, adding
          social proof is the fastest way to increase your conversion rate.
        </P>
        <P>
          In this guide, we'll show you exactly how to embed a beautiful "Wall of Love" on your
          Carrd site using KudosWall.
        </P>
      </section>

      <section className="mb-12">
        <H3>Step 1: Create Your KudosWall Widget</H3>
        <P>
          First, sign up for KudosWall (the free plan gives you 50 testimonials + video). Create a
          new "Wall" and start collecting testimonials using your unique collection link. Once you
          have a few reviews, head to the "Widgets" tab.
        </P>
        <P>
          Customize your widget's colors and fonts to match your Carrd site. Since Carrd is often
          minimalist, we recommend using our <strong>Grid</strong> or <strong>Masonry</strong>
          layouts with a subtle background.
        </P>
      </section>

      <section className="mb-12">
        <H3>Step 2: Copy Your Embed Code</H3>
        <P>
          Once your widget looks perfect, click the "Embed" button. You'll see a single line of
          JavaScript code. Copy this to your clipboard.
        </P>
      </section>

      <section className="mb-12">
        <H3>Step 3: Add an "Embed" Element in Carrd</H3>
        <P>Open your Carrd editor and follow these steps:</P>
        <UL>
          <LI>
            Click the <strong>+ (Add)</strong> button in the sidebar.
          </LI>
          <LI>
            Select <strong>Embed</strong> from the list of elements.
          </LI>
          <LI>
            In the settings for the Embed element, set the "Style" to <strong>Hidden</strong> (this
            is usually best for JS scripts).
          </LI>
          <LI>
            Paste your KudosWall embed code into the <strong>Code</strong> box.
          </LI>
          <LI>
            Position the Embed element where you want the testimonials to appear on your page.
          </LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>Why KudosWall is Perfect for Carrd</H3>
        <P>
          Carrd users value speed and simplicity. KudosWall's widgets are edge-optimized and
          designed to load instantly without causing layout shifts. Plus, with our generous free
          tier, you don't have to worry about a monthly subscription for your simple one-page site.
        </P>
      </section>
    </>
  ),
};

export const BEEHIIV_EMBED_GUIDE = {
  content: (
    <>
      <section className="mb-12">
        <H2>How to Embed Testimonials on Beehiiv Newsletters</H2>
        <P>
          Newsletters thrive on trust. When a new reader lands on your Beehiiv subscribe page,
          seeing testimonials from existing happy readers can be the difference between a bounce and
          a new subscriber.
        </P>
        <P>
          While email clients (like Gmail or Outlook) don't support interactive JavaScript widgets
          directly inside the email body, you can still use KudosWall to power your social proof on
          your Beehiiv website and in your newsletter blasts.
        </P>
      </section>

      <section className="mb-12">
        <H3>Option 1: Adding Testimonials to Your Beehiiv Website</H3>
        <P>Beehiiv allows you to customize your publication's website. To add a Wall of Love:</P>
        <UL>
          <LI>
            Go to your Beehiiv Dashboard and select <strong>Settings {"->"} Design Lab</strong>.
          </LI>
          <LI>
            Choose the page where you want to add social proof (e.g., the Home page or a dedicated
            "Love" page).
          </LI>
          <LI>
            Add a <strong>Custom HTML</strong> block.
          </LI>
          <LI>Paste your KudosWall embed code into the block and save.</LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>Option 2: Using Testimonials in Newsletter Emails</H3>
        <P>
          Since emails can't run JavaScript, you can't embed the live widget directly. However,
          KudosWall makes it easy to include social proof in your blasts:
        </P>
        <UL>
          <LI>
            <strong>Screenshot & Link:</strong> Take a high-quality screenshot of your favorite
            video testimonial or the Wall of Love and embed it as an image in Beehiiv. Link the
            image to your public KudosWall "Wall of Love" page.
          </LI>
          <LI>
            <strong>Direct Link:</strong> Add a "What readers are saying" section in your footer
            with a link to your verified Wall of Love.
          </LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>The Beehiiv + KudosWall Advantage</H3>
        <P>
          By using KudosWall, you can collect <strong>video testimonials</strong> from your readers,
          which carry much more weight than simple text. You can even include these video links
          directly in your Beehiiv posts to build massive credibility with your audience.
        </P>
      </section>
    </>
  ),
};

export const TESTIMONIAL_QUESTIONS_GUIDE = {
  content: (
    <>
      <section className="mb-12">
        <H2>30 Testimonial Questions That Actually Get Usable Answers</H2>
        <P>
          "Can you leave us a review?" is the worst way to ask for a testimonial. It's too vague, it
          puts all the creative work on your customer, and it usually results in "This tool is
          great, 5 stars!" which does nothing to convince a skeptical prospect.
        </P>
        <P>
          To get high-converting testimonials, you need to ask questions that elicit a{" "}
          <strong>narrative</strong>. You want to hear about the struggle they faced, the moment
          they decided to switch, and the specific results they've seen.
        </P>
      </section>

      <section className="mb-12">
        <H3>The "Before": Understanding the Pain Point</H3>
        <P>These questions help establish the "villain" of the story — the problem you solved.</P>
        <UL>
          <LI>What was the main challenge you were facing before using KudosWall?</LI>
          <LI>How much time/money were you losing to that problem?</LI>
          <LI>What other solutions did you try that didn't work?</LI>
          <LI>What was the "last straw" that made you look for a new tool?</LI>
          <LI>How were you handling testimonial collection previously?</LI>
          <LI>What was your biggest frustration with your previous workflow?</LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>The "During": The Experience of Using the Product</H3>
        <P>Focus on ease of use and that "aha" moment.</P>
        <UL>
          <LI>How would you describe the setup process in one word?</LI>
          <LI>What was the first thing that surprised you about the product?</LI>
          <LI>What is your favorite feature that you use every day?</LI>
          <LI>Was there a specific moment where you realized this was the right choice?</LI>
          <LI>How did your team react when you first implemented it?</LI>
          <LI>How much time did it take to get your first result?</LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>The "After": The Results and ROI</H3>
        <P>This is the most important part for conversions.</P>
        <UL>
          <LI>What specific metric has improved since you started using it?</LI>
          <LI>Can you quantify the time you've saved each week?</LI>
          <LI>How has this impacted your conversion rate on your landing pages?</LI>
          <LI>What's the #1 thing you can do now that you couldn't do before?</LI>
          <LI>How has your customers' feedback changed?</LI>
          <LI>If you had to put a dollar value on the value we provide, what would it be?</LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>Handling Objections & Recommendation</H3>
        <P>Social proof that directly addresses skepticism.</P>
        <UL>
          <LI>What was your biggest concern or hesitation before signing up?</LI>
          <LI>What would you say to someone who thinks this is too expensive?</LI>
          <LI>If you were to recommend us to a friend, what's the first thing you'd say?</LI>
          <LI>Who do you think would benefit most from this tool?</LI>
          <LI>What's the main reason you'd recommend us over competitors?</LI>
          <LI>Is there anything else you'd like to share that we haven't covered?</LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>Automate the Asking with KudosWall</H3>
        <P>
          You don't have to manually email these questions to every customer. With KudosWall, you
          can embed these prompts directly into your <strong>Collection Form</strong>.
        </P>
        <P>
          Our high-fidelity recording flow guides your customers through the process, ensuring they
          give you the specific, results-oriented testimonials that drive sales.
        </P>
      </section>
    </>
  ),
};

export const AGENCY_SOFTWARE_GUIDE = {
  content: (
    <>
      <section className="mb-12">
        <H2>Best Testimonial Tool for Marketing Agencies in 2026</H2>
        <P>
          As an agency, your needs are different from a single business owner. You're not just
          collecting testimonials for yourself; you're managing social proof for dozens of clients.
          You need a tool that is scalable, easy to hand off, and doesn't break the bank.
        </P>
        <P>
          KudosWall was built with agencies in mind. Whether you're a SEO agency, a CRO shop, or a
          full-service creative house, here is why KudosWall is the best testimonial software for
          agencies.
        </P>
      </section>

      <section className="mb-12">
        <H3>1. Unlimited Projects & High Limits</H3>
        <P>
          Most competitors charge you per "space" or per "client". This makes it incredibly
          expensive to scale. KudosWall's architecture allows you to manage multiple client projects
          with generous testimonial limits on our free and pro tiers.
        </P>
      </section>

      <section className="mb-12">
        <H3>2. Native Video Support (No Extra Cost)</H3>
        <P>
          Video testimonials are the highest form of social proof. While other tools charge $50+/mo
          just to unlock video, KudosWall includes native video recording on our free tier. This
          allows you to offer high-end video social proof as a standard part of your agency
          packages.
        </P>
      </section>

      <section className="mb-12">
        <H3>3. Lightning-Fast Performance</H3>
        <P>
          If you're an SEO agency, you know that slow widgets hurt Core Web Vitals. KudosWall's
          widgets are edge-optimized and deliver static-like performance, ensuring your clients'
          sites stay fast and rank high.
        </P>
      </section>

      <section className="mb-12">
        <H3>4. Easy Client Handoff</H3>
        <P>
          You can set up the collection forms and Walls of Love for your clients, and then simply
          give them the embed code. The dashboard is intuitive enough that they can manage their own
          approvals if you want them to, or you can handle it all from your central account.
        </P>
      </section>
    </>
  ),
};

export const AGENCY_PLAYBOOK = {
  content: (
    <>
      <section className="mb-12">
        <H2>How to Collect Client Testimonials at Scale (Agency Playbook)</H2>
        <P>
          Getting testimonials from your clients (and your clients' customers) shouldn't be a manual
          chore. If you're still sending "Quick question..." emails once a month, you're leaving
          money on the table.
        </P>
        <P>
          This is the exact playbook we recommend for agencies to automate testimonial collection at
          scale.
        </P>
      </section>

      <section className="mb-12">
        <H3>Step 1: The Milestone Trigger</H3>
        <P>
          Don't wait until the end of a 6-month contract to ask for a review. Ask when the "Value
          Moment" happens. This could be:
        </P>
        <UL>
          <LI>The first time an ad campaign hits its ROAS target.</LI>
          <LI>The day a new website goes live.</LI>
          <LI>After the first monthly report showing 20%+ growth.</LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>Step 2: Use "Question-First" Collection</H3>
        <P>
          Instead of a blank box, use our <strong>Testimonial Questions</strong> feature. Guide the
          client to talk about the ROI you provided. (Hint: Use our "30 Testimonial Questions" guide
          for inspiration).
        </P>
      </section>

      <section className="mb-12">
        <H3>Step 3: Offer the "Wall of Love" as a Value-Add</H3>
        <P>
          Don't just collect the testimonials; show them off. As part of your service, offer to set
          up a dedicated "Love" page for your client. It takes you 2 minutes with KudosWall, but it
          adds massive perceived value to your agency's monthly retainer.
        </P>
      </section>

      <section className="mb-12">
        <H3>Step 4: Automate the Follow-up</H3>
        <P>
          Set up an automated email sequence that triggers 7 days after a project milestone. Include
          your KudosWall collection link and a personal note from the account manager.
        </P>
      </section>
    </>
  ),
};

export const VOUCH_ALTERNATIVE = {
  content: (
    <>
      <section className="mb-12">
        <H2>Vouch alternative: 5 testimonial tools (since Vouch pivoted to talent)</H2>
        <P>
          Vouch recently shifted its focus toward "Vouch for Talent," an employee-focused video
          tool. This left many marketers and founders looking for a simple, video-first alternative
          for collecting customer testimonials.
        </P>
        <P>
          If you loved Vouch for its video quality but need a tool focused on social proof, here are
          the top 5 alternatives.
        </P>
      </section>

      <section className="mb-12">
        <H3>1. KudosWall (Best for Speed & Value)</H3>
        <P>
          KudosWall is the most direct replacement for Vouch's original mission: collecting
          high-quality video testimonials with zero friction. Unlike Vouch, which has moved into HR
          tech, KudosWall is 100% focused on helping you build trust with your customers.
        </P>
        <UL>
          <LI>
            <strong>Video Support:</strong> High-fidelity, native recording.
          </LI>
          <LI>
            <strong>Ease of Use:</strong> One-click recording for customers.
          </LI>
          <LI>
            <strong>Pricing:</strong> 50 testimonials (including video) for free.
          </LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>2. Senja</H3>
        <P>
          Senja is a great all-rounder. While it's not as video-centric as Vouch used to be, its
          ability to curate and display video alongside social media imports makes it a strong
          contender.
        </P>
      </section>

      <section className="mb-12">
        <H3>3. Testimonial.to</H3>
        <P>
          The most established name in video testimonials. It offers many of the features Vouch
          users liked (like dedicated landing pages for recording) but at a higher price point.
        </P>
      </section>

      <section className="mb-12">
        <H3>4. Bonjoro</H3>
        <P>
          Bonjoro is unique because it blends personal video messaging with testimonial collection.
          If you want a more "high-touch" relationship with your clients, this is a great pivot.
        </P>
      </section>

      <section className="mb-12">
        <H3>5. VideoPeel</H3>
        <P>
          If you need enterprise-grade video permissions and management, VideoPeel is the way to go.
          It's more expensive, but it offers the robust controls that large marketing teams need.
        </P>
      </section>
    </>
  ),
};

export const FRAMER_EMBED_GUIDE = {
  content: (
    <>
      <section className="mb-12">
        <H2>How to Embed Testimonials on Framer in 2026</H2>
        <P>
          Framer has become the go-to design tool for high-end landing pages and SaaS websites. Its
          ability to create custom, fluid animations and layouts is unmatched. However, to truly
          convert visitors into customers, your beautiful Framer site needs verified social proof.
        </P>
        <P>
          In this guide, we'll show you how to embed a high-fidelity KudosWall testimonial widget on
          your Framer site in just a few clicks, without slowing down your site or breaking your
          design.
        </P>
      </section>

      <section className="mb-12">
        <H3>Step 1: Get Your KudosWall Embed Code</H3>
        <P>
          First, log in to your KudosWall dashboard. Navigate to the Widgets section and choose the
          wall you'd like to display. Customize the design—select from Grid, Masonry, or Carousel
          layouts and match the colors to your Framer project's palette.
        </P>
        <P>
          Once it looks perfect, click Embed code and copy the single line of JavaScript provided.
        </P>
      </section>

      <section className="mb-12">
        <H3>Step 2: Add an Embed Component in Framer</H3>
        <P>Open your project in Framer and follow these steps:</P>
        <UL>
          <LI>Click the Plus (+) button in the top left to open the Insert menu.</LI>
          <LI>
            Search for Embed and drag it onto your canvas where you want the testimonials to appear.
          </LI>
          <LI>In the properties panel on the right, make sure the "Type" is set to HTML.</LI>
          <LI>Paste your KudosWall embed code into the HTML box.</LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>Step 3: Styling and Responsive Design</H3>
        <P>
          Framer's Embed component is fully responsive. You can resize the embed box directly on the
          canvas to fit your layout. KudosWall's widgets are designed to be fluid, so they will
          automatically adjust to the width of the Framer container.
        </P>
        <P>
          Pro Tip: Set the Embed component's width to "Fill" and the height to "Auto" (or a fixed
          height if you want a scrollable masonry grid) to ensure it looks great on all devices.
        </P>
      </section>

      <section className="mb-12">
        <H3>Why KudosWall + Framer is a Winning Combo</H3>
        <P>
          Framer users care deeply about performance and aesthetics. KudosWall widgets are
          edge-optimized, meaning they load near-instantly and won't hurt your Framer site's
          Lighthouse scores. Plus, our high-fidelity text and video testimonials match the premium
          feel of a Framer-designed site.
        </P>
      </section>
    </>
  ),
};

export const COURSE_CREATOR_TESTIMONIALS = {
  content: (
    <>
      <section className="mb-12">
        <H2>Course Creator Testimonials: The Strategy for Maximum Impact</H2>
        <P>
          For course creators, testimonials aren't just "nice to have"—they are your most effective
          sales tool. A potential student isn't just buying your content; they are buying a
          transformation. And nothing proves a transformation better than a student sharing their
          results.
        </P>
        <P>
          In 2026, text reviews are no longer enough. To stand out in a crowded market, you need
          verified video testimonials and student success stories that feel authentic. Here is the
          exact strategy top creators use to collect and display social proof.
        </P>
      </section>

      <section className="mb-12">
        <H3>1. The "Moment of Transformation" Ask</H3>
        <P>
          Don't wait until the very end of your course to ask for a testimonial. The best time to
          ask is at the Moment of Transformation—when a student hits a specific milestone or
          achieves their first win.
        </P>
        <UL>
          <LI>
            Module 1 Win: Ask for a testimonial right after they complete their first assignment.
          </LI>
          <LI>Mid-Course Check-in: Use an automated email to ask how their progress is going.</LI>
          <LI>
            Certification: Include a collection link on the final success page of your course.
          </LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>2. Use Video to Build Absolute Trust</H3>
        <P>
          Text can be faked; video cannot. Seeing a student's face and hearing the emotion in their
          voice as they describe how your course changed their life is incredibly powerful.
        </P>
        <P>
          KudosWall makes this easy by allowing students to record a high-fidelity video directly
          from their phone or laptop, without needing to download any apps. This frictionless
          experience leads to a 3x higher completion rate for video requests.
        </P>
      </section>

      <section className="mb-12">
        <H3>3. Display Your "Wall of Love" Strategically</H3>
        <P>
          Don't just hide your testimonials on a separate page. Integrate them throughout your
          entire sales funnel:
        </P>
        <UL>
          <LI>The Hero Section: A carousel of 3-5 star students right under your main CTA.</LI>
          <LI>
            The Pricing Table: A masonry grid of testimonials next to your checkout button to reduce
            friction.
          </LI>
          <LI>The FAQ Section: Use specific testimonials that answer common student objections.</LI>
        </UL>
      </section>

      <section className="mb-12">
        <H3>4. Leverage "Social Proof as Education"</H3>
        <P>
          Turn your best student success stories into content. Share their video testimonials on
          Instagram, LinkedIn, or in your email newsletters. This not only builds trust with
          prospects but also celebrates your students and builds community.
        </P>
      </section>
    </>
  ),
};
