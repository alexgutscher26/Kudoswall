import type { CompetitorData } from "@/components/vs-competitor-template";

export const COMPETITORS: CompetitorData[] = [
  {
    name: "Senja",
    slug: "senja",
    freeTier: "15 testimonials + video",
    multiplier: "3.3×",
    headline: "Senja alternative with 3× the free testimonials",
    startingPaidPrice: "$29/mo",
    strengths: ["30+ import sources", "sentiment AI", "20+ widgets"],
    wedges: [
      {
        title: "3.3× more free testimonials",
        description:
          "Collect up to 50 testimonials with video on our free plan. Senja caps you at just 15, forcing a paywall before you've even properly activated your wall of love.",
      },
      {
        title: "Cheaper unlimited plan: $19/mo vs $29",
        description:
          "Our Pro plan gives you more features for a fraction of the cost. No hidden per-project fees or seat taxes.",
      },
      {
        title: "Transparent agency tier: $59 for 5 brands",
        description:
          "Senja's pricing for agencies can be opaque. We offer a flat, predictable rate for multiple client projects.",
      },
    ],
    concessions: [
      "Senja has more import sources (G2, Capterra, etc.)",
      "Senja has more advanced AI features (sentiment analysis, auto-generated sizzle reels)",
    ],
    honestAssessment:
      "Senja is the industry heavyweight for a reason. They have built an incredible suite of import tools and AI-driven social proof features that are great for enterprise teams with massive volumes of existing reviews.",
    honestCompetitorStrengths:
      "If you need to import reviews from 30+ different platforms or want an AI to automatically generate video reels for you, Senja is currently the superior tool.",
    migrationGuide:
      "Export your testimonials from Senja as a CSV.\nUpload to KudosWall's importer.\nCopy your new KudosWall embed script into your site.",
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
  },
  {
    name: "Testimonial.to",
    slug: "testimonial-to",
    freeTier: "10 + 2 video",
    multiplier: "5×",
    headline: "Testimonial.to alternative with 5× more free testimonials",
    startingPaidPrice: "$20/mo",
    strengths: ["Pioneered video", "Robust dashboard", "Direct imports"],
    wedges: [
      {
        title: "5× more free testimonials",
        description:
          "We offer 50 testimonials on our free plan, while Testimonial.to limits you to just 10. That's 40 more opportunities to build trust for $0.",
      },
      {
        title: "Video support for all",
        description:
          "Testimonial.to gates their video recording behind their primary upsell. We believe video is essential, so we include it in every plan, including free.",
      },
      {
        title: "Edge-Optimized Performance",
        description:
          "Our widgets are designed for sub-100ms loading times, ensuring your social proof doesn't hurt your SEO or conversion rates.",
      },
    ],
    concessions: [
      "Testimonial.to has a longer track record in the industry",
      "They have slightly more native integrations with third-party apps",
    ],
    honestAssessment:
      "Testimonial.to is the pioneer that made video testimonials popular. They have a very solid, battle-tested platform that works well for thousands of users.",
    honestCompetitorStrengths:
      "If you want the 'original' brand and need specific integrations they've built over the years, they are a very safe bet.",
    migrationGuide:
      "Export your data from Testimonial.to.\nImport into KudosWall.\nUpdate your embed code.",
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
          "We love that KudosWall handles both text and video. The high-fidelity video recording is so smooth that our customers actually enjoy leaving reviews.",
      },
    ],
  },
  {
    name: "Vouch",
    slug: "vouch",
    freeTier: "Demo only",
    headline:
      "Looking for a Vouch alternative? Here's why people switch (and 50 free testimonials)",
    startingPaidPrice: "$600/yr",
    strengths: ["Enterprise focus", "Video playlists", "High-end recording"],
    wedges: [
      {
        title: "A real free tier",
        description:
          "Vouch has pivoted away from solo founders toward enterprise. We still offer a robust, 50-testimonial free tier that actually works for small businesses.",
      },
      {
        title: "Simple, flat pricing",
        description:
          "No enterprise sales calls required. Get all our professional features for $19/mo.",
      },
      {
        title: "Speed of execution",
        description:
          "KudosWall is built for speed. Go from sign-up to live widget in under 5 minutes.",
      },
    ],
    concessions: [
      "Vouch has deeper features for enterprise video workflows",
      "They offer more complex 'playlist' styles for video-heavy sites",
    ],
    honestAssessment:
      "Vouch is moving upmarket and doing a great job at serving large enterprises with complex video needs. They are less of a 'widget' and more of a 'video workflow' tool.",
    honestCompetitorStrengths:
      "If you are an enterprise team looking for internal video workflows and complex playlists, Vouch is the market leader.",
    migrationGuide:
      "Export your Vouch videos.\nUpload them to KudosWall.\nReplace your Vouch player with our minimalist widget.",
  },
  {
    name: "Famewall",
    slug: "famewall",
    freeTier: "Basic text",
    multiplier: "~3×",
    headline: "Famewall alternative with video on free",
    startingPaidPrice: "$11.99/mo",
    strengths: ["Simple UI", "Affordable", "Fast"],
    wedges: [
      {
        title: "Video on free",
        description:
          "Famewall is generous but gates video recording. KudosWall includes high-fidelity video collection in our free plan from day one.",
      },
      {
        title: "50 Testimonial Limit",
        description:
          "Our free tier is significantly deeper, allowing you to build a truly massive wall of love before needing to upgrade.",
      },
      {
        title: "Advanced Layouts",
        description:
          "Our widgets offer more control over typography and spacing, matching your brand's exact aesthetic.",
      },
    ],
    concessions: [
      "Famewall is slightly cheaper for the entry-level paid plan",
      "Their UI is exceptionally simple and easy to navigate",
    ],
    honestAssessment:
      "Famewall is a great, honest tool for founders who want something fast and simple. They have been very fair to the indie hacker community.",
    honestCompetitorStrengths:
      "If you just want the absolute simplest text-focused wall and want to support another indie builder, Famewall is a great choice.",
    migrationGuide:
      "Export your testimonials from Famewall.\nImport into KudosWall.\nUpdate your site with our script.",
  },
  {
    name: "Trustmary",
    slug: "trustmary",
    freeTier: "Limited views",
    multiplier: "~3×",
    headline: "Trustmary alternative — 50 testimonials free, no view caps",
    startingPaidPrice: "$19/mo",
    strengths: ["Survey focus", "NPS", "Widget variety"],
    wedges: [
      {
        title: "No view caps on free",
        description:
          "Trustmary often limits how many people can see your widgets on free plans. We believe your success shouldn't be penalized, so we have no view caps.",
      },
      {
        title: "50-testimonial collection",
        description:
          "Collect 3x more testimonials than Trustmary's free tier, including video support.",
      },
      {
        title: "Pure focus on social proof",
        description:
          "Trustmary is an all-in-one survey tool. We are a specialized social proof engine, meaning our widgets and collection flows are more optimized for conversion.",
      },
    ],
    concessions: [
      "Trustmary has better built-in NPS and survey tools",
      "They have more 'lead gen' style widgets for sales teams",
    ],
    honestAssessment:
      "Trustmary is an excellent choice if you need a complete feedback and survey system that also happens to do testimonials.",
    honestCompetitorStrengths:
      "If you need to measure NPS and run deep customer surveys alongside your social proof, Trustmary's all-in-one approach is superior.",
    migrationGuide:
      "Export your Trustmary testimonials.\nImport into KudosWall.\nSwitch the embed script.",
  },
  {
    name: "VideoAsk",
    slug: "videoask",
    freeTier: "Trial only",
    headline: "VideoAsk alternative with a real free tier",
    startingPaidPrice: "$30/mo",
    strengths: ["Interactive video", "Conversational", "Brand of Typeform"],
    wedges: [
      {
        title: "A real free tier",
        description:
          "VideoAsk is great for trials, but their permanent free tier is extremely limited. KudosWall gives you a permanent, 50-testimonial home for your social proof.",
      },
      {
        title: "Optimized for Testimonials",
        description:
          "VideoAsk is a conversational video tool. KudosWall is a social proof engine. Our layouts are designed specifically to display praise and drive sales.",
      },
      {
        title: "Lower Cost of Ownership",
        description:
          "Get all the video testimonial power you need for $19/mo instead of VideoAsk's $30+ tiers.",
      },
    ],
    concessions: [
      "VideoAsk is superior for interactive, branchable video conversations",
      "Their 'conversational' interface is unique and highly engaging",
    ],
    honestAssessment:
      "VideoAsk is one of the best tools ever made for asynchronous video conversations. If you want to build a 'choose your own adventure' video bot, use them.",
    honestCompetitorStrengths:
      "For interactive video sales and conversational support, VideoAsk has no real competition.",
    migrationGuide:
      "Download your VideoAsk clips.\nUpload them to your KudosWall wall.\nEmbed our optimized testimonial widget.",
  },
  {
    name: "Boast",
    slug: "boast",
    freeTier: "Limited free",
    multiplier: "~5×",
    headline: "Boast alternative — 50 free testimonials, video included",
    startingPaidPrice: "$50/mo",
    strengths: ["Long history", "Compliance features", "Mobile app"],
    wedges: [
      {
        title: "5× more free testimonials",
        description:
          "Boast's free entry is very tight. We offer 50 testimonials with video support for $0.",
      },
      {
        title: "Modern, lean interface",
        description:
          "Boast is a legacy tool with many features. KudosWall is a modern, lean alternative built for the web in 2026.",
      },
      {
        title: "Transparent pricing",
        description:
          "Our Pro plan is $19/mo, while Boast starts closer to $50/mo for similar features.",
      },
    ],
    concessions: [
      "Boast has more 'compliance' and legal tracking features for big brands",
      "They have a dedicated mobile app for collection on the go",
    ],
    honestAssessment:
      "Boast has been around for a long time and is a very stable choice for large corporate clients who need specific legal and compliance workflows.",
    honestCompetitorStrengths:
      "If you need a dedicated mobile app for your field team to collect reviews, Boast is the right choice.",
    migrationGuide: "Export your Boast reviews.\nImport into KudosWall.\nUpdate your embed code.",
  },
  {
    name: "Endorsal",
    slug: "endorsal",
    freeTier: "Limited",
    multiplier: "~5×",
    headline: "Endorsal alternative — most generous free testimonial tool",
    startingPaidPrice: "$29/mo",
    strengths: ["Auto-propagate", "FOMO popups", "Deep automation"],
    wedges: [
      {
        title: "The most generous free tier",
        description:
          "Endorsal's free plan is designed to move you to paid quickly. We give you 50 testimonials for free because we want you to succeed first.",
      },
      {
        title: "Better video support",
        description:
          "Our video recording flow is more modern and has higher completion rates on mobile devices.",
      },
      {
        title: "Simplified automation",
        description:
          "Endorsal can be complex to set up. KudosWall gets you live in 5 minutes without the headache.",
      },
    ],
    concessions: [
      "Endorsal has better 'FOMO' style notification popups",
      "Their 'Auto-propagate' feature is great for multi-site setups",
    ],
    honestAssessment:
      "Endorsal is a very powerful automation tool. If you want social proof 'popups' and deep automated workflows, they are a strong contender.",
    honestCompetitorStrengths:
      "For 'FOMO' notifications and complex automated review propagation across multiple sites, Endorsal is superior.",
    migrationGuide:
      "Export your Endorsal data.\nUpload to KudosWall.\nReplace your Endorsal scripts.",
  },
];
