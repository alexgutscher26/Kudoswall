import { NextResponse } from "next/server";
import { createDb } from "@my-better-t-app/db";
import { workspace, testimonial, project } from "@my-better-t-app/db/schema";
import { env } from "@my-better-t-app/env/server";
import { and, eq, lt, max, isNull } from "drizzle-orm";
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
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // This is a bit complex for a single query with Drizzle without heavy joining
    // Let's find workspaces that have at least one project
    const activeWorkspaces = await db.query.workspace.findMany({
      where: isNull(workspace.deletedAt),
      with: {
        owner: true,
        projects: {
          with: {
            testimonials: {
              limit: 1,
              orderBy: (t, { desc }) => [desc(t.createdAt)],
            },
          },
        },
      },
    });

    const results = [];
    for (const ws of activeWorkspaces) {
      // Find the latest testimonial date across all projects
      let latestTestimonialDate: Date | null = null;
      let hasAnyTestimonial = false;

      for (const p of ws.projects) {
        if (p.testimonials.length > 0) {
          hasAnyTestimonial = true;
          const tDate = p.testimonials[0].createdAt;
          if (!latestTestimonialDate || tDate > latestTestimonialDate) {
            latestTestimonialDate = tDate;
          }
        }
      }

      // If they have testimonials, but none in the last 30 days
      if (
        hasAnyTestimonial &&
        latestTestimonialDate &&
        latestTestimonialDate < thirtyDaysAgo &&
        ws.owner?.email
      ) {
        try {
          await emailService.sendReEngagementEmail(ws.owner.email, ws.owner.name || "there");
          results.push({ email: ws.owner.email, lastTestimonial: latestTestimonialDate });
        } catch (error) {
          console.error(`[RE_ENGAGEMENT_FAILURE] to ${ws.owner.email}:`, error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: activeWorkspaces.length,
      emailed: results.length,
      details: results,
    });
  } catch (error) {
    console.error("[RE_ENGAGEMENT_CRON_FAILURE]", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
