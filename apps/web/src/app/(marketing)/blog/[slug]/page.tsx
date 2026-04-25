import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  SENJA_COMPARISON,
  TESTIMONIAL_TO_COMPARISON,
  COURSE_CREATORS_COMPARISON,
  AFFORDABLE_SENJA_ALTERNATIVE,
  TEACHABLE_BEST_TOOLS,
  KAJABI_BEST_TOOLS,
  GUMROAD_BEST_TOOLS,
  FREE_PLAN_COMPARISON,
  WEBFLOW_WIDGET_GUIDE,
} from "@/lib/comparisons";
import { BLOG_POSTS } from "@/lib/blog";
import { Button } from "@my-better-t-app/ui/components/button";
import { ChevronLeft } from "lucide-react";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}


export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = "https://kudoswall.org";

  if (slug === "kudoswall-vs-senja") {
    return {
      title: "KudosWall vs Senja: Best Social Proof Alternative in 2026",
      description:
        "A deep dive comparison between KudosWall and Senja. Discover why KudosWall is the faster, more customizable social proof tool for SaaS founders.",
      alternates: { canonical: `${baseUrl}/blog/${slug}` },
      openGraph: {
        title: "KudosWall vs Senja: Which Social Proof Tool is Best?",
        description: "Compare features, pricing, and performance between KudosWall and Senja.",
        url: `${baseUrl}/blog/${slug}`,
        type: "article",
        images: [{ url: `${baseUrl}/og/vs-senja.png`, width: 1200, height: 630 }],
      },
    };
  }

  if (slug === "kudoswall-vs-testimonial-to") {
    return {
      title: "KudosWall vs Testimonial.to: The Modern Social Proof Comparison",
      description:
        "Looking for an alternative to Testimonial.to? See how KudosWall offers better high-fidelity text testimonials and faster edge-optimized widgets.",
      alternates: { canonical: `${baseUrl}/blog/${slug}` },
      openGraph: {
        title: "KudosWall vs Testimonial.to: The Ultimate Comparison",
        description: "Why high-fidelity text-only testimonials are winning in 2026.",
        url: `${baseUrl}/blog/${slug}`,
        type: "article",
        images: [{ url: `${baseUrl}/og/vs-testimonial-to.png`, width: 1200, height: 630 }],
      },
    };
  }

  if (slug === "testimonial-to-alternative-course-creators") {
    return {
      title: "The Best Testimonial.to Alternative for Course Creators (2026)",
      description:
        "Why the top 1% of course creators are moving to KudosWall for faster sales pages and verified student results.",
      alternates: { canonical: `${baseUrl}/blog/${slug}` },
      openGraph: {
        title: "Testimonial.to Alternative for Course Creators - KudosWall",
        description: "Speed up your sales page and build student trust with verified testimonials.",
        url: `${baseUrl}/blog/${slug}`,
        type: "article",
        images: [{ url: `${baseUrl}/og/course-creators.png`, width: 1200, height: 630 }],
      },
    };
  }

  if (slug === "affordable-senja-alternative") {
    return {
      title: "Affordable Senja Alternatives: Stop Overpaying for Social Proof",
      description:
        "Discover why KudosWall is the most cost-effective alternative to Senja for indie hackers and solo founders.",
      alternates: { canonical: `${baseUrl}/blog/${slug}` },
      openGraph: {
        title: "Affordable Senja Alternatives in 2026",
        description:
          "Indie hackers are switching to KudosWall for better value and lifetime access.",
        url: `${baseUrl}/blog/${slug}`,
        type: "article",
        images: [{ url: `${baseUrl}/og/affordable-senja.png`, width: 1200, height: 630 }],
      },
    };
  }

  if (slug === "best-testimonial-tools-teachable") {
    return {
      title: "Best Testimonial Tools for Teachable Creators (2026)",
      description: "Upgrade your course sales page with the best social proof tools for Teachable.",
      alternates: { canonical: `${baseUrl}/blog/${slug}` },
      openGraph: {
        title: "Best Testimonial Tools for Teachable",
        url: `${baseUrl}/blog/${slug}`,
        type: "article",
        images: [{ url: `${baseUrl}/og/teachable.png`, width: 1200, height: 630 }],
      },
    };
  }

  if (slug === "best-testimonial-tools-kajabi") {
    return {
      title: "Best Testimonial Tools for Kajabi Creators",
      description: "Match your premium Kajabi branding with highest-fidelity testimonial widgets.",
      alternates: { canonical: `${baseUrl}/blog/${slug}` },
      openGraph: {
        title: "Best Testimonial Tools for Kajabi",
        url: `${baseUrl}/blog/${slug}`,
        type: "article",
        images: [{ url: `${baseUrl}/og/kajabi.png`, width: 1200, height: 630 }],
      },
    };
  }

  if (slug === "best-testimonial-tools-gumroad") {
    return {
      title: "Best Testimonial Tools for Gumroad Sellers",
      description:
        "Convert more Gumroad customers with simple, effective, and affordable social proof.",
      alternates: { canonical: `${baseUrl}/blog/${slug}` },
      openGraph: {
        title: "Best Testimonial Tools for Gumroad",
        url: `${baseUrl}/blog/${slug}`,
        type: "article",
        images: [{ url: `${baseUrl}/og/gumroad.png`, width: 1200, height: 630 }],
      },
    };
  }

  if (slug === "free-testimonial-widget-comparison") {
    return {
      title: "Free Testimonial Widget: Every Tool's Free Plan Compared",
      description:
        "Who actually gives you the most value for free? A detailed comparison of testimonial tool free plans.",
      alternates: { canonical: `${baseUrl}/blog/${slug}` },
      openGraph: {
        title: "Free Testimonial Widget Comparison",
        url: `${baseUrl}/blog/${slug}`,
        type: "article",
        images: [{ url: `${baseUrl}/og/free-plan.png`, width: 1200, height: 630 }],
      },
    };
  }

  if (slug === "testimonial-widget-for-webflow") {
    return {
      title: "Testimonial Widget for Webflow: The Ultimate Guide (2026)",
      description:
        "How to add high-converting, edge-optimized testimonial widgets to your Webflow site without sacrificing page speed or design.",
      alternates: { canonical: `${baseUrl}/blog/${slug}` },
      openGraph: {
        title: "Testimonial Widget for Webflow",
        description: "The best social proof integration for Webflow.",
        url: `${baseUrl}/blog/${slug}`,
        type: "article",
        images: [{ url: `${baseUrl}/og/webflow.png`, width: 1200, height: 630 }],
      },
    };
  }

  return {
    title: "Blog Post Not Found",
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) {
    return notFound();
  }

  let content = null;
  let title = "";
  let description = "";
  let date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const baseUrl = "https://kudoswall.org";

  if (slug === "kudoswall-vs-senja") {
    content = SENJA_COMPARISON.content;
    title = "KudosWall vs Senja: Best Social Proof Alternative in 2026";
    description = "A deep dive comparison between KudosWall and Senja.";
  } else if (slug === "kudoswall-vs-testimonial-to") {
    content = TESTIMONIAL_TO_COMPARISON.content;
    title = "KudosWall vs Testimonial.to: The Modern Social Proof Comparison";
    description = "Looking for an alternative to Testimonial.to?";
  } else if (slug === "testimonial-to-alternative-course-creators") {
    content = COURSE_CREATORS_COMPARISON.content;
    title = "The Best Testimonial.to Alternative for Course Creators (2026)";
    description = "Why course creators are switching to KudosWall.";
  } else if (slug === "affordable-senja-alternative") {
    content = AFFORDABLE_SENJA_ALTERNATIVE.content;
    title = "Affordable Senja Alternatives: Stop Overpaying for Social Proof";
    description = "The best value alternative for indie hackers.";
  } else if (slug === "best-testimonial-tools-teachable") {
    content = TEACHABLE_BEST_TOOLS.content;
    title = "Best Testimonial Tools for Teachable Creators (2026)";
    description = "Upgrade your course sales page with the best social proof tools for Teachable.";
  } else if (slug === "best-testimonial-tools-kajabi") {
    content = KAJABI_BEST_TOOLS.content;
    title = "Best Testimonial Tools for Kajabi Creators";
    description = "Match your premium Kajabi branding with highest-fidelity testimonial widgets.";
  } else if (slug === "best-testimonial-tools-gumroad") {
    content = GUMROAD_BEST_TOOLS.content;
    title = "Best Testimonial Tools for Gumroad Sellers";
    description =
      "Convert more Gumroad customers with simple, effective, and affordable social proof.";
  } else if (slug === "free-testimonial-widget-comparison") {
    content = FREE_PLAN_COMPARISON.content;
    title = "Free Testimonial Widget: Every Tool's Free Plan Compared";
    description = "Who actually gives you the most value for free?";
  } else if (slug === "testimonial-widget-for-webflow") {
    content = WEBFLOW_WIDGET_GUIDE.content;
    title = "Testimonial Widget for Webflow: The Ultimate Guide (2026)";
    description =
      "How to add high-converting, edge-optimized testimonial widgets to your Webflow site.";
  } else {
    return notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    author: {
      "@type": "Person",
      name: "Alex G.",
      url: baseUrl,
    },
    datePublished: "2026-04-18T00:00:00Z",
    dateModified: "2026-04-18T00:00:00Z",
    publisher: {
      "@type": "Organization",
      name: "KudosWall",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${slug}`,
    },
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-24">
        <Link href="/blog">
          <Button variant="ghost" className="mb-8 -ml-4">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>
        </Link>
        <header className="mb-12">
          <div className="text-primary mb-4 text-sm font-medium">{date}</div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
        </header>

        <article className="text-foreground/90 space-y-8 leading-relaxed">{content}</article>

        <div className="bg-primary/5 border-primary/10 mt-24 rounded-2xl border p-8 text-center">
          <h3 className="mb-4 text-2xl font-bold">Ready to upgrade your social proof?</h3>
          <p className="text-muted-foreground mb-8 text-lg">
            Join 1,000+ founders who switched to KudosWall for better branding and automated
            collection.
          </p>
          <Link href="/login">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-lg font-semibold"
            >
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
