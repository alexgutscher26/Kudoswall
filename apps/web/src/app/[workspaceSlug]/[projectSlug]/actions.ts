"use server";

import { db } from "@/lib/server-db";
import { project, testimonial, workspace } from "@my-better-t-app/db/schema";
import { eq, and, count } from "drizzle-orm";
import { nanoid } from "nanoid";
import { notifyOwnerNewTestimonial } from "@/lib/email-helpers";

export async function getProjectBySlug(workspaceSlug: string, projectSlug: string) {
  const ws = await db.query.workspace.findFirst({
    where: eq(workspace.slug, workspaceSlug),
  });

  if (!ws) return null;

  const result = await db.query.project.findFirst({
    where: and(eq(project.workspaceId, ws.id), eq(project.slug, projectSlug)),
    with: {
      workspace: true,
    },
  });

  if (!result) return null;

  // Get current usage for permissions
  const counts = await db
    .select({ count: count() })
    .from(testimonial)
    .where(eq(testimonial.projectId, result.id));

  const { getWorkspacePermissions } = await import("@my-better-t-app/api/logic/billing");
  const permissions = getWorkspacePermissions({
    plan: result.workspace.plan,
    testimonialsCount: counts[0]?.count ?? 0,
  });

  return {
    ...result,
    permissions,
    workspace: {
      ...result.workspace,
      branding: result.workspace.brandingJson
        ? JSON.parse(result.workspace.brandingJson)
        : {
            accentColor: "#e8527a",
            font: "sans",
            logoUrl: result.workspace.logoUrl,
          },
    },
  };
}

export async function submitTestimonial(
  projectId: string,
  data: {
    rating: number;
    content: string;
    authorName: string;
    authorEmail: string;
    authorImage?: string;
    authorCompany?: string;
    authorLinkedin?: string;
    authorTagline?: string;
    videoUrl?: string;
  },
) {
  const id = `tst_${nanoid()}`;

  await db.insert(testimonial).values({
    id,
    projectId,
    rating: data.rating,
    content: data.content,
    authorName: data.authorName,
    authorEmail: data.authorEmail,
    authorImage: data.authorImage,
    authorCompany: data.authorCompany,
    authorLinkedin: data.authorLinkedin,
    authorTagline: data.authorTagline,
    videoUrl: data.videoUrl,
    status: "pending",
    type: data.videoUrl ? "video" : "text",
  });

  // Fire-and-forget email notification
  void notifyOwnerNewTestimonial(projectId, {
    authorName: data.authorName,
    content: data.content,
    rating: data.rating,
  });

  return { success: true };
}
