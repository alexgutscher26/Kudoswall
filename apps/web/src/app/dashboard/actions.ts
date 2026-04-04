"use server";

import { db } from "@/lib/server-db";
import { auth } from "@/lib/auth";
import { workspace, project, testimonial } from "@my-better-t-app/db/schema";
import { eq, and, desc, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const generateSlug = (name: string) => 
  name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

/**
 * Ensures the user has a workspace, creating one if it doesn't exist.
 */
async function getOrCreateWorkspace(userId: string, userName: string) {
  const existing = await db.query.workspace.findFirst({
    where: eq(workspace.ownerId, userId),
  });

  if (existing) return existing;

  const newWorkspace = {
    id: crypto.randomUUID(),
    name: `${userName}'s Workspace`,
    slug: generateSlug(userName),
    ownerId: userId,
  };

  await db.insert(workspace).values(newWorkspace);
  return newWorkspace;
}

export async function createProject(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  if (!name) throw new Error("Project name is required");

  const ws = await getOrCreateWorkspace(session.user.id, session.user.name);

  const slug = generateSlug(name);

  await db.insert(project).values({
    id: crypto.randomUUID(),
    workspaceId: ws.id,
    name,
    slug,
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getDashboardData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const ws = await getOrCreateWorkspace(session.user.id, session.user.name);

  const projects = await db.query.project.findMany({
    where: eq(project.workspaceId, ws.id),
    orderBy: desc(project.createdAt),
  });

  // Get some basic stats
  // <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500" />
  const [testimonialCount] = await db
    .select({ value: count() })
    .from(testimonial)
    .innerJoin(project, eq(testimonial.projectId, project.id))
    .where(eq(project.workspaceId, ws.id));

  const [pendingCount] = await db
    .select({ value: count() })
    .from(testimonial)
    .innerJoin(project, eq(testimonial.projectId, project.id))
    .where(
      and(
        eq(project.workspaceId, ws.id),
        eq(testimonial.status, "pending")
      )
    );

  return {
    workspace: ws,
    projects,
    stats: {
      testimonials: testimonialCount?.value || 0,
      pending: pendingCount?.value || 0,
      views: 0, // Mock for now
      conversion: "—", // Mock for now
    },
  };
}
