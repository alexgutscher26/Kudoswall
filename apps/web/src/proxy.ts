import { db } from "@/lib/server-db";
import { project } from "@my-better-t-app/db/schema";
import { eq, isNull, and } from "drizzle-orm";

/**
 * Checks if a host name should be treated as a custom domain for a collection page.
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
 * Retrieves the project associated with a custom domain.
 */
export async function getProjectByCustomDomain(host: string) {
  if (!isCustomDomain(host)) return null;

  return await db.query.project.findFirst({
    where: and(
      eq(project.customDomain, host),
      eq(project.customDomainVerified, true),
      isNull(project.deletedAt),
    ),
  });
}
