export interface PlatformPageData {
  name: string;
  slug: string;
  heroTitle: string;
  useCaseFraming: string;
  setupSteps: { title: string; description: string }[];
  faq: { q: string; a: string }[];
}

export const PLATFORM_PAGES: PlatformPageData[] = [
  {
    name: "Carrd",
    slug: "carrd",
    heroTitle: "Free testimonial widget for Carrd — 50 testimonials, video included",
    useCaseFraming:
      "Carrd is the go-to for solo founders and minimalist landing pages. KudosWall's lightweight, edge-optimized widgets ensure your one-page site stays fast while building massive trust with 50+ free testimonials.",
    setupSteps: [
      {
        title: "Create your Wall",
        description: "Sign up for KudosWall and create a dedicated wall for your Carrd project.",
      },
      {
        title: "Collect Reviews",
        description: "Send your collection link to customers or manually add existing praise.",
      },
      {
        title: "Copy Embed Code",
        description: "Get your custom JS snippet from the KudosWall dashboard.",
      },
      {
        title: "Add to Carrd",
        description: "Drag an 'Embed' element into your Carrd editor and paste the code.",
      },
    ],
    faq: [
      {
        q: "Is KudosWall really free for Carrd?",
        a: "Yes! Our free plan gives you 50 testimonials with video support, which is perfect for most Carrd sites.",
      },
      {
        q: "Will it slow down my Carrd site?",
        a: "No. Our widgets are edge-optimized and use CSS-first rendering to ensure zero layout shift and instant load times.",
      },
      {
        q: "Can I use video testimonials on Carrd?",
        a: "Absolutely. Video recording and display are fully supported on our free tier.",
      },
    ],
  },
  {
    name: "Beehiiv",
    slug: "beehiiv",
    heroTitle: "Free testimonial widget for Beehiiv — Grow your newsletter with social proof",
    useCaseFraming:
      "Newsletter growth is all about trust. Show potential subscribers what they are missing by embedding a Wall of Love directly on your Beehiiv subscribe page.",
    setupSteps: [
      {
        title: "Collect Reader Praise",
        description: "Use our dedicated collection link in your next newsletter blast.",
      },
      {
        title: "Customize Layout",
        description: "Choose a masonry grid that matches your newsletter's aesthetic.",
      },
      {
        title: "Paste HTML in Beehiiv",
        description: "Go to Beehiiv Settings -> Design Lab and add a Custom HTML block.",
      },
      {
        title: "Publish",
        description: "Your testimonials are now live and helping you convert more subscribers.",
      },
    ],
    faq: [
      {
        q: "Can I use KudosWall in the actual email body?",
        a: "Email clients don't support JS widgets, but you can embed a screenshot of your wall and link it to your live KudosWall page.",
      },
      {
        q: "How many testimonials can I show for free?",
        a: "Up to 50! This is usually more than enough to fill a high-converting subscribe page.",
      },
    ],
  },
  {
    name: "Webflow",
    slug: "webflow",
    heroTitle: "Free testimonial widget for Webflow — 50 testimonials, video included",
    useCaseFraming:
      "Webflow designers demand pixel-perfect control. KudosWall gives you the power to match your exact typography and spacing while maintaining a lightning-fast site.",
    setupSteps: [
      {
        title: "Design your Widget",
        description: "Style your wall in KudosWall to match your Webflow project's design tokens.",
      },
      { title: "Grab the Snippet", description: "Copy our edge-optimized embed code." },
      {
        title: "Embed in Webflow",
        description: "Add an 'HTML Embed' element in Webflow and paste your code.",
      },
      {
        title: "Done",
        description: "Your social proof is now seamlessly integrated into your Webflow site.",
      },
    ],
    faq: [
      {
        q: "Does KudosWall support Webflow CMS?",
        a: "While we have a dedicated widget, you can also use our API for deeper CMS integrations if you are on a Pro plan.",
      },
      {
        q: "Can I remove the branding?",
        a: "Our Pro plan allows for complete white-labeling, but the free plan is perfect for starting out with a subtle badge.",
      },
    ],
  },
  {
    name: "Notion",
    slug: "notion",
    heroTitle: "Free testimonial widget for Notion — 50 testimonials, video included",
    useCaseFraming:
      "Notion is perfect for hosting portfolios, course hubs, and internal wikis. Add a professional layer of social proof to your Notion pages in seconds.",
    setupSteps: [
      {
        title: "Generate Embed URL",
        description: "Get a Notion-optimized embed link from your KudosWall dashboard.",
      },
      {
        title: "Paste in Notion",
        description: "Type /embed in any Notion page and paste your link.",
      },
      {
        title: "Resize",
        description: "Drag the Notion block handles to fit your testimonials perfectly.",
      },
    ],
    faq: [
      {
        q: "Does this work on Notion sites like Super?",
        a: "Yes! KudosWall works perfectly on all Notion-to-site platforms like Super, Potion, and Fruition.",
      },
      {
        q: "Can I collect testimonials directly from Notion?",
        a: "Yes, you can link to your collection page from any Notion callout or button.",
      },
    ],
  },
  {
    name: "Framer",
    slug: "framer",
    heroTitle: "Free testimonial widget for Framer — 50 testimonials, video included",
    useCaseFraming:
      "Framer is the future of high-end site design. Don't compromise your aesthetic with a clunky plugin. KudosWall's modern widgets feel right at home in any Framer project.",
    setupSteps: [
      { title: "Get your Script", description: "Copy your custom KudosWall embed script." },
      { title: "Add Embed in Framer", description: "Insert an 'Embed' component in Framer." },
      {
        title: "Paste and Style",
        description: "Paste your code and use Framer's layout tools to position it.",
      },
    ],
    faq: [
      {
        q: "Is it responsive in Framer?",
        a: "Yes, our widgets are fully fluid and will adapt to whatever container size you set in Framer.",
      },
      {
        q: "Can I use custom fonts?",
        a: "Yes, our Pro plan allows you to match your Framer project's exact typography.",
      },
    ],
  },
];
