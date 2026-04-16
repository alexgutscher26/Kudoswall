import { EmailService } from "@my-better-t-app/email";
import { env } from "@my-better-t-app/env/server";
import { db } from "./server-db";
import { testimonial, project } from "@my-better-t-app/db/schema";
import { eq, count } from "drizzle-orm";

export async function notifyOwnerNewTestimonial(
  projectId: string,
  testimonialData: {
    authorName: string;
    content: string;
    rating: number;
  },
) {
  try {
    // 1. Fetch project/workspace/owner and settings
    const proj = await db.query.project.findFirst({
      where: eq(project.id, projectId),
      with: {
        workspace: {
          with: {
            owner: true,
          },
        },
      },
    });

    if (!proj?.workspace?.owner?.email) return;

    // 2. Check settings
    let shouldSend = false;
    const settings = proj.workspace.notificationSettingsJson
      ? JSON.parse(proj.workspace.notificationSettingsJson)
      : { instantAlerts: true }; // default to true

    if (settings.instantAlerts !== false) {
      shouldSend = true;
    } else {
      // If instant alerts are OFF, still send if it's the first one!
      const testimonialCount = await db
        .select({ value: count() })
        .from(testimonial)
        .where(eq(testimonial.projectId, projectId));

      if (testimonialCount[0].value === 1) {
        shouldSend = true;
      }
    }

    if (shouldSend) {
      const emailService = new EmailService(env.RESEND_API_KEY || "", env.EMAIL_FROM);
      await emailService.sendFirstTestimonialEmail(
        proj.workspace.owner.email,
        proj.workspace.owner.name || "there",
        testimonialData.authorName,
        testimonialData.content,
        testimonialData.rating,
      );
      console.log(`[TESTIMONIAL_NOTIFICATION] Sent to ${proj.workspace.owner.email}`);
    }
  } catch (error) {
    console.error("[TESTIMONIAL_NOTIFICATION_FAILURE]", error);
  }
}
