import { db } from "@/lib/server-db";
import { widget, project, testimonial } from "@my-better-t-app/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import Widget from "@/components/widget";
export const dynamic = "force-dynamic";

export default async function EmbedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const w = await db.query.widget.findFirst({
    where: eq(widget.id, id),
    with: {
      workspace: true,
    },
  });

  if (!w) {
    notFound();
  }

  const settings = JSON.parse(w.settingsJson);

  // Fetch testimonials
  const projectsList = await db.query.project.findMany({
    where: eq(project.workspaceId, w.workspaceId),
  });

  let testimonialsList: any[] = [];
  if (projectsList.length > 0) {
    const projectIds = projectsList.map((p) => p.id);
    testimonialsList = await db.query.testimonial.findMany({
      where: and(inArray(testimonial.projectId, projectIds), eq(testimonial.status, "approved")),
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
    <div className="min-h-screen bg-transparent p-4">
      <Widget data={widgetData} testimonials={testimonialsList} />
    </div>
  );
}
