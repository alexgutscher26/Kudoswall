import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent } from "@my-better-t-app/ui/components/card";
import { BLOG_POSTS } from "@/lib/blog";

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
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <Card className="dark:hover:shadow-primary/5 group-hover:border-primary/50 transition-all hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="mb-4 flex items-start justify-between">
                    <span className="text-muted-foreground text-sm">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
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

