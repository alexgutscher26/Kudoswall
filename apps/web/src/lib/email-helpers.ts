import { EmailService } from "@my-better-t-app/email";
import { env } from "@my-better-t-app/env/server";
import { db } from "./server-db";
import { testimonial, project } from "@my-better-t-app/db/schema";
import { eq, count, and, isNull } from "drizzle-orm";

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

    // Sync to Loops.so
    const loopsApiKey = env.LOOPS_API_KEY;
    if (loopsApiKey && proj.workspace.owner.email) {
      try {
        const { LoopsService } = await import("@my-better-t-app/email");
        const loops = new LoopsService(loopsApiKey);

        // Fetch overall testimonial count in owner's workspace
        const testimonialCountResult = await db
          .select({ value: count() })
          .from(testimonial)
          .innerJoin(project, eq(testimonial.projectId, project.id))
          .where(and(eq(project.workspaceId, proj.workspaceId), isNull(testimonial.deletedAt)));
        const totalTestimonials = testimonialCountResult[0]?.value || 0;

        await loops.sendEvent({
          email: proj.workspace.owner.email,
          eventName: "testimonial_received",
          eventProperties: {
            authorName: testimonialData.authorName,
            rating: testimonialData.rating,
            isFirst: totalTestimonials === 1,
          },
        });

        await loops.updateContact({
          email: proj.workspace.owner.email,
          testimonialCount: totalTestimonials,
        });
        console.log(
          `[Loops Sync] Testimonial synced successfully for ${proj.workspace.owner.email}`,
        );
      } catch (loopsErr) {
        console.error("[Loops Sync] Failed to sync testimonial_received:", loopsErr);
      }
    }
  } catch (error) {
    console.error("[TESTIMONIAL_NOTIFICATION_FAILURE]", error);
  }
}

export async function sendAuthorConfirmationEmail(
  projectId: string,
  testimonialData: {
    authorName: string;
    authorEmail: string;
  },
) {
  try {
    const proj = await db.query.project.findFirst({
      where: eq(project.id, projectId),
    });

    if (!proj || !testimonialData.authorEmail) return;

    const emailService = new EmailService(env.RESEND_API_KEY || "", env.EMAIL_FROM);
    await emailService.sendSubmissionConfirmationEmail(
      testimonialData.authorEmail,
      testimonialData.authorName,
      proj.name,
      proj.thankYouMessage,
      proj.emailFromName,
    );
    console.log(`[AUTHOR_CONFIRMATION_SENT] Sent to ${testimonialData.authorEmail}`);
  } catch (error) {
    console.error("[AUTHOR_CONFIRMATION_FAILURE]", error);
  }
}
