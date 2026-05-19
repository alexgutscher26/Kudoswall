import type { MetadataRoute } from "next";
import { createDb } from "@my-better-t-app/db";
import { project } from "@my-better-t-app/db/schema";
import { isNotNull } from "drizzle-orm";
import { BLOG_POSTS } from "@/lib/blog";
import { COMPETITORS } from "@/lib/competitor-data";
import { PLATFORM_PAGES } from "@/lib/platform-pages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://kudoswall.org";
  const db = createDb();

  // Fetch all projects with a collection slug for dynamic collection URLs
  const projects = await db.query.project.findMany({
    where: isNotNull(project.collectionSlug),
  });

  const collectionUrls: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/collect/${p.collectionSlug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const wallUrls: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/wall/${p.collectionSlug}`,
    lastModified: p.updatedAt,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const blogUrls: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const vsUrls: MetadataRoute.Sitemap = COMPETITORS.map((c) => ({
    url: `${baseUrl}/vs/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const platformUrls: MetadataRoute.Sitemap = PLATFORM_PAGES.map((p) => ({
    url: `${baseUrl}/free-testimonials-for/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/free`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/agencies`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/dpa`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/security/responsible-disclosure`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  return [...staticUrls, ...blogUrls, ...vsUrls, ...collectionUrls, ...wallUrls, ...platformUrls];
}
