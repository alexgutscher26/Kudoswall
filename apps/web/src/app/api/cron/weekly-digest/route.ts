import { NextResponse } from "next/server";
import { createDb } from "@my-better-t-app/db";
import { workspace, testimonial, analyticsEvent } from "@my-better-t-app/db/schema";
import { env } from "@my-better-t-app/env/server";
import { and, eq, gte, count, isNull, inArray } from "drizzle-orm";
import { EmailService } from "@my-better-t-app/email";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (env.CRON_SECRET && authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = createDb();
  const emailService = new EmailService(env.RESEND_API_KEY || "", env.EMAIL_FROM);

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeWorkspaces = await db.query.workspace.findMany({
      where: and(isNull(workspace.deletedAt), inArray(workspace.plan, ["plan_1", "plan_2", "ltd"])),
      with: {
        owner: true,
        projects: true,
      },
    });

    const results = [];
    for (const ws of activeWorkspaces) {
      if (!ws.owner?.email) continue;

      const projectIds = ws.projects.map((p) => p.id);
      if (projectIds.length === 0) continue;

      // 1. New testimonials in last 7 days
      const [newTResult] = await db
        .select({ value: count() })
        .from(testimonial)
        .where(
          and(
            inArray(testimonial.projectId, projectIds),
            gte(testimonial.createdAt, sevenDaysAgo),
            isNull(testimonial.deletedAt),
          ),
        );

      const newTestimonials = Number(newTResult?.value || 0);

      // 2. Views in last 7 days
      const [viewsResult] = await db
        .select({ value: count() })
        .from(analyticsEvent)
        .where(
          and(
            eq(analyticsEvent.workspaceId, ws.id),
            eq(analyticsEvent.eventType, "view"),
            gte(analyticsEvent.createdAt, sevenDaysAgo),
            isNull(analyticsEvent.deletedAt),
          ),
        );

      const totalViews = Number(viewsResult?.value || 0);

      // 3. Conversion rate
      const conversionRate =
        totalViews > 0 ? ((newTestimonials / totalViews) * 100).toFixed(1) + "%" : "0%";

      // 4. Top testimonial (latest one)
      const topT = await db.query.testimonial.findFirst({
        where: and(
          inArray(testimonial.projectId, projectIds),
          gte(testimonial.createdAt, sevenDaysAgo),
          isNull(testimonial.deletedAt),
        ),
        orderBy: (t, { desc }) => [desc(t.rating), desc(t.createdAt)],
      });

      // Only send if there was some activity (new testimonials or views)
      if (newTestimonials > 0 || totalViews > 0) {
        try {
          await emailService.sendWeeklyDigest(ws.owner.email, ws.owner.name || "there", {
            newTestimonials,
            totalViews,
            conversionRate,
            topTestimonial: topT
              ? {
                  content: topT.content || "Video testimonial received",
                  author: topT.authorName || "Hidden",
                }
              : undefined,
          });
          results.push({ email: ws.owner.email, status: "sent" });
        } catch (error) {
          console.error(`[WEEKLY_DIGEST_FAILURE] to ${ws.owner.email}:`, error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: activeWorkspaces.length,
      digestsSent: results.length,
      details: results,
    });
  } catch (error) {
    console.error("[WEEKLY_DIGEST_CRON_FAILURE]", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
