import { db } from "@/lib/server-db";
import { widget, project, testimonial } from "@my-better-t-app/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const w = await db.query.widget.findFirst({
      where: eq(widget.id, id),
      with: {
        workspace: true,
      },
    });

    if (!w) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    }

    const settings = JSON.parse(w.settingsJson);

    // Fetch testimonials from all projects in the workspace
    const projectsList = await db.query.project.findMany({
      where: eq(project.workspaceId, w.workspaceId),
    });

    if (projectsList.length === 0) {
      return NextResponse.json({
        widget: { ...w, settings },
        testimonials: [],
      });
    }

    const projectIds = projectsList.map((p) => p.id);

    // Apply filters from settings
    const testimonials = await db.query.testimonial.findMany({
      where: and(
        inArray(testimonial.projectId, projectIds),
        eq(testimonial.status, "approved"),
        // Additional filters could go here
      ),
      orderBy: desc(testimonial.createdAt),
      limit: settings.maxItems || 20,
      with: {
        testimonialToTags: {
          with: {
            tag: true,
          },
        },
      },
    });

    // Return the widget config and testimonials
    return NextResponse.json({
      widget: {
        id: w.id,
        name: w.name,
        settings,
        workspaceName: w.workspace.name,
        isPro: w.workspace.plan !== "free",
      },
      testimonials: testimonials.map((t) => ({
        id: t.id,
        content: t.content,
        rating: t.rating,
        authorName: t.authorName,
        authorTagline: t.authorTagline,
        authorCompany: t.authorCompany,
        authorImage: t.authorImage,
        createdAt: t.createdAt,
        type: t.type,
        videoUrl: t.videoUrl,
        tags: t.testimonialToTags.map((tt) => ({
          name: tt.tag.name,
          color: tt.tag.color,
        })),
      })),
    });
  } catch (error) {
    console.error("Widget API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
