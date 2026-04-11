import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextResponse } from "next/server";
import { createDb } from "@my-better-t-app/db";
import { workspace, testimonial, analyticsEvent, project } from "@my-better-t-app/db/schema";
import { eq, gte, and, inArray } from "drizzle-orm";
import { EmailService } from "@my-better-t-app/email";
import { env } from "@my-better-t-app/env/server";

async function handler(req: Request) {
  try {
    const db = createDb();

    // Find all paid workspaces
    const proWorkspaces = await db.query.workspace.findMany({
      where: eq(workspace.isPro, true),
      with: {
        owner: true,
        projects: true
      }
    });

    const emailService = new EmailService(env.RESEND_API_KEY || "");

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    for (const ws of proWorkspaces) {
      if (!ws.owner || !ws.owner.email) continue;
      if (!ws.projects || ws.projects.length === 0) continue;

      const projectIds = ws.projects.map((p) => p.id);

      // Get new testimonials in last 7 days scoped to the workspace's projects
      const wsNewTestimonials = await db.query.testimonial.findMany({
        where: and(
          inArray(testimonial.projectId, projectIds),
          gte(testimonial.createdAt, oneWeekAgo)
        ),
      });

      // Get total views in last 7 days
      const recentViews = await db.query.analyticsEvent.findMany({
        where: and(
          eq(analyticsEvent.workspaceId, ws.id),
          eq(analyticsEvent.eventType, "view"),
          gte(analyticsEvent.createdAt, oneWeekAgo)
        )
      });

      const newTestimonialsCount = wsNewTestimonials.length;
      const totalViews = recentViews.length;

      const conversionRate =
        totalViews > 0
          ? ((newTestimonialsCount / totalViews) * 100).toFixed(1) + "%"
          : "—";

      // Find top testimonial (highest rating, most recent)
      const topTestimonialData = wsNewTestimonials
        .sort((a, b) => {
          if (a.rating !== b.rating) {
            return (b.rating || 0) - (a.rating || 0);
          }
          return b.createdAt.getTime() - a.createdAt.getTime();
        })[0];

      let topTestimonial;
      if (topTestimonialData && topTestimonialData.content) {
        topTestimonial = {
          content: topTestimonialData.content,
          author: topTestimonialData.authorName || "Anonymous",
        };
      }

      await emailService.sendWeeklyDigest(
        ws.owner.email,
        ws.owner.name || "there",
        {
          newTestimonials: newTestimonialsCount,
          totalViews,
          conversionRate,
          topTestimonial,
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Weekly digest failed:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

// Next.js static site generation evaluates the file, so we provide fallback config for build-time evaluation
export const POST = process.env.NODE_ENV === "development" || !process.env.QSTASH_CURRENT_SIGNING_KEY
  ? handler
  : verifySignatureAppRouter(handler);
