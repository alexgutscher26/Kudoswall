import { NextResponse } from "next/server";
import { createDb, type Database } from "@my-better-t-app/db";
import { workspace, project, user } from "@my-better-t-app/db/schema";
import { env } from "@my-better-t-app/env/server";
import { and, eq, lt, gt, isNull, sql } from "drizzle-orm";
import { EmailService } from "@my-better-t-app/email";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Verify CRON_SECRET if it's set in the environment
  const authHeader = req.headers.get("authorization");
  if (env.CRON_SECRET && authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = createDb();
  const emailService = new EmailService(env.RESEND_API_KEY || "", env.EMAIL_FROM);

  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Find workspaces created between 2 and 3 days ago that have no projects
    const workspacesToNudge = await db.query.workspace.findMany({
      where: and(
        gt(workspace.createdAt, threeDaysAgo),
        lt(workspace.createdAt, twoDaysAgo),
        isNull(workspace.deletedAt),
      ),
      with: {
        owner: true,
        projects: {
          limit: 1,
        },
      },
    });

    const results = [];
    for (const ws of workspacesToNudge) {
      if (ws.projects.length === 0 && ws.owner?.email) {
        try {
          await emailService.sendActivationNudge(ws.owner.email, ws.owner.name || "there");
          results.push({ email: ws.owner.email, status: "sent" });
        } catch (error) {
          console.error(`[ACTIVATION_NUDGE_FAILURE] to ${ws.owner.email}:`, error);
          results.push({ email: ws.owner.email, status: "failed", error });
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      processed: workspacesToNudge.length,
      nudged: results.length,
      details: results,
    });
  } catch (error) {
    console.error("[ACTIVATION_NUDGE_CRON_FAILURE]", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
