"use server";

import { db } from "@/lib/server-db";
import { project, testimonial, workspace } from "@my-better-t-app/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

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

  return {
    ...result,
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
    status: "pending",
    type: "text", // Could be "video" if videoUrl is present
  });

  return { success: true };
}
