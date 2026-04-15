"use server";

import { db } from "@/lib/server-db";
import { auth } from "@/lib/auth";
import {
  workspace,
  project,
  testimonial,
  widget,
  workspaceMember,
} from "@my-better-t-app/db/schema";
import { eq, and, desc, count, inArray, isNull } from "drizzle-orm";
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

  if (existing) {
    // Heal missing membership if needed
    const m = await db.query.workspaceMember.findFirst({
      where: and(eq(workspaceMember.workspaceId, existing.id), eq(workspaceMember.userId, userId)),
    });
    if (!m) {
      await db.insert(workspaceMember).values({
        id: crypto.randomUUID(),
        workspaceId: existing.id,
        userId: userId,
        role: "owner",
      });
    }
    return existing;
  }

  const wsId = crypto.randomUUID();
  const newWorkspace = {
    id: wsId,
    name: `${userName}'s Workspace`,
    slug: generateSlug(userName),
    ownerId: userId,
    onboardingStatus: JSON.stringify({
      step1: false,
      step2: false,
      step3: false,
      step4: false,
      step5: false,
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    logoUrl: null,
    isPro: false,
    brandingJson: null,
    dpaAcceptedAt: null,
    dpaAcceptedById: null,
    retentionEnabled: false,
    retentionDays: 365,
  };

  await db.transaction(async (tx) => {
    await tx.insert(workspace).values(newWorkspace);
    await tx.insert(workspaceMember).values({
      id: crypto.randomUUID(),
      workspaceId: wsId,
      userId: userId,
      role: "owner",
    });
  });

  const emailService = new EmailService(env.RESEND_API_KEY || "");
  const u = await db.query.user.findFirst({ where: eq(user.id, userId) });
  if (u?.email) {
    try {
      await emailService.sendWelcomeEmail(u.email, u.name || "there");
    } catch (err) {
      console.error("Failed to send welcome email", err);
    }
  }

  return newWorkspace;
}

export async function createProject(formData: FormData, workspaceId?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  if (!name) throw new Error("Project name is required");

  let wsId = workspaceId;
  if (!wsId) {
    const ws = await getOrCreateWorkspace(session.user.id, session.user.name);
    wsId = ws.id;
  }

  const slug = generateSlug(name);

  await db.insert(project).values({
    id: crypto.randomUUID(),
    workspaceId: wsId,
    name,
    slug,
    collectionSlug: slug,
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getDashboardData(workspaceId?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  let ws;
  if (workspaceId) {
    ws = await db.query.workspace.findFirst({
      where: and(eq(workspace.id, workspaceId), eq(workspace.ownerId, session.user.id)),
    });
  }

  if (!ws) {
    ws = await getOrCreateWorkspace(session.user.id, session.user.name);
  }

  // Fetch everything in parallel to eliminate waterfalls
  const [projects, [testimonialCount], [pendingCount], [approvedCount], [widgetCount]] =
    await Promise.all([
      db.query.project.findMany({
        where: and(eq(project.workspaceId, ws.id), isNull(project.deletedAt)),
        orderBy: desc(project.createdAt),
      }),
      db
        .select({ value: count() })
        .from(testimonial)
        .innerJoin(project, eq(testimonial.projectId, project.id))
        .where(
          and(
            eq(project.workspaceId, ws.id),
            isNull(testimonial.deletedAt),
            isNull(project.deletedAt),
          ),
        ),
      db
        .select({ value: count() })
        .from(testimonial)
        .innerJoin(project, eq(testimonial.projectId, project.id))
        .where(
          and(
            eq(project.workspaceId, ws.id),
            eq(testimonial.status, "pending"),
            isNull(testimonial.deletedAt),
            isNull(project.deletedAt),
          ),
        ),
      db
        .select({ value: count() })
        .from(testimonial)
        .innerJoin(project, eq(testimonial.projectId, project.id))
        .where(
          and(
            eq(project.workspaceId, ws.id),
            eq(testimonial.status, "approved"),
            isNull(testimonial.deletedAt),
            isNull(project.deletedAt),
          ),
        ),
      db
        .select({ value: count() })
        .from(widget)
        .where(and(eq(widget.workspaceId, ws.id), isNull(widget.deletedAt))),
    ]);

  const recentTestimonials =
    projects.length > 0
      ? await db.query.testimonial.findMany({
          where: and(
            inArray(
              testimonial.projectId,
              projects.map((p) => p.id),
            ),
            isNull(testimonial.deletedAt),
          ),
          orderBy: desc(testimonial.createdAt),
          limit: 5,
          with: {
            project: true,
            testimonialToTags: {
              with: {
                tag: true,
              },
            },
          },
        })
      : [];

  const [viewsResult] = await db
    .select({ value: count() })
    .from(analyticsEvent)
    .where(
      and(
        eq(analyticsEvent.workspaceId, ws.id),
        eq(analyticsEvent.eventType, "view"),
        isNull(analyticsEvent.deletedAt),
      ),
    );

  const totalViews = Number(viewsResult?.value || 0);

  // Onboarding Calculation
  const dbStatus = JSON.parse(ws.onboardingStatus || "{}");
  const onboarding = {
    step1: dbStatus.step1 || projects.length > 0,
    step2: dbStatus.step2 || projects.some((p) => p.collectionSettingsJson !== null),
    step3: dbStatus.step3 || false,
    step4: dbStatus.step4 || Number(approvedCount?.value || 0) > 0,
    step5: dbStatus.step5 || Number(widgetCount?.value || 0) > 0,
  };

  const testimonialsCount = Number(testimonialCount?.value || 0);
  const conversionRate =
    totalViews > 0 ? ((testimonialsCount / totalViews) * 100).toFixed(1) + "%" : "—";

  return {
    workspace: {
      ...ws,
      createdAt: ws.createdAt.toISOString(),
      updatedAt: ws.updatedAt.toISOString(),
      deletedAt: ws.deletedAt?.toISOString() || null,
      dpaAcceptedAt: ws.dpaAcceptedAt?.toISOString() || null,
      dpaAcceptedById: ws.dpaAcceptedById,
      retentionEnabled: ws.retentionEnabled,
      retentionDays: ws.retentionDays,
    },
    projects: projects.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      deletedAt: p.deletedAt?.toISOString() || null,
    })),
    recentTestimonials: recentTestimonials.map((t) => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      deletedAt: t.deletedAt?.toISOString() || null,
      project: {
        ...t.project,
        createdAt: t.project.createdAt.toISOString(),
        updatedAt: t.project.updatedAt.toISOString(),
        deletedAt: t.project.deletedAt?.toISOString() || null,
      },
    })),
    onboarding,
    stats: {
      testimonials: testimonialsCount,
      pending: Number(pendingCount?.value || 0),
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
    where: and(eq(testimonial.projectId, projectId), isNull(testimonial.deletedAt)),
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
    project: {
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      deletedAt: p.deletedAt?.toISOString() || null,
      workspace: {
        ...p.workspace,
        createdAt: p.workspace.createdAt.toISOString(),
        updatedAt: p.workspace.updatedAt.toISOString(),
        deletedAt: p.workspace.deletedAt?.toISOString() || null,
        dpaAcceptedAt: p.workspace.dpaAcceptedAt?.toISOString() || null,
        dpaAcceptedById: p.workspace.dpaAcceptedById,
        retentionEnabled: p.workspace.retentionEnabled,
        retentionDays: p.workspace.retentionDays,
      },
    },
    testimonials: testimonials.map((t) => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      deletedAt: t.deletedAt?.toISOString() || null,
    })),
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
