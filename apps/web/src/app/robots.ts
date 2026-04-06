import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://testimonialwall.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/", "/login", "/register", "/embed/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
