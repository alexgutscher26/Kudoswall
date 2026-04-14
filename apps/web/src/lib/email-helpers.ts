import { EmailService } from "@my-better-t-app/email";
import { env } from "@my-better-t-app/env/server";
import { db } from "./server-db";
import { testimonial, project, workspace, user } from "@my-better-t-app/db/schema";
import { eq, count, and } from "drizzle-orm";

export async function checkAndSendFirstTestimonialEmail(
  projectId: string,
  testimonialData: {
    authorName: string;
    content: string;
    rating: number;
  },
) {
  try {
    // 1. Check if this is indeed the first testimonial for this project/workspace
    const testimonialCount = await db
      .select({ value: count() })
      .from(testimonial)
      .where(eq(testimonial.projectId, projectId));

    // If count is 1 (the one we just inserted), it's the first!
    if (testimonialCount[0].value === 1) {
      // 2. Fetch project/workspace/owner info
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

      if (proj?.workspace?.owner?.email) {
        const emailService = new EmailService(env.RESEND_API_KEY || "", env.EMAIL_FROM);
        await emailService.sendFirstTestimonialEmail(
          proj.workspace.owner.email,
          proj.workspace.owner.name || "there",
          testimonialData.authorName,
          testimonialData.content,
          testimonialData.rating,
        );
        console.log(`[FIRST_TESTIMONIAL_EMAIL] Sent to ${proj.workspace.owner.email}`);
      }
    }
  } catch (error) {
    console.error("[FIRST_TESTIMONIAL_EMAIL_FAILURE]", error);
  }
}
