import { db } from "@/lib/server-db";
import { project } from "@my-better-t-app/db/schema";
import { eq, isNull, and } from "drizzle-orm";

/**
 * List of subdomains that are reserved for platform use and should not
 * be mapped to a project collection page.
 */
const RESERVED_SUBDOMAINS = ["www", "api", "dashboard", "auth", "admin", "blog", "app"];

/**
 * Checks if a host name should be treated as a routing domain.
 * Excludes the main domain and typical development/staging domains.
 */
export function isCustomDomain(host: string) {
  const mainDomain = "kudoswall.org";
  const isMainSite = host === mainDomain || host === `www.${mainDomain}`;

  return (
    !isMainSite &&
    !host.includes("localhost") &&
    !host.includes("vercel.app") &&
    !host.includes("pages.dev")
  );
}

/**
 * Retrieves the project associated with a host.
 * Supports:
 * 1. Verified custom domains (e.g. testimonials.mybrand.com)
 * 2. Automatic subdomains (e.g. project-slug.kudoswall.org)
 */
export async function getProjectByHost(host: string) {
  const mainDomain = "kudoswall.org";

  // 1. Check for exact matching custom domain (verified)
  const customProject = await db.query.project.findFirst({
    where: and(
      eq(project.customDomain, host),
      eq(project.customDomainVerified, true),
      isNull(project.deletedAt),
    ),
  });

  if (customProject) return customProject;

  // 2. Check for subdomain mapping (e.g. threddiq.kudoswall.org)
  if (host.endsWith(`.${mainDomain}`)) {
    const subdomain = host.replace(`.${mainDomain}`, "");

    // Skip if it's a reserved subdomain or empty
    if (!subdomain || RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())) {
      return null;
    }

    // Lookup by collectionSlug or slug
    return await db.query.project.findFirst({
      where: and(eq(project.collectionSlug, subdomain), isNull(project.deletedAt)),
    });
  }

  return null;
}
