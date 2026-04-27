import { db } from "@/lib/server-db";
import { widget, project, testimonial } from "@my-better-t-app/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getEnvAsync } from "@my-better-t-app/env/server";
import { withCoalescing } from "@/lib/coalesce";

export const runtime = "edge";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const env = await getEnvAsync();

  try {
    const { data, source } = await withCoalescing({
      key: `widget:${id}`,
      kv: env.WIDGET_KV,
      ttl: 3600,
      fetcher: async () => {
        const w = await db.query.widget.findFirst({
          where: eq(widget.id, id),
          with: {
            workspace: { with: { organization: true } },
          },
        });


        if (!w) {
          throw new Error("WIDGET_NOT_FOUND");
        }

        const settings = JSON.parse(w.settingsJson);

        // Fetch testimonials from all projects in the workspace
        const projectsList = await db.query.project.findMany({
          where: eq(project.workspaceId, w.workspaceId),
        });

        if (projectsList.length === 0) {
          return {
            widget: {
              id: w.id,
              name: w.name,
              settings,
              workspaceName: w.workspace.name,
              isPro: (w.workspace.organization?.plan || w.workspace.plan) !== "free",

            },
            testimonials: [],
          };
        }

        const projectIds = projectsList.map((p) => p.id);

        // Apply filters from settings
        const testimonials = await db.query.testimonial.findMany({
          where: and(
            inArray(testimonial.projectId, projectIds),
            eq(testimonial.status, "approved"),
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

        return {
          widget: {
            id: w.id,
            name: w.name,
            settings,
            workspaceName: w.workspace.name,
            isPro: (w.workspace.organization?.plan || w.workspace.plan) !== "free",

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
        };
      },
    });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        Vary: "Origin",
        "X-Cache": source === "kv" ? "HIT" : "MISS",
        "X-Coalesce": source,
      },
    });
  } catch (error: any) {
    if (error.message === "WIDGET_NOT_FOUND") {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    }
    console.error("Widget API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
