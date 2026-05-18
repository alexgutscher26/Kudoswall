import { db } from "@/lib/server-db";
import { widget, project, testimonial } from "@my-better-t-app/db/schema";
import { eq, and, desc, inArray, gte, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Widget from "@/components/widget";
import ErrorBoundary from "@/components/error-boundary";
import { JsonLd } from "@/components/seo/json-ld";

export const revalidate = 300; // Cache for 5 minutes at the edge

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
      workspace: {
        with: { organization: true },
      },
    },
  });

  if (!w) {
    notFound();
  }

  const settings = JSON.parse(w.settingsJson);
  settings.truncateText = "off"; // Explicitly disable truncation so full text shows

  // Derive font link server-side so it's in the HTML before React hydrates (no FOUF)
  const fontFamily = settings.fontFamily as string | undefined;
  const isGoogleFont = Boolean(
    fontFamily && !["sans", "serif", "mono", "custom"].includes(fontFamily),
  );
  const isCustomFont = fontFamily === "custom" && settings.customFontUrl;

  const fontHref = isGoogleFont
    ? `https://fonts.googleapis.com/css2?family=${(fontFamily as string).replace(/\s+/g, "+")}:wght@300;400;500;600;700;800;900&display=swap`
    : null;

  // Helper to normalize colors from URL params
  const normalizeColor = (c: string | string[] | undefined) => {
    if (!c || typeof c !== "string") return undefined;
    if (/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(c)) return `#${c}`;
    return c.startsWith("#") ? c : c;
  };

  // Allow query param overrides if Pro
  const effectivePlan = w.workspace.organization?.plan || w.workspace.plan;
  const isPro = effectivePlan !== "free" && effectivePlan !== null;

  if (isPro) {
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
      orderBy:
        settings.pinTopTestimonials !== false
          ? [
              desc(testimonial.featured),
              asc(testimonial.featuredOrder),
              desc(testimonial.createdAt),
            ]
          : [desc(testimonial.createdAt)],
      limit: settings.maxItems || 20,
    });
  }

  const widgetData = {
    id: w.id,
    name: w.name,
    settings,
    isPro,
    workspaceId: w.workspaceId,
  };

  // SEO: Structured Data for Widget
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: w.workspace.name,
    logo: isPro ? w.workspace.logoUrl : undefined,
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
      {/* Preconnect so DNS resolution happens in parallel with HTML parse */}
      {fontHref && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          {/* crossOrigin required for CORS fonts from gstatic */}
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link rel="stylesheet" href={fontHref} />
        </>
      )}
      {w.customCss && <style dangerouslySetInnerHTML={{ __html: w.customCss }} />}
      <style
        dangerouslySetInnerHTML={{
          __html: [
            "html, body { background: transparent !important; }",
            isCustomFont
              ? `
                @font-face {
                  font-family: 'CustomFont';
                  src: url('${settings.customFontUrl}') format('woff2');
                  font-weight: 300 900;
                  font-style: normal;
                  font-display: swap;
                }
                *, *::before, *::after { font-family: 'CustomFont', system-ui, sans-serif !important; }
              `
              : isGoogleFont
                ? `*, *::before, *::after { font-family: "${fontFamily}", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important; }`
                : "",
          ]
            .filter(Boolean)
            .join("\n"),
        }}
      />
      <JsonLd data={jsonLd} />
      <ErrorBoundary name="Widget">
        <Widget data={widgetData} testimonials={testimonialsList} />
      </ErrorBoundary>
    </div>
  );
}
