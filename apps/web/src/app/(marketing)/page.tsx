import Hero from "@/components/hero";
import FeaturesSection from "@/components/sections/features-section";
import HowItWorksSection from "@/components/sections/how-it-works-section";
import WidgetPreviewSection from "@/components/sections/widget-preview-section";
// import SocialProofSection from "@/components/sections/social-proof-section";
import PricingSection from "@/components/sections/pricing-section";
import FaqSection from "@/components/sections/faq-section";
import CtaSection from "@/components/sections/cta-section";
import Footer from "@/components/footer";
import SocialProofSection from "@/components/sections/social-proof-section";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturesSection />
      <HowItWorksSection />
      <SocialProofSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
