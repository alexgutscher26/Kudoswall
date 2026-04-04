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
    where: and(
      eq(project.workspaceId, ws.id),
      eq(project.slug, projectSlug)
    ),
    with: {
      workspace: true,
    },
  });

  return result;
}

export async function submitTestimonial(
  projectId: string,
  data: {
    rating: number;
    content: string;
    authorName: string;
    authorEmail: string;
  }
) {
  const id = `tst_${nanoid()}`;
  
  await db.insert(testimonial).values({
    id,
    projectId,
    rating: data.rating,
    content: data.content,
    authorName: data.authorName,
    authorEmail: data.authorEmail,
    status: "pending",
    type: "text",
  });

  return { success: true };
}
