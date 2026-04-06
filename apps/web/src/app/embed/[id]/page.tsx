import { db } from "@/lib/server-db";
import { widget, project, testimonial } from "@my-better-t-app/db/schema";
import { eq, and, desc, inArray, gte } from "drizzle-orm";
import { notFound } from "next/navigation";
import Widget from "@/components/widget";
export const dynamic = "force-dynamic";

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

  // Helper to normalize colors from URL params
  const normalizeColor = (c: string | string[] | undefined) => {
    if (!c || typeof c !== "string") return undefined;
    // If it's a 3 or 6 char hex code without #, add it
    if (/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(c)) return `#${c}`;
    return c.startsWith("#") ? c : c; // Already has # or is a named color
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

  // Fetch testimonials
  const projectsList = await db.query.project.findMany({
    where: eq(project.workspaceId, w.workspaceId),
  });

  let testimonialsList: any[] = [];
  if (projectsList.length > 0) {
    const projectIds = projectsList.map((p) => p.id);

    // Apply additional filters
    const whereConditions = [
      inArray(testimonial.projectId, projectIds),
      eq(testimonial.status, "approved"),
    ];

    if (settings.filterMinRating > 0) {
      whereConditions.push(gte(testimonial.rating, settings.filterMinRating));
    }

    if (settings.filterType !== "all") {
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

  return (
    <div className="h-auto bg-transparent p-4">
      <Widget data={widgetData} testimonials={testimonialsList} />
    </div>
  );
}
