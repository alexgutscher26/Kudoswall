import { NextResponse } from "next/server";
import { createDb } from "@my-better-t-app/db";
import { workspace } from "@my-better-t-app/db/schema";
import { env } from "@my-better-t-app/env/server";
import { and, lt, gt, isNull, eq } from "drizzle-orm";
import { EmailService } from "@my-better-t-app/email";

export const dynamic = "force-dynamic";

/**
 * Cron job to notify users when their Pro trial is about to expire.
 * Should be run daily.
 * Target: Workspaces with trials ending in the next 48 hours.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (env.CRON_SECRET && authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = createDb();
  const emailService = new EmailService(env.RESEND_API_KEY || "", env.EMAIL_FROM);

  try {
    const now = new Date();
    const fortyEightHoursFromNow = new Date();
    fortyEightHoursFromNow.setHours(fortyEightHoursFromNow.getHours() + 48);

    // Find workspaces where trial ends between now and 48 hours from now
    const expiringTrials = await db.query.workspace.findMany({
      where: and(
        eq(workspace.subscriptionStatus, "trialing"),
        gt(workspace.trialEndsAt, now),
        lt(workspace.trialEndsAt, fortyEightHoursFromNow),
        isNull(workspace.deletedAt),
      ),
      with: {
        owner: true,
      },
    });

    const results = [];
    for (const ws of expiringTrials) {
      if (ws.owner?.email && ws.trialEndsAt) {
        try {
          const expiryDateFormatted = new Intl.DateTimeFormat("en-US", {
            dateStyle: "long",
          }).format(ws.trialEndsAt);

          await emailService.sendTrialExpiringEmail(
            ws.owner.email,
            ws.owner.name || "there",
            expiryDateFormatted,
          );

          results.push({ email: ws.owner.email, status: "sent" });
        } catch (error) {
          console.error(`[TRIAL_EXPIRING_FAILURE] to ${ws.owner.email}:`, error);
          results.push({ email: ws.owner.email, status: "failed", error });
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      found: expiringTrials.length,
      sent: results.length,
      details: results,
    });
  } catch (error) {
    console.error("[TRIAL_EXPIRING_CRON_FAILURE]", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
