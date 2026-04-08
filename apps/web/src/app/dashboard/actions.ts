"use server";

import { db } from "@/lib/server-db";
import { auth } from "@/lib/auth";
import { workspace, project, testimonial } from "@my-better-t-app/db/schema";
import { eq, and, desc, count, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const generateSlug = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);
import { EmailService } from "@my-better-t-app/email";
import { env } from "@my-better-t-app/env/server";
import { analyticsEvent, user } from "@my-better-t-app/db/schema";

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
    collectionSlug: slug,
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

  // Fetch everything in parallel to eliminate waterfalls
  const [projects, [testimonialCount], [pendingCount]] = await Promise.all([
    db.query.project.findMany({
      where: eq(project.workspaceId, ws.id),
      orderBy: desc(project.createdAt),
    }),
    db
      .select({ value: count() })
      .from(testimonial)
      .innerJoin(project, eq(testimonial.projectId, project.id))
      .where(eq(project.workspaceId, ws.id)),
    db
      .select({ value: count() })
      .from(testimonial)
      .innerJoin(project, eq(testimonial.projectId, project.id))
      .where(and(eq(project.workspaceId, ws.id), eq(testimonial.status, "pending"))),
  ]);

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

  const [viewsResult] = await db
    .select({ value: count() })
    .from(analyticsEvent)
    .where(eq(analyticsEvent.workspaceId, ws.id));

  const totalViews = Number(viewsResult?.value || 0);
  const conversionRate =
    totalViews > 0
      ? ((Number(testimonialCount?.value || 0) / totalViews) * 100).toFixed(1) + "%"
      : "—";

  return {
    workspace: ws,
    projects,
    recentTestimonials,
    stats: {
      testimonials: testimonialCount?.value || 0,
      pending: pendingCount?.value || 0,
      views: totalViews,
      conversion: conversionRate,
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
    with: {
      testimonialToTags: {
        with: {
          tag: true,
        },
      },
    },
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

  if (status === "approved") {
    // Check if this is the FIRST approved testimonial for this project/workspace
    const approvedCountQuery = await db
      .select({ value: count() })
      .from(testimonial)
      .innerJoin(project, eq(testimonial.projectId, project.id))
      .where(
        and(eq(project.workspaceId, t.project.workspaceId), eq(testimonial.status, "approved")),
      );

    const approvedCount = Number(approvedCountQuery[0]?.value || 0);

    if (approvedCount === 1) {
      const u = await db.query.user.findFirst({
        where: eq(user.id, t.project.workspace.ownerId),
      });
      if (u?.email) {
        const emailService = new EmailService(env.RESEND_API_KEY || "");
        await emailService.sendFirstTestimonialEmail(
          u.email,
          u.name || "there",
          t.authorName || "Someone",
          t.content || "Awesome product!",
          t.rating || 5,
        );
      }
    }

    // TODO: (Paid Plan) 5th Testimonial Upgrade Prompt
    // if (approvedCount === 5) {
    //   await emailService.sendUpgradePrompt(u.email, u.name || "there");
    // }
  }

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
