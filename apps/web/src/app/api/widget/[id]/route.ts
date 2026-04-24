import { db } from "@/lib/server-db";
import { widget, project, testimonial } from "@my-better-t-app/db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getEnvAsync } from "@my-better-t-app/env/server";

export const runtime = "edge";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const env = await getEnvAsync();

  try {
    // 1. Try KV lookup for sub-10ms response
    if (env.WIDGET_KV) {
      const cached = await env.WIDGET_KV.get(`widget:${id}`, "json");
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            Vary: "Origin",
            "X-Cache": "HIT",
          },
        });
      }
    }

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
      const emptyResponse = {
        widget: {
          id: w.id,
          name: w.name,
          settings,
          workspaceName: w.workspace.name,
          isPro: w.workspace.plan !== "free",
        },
        testimonials: [],
      };

      if (env.WIDGET_KV) {
        await env.WIDGET_KV.put(`widget:${id}`, JSON.stringify(emptyResponse), {
          expirationTtl: 3600,
        });
      }

      return NextResponse.json(emptyResponse);
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

    const responseData = {
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
    };

    // 2. Store in KV for subsequent requests
    if (env.WIDGET_KV) {
      await env.WIDGET_KV.put(`widget:${id}`, JSON.stringify(responseData), {
        expirationTtl: 3600, // 1 hour
      });
    }

    // Return the response
    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        Vary: "Origin",
        "X-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Widget API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
