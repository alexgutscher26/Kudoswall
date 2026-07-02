import Hero from "@/components/hero";
import FeaturesSection from "@/components/sections/features-section";
import HowItWorksSection from "@/components/sections/how-it-works-section";
import PricingSection from "@/components/sections/pricing-section";
import FaqSection from "@/components/sections/faq-section";
import CtaSection from "@/components/sections/cta-section";
import NewsletterSection from "@/components/sections/newsletter-section";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default async function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FaqSection />
      <NewsletterSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
