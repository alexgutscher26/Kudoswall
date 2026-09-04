import FaqAccordion from "./faq-accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Do my customers need to create an account or download an app to record a video?",
    answer:
      "No. Your customers simply open your link in any desktop or mobile browser and can record video or write text in two clicks with zero registration.",
  },
  {
    question: "Will embedding KudosWall slow down my website load time?",
    answer:
      "No. KudosWall embeds are ultra lightweight (under 12kb), delivered via global edge CDN caches, and load asynchronously without blocking your page paint or hurting Core Web Vitals.",
  },
  {
    question: "Can I customize the widgets to match my brand colors and dark mode?",
    answer:
      "Yes. You have complete control over corner radii, typography, dark or light themes, card borders, and layout styles including Grid, Masonry, Carousel, and Bento.",
  },
  {
    question: "How do I prevent spam or negative reviews from appearing on my site?",
    answer:
      "Every incoming submission arrives in your private dashboard. Testimonials only appear on your live website after you review and click approve.",
  },
  {
    question: "Can I import existing reviews from Twitter, Product Hunt, and G2?",
    answer:
      "Yes. You can import verified reviews from X (Twitter), Product Hunt, G2, Trustpilot, and the App Store with a single link paste.",
  },
  {
    question: "What platforms are supported for embedding?",
    answer:
      "KudosWall works anywhere HTML or JavaScript is allowed, including Next.js, Webflow, Framer, WordPress, Shopify, Squarespace, Ghost, and custom static sites.",
  },
  {
    question: "What happens when my 14 day free trial ends?",
    answer:
      "You can choose a plan that fits your volume or stay on our free tier. We will never display third party advertisements on your widgets or hold your data hostage.",
  },
  {
    question: "Do I need a credit card to get started?",
    answer:
      "No. You get immediate access to all Pro features for 14 days without entering credit card or payment details.",
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
    <section id="faq" className="relative bg-white px-4 py-20 sm:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-[680px] text-center">
          <span className="inline-block rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700">
            Frequently answered
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl [text-wrap:balance]">
            Got questions? We have answers.
          </h2>
          <p className="mt-3 text-base text-neutral-500 sm:text-lg [text-wrap:pretty]">
            Everything you need to know about collecting, managing, and displaying authentic customer praise.
          </p>
        </div>

        {/* FAQ Accordion */}
        <FaqAccordion items={FAQS} />
      </div>
    </section>
  );
}
