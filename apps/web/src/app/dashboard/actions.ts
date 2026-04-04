"use server";

import { db } from "@/lib/server-db";
import { auth } from "@/lib/auth";
import { workspace, project, testimonial } from "@my-better-t-app/db/schema";
import { eq, and, desc, count, inArray } from "drizzle-orm";
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
    .where(and(eq(project.workspaceId, ws.id), eq(testimonial.status, "pending")));

  const recentTestimonials =
    projects.length > 0
      ? await db.query.testimonial.findMany({
          where: inArray(
            testimonial.projectId,
            projects.map((p) => p.id),
          ),
          orderBy: desc(testimonial.createdAt),
          limit: 5,
          with: {
            project: true,
          },
        })
      : [];

  return {
    workspace: ws,
    projects,
    recentTestimonials,
    stats: {
      testimonials: testimonialCount?.value || 0,
      pending: pendingCount?.value || 0,
      views: 0, // Mock for now
      conversion: "—", // Mock for now
    },
  };
}

export async function getProjectTestimonials(projectId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Verify ownership via the project's workspace
  const p = await db.query.project.findFirst({
    where: eq(project.id, projectId),
    with: {
      workspace: true,
    },
  });

  if (!p || p.workspace.ownerId !== session.user.id) {
    throw new Error("Forbidden");
  }

  const testimonials = await db.query.testimonial.findMany({
    where: eq(testimonial.projectId, projectId),
    orderBy: desc(testimonial.createdAt),
  });

  return {
    project: p,
    testimonials,
  };
}

export async function updateTestimonialStatus(
  id: string,
  status: "approved" | "archived" | "pending",
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Check ownership
  const t = await db.query.testimonial.findFirst({
    where: eq(testimonial.id, id),
    with: {
      project: {
        with: {
          workspace: true,
        },
      },
    },
  });

  if (!t || t.project.workspace.ownerId !== session.user.id) {
    throw new Error("Forbidden");
  }

  await db.update(testimonial).set({ status }).where(eq(testimonial.id, id));

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/testimonials/${t.projectId}`);
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const t = await db.query.testimonial.findFirst({
    where: eq(testimonial.id, id),
    with: {
      project: {
        with: {
          workspace: true,
        },
      },
    },
  });

  if (!t || t.project.workspace.ownerId !== session.user.id) {
    throw new Error("Forbidden");
  }

  await db.delete(testimonial).where(eq(testimonial.id, id));

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/testimonials/${t.projectId}`);
  return { success: true };
}
