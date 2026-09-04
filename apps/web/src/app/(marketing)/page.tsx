import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import TaglineRevealSection from "@/components/sections/tagline-reveal-section";
import ProblemSolutionSection from "@/components/sections/problem-solution-section";
import FeaturesSection from "@/components/sections/features-section";
import HowItWorksSection from "@/components/sections/how-it-works-section";
import WidgetPreviewSection from "@/components/sections/widget-preview-section";
import PricingSection from "@/components/sections/pricing-section";
import FaqSection from "@/components/sections/faq-section";
import CtaSection from "@/components/sections/cta-section";
import Footer from "@/components/footer";

export default async function Home() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <Navbar />
      <Hero />
      <TaglineRevealSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WidgetPreviewSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
