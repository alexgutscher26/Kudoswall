import { NextResponse } from "next/server";
import { createDb } from "@my-better-t-app/db";
import { workspace, testimonial, project } from "@my-better-t-app/db/schema";
import { env } from "@my-better-t-app/env/server";
import { and, eq, lt, inArray } from "drizzle-orm";

/**
 * CRON: Data Retention Cleanup
 * This endpoint should be called daily to delete old testimonials
 * based on workspace-level retention policies.
 */

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Verify CRON_SECRET if it's set in the environment
  const authHeader = req.headers.get("authorization");
  if (env.CRON_SECRET && authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = createDb();

  try {
    // 1. Find all workspaces that have retention enabled
    const activeWorkspaces = await db.query.workspace.findMany({
      where: eq(workspace.retentionEnabled, true),
    });

    const results = [];
    let totalDeleted = 0;

    for (const ws of activeWorkspaces) {
      const days = ws.retentionDays || 365;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);

      // 2. Identify testimonials in this workspace older than the cutoff
      // We join with projects to ensure we only target testimonials in this workspace
      const oldTestimonials = await db
        .select({ id: testimonial.id })
        .from(testimonial)
        .innerJoin(project, eq(testimonial.projectId, project.id))
        .where(and(eq(project.workspaceId, ws.id), lt(testimonial.createdAt, cutoff)));

      if (oldTestimonials.length > 0) {
        const ids = oldTestimonials.map((t) => t.id);

        // 3. Perform the deletion
        // Note: For compliance, this is a hard delete.
        await db.delete(testimonial).where(inArray(testimonial.id, ids));

        totalDeleted += ids.length;
        results.push({
          workspaceId: ws.id,
          workspaceName: ws.name,
          deletedCount: ids.length,
          retentionDays: days,
          cutoff: cutoff.toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      workspacesProcessed: activeWorkspaces.length,
      totalDeleted,
      details: results,
    });
  } catch (error) {
    console.error("[RETENTION_CRON_FAILURE]", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
