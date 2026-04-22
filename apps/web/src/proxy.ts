import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/server-db";
import { project } from "@my-better-t-app/db/schema";
import { eq, isNull, and } from "drizzle-orm";

/**
 * List of subdomains that are reserved for platform use and should not
 * be captured by the custom domain mapping.
 */
const RESERVED_SUBDOMAINS = ["www", "api", "dashboard", "auth", "admin", "blog", "app"];

function isReservedSubdomain(host: string) {
  const mainDomain = "kudoswall.org";
  if (!host.endsWith(`.${mainDomain}`)) return false;
  const subdomain = host.replace(`.${mainDomain}`, "");
  return RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase());
}

/**
 * Next.js 16 Proxy implementation (replaces middleware)
 */
export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = new URL(request.url);

  // 0. Handle documentation proxy (Mintlify)
  if (url.pathname === "/docs" || url.pathname.startsWith("/docs/")) {
    const mintlifyUrl = new URL(url.pathname, "https://kudoswall.mintlify.dev");
    return NextResponse.rewrite(mintlifyUrl);
  }

  // 1. Detect if this is a custom domain or supported subdomain
  const mainDomain = "kudoswall.org";
  const isMainSite = host === mainDomain || host === `www.${mainDomain}`;

  const isSupportedDomain =
    !isMainSite &&
    !isReservedSubdomain(host) &&
    !host.includes("localhost") &&
    !host.includes("vercel.app") &&
    !host.includes("pages.dev");

  if (isSupportedDomain && url.pathname === "/") {
    // A. Check for exact verified custom domain
    let projectData = await db.query.project.findFirst({
      where: and(
        eq(project.customDomain, host),
        eq(project.customDomainVerified, true),
        isNull(project.deletedAt),
      ),
    });

    // B. Fallback to subdomain check (project-slug.kudoswall.org)
    if (!projectData && host.endsWith(`.${mainDomain}`)) {
      const subdomain = host.replace(`.${mainDomain}`, "");
      projectData = await db.query.project.findFirst({
        where: and(eq(project.collectionSlug, subdomain), isNull(project.deletedAt)),
      });
    }

    if (projectData?.collectionSlug) {
      // Rewrite to the collection page
      return NextResponse.rewrite(new URL(`/collect/${projectData.collectionSlug}`, request.url));
    }
  }

  // Handle other paths or default behavior
  return NextResponse.next();
}
