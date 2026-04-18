import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent } from "@my-better-t-app/ui/components/card";

const blogPosts = [
  {
    title: "KudosWall vs Senja: Which Social Proof Tool is Best for Your SaaS?",
    description:
      "A deep dive comparison between KudosWall and Senja. We look at pricing, features, and when to choose which.",
    slug: "kudoswall-vs-senja",
    date: "April 18, 2026",
  },
  {
    title: "KudosWall vs Testimonial.to: The Ultimate Comparison",
    description:
      "Looking for an alternative to Testimonial.to? Read our detailed comparison to see which tool handles video testimonials better.",
    slug: "kudoswall-vs-testimonial-to",
    date: "April 18, 2026",
  },
  {
    title: "The Best Testimonial.to Alternative for Course Creators (2026)",
    description:
      "Why the top 1% of course creators are moving to KudosWall for faster sales pages and verified student results.",
    slug: "testimonial-to-alternative-course-creators",
    date: "April 18, 2026",
  },
  {
    title: "Affordable Senja Alternatives: Stop Overpaying for Social Proof",
    description:
      "Discover why KudosWall is the most cost-effective alternative to Senja for indie hackers and solo founders.",
    slug: "affordable-senja-alternative",
    date: "April 18, 2026",
  },
  {
    title: "Best Testimonial Tools for Teachable Creators (2026)",
    description: "Upgrade your course sales page with the best social proof tools for Teachable.",
    slug: "best-testimonial-tools-teachable",
    date: "April 18, 2026",
  },
  {
    title: "Best Testimonial Tools for Kajabi Creators",
    description: "Match your premium Kajabi branding with highest-fidelity testimonial widgets.",
    slug: "best-testimonial-tools-kajabi",
    date: "April 18, 2026",
  },
  {
    title: "Best Testimonial Tools for Gumroad Sellers",
    description:
      "Convert more Gumroad customers with simple, effective, and affordable social proof.",
    slug: "best-testimonial-tools-gumroad",
    date: "April 18, 2026",
  },
  {
    title: "Free Testimonial Widget: Every Tool's Free Plan Compared",
    description:
      "Who actually gives you the most value for free? A detailed comparison of testimonial tool free plans.",
    slug: "free-testimonial-widget-comparison",
    date: "April 18, 2026",
  },
];

export default function BlogPage() {
  return (
    <main className="bg-background min-h-screen">
      <Navbar />
      <div className="container mx-auto max-w-4xl px-4 py-24">
        <header className="mb-16 text-center">
          <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            The KudosWall Blog
          </h1>
          <p className="text-muted-foreground text-xl">
            Insights, guides, and comparisons to help you build trust with social proof.
          </p>
        </header>

        <div className="grid gap-8">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <Card className="dark:hover:shadow-primary/5 group-hover:border-primary/50 transition-all hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="mb-4 flex items-start justify-between">
                    <span className="text-muted-foreground text-sm">{post.date}</span>
                  </div>
                  <h2 className="group-hover:text-primary text-foreground mb-4 text-2xl font-bold transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {post.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
