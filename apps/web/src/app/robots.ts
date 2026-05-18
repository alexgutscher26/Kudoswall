import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://kudoswall.org";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/", "/login", "/signup", "/verify-otp", "/embed/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
