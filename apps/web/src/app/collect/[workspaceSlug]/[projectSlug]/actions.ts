"use server";

import { db } from "@/lib/server-db";
import { project, testimonial, workspace } from "@my-better-t-app/db/schema";
import { eq, and } from "drizzle-orm";

export async function submitTestimonial(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const content = formData.get("content") as string;
  const rating = parseInt(formData.get("rating") as string || "5");
  const authorName = formData.get("authorName") as string;
  const authorEmail = formData.get("authorEmail") as string;

  if (!projectId || !content) {
    throw new Error("Missing required fields");
  }

  await db.insert(testimonial).values({
    id: crypto.randomUUID(),
    projectId,
    content,
    rating,
    authorName,
    authorEmail,
    status: "pending",
    type: "text",
  });

  return { success: true };
}

export async function getProjectBySlug(workspaceSlug: string, projectSlug: string) {
  const ws = await db.query.workspace.findFirst({
    where: eq(workspace.slug, workspaceSlug),
  });

  if (!ws) return null;

  return await db.query.project.findFirst({
    where: and(
      eq(project.workspaceId, ws.id),
      eq(project.slug, projectSlug),
      eq(project.active, true)
    ),
    with: {
      workspace: true,
    },
  });
}
