import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TestimonialQuestionsDirectory from "@/components/testimonial-questions-directory";

export const metadata: Metadata = {
  title: "Testimonial Questions Generator & Directory | KudosWall",
  description:
    "Browse 30+ proven, high-converting testimonial questions across SaaS, E-Commerce, Courses, Agencies, and Communities. Build your perfect collection script in one click.",
  openGraph: {
    title: "Testimonial Questions Generator & Directory | KudosWall",
    description:
      "Browse 30+ proven, high-converting testimonial questions across SaaS, E-Commerce, Courses, Agencies, and Communities.",
    type: "website",
  },
};

export default async function TestimonialQuestionsPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-slate-900">
      {/* Navigation */}
      <Navbar />

      {/* Main Interactive App Container */}
      <div className="pt-32 pb-24">
        <TestimonialQuestionsDirectory />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
