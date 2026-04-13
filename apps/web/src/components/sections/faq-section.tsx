import FaqAccordion from "./faq-accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How does KudosWall work?",
    answer:
      "KudosWall provides you with a unique, shareable link that you can send to your customers. They click the link, record a video or type a text testimonial, and submit it. You then review and approve the testimonials from your dashboard and embed them on your site with a simple script tag.",
  },
  {
    question: "Do my customers need to create an account to leave a review?",
    answer:
      "No. We believe in zero friction. Your customers can leave a high-quality video or text testimonial directly from their browser without ever signing up or downloading an app.",
  },
  {
    question: "Can I customize the look of the testimonial widget?",
    answer:
      "Yes! You can customize the colors, fonts, layout, and even the rounding of the corners to perfectly match your brand identity. All changes can be previewed live in your dashboard.",
  },
  {
    question: "Which platforms does the embed widget support?",
    answer:
      "KudosWall works on any platform that allows you to add HTML/JavaScript. This includes WordPress, Wix, Squarespace, Webflow, Shopify, Framer, and custom-built websites.",
  },
  {
    question: "Is there a limit on how many testimonials I can collect?",
    answer:
      "Our Free forever plan allows you to collect and display a limited number of testimonials. Our Pro and Business plans offer unlimited collection, advanced analytics, and premium customization options.",
  },
];

export default function FaqSection() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden px-4 py-24"
      style={{ backgroundColor: "#ffffff" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Dot-grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <span
            className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-widest uppercase"
            style={{ color: "#e8527a", backgroundColor: "#fff5f7" }}
          >
            FAQ
          </span>
          <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            Frequently Asked <span style={{ color: "#e8527a" }}>Questions</span>
          </h2>
        </div>

        {/* FAQ Accordion */}
        <FaqAccordion items={FAQS} />
      </div>
    </section>
  );
}
