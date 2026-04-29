"use server";

import { db } from "@/lib/server-db";
import { auth } from "@/lib/auth";
import {
  workspace,
  project,
  testimonial,
  widget,
  workspaceMember,
  organization,
  analyticsEvent,
  user,
  tag,
  testimonialToTag,
} from "@my-better-t-app/db/schema";
import { eq, and, desc, count, inArray, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { EmailService } from "@my-better-t-app/email";
import { env, getEnvAsync } from "@my-better-t-app/env/server";
import { purgeWidgetCache } from "@my-better-t-app/api";

const generateSlug = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

/**
 * Ensures the user has a workspace, creating one if it doesn't exist.
 */
async function getOrCreateWorkspace(userId: string, userName: string) {
  const existing = await db.query.workspace.findFirst({
    where: eq(workspace.ownerId, userId),
    with: { organization: true },
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
    // Normalize plan and status
    if (existing.organization) {
      existing.plan = (existing.organization as any).plan || existing.plan;
      existing.subscriptionStatus =
        (existing.organization as any).subscriptionStatus || existing.subscriptionStatus;
    }
    return existing;
  }

  // Find or create a default organization for the user
  let org = await db.query.organization.findFirst({
    where: eq(organization.ownerId, userId),
  });

  if (!org) {
    const orgId = crypto.randomUUID();
    await db.insert(organization).values({
      id: orgId,
      name: `${userName}'s Org`,
      ownerId: userId,
      plan: "free",
    });
    org = await db.query.organization.findFirst({
      where: eq(organization.id, orgId),
    });
  }

  const wsId = crypto.randomUUID();
  const newWorkspace = {
    id: wsId,
    name: `${userName}'s Workspace`,
    slug: generateSlug(userName),
    ownerId: userId,
    organizationId: org?.id || null,
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
    plan: "free" as const,
    subscriptionStatus: null,
    brandingJson: null,
    dpaAcceptedAt: null,
    dpaAcceptedById: null,
    retentionEnabled: false,
    retentionDays: 365,
    notificationSettingsJson: JSON.stringify({ instantAlerts: true, dailySummary: false }),
  };

  await db.transaction(async (tx) => {
    await tx.insert(workspace).values(newWorkspace as any);
    await tx.insert(workspaceMember).values({
      id: crypto.randomUUID(),
      workspaceId: wsId,
      userId: userId,
      role: "owner",
      updatedAt: new Date(),
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

  // Normalize plan and status
  if (org) {
    (newWorkspace as any).plan = org.plan || newWorkspace.plan;
    (newWorkspace as any).subscriptionStatus =
      org.subscriptionStatus || newWorkspace.subscriptionStatus;
  }

  return newWorkspace as any;


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

  // Check project limits
  const projectsCount = await db
    .select({ value: count() })
    .from(project)
    .where(and(eq(project.workspaceId, wsId as string), isNull(project.deletedAt)));

  const ws = await db.query.workspace.findFirst({
    where: eq(workspace.id, wsId as string),
    with: { organization: true },
  });

  const { getWorkspacePermissions } = await import("@my-better-t-app/api/logic/billing");
  const permissions = getWorkspacePermissions({
    plan: ws?.plan || "free",
    organization: (ws as any)?.organization,
    projectsCount: projectsCount[0]?.value || 0,
  });


  if (!permissions.canAddProject) {
    throw new Error(
      `You have reached the project limit for your ${permissions.name} plan. Please upgrade.`,
    );
  }

  await db.insert(project).values({
    id: crypto.randomUUID(),
    workspaceId: wsId as string,
    name,
    slug,
    collectionSlug: slug,
    updatedAt: new Date(),
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getDashboardData(workspaceId?: string) {
  try {
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
        with: { organization: true },
      });
    }


    if (!ws) {
      ws = await getOrCreateWorkspace(session.user.id, session.user.name);
    }

    // Normalize plan and status
    if (ws.organization) {
      ws.plan = (ws.organization as any).plan || ws.plan;
      ws.subscriptionStatus = (ws.organization as any).subscriptionStatus || ws.subscriptionStatus;
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

    // Onboarding Calculation - Defensive JSON parsing
    let dbStatus = {};
    try {
      if (ws.onboardingStatus) {
        dbStatus = JSON.parse(ws.onboardingStatus);
      }
    } catch (e) {
      console.error("❌ Failed to parse onboardingStatus:", ws.onboardingStatus);
      dbStatus = {};
    }

    const onboarding = {
      step1: (dbStatus as any).step1 || projects.length > 0,
      step2: (dbStatus as any).step2 || projects.some((p) => p.collectionSettingsJson !== null),
      step3: (dbStatus as any).step3 || false,
      step4: (dbStatus as any).step4 || Number(approvedCount?.value || 0) > 0,
      step5: (dbStatus as any).step5 || Number(widgetCount?.value || 0) > 0,
    };

    const testimonialsCount = Number(testimonialCount?.value || 0);
    const conversionRate =
      totalViews > 0 ? ((testimonialsCount / totalViews) * 100).toFixed(1) + "%" : "—";

    const allMemberships = await db.query.workspaceMember.findMany({
      where: and(eq(workspaceMember.userId, session.user.id), isNull(workspaceMember.deletedAt)),
    });

    // Helper for safe Date object creation
    const safeDate = (d: any) => {
      if (!d) return null;
      try {
        const date = new Date(d);
        return isNaN(date.getTime()) ? null : date;
      } catch (e) {
        return null;
      }
    };

    const { getWorkspacePermissions } = await import("@my-better-t-app/api/logic/billing");
    const permissions = getWorkspacePermissions({
      plan: ws.plan,
      organization: (ws as any).organization,
      projectsCount: projects.length,
      testimonialsCount: testimonialsCount,
    });


    return {
      workspace: {
        ...ws,
        isPro: permissions.isPro, // Add compatibility flag
        createdAt: safeDate(ws.createdAt) || new Date(),
        updatedAt: safeDate(ws.updatedAt) || new Date(),
        deletedAt: safeDate(ws.deletedAt),
        dpaAcceptedAt: safeDate(ws.dpaAcceptedAt),
        dpaAcceptedById: ws.dpaAcceptedById,
        retentionEnabled: ws.retentionEnabled,
        retentionDays: ws.retentionDays,
        trialEndsAt: ws.trialEndsAt?.toISOString() || null,
      },
      projects: projects.map((p) => ({
        ...p,
        createdAt: safeDate(p.createdAt) || new Date(),
        updatedAt: safeDate(p.updatedAt) || new Date(),
        deletedAt: safeDate(p.deletedAt),
      })),
      recentTestimonials: recentTestimonials.map((t) => ({
        ...t,
        createdAt: safeDate(t.createdAt) || new Date(),
        updatedAt: safeDate(t.updatedAt) || new Date(),
        deletedAt: safeDate(t.deletedAt),
        project: {
          ...t.project,
          createdAt: safeDate(t.project.createdAt) || new Date(),
          updatedAt: safeDate(t.project.updatedAt) || new Date(),
          deletedAt: safeDate(t.project.deletedAt),
        },
      })),
      onboarding,
      permissions, // Restore permissions object
      workspaceCount: allMemberships.length,
      stats: {
        testimonials: testimonialsCount,
        pending: Number(pendingCount?.value || 0),
        views: totalViews,
        conversion: conversionRate,
      },
    } as any; // Cast to avoid literal type mismatch with internal tRPC expectations
  } catch (error: any) {
    console.error("❌ CRITICAL: getDashboardData failed:", error);
    // Re-throw so error.tsx can catch it, but now we have a log in prod
    throw error;
  }
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
      workspace: {
        with: { organization: true },
      },
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
        trialEndsAt: p.workspace.trialEndsAt?.toISOString() || null,
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
          workspace: {
            with: { organization: true },
          },
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
      try {
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
      } catch (err) {
        console.error("Failed to send first testimonial email:", err);
      }
    }

    // (Paid Plan) 5th Testimonial Upgrade Prompt
    const effectivePlan = t.project.workspace.organization?.plan || t.project.workspace.plan;
    if (effectivePlan === "free" && approvedCount === 5) {

      try {
        const u = await db.query.user.findFirst({
          where: eq(user.id, t.project.workspace.ownerId),
        });
        if (u?.email) {
          const emailService = new EmailService(env.RESEND_API_KEY || "");
          await emailService.sendUpgradePrompt(u.email, u.name || "there", approvedCount);
        }
      } catch (err) {
        console.error("Failed to send upgrade prompt email:", err);
      }
    }
  }

  try {
    // Use sync env instead of getEnvAsync for Server Actions
    await purgeWidgetCache({ db, workspaceId: t.workspaceId, env });
  } catch (err) {
    console.error("Failed to purge widget cache:", err);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/testimonials?workspaceId=${t.workspaceId}`);
  if (t.project.collectionSlug) {
    revalidatePath(`/collect/${t.project.collectionSlug}`);
  }
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
          workspace: {
            with: { organization: true },
          },
        },
      },
    },
  });


  if (!t || t.project.workspace.ownerId !== session.user.id) {
    throw new Error("Forbidden");
  }

  await db.delete(testimonial).where(eq(testimonial.id, id));

  try {
    // Use sync env instead of getEnvAsync for Server Actions
    await purgeWidgetCache({ db, workspaceId: t.workspaceId, env });
  } catch (err) {
    console.error("Failed to purge widget cache:", err);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/testimonials?workspaceId=${t.workspaceId}`);
  if (t.project.collectionSlug) {
    revalidatePath(`/collect/${t.project.collectionSlug}`);
  }
  return { success: true };
}

export async function bulkUpdateTestimonialStatus(
  ids: string[],
  status: "approved" | "archived" | "pending",
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (ids.length === 0) return { success: true };

  // Verify ownership of all testimonials
  const testimonials = await db.query.testimonial.findMany({
    where: and(inArray(testimonial.id, ids), isNull(testimonial.deletedAt)),
    with: {
      project: {
        with: {
          workspace: true,
        },
      },
    },
  });

  const unauthorized = testimonials.some((t) => t.project.workspace.ownerId !== session.user.id);
  if (unauthorized || testimonials.length !== ids.length) {
    throw new Error("Forbidden or some testimonials not found");
  }

  await db.update(testimonial).set({ status }).where(inArray(testimonial.id, ids));

  // Purge cache for all affected workspaces
  const workspaceIds = Array.from(new Set(testimonials.map((t) => t.workspaceId)));
  for (const wsId of workspaceIds) {
    try {
      await purgeWidgetCache({ db, workspaceId: wsId, env });
    } catch (err) {
      console.error(`Failed to purge widget cache for workspace ${wsId}:`, err);
    }
  }

  revalidatePath("/dashboard");
  for (const wsId of workspaceIds) {
    revalidatePath(`/dashboard/testimonials?workspaceId=${wsId}`);
  }

  return { success: true };
}

export async function bulkDeleteTestimonials(ids: string[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (ids.length === 0) return { success: true };

  // Verify ownership
  const testimonials = await db.query.testimonial.findMany({
    where: and(inArray(testimonial.id, ids), isNull(testimonial.deletedAt)),
    with: {
      project: {
        with: {
          workspace: true,
        },
      },
    },
  });

  const unauthorized = testimonials.some((t) => t.project.workspace.ownerId !== session.user.id);
  if (unauthorized || testimonials.length !== ids.length) {
    throw new Error("Forbidden or some testimonials not found");
  }

  await db.update(testimonial).set({ deletedAt: new Date() }).where(inArray(testimonial.id, ids));

  const workspaceIds = Array.from(new Set(testimonials.map((t) => t.workspaceId)));
  for (const wsId of workspaceIds) {
    try {
      await purgeWidgetCache({ db, workspaceId: wsId, env });
    } catch (err) {
      console.error(`Failed to purge widget cache for workspace ${wsId}:`, err);
    }
  }

  revalidatePath("/dashboard");
  for (const wsId of workspaceIds) {
    revalidatePath(`/dashboard/testimonials?workspaceId=${wsId}`);
  }

  return { success: true };
}

export async function bulkTagTestimonials(
  ids: string[],
  tagId: string,
  action: "assign" | "unassign",
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (ids.length === 0) return { success: true };

  // Verify tag ownership
  const t = await db.query.tag.findFirst({
    where: eq(tag.id, tagId),
  });

  if (!t) throw new Error("Tag not found");

  const ws = await db.query.workspace.findFirst({
    where: eq(workspace.id, t.workspaceId),
  });

  if (!ws || ws.ownerId !== session.user.id) {
    throw new Error("Forbidden: Tag ownership");
  }

  // Verify testimonial ownership
  const testimonials = await db.query.testimonial.findMany({
    where: and(inArray(testimonial.id, ids), isNull(testimonial.deletedAt)),
  });

  if (testimonials.length !== ids.length || testimonials.some((test) => test.workspaceId !== t.workspaceId)) {
    throw new Error("Forbidden or some testimonials not found in this workspace");
  }

  if (action === "assign") {
    const values = ids.map((id) => ({ testimonialId: id, tagId }));
    await db.insert(testimonialToTag).values(values).onConflictDoNothing();
  } else {
    await db
      .delete(testimonialToTag)
      .where(and(inArray(testimonialToTag.testimonialId, ids), eq(testimonialToTag.tagId, tagId)));
  }

  try {
    await purgeWidgetCache({ db, workspaceId: t.workspaceId, env });
  } catch (err) {
    console.error("Failed to purge widget cache:", err);
  }

  revalidatePath(`/dashboard/testimonials?workspaceId=${t.workspaceId}`);
  return { success: true };
}
