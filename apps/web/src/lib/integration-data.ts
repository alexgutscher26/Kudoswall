export interface IntegrationPageData {
  name: string;
  slug: string;
  heroTitle: string;
  heroDescription: string;
  dataPoints: string[];
  sections: { title: string; content: string }[];
}

export const INTEGRATIONS: IntegrationPageData[] = [
  {
    name: "Carrd",
    slug: "carrd",
    heroTitle: "How to embed testimonials on Carrd (2026 Guide)",
    heroDescription:
      "The definitive guide to adding a Wall of Love to your Carrd site. Lightweight, responsive, and edge-optimized.",
    dataPoints: [
      "Zero layout shift (CLS) for Carrd sites",
      "5-minute copy-paste installation",
      "Native video testimonial support",
      "Auto-scaling masonry grid",
      "Custom CSS branding",
      "Lazy-loaded images for performance",
      "GDPR compliant analytics",
      "No-code widget customizer",
      "Multiple widget styles",
      "Automated review collection",
      "Spam protection (reCAPTCHA)",
      "Dark mode support",
    ],
    sections: [
      {
        title: "Why social proof matters for Carrd",
        content:
          "Carrd sites are often minimalist. A single Wall of Love can double your conversion rate by adding necessary trust without clutter.",
      },
      {
        title: "Preparation",
        content:
          "Before you start, make sure you have at least 3-5 testimonials collected in your KudosWall dashboard.",
      },
    ],
  },
  {
    name: "Webflow",
    slug: "webflow",
    heroTitle: "How to embed testimonials on Webflow (2026 Guide)",
    heroDescription:
      "Pixel-perfect testimonial widgets for Webflow designers. Match your style, maintain your speed.",
    dataPoints: [
      "Works with Webflow HTML Embed",
      "No external script heavy-lifting",
      "Match Webflow custom fonts",
      "Responsive container queries",
      "CMS-friendly integration",
      "Interaction-ready widgets",
      "SEO-friendly structured data",
      "Auto-updating reviews",
      "Video play-on-hover",
      "Social platform imports",
      "Trust badges included",
      "Priority loading for LCP",
    ],
    sections: [
      {
        title: "Webflow & Performance",
        content:
          "Don't let clunky plugins slow down your Webflow site. KudosWall is built for performance.",
      },
      {
        title: "Installation Steps",
        content: "1. Copy code. 2. Drag Embed. 3. Paste. 4. Publish. Done.",
      },
    ],
  },
  // ... others would be added similarly
];
