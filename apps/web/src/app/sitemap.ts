import type { MetadataRoute } from "next";
import { createDb } from "@my-better-t-app/db";
import { project } from "@my-better-t-app/db/schema";
import { isNotNull } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://testimonialwall.com";
  const db = createDb();

  // Fetch all projects with a collection slug for dynamic collection URLs
  // This helps indexing of public testimonial collection pages
  const projects = await db
    .select({ slug: project.collectionSlug })
    .from(project)
    .where(isNotNull(project.collectionSlug));

  const collectionUrls: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/collect/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
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
  ];

  return [...staticUrls, ...collectionUrls];
}
