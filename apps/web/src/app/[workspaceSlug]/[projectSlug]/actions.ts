"use server";

import { db } from "@/lib/server-db";
import { project, testimonial, workspace, videoTranscodingJob } from "@my-better-t-app/db/schema";
import { eq, and, count } from "drizzle-orm";
import { nanoid } from "nanoid";
import { notifyOwnerNewTestimonial } from "@/lib/email-helpers";
import { unstable_noStore as noStore } from "next/cache";

export async function getProjectBySlug(workspaceSlug: string, projectSlug: string) {
  noStore();
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

  console.log(
    `[Collection Action] Project: ${projectSlug}, Plan: ${result.workspace.plan}, Video Enbled: ${permissions.features.video}`,
  );

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

  // Check testimonial limits
  const p = await db.query.project.findFirst({
    where: eq(project.id, projectId),
    with: { workspace: true },
  });

  if (!p) throw new Error("Project not found");

  const counts = await db
    .select({ count: count() })
    .from(testimonial)
    .where(eq(testimonial.projectId, projectId));

  const { getWorkspacePermissions } = await import("@my-better-t-app/api/logic/billing");
  const permissions = getWorkspacePermissions({
    plan: p.workspace.plan,
    testimonialsCount: counts[0]?.count ?? 0,
  });

  if (!permissions.canAddTestimonial) {
    throw new Error(
      `This project has reached its testimonial limit for the current plan. Please contact the owner.`,
    );
  }

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

  if (data.videoUrl && data.videoUrl.startsWith("/api/videos/")) {
    const key = data.videoUrl.replace("/api/videos/", "");
    await db.insert(videoTranscodingJob).values({
      id: `vtj_${nanoid()}`,
      testimonialId: id,
      sourceKey: key,
      status: "pending",
    });
  }

  // Fire-and-forget email notification
  void notifyOwnerNewTestimonial(projectId, {
    authorName: data.authorName,
    content: data.content,
    rating: data.rating,
  });

  return { success: true };
}
