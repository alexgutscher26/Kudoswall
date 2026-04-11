import { db } from "@/lib/server-db";
import { widget, project, testimonial } from "@my-better-t-app/db/schema";
import { eq, and, desc, inArray, gte } from "drizzle-orm";
import { notFound } from "next/navigation";
import Widget from "@/components/widget";
import ErrorBoundary from "@/components/error-boundary";
import { JsonLd } from "@/components/seo/json-ld";

export const revalidate = 0; // Disable caching for debugging to ensure live updates

export default async function EmbedPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sParams = await searchParams;

  const w = await db.query.widget.findFirst({
    where: eq(widget.id, id),
    with: {
      workspace: true,
    },
  });

  if (!w) {
    notFound();
  }

  let settings = JSON.parse(w.settingsJson);
  settings.truncateText = "off"; // Explicitly disable truncation so full text shows

  // Helper to normalize colors from URL params
  const normalizeColor = (c: string | string[] | undefined) => {
    if (!c || typeof c !== "string") return undefined;
    if (/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(c)) return `#${c}`;
    return c.startsWith("#") ? c : c;
  };

  // Allow query param overrides if Pro
  if (w.workspace.isPro) {
    if (sParams.theme) settings.theme = sParams.theme as any;
    if (sParams.layout) settings.layout = sParams.layout as any;

    const accent = normalizeColor(sParams.accentColor);
    if (accent) settings.accentColor = accent;

    const bg = normalizeColor(sParams.backgroundColor);
    if (bg) settings.backgroundColor = bg;

    const text = normalizeColor(sParams.textColor);
    if (text) settings.textColor = text;

    if (sParams.maxItems) settings.maxItems = parseInt(sParams.maxItems as string);
    if (sParams.hideBadge) settings.hideBadge = sParams.hideBadge === "true";
  }

  // Fetch all projects in workspace to gather testimonials
  const projectsList = await db.query.project.findMany({
    where: eq(project.workspaceId, w.workspaceId),
  });

  let testimonialsList: any[] = [];
  if (projectsList.length > 0) {
    const projectIds = projectsList.map((p) => p.id);

    // Dynamic where clause
    const whereConditions = [
      inArray(testimonial.projectId, projectIds),
      eq(testimonial.status, "approved"),
    ];

    // Relaxed filtering for debugging: only apply if explicitly set and > 0
    if (settings.filterMinRating && settings.filterMinRating > 0) {
      whereConditions.push(gte(testimonial.rating, settings.filterMinRating));
    }

    if (settings.filterType && settings.filterType !== "all") {
      whereConditions.push(eq(testimonial.type, settings.filterType));
    }

    testimonialsList = await db.query.testimonial.findMany({
      where: and(...whereConditions),
      orderBy: desc(testimonial.createdAt),
      limit: settings.maxItems || 20,
    });
  }

  const widgetData = {
    id: w.id,
    name: w.name,
    settings,
    isPro: w.workspace.isPro,
    workspaceId: w.workspaceId,
  };

  // SEO: Structured Data for Widget
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: w.workspace.name,
    logo: w.workspace.isPro ? w.workspace.logoUrl : undefined,
    aggregateRating:
      testimonialsList.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: (
              testimonialsList.reduce((acc, current) => acc + (current.rating || 5), 0) /
              testimonialsList.length
            ).toFixed(1),
            reviewCount: testimonialsList.length,
            bestRating: "5",
            worstRating: "1",
          }
        : undefined,
    review: testimonialsList.map((t) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: t.authorName || "Anonymous",
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating || 5,
        bestRating: 5,
        worstRating: 1,
      },
      description: t.content || "",
      datePublished: t.createdAt.toISOString(),
    })),
  };

  return (
    <div className="h-auto bg-transparent p-4">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        html, body { background: transparent !important; }
      `,
        }}
      />
      <JsonLd data={jsonLd} />
      <ErrorBoundary name="Widget">
        <Widget data={widgetData} testimonials={testimonialsList} />
      </ErrorBoundary>
    </div>
  );
}
