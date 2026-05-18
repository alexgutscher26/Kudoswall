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
  TEN_X_FREE_TIER,
  FREE_VIDEO_TESTIMONIAL_SOFTWARE,
  FREE_SENJA_ALTERNATIVE,
  FREE_WALL_OF_LOVE,
  COLLECT_TESTIMONIALS_GUIDE,
  BEST_FREE_TOOLS_2026,
  CARRD_EMBED_GUIDE,
  BEEHIIV_EMBED_GUIDE,
  TESTIMONIAL_QUESTIONS_GUIDE,
  AGENCY_SOFTWARE_GUIDE,
  AGENCY_PLAYBOOK,
  VOUCH_ALTERNATIVE,
  FRAMER_EMBED_GUIDE,
  COURSE_CREATOR_TESTIMONIALS,
  VIDEO_TESTIMONIALS_GUIDE,
  COURSE_TESTIMONIALS_GUIDE,
  TESTIMONIAL_COLLECTION_SOFTWARE_GUIDE,
  SAAS_TESTIMONIALS_GUIDE,
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
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) {
    return {
      title: "Blog Post Not Found",
    };
  }

  const baseUrl = "https://kudoswall.org";

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${baseUrl}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${baseUrl}/blog/${slug}`,
      type: "article",
      images: [{ url: `${baseUrl}/og/${slug}.png`, width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) {
    return notFound();
  }

  let content = null;
  const title = post.title;
  const description = post.description;
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const baseUrl = "https://kudoswall.org";

  if (slug === "kudoswall-vs-senja") {
    content = SENJA_COMPARISON.content;
  } else if (slug === "kudoswall-vs-testimonial-to") {
    content = TESTIMONIAL_TO_COMPARISON.content;
  } else if (slug === "testimonial-to-alternative-course-creators") {
    content = COURSE_CREATORS_COMPARISON.content;
  } else if (slug === "affordable-senja-alternative") {
    content = AFFORDABLE_SENJA_ALTERNATIVE.content;
  } else if (slug === "best-testimonial-tools-teachable") {
    content = TEACHABLE_BEST_TOOLS.content;
  } else if (slug === "best-testimonial-tools-kajabi") {
    content = KAJABI_BEST_TOOLS.content;
  } else if (slug === "best-testimonial-tools-gumroad") {
    content = GUMROAD_BEST_TOOLS.content;
  } else if (slug === "free-testimonial-widget-comparison") {
    content = FREE_PLAN_COMPARISON.content;
  } else if (slug === "testimonial-widget-for-webflow") {
    content = WEBFLOW_WIDGET_GUIDE.content;
  } else if (slug === "why-we-made-free-tier-10x-bigger") {
    content = TEN_X_FREE_TIER.content;
  } else if (slug === "free-testimonial-software-with-video") {
    content = FREE_VIDEO_TESTIMONIAL_SOFTWARE.content;
  } else if (slug === "free-senja-alternative") {
    content = FREE_SENJA_ALTERNATIVE.content;
  } else if (slug === "free-wall-of-love") {
    content = FREE_WALL_OF_LOVE.content;
  } else if (slug === "best-free-testimonial-software") {
    content = BEST_FREE_TOOLS_2026.content;
  } else if (slug === "how-to-collect-customer-testimonials") {
    content = COLLECT_TESTIMONIALS_GUIDE.content;
  } else if (slug === "how-to-embed-testimonials-on-carrd") {
    content = CARRD_EMBED_GUIDE.content;
  } else if (slug === "how-to-embed-testimonials-on-beehiiv") {
    content = BEEHIIV_EMBED_GUIDE.content;
  } else if (slug === "testimonial-questions-to-ask-customers") {
    content = TESTIMONIAL_QUESTIONS_GUIDE.content;
  } else if (slug === "testimonial-software-for-agencies") {
    content = AGENCY_SOFTWARE_GUIDE.content;
  } else if (slug === "how-to-collect-client-testimonials") {
    content = AGENCY_PLAYBOOK.content;
  } else if (slug === "vouch-alternative") {
    content = VOUCH_ALTERNATIVE.content;
  } else if (slug === "how-to-embed-testimonials-on-framer") {
    content = FRAMER_EMBED_GUIDE.content;
  } else if (slug === "course-creator-testimonials") {
    content = COURSE_CREATOR_TESTIMONIALS.content;
  } else if (slug === "video-testimonials-ultimate-guide") {
    content = VIDEO_TESTIMONIALS_GUIDE.content;
  } else if (slug === "collect-course-testimonials") {
    content = COURSE_TESTIMONIALS_GUIDE.content;
  } else if (slug === "testimonial-collection-software") {
    content = TESTIMONIAL_COLLECTION_SOFTWARE_GUIDE.content;
  } else if (slug === "saas-testimonials") {
    content = SAAS_TESTIMONIALS_GUIDE.content;
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
    datePublished: `${post.date}T00:00:00Z`,
    dateModified: `${post.date}T00:00:00Z`,
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

        {/* Related Posts */}
        <div className="mt-24 border-t pt-16">
          <h3 className="mb-8 text-2xl font-bold">Recent Posts</h3>
          <div className="grid gap-8 md:grid-cols-2">
            {BLOG_POSTS.filter((p) => p.slug !== slug)
              .slice(0, 4)
              .map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="group block space-y-2"
                >
                  <div className="text-muted-foreground text-sm">
                    {new Date(relatedPost.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <h4 className="group-hover:text-primary text-xl font-bold transition-colors">
                    {relatedPost.title}
                  </h4>
                  <p className="text-muted-foreground line-clamp-2">{relatedPost.description}</p>
                </Link>
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
