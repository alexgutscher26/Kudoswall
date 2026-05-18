import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq, and, desc, count, inArray, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { protectedProcedure, router, workspaceProcedure, publicProcedure } from "../index";
import {
  workspace,
  project,
  testimonial,
  workspaceMember,
  user,
  widget,
  analyticsEvent,
  organization,
} from "@my-better-t-app/db/schema";

import { recordAuditLog } from "@my-better-t-app/db";
import { EmailService } from "@my-better-t-app/email";
import { env, getEnvAsync } from "@my-better-t-app/env/server";
import { generateSignedUrl } from "../lib/signed-url";
import { purgeWidgetCache } from "../utils/purge";

import type { Database } from "@my-better-t-app/db";

/**
 * Helper to ensure the user has a workspace.
 */
async function getOrCreateWorkspace(db: Database, userId: string, userName: string) {
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

    // Heal missing organization if needed
    if (!existing.organizationId) {
      let org = await db.query.organization.findFirst({
        where: eq(organization.ownerId, userId),
      });

      if (!org) {
        const orgId = crypto.randomUUID();
        await db.insert(organization).values({
          id: orgId,
          name: `${userName}'s Org`,
          ownerId: userId,
          plan: existing.plan,
          stripeCustomerId: existing.stripeCustomerId,
          stripeSubscriptionId: existing.stripeSubscriptionId,
          subscriptionStatus: existing.subscriptionStatus,
        });
        org = (await db.query.organization.findFirst({ where: eq(organization.id, orgId) }))!;
      }

      await db
        .update(workspace)
        .set({ organizationId: org.id })
        .where(eq(workspace.id, existing.id));
      existing.organizationId = org.id;
    }

    return existing;
  }

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

  // Ensure organization exists
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
    org = (await db.query.organization.findFirst({ where: eq(organization.id, orgId) }))!;
  }

  const newWorkspace = {
    id: crypto.randomUUID(),
    name: `${userName}'s Workspace`,
    slug: generateSlug(userName),
    ownerId: userId,
    organizationId: org.id,
    onboardingStatus: JSON.stringify({
      step1: false,
      step2: false,
      step3: false,
      step4: false,
      step5: false,
    }),
    dpaAcceptedAt: null,
    dpaAcceptedById: null,
    logoUrl: null,
    brandingJson: null,
    notificationSettingsJson: JSON.stringify({ instantAlerts: true, dailySummary: false }),
    plan: (org.plan || "free") as any,
    subscriptionStatus: (org.subscriptionStatus || "active") as any,

    retentionEnabled: false,
    retentionDays: 365,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  await db.insert(workspace).values(newWorkspace);

  await db.insert(workspaceMember).values({
    id: crypto.randomUUID(),
    workspaceId: newWorkspace.id,
    userId: userId,
    role: "owner",
  });

  const emailService = new EmailService(env.RESEND_API_KEY || "", env.EMAIL_FROM);
  const u = await db.query.user.findFirst({ where: eq(user.id, userId) });
  if (u?.email) {
    try {
      await emailService.sendWelcomeEmail(u.email, u.name || "there");
    } catch (err) {
      console.error("Failed to send welcome email", err);
    }
  }

  return { ...newWorkspace, organization: org };
}

/**
 * Helper to sign video URLs for a list of testimonials.
 */
async function signTestimonials<T extends { type: string | null; videoUrl: string | null }>(
  testimonials: T[],
): Promise<T[]> {
  const secret = env.R2_SIGNING_SECRET;
  if (!secret) return testimonials;

  return Promise.all(
    testimonials.map(async (t) => {
      if (t.type === "video" && t.videoUrl && t.videoUrl.startsWith("/api/videos/")) {
        try {
          const key = t.videoUrl.replace(/^\/api\/videos\//, "");
          const signedUrl = await generateSignedUrl(key, secret, 3600);
          return { ...t, videoUrl: signedUrl };
        } catch (err) {
          console.error("Failed to sign testimonial video URL", err);
          return t;
        }
      }
      return t;
    }),
  );
}

export const dashboardRouter = router({
  getData: protectedProcedure
    .input(z.object({ workspaceId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const workspaceId = input?.workspaceId;

      let ws: any;

      if (workspaceId) {
        // Check membership
        const membership = await db.query.workspaceMember.findFirst({
          where: and(
            eq(workspaceMember.workspaceId, workspaceId),
            eq(workspaceMember.userId, session.user.id),
            isNull(workspaceMember.deletedAt),
          ),
          with: { workspace: { with: { organization: true } } },
        });

        if (membership) ws = membership.workspace;
      }

      if (!ws) {
        // Fallback to first available workspace the user is a member of
        const membership = await db.query.workspaceMember.findFirst({
          where: and(
            eq(workspaceMember.userId, session.user.id),
            isNull(workspaceMember.deletedAt),
          ),
          with: { workspace: { with: { organization: true } } },
          orderBy: desc(workspaceMember.createdAt),
        });
        if (membership) ws = membership.workspace;
      }

      if (!ws) {
        ws = await getOrCreateWorkspace(db, session.user.id, session.user.name);
      }

      // Normalize workspace plan and subscription status based on organization
      if (ws.organization) {
        ws.plan = ws.organization.plan || ws.plan;
        ws.subscriptionStatus = ws.organization.subscriptionStatus || ws.subscriptionStatus;
      }

      const projects = await db.query.project.findMany({
        where: and(eq(project.workspaceId, ws.id), isNull(project.deletedAt)),
        orderBy: desc(project.createdAt),
      });

      const [testimonialCount] = await db
        .select({ value: count() })
        .from(testimonial)
        .innerJoin(project, eq(testimonial.projectId, project.id))
        .where(
          and(
            eq(project.workspaceId, ws.id),
            isNull(testimonial.deletedAt),
            isNull(project.deletedAt),
          ),
        );

      const [pendingCount] = await db
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
        );

      const [approvedCount] = await db
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
        );

      const [widgetCount] = await db
        .select({ value: count() })
        .from(widget)
        .where(and(eq(widget.workspaceId, ws.id), isNull(widget.deletedAt)));

      // Fetch View Stats
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

      // Onboarding Calculation
      const dbStatus = JSON.parse(ws.onboardingStatus || "{}");
      const onboarding = {
        step1: dbStatus.step1 || projects.length > 0,
        step2: dbStatus.step2 || projects.some((p) => p.collectionSettingsJson !== null),
        step3: dbStatus.step3 || false,
        step4: dbStatus.step4 || Number(approvedCount?.value || 0) > 0,
        step5: dbStatus.step5 || Number(widgetCount?.value || 0) > 0,
        rewardClaimed: dbStatus.rewardClaimed || false,
      };

      // Calculate Conversion Rate
      const testimonialsCount = Number(testimonialCount?.value || 0);
      const conversionRate =
        totalViews > 0 ? ((testimonialsCount / totalViews) * 100).toFixed(1) + "%" : "—";

      // Get workspace count for this user
      const allMemberships = await db.query.workspaceMember.findMany({
        where: and(eq(workspaceMember.userId, session.user.id), isNull(workspaceMember.deletedAt)),
      });

      // Permissions
      const { getWorkspacePermissions } = await import("../logic/billing");
      const permissions = getWorkspacePermissions({
        plan: ws.plan,
        organization: ws.organization,
        projectsCount: projects.length,
        testimonialsCount: testimonialsCount,
      });

      return {
        workspace: ws,
        permissions,
        billing: {
          plan: ws.organization?.plan || ws.plan,
          status: ws.organization?.subscriptionStatus || ws.subscriptionStatus || "active",
        },
        projects,

        recentTestimonials: await signTestimonials(recentTestimonials),
        onboarding,
        workspaceCount: allMemberships.length,
        stats: {
          testimonials: testimonialsCount,
          pending: Number(pendingCount?.value || 0),
          views: totalViews,
          conversion: conversionRate,
        },
      };
    }),

  listWorkspaces: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const memberships = await db.query.workspaceMember.findMany({
      where: and(eq(workspaceMember.userId, session.user.id), isNull(workspaceMember.deletedAt)),
      with: { workspace: { with: { organization: true } } },
      orderBy: desc(workspaceMember.createdAt),
    });
    return memberships
      .map((m) => {
        const ws = m.workspace as any;
        if (ws.organization) {
          ws.plan = ws.organization.plan || ws.plan;
          ws.subscriptionStatus = ws.organization.subscriptionStatus || ws.subscriptionStatus;
        }
        return ws;
      })
      .filter((ws) => !ws.deletedAt);
  }),

  createWorkspace: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { name } = input;

      // Allow multiple workspaces only for Agency (plan_2) or Lifetime (ltd) plans.
      // Otherwise, restrict to 1 active workspace.
      let org = await db.query.organization.findFirst({
        where: eq(organization.ownerId, session.user.id),
      });

      if (!org) {
        // Fallback for edge cases where org wasn't created yet
        const orgId = crypto.randomUUID();
        await db.insert(organization).values({
          id: orgId,
          name: `${session.user.name}'s Org`,
          ownerId: session.user.id,
          plan: "free",
        });
        org = (await db.query.organization.findFirst({ where: eq(organization.id, orgId) }))!;
      }

      const ownedWorkspaces = await db.query.workspace.findMany({
        where: and(eq(workspace.ownerId, session.user.id), isNull(workspace.deletedAt)),
      });

      const hasAgencyPlan = org.plan === "plan_2" || org.plan === "ltd";

      if (ownedWorkspaces.length >= 1 && !hasAgencyPlan) {
        throw new Error(
          "You already have a workspace. Upgrade to the Agency plan to create more workspaces.",
        );
      }

      const generateSlug = (n: string) =>
        n.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

      const newWs = {
        id: crypto.randomUUID(),
        name,
        slug: generateSlug(name),
        ownerId: session.user.id,
        organizationId: org.id,
        onboardingStatus: JSON.stringify({
          step1: false,
          step2: false,
          step3: false,
          step4: false,
          step5: false,
        }),
        dpaAcceptedAt: null,
        dpaAcceptedById: null,
        logoUrl: null,
        brandingJson: null,
        notificationSettingsJson: JSON.stringify({ instantAlerts: true, dailySummary: false }),
        plan: (org.plan || "free") as any,
        subscriptionStatus: (org.subscriptionStatus || "active") as any,
        retentionEnabled: false,
        retentionDays: 365,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      await db.insert(workspace).values(newWs);

      await db.insert(workspaceMember).values({
        id: crypto.randomUUID(),
        workspaceId: newWs.id,
        userId: session.user.id,
        role: "owner",
      });

      await recordAuditLog({
        userId: session.user.id,
        workspaceId: newWs.id,
        entityType: "workspace",
        entityId: newWs.id,
        action: "create",
      });

      return newWs;
    }),

  getProjectTestimonials: workspaceProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const { projectId } = input;

      const p = await db.query.project.findFirst({
        where: eq(project.id, projectId),
      });

      if (!p) throw new Error("Project not found or forbidden");

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
        project: p,
        testimonials: await signTestimonials(testimonials),
      };
    }),

  updateProjectSettings: workspaceProcedure
    .input(
      z.object({
        projectId: z.string(),
        settings: z.unknown().optional(),
        name: z.string().optional(),
        collectionSlug: z.string().optional(),
        customCss: z.string().optional(),
        emailFromName: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { projectId, settings, name, collectionSlug, customCss, emailFromName } = input;

      const p = await db.query.project.findFirst({
        where: eq(project.id, projectId),
      });

      if (!p) throw new Error("Project not found or forbidden");

      if (!ctx.permissions.includes("project:update")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Insufficient permissions to update this project",
        });
      }

      await db
        .update(project)
        .set({
          ...(settings !== undefined ? { collectionSettingsJson: JSON.stringify(settings) } : {}),
          ...(name !== undefined ? { name } : {}),
          ...(collectionSlug !== undefined ? { collectionSlug } : {}),
          ...(customCss !== undefined ? { customCss } : {}),
          ...(emailFromName !== undefined ? { emailFromName } : {}),
        })
        .where(eq(project.id, projectId));

      await recordAuditLog({
        userId: session.user.id,
        workspaceId: ctx.workspaceId,
        entityType: "project",
        entityId: projectId,
        action: "update",
        diff: { collectionSettingsJson: settings, name, collectionSlug, customCss, emailFromName },
      });

      if (p.collectionSlug) {
        revalidatePath(`/collect/${p.collectionSlug}`);
      }
      if (collectionSlug && collectionSlug !== p.collectionSlug) {
        revalidatePath(`/collect/${collectionSlug}`);
      }

      return { success: true };
    }),

  deleteProject: workspaceProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { id } = input;

      const p = await db.query.project.findFirst({
        where: eq(project.id, id),
      });

      if (!p) throw new Error("Project not found or forbidden");

      if (!ctx.permissions.includes("project:delete")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Insufficient permissions to delete this project",
        });
      }

      await db.update(project).set({ deletedAt: new Date() }).where(eq(project.id, id));

      await recordAuditLog({
        userId: session.user.id,
        workspaceId: ctx.workspaceId,
        entityType: "project",
        entityId: id,
        action: "delete",
      });

      return { success: true };
    }),

  duplicateProject: workspaceProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { id } = input;

      const p = await db.query.project.findFirst({
        where: eq(project.id, id),
      });

      if (!p) throw new Error("Project not found or forbidden");

      if (!ctx.permissions.includes("project:create")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Insufficient permissions to duplicate this project",
        });
      }

      const generateSlug = (name: string) =>
        name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

      const newName = `${p.name} (Copy)`;
      const newSlug = generateSlug(newName);

      const newProject = {
        id: crypto.randomUUID(),
        workspaceId: ctx.workspaceId,
        name: newName,
        slug: newSlug,
        collectionSlug: newSlug,
        collectionSettingsJson: p.collectionSettingsJson,
      };

      await (db as any).insert(project).values([newProject]);

      await recordAuditLog({
        userId: session.user.id,
        workspaceId: ctx.workspaceId,
        entityType: "project",
        entityId: newProject.id,
        action: "create",
        diff: { duplicatedFrom: id },
      });

      return { success: true, newProjectId: newProject.id };
    }),

  completeOnboardingStep: protectedProcedure
    .input(z.object({ step: z.string(), workspaceId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { step, workspaceId } = input;

      let ws;
      if (workspaceId) {
        ws = await db.query.workspaceMember
          .findFirst({
            where: and(
              eq(workspaceMember.workspaceId, workspaceId),
              eq(workspaceMember.userId, session.user.id),
              isNull(workspaceMember.deletedAt),
            ),
            with: { workspace: true },
          })
          .then((m) => m?.workspace);
      } else {
        ws = await db.query.workspaceMember
          .findFirst({
            where: and(
              eq(workspaceMember.userId, session.user.id),
              isNull(workspaceMember.deletedAt),
            ),
            with: { workspace: true },
          })
          .then((m) => m?.workspace);
      }

      if (!ws) throw new Error("Workspace not found");

      const status = JSON.parse(ws.onboardingStatus || "{}");
      status[step] = true;

      await db
        .update(workspace)
        .set({
          onboardingStatus: JSON.stringify(status),
        })
        .where(eq(workspace.id, ws.id));

      return { success: true };
    }),

  updateWorkspace: workspaceProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        logoUrl: z.string().nullable().optional(),
        notificationSettingsJson: z.string().optional(),
        retentionEnabled: z.boolean().optional(),
        retentionDays: z.number().int().min(1).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { db, session } = ctx;
        const { name, slug, logoUrl, notificationSettingsJson, retentionEnabled, retentionDays } =
          input;

        console.log("Updating workspace:", {
          workspaceId: ctx.workspaceId,
          userId: session.user.id,
        });

        if (!ctx.permissions.includes("settings:manage")) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Insufficient permissions to update this workspace",
          });
        }

        const { workspaceId } = ctx;

        await db
          .update(workspace)
          .set({
            ...(name ? { name } : {}),
            ...(slug ? { slug } : {}),
            ...(logoUrl !== undefined ? { logoUrl } : {}),
            ...(notificationSettingsJson !== undefined ? { notificationSettingsJson } : {}),
            ...(retentionEnabled !== undefined ? { retentionEnabled } : {}),
            ...(retentionDays !== undefined ? { retentionDays } : {}),
          })
          .where(eq(workspace.id, workspaceId));

        await recordAuditLog({
          userId: session.user.id,
          workspaceId: workspaceId,
          entityType: "workspace",
          entityId: workspaceId,
          action: "update",
          diff: { name, slug, logoUrl, retentionEnabled, retentionDays },
        });

        const cloudflareEnv = await getEnvAsync();
        await purgeWidgetCache({ db, workspaceId, env: cloudflareEnv });

        return { success: true };
      } catch (error) {
        console.error("❌ Error in updateWorkspace:", error);
        throw error;
      }
    }),

  deleteWorkspace: workspaceProcedure.mutation(async ({ ctx }) => {
    const { db, session } = ctx;

    const membership = await db.query.workspaceMember.findFirst({
      where: and(eq(workspaceMember.userId, session.user.id), isNull(workspaceMember.deletedAt)),
    });

    if (!membership || membership.role !== "owner") {
      throw new Error("Forbidden: Only owners can delete workspaces.");
    }

    const workspaceId = membership.workspaceId;

    // Don't allow deleting the last active workspace
    const allMemberships = await db.query.workspaceMember.findMany({
      where: and(eq(workspaceMember.userId, session.user.id), isNull(workspaceMember.deletedAt)),
    });

    if (allMemberships.length <= 1) {
      throw new Error("Cannot delete your only workspace.");
    }

    await db.update(workspace).set({ deletedAt: new Date() }).where(eq(workspace.id, workspaceId));

    await recordAuditLog({
      userId: session.user.id,
      workspaceId: workspaceId,
      entityType: "workspace",
      entityId: workspaceId,
      action: "delete",
    });

    return { success: true };
  }),

  acceptDpa: workspaceProcedure.mutation(async ({ ctx }) => {
    const { db, session, workspaceId } = ctx;

    if (!ctx.permissions.includes("settings:manage")) {
      throw new Error("Forbidden: Insufficient permissions");
    }

    await db
      .update(workspace)
      .set({
        dpaAcceptedAt: new Date(),
        dpaAcceptedById: session.user.id,
      })
      .where(eq(workspace.id, workspaceId));

    await recordAuditLog({
      userId: session.user.id,
      workspaceId: workspaceId,
      entityType: "workspace",
      entityId: workspaceId,
      action: "update",
      diff: { dpaAccepted: true },
    });

    return { success: true };
  }),

  findRespondentData: workspaceProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      const { db, workspaceId } = ctx;
      const { email } = input;

      const [countResult] = await db
        .select({ value: count() })
        .from(testimonial)
        .innerJoin(project, eq(testimonial.projectId, project.id))
        .where(
          and(
            eq(project.workspaceId, workspaceId),
            eq(testimonial.authorEmail, email),
            isNull(testimonial.deletedAt),
          ),
        );

      return { count: Number(countResult?.value || 0) };
    }),

  exportRespondentData: workspaceProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      const { db, workspaceId } = ctx;
      const { email } = input;

      const results = await db
        .select({
          id: testimonial.id,
          content: testimonial.content,
          rating: testimonial.rating,
          authorName: testimonial.authorName,
          authorEmail: testimonial.authorEmail,
          status: testimonial.status,
          type: testimonial.type,
          videoUrl: testimonial.videoUrl,
          createdAt: testimonial.createdAt,
          projectName: project.name,
        })
        .from(testimonial)
        .innerJoin(project, eq(testimonial.projectId, project.id))
        .where(
          and(
            eq(project.workspaceId, workspaceId),
            eq(testimonial.authorEmail, email),
            isNull(testimonial.deletedAt),
          ),
        );

      return {
        exportedAt: new Date().toISOString(),
        respondent: email,
        workspaceId,
        data: results,
      };
    }),

  deleteRespondentData: workspaceProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session, workspaceId } = ctx;
      const { email } = input;

      if (!ctx.permissions.includes("testimonial:delete")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Insufficient permissions to delete respondent data",
        });
      }

      // Find all testimonials in this workspace for this email
      const testimonialsToDelete = await db
        .select({ id: testimonial.id })
        .from(testimonial)
        .innerJoin(project, eq(testimonial.projectId, project.id))
        .where(and(eq(project.workspaceId, workspaceId), eq(testimonial.authorEmail, email)));

      if (testimonialsToDelete.length === 0) {
        return { success: true, count: 0 };
      }

      const ids = testimonialsToDelete.map((t) => t.id);

      // Perform deletion
      await db.delete(testimonial).where(inArray(testimonial.id, ids));

      await recordAuditLog({
        userId: session.user.id,
        workspaceId: workspaceId,
        entityType: "workspace",
        entityId: workspaceId,
        action: "delete",
        diff: {
          target: "respondent_data",
          email,
          deletedCount: ids.length,
        },
      });

      return { success: true, count: ids.length };
    }),

  updateProjectDomain: workspaceProcedure
    .input(z.object({ projectId: z.string(), domain: z.string().nullable() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session, workspaceId } = ctx;
      const { projectId, domain } = input;

      const p = await db.query.project.findFirst({
        where: and(eq(project.id, projectId), eq(project.workspaceId, workspaceId)),
      });

      if (!p) throw new Error("Project not found");

      const membership = await db.query.workspaceMember.findFirst({
        where: and(eq(workspaceMember.userId, session.user.id), isNull(workspaceMember.deletedAt)),
      });

      if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
        throw new Error("Forbidden: Insufficient permissions");
      }

      // Basic domain validation
      if (domain && !/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/i.test(domain)) {
        throw new Error("Invalid domain format");
      }

      await db
        .update(project)
        .set({
          customDomain: domain,
          customDomainVerified: false,
          customDomainVerificationError: null,
          customDomainVerificationToken: domain ? crypto.randomUUID() : null,
        })
        .where(eq(project.id, projectId));

      await recordAuditLog({
        userId: session.user.id,
        workspaceId,
        entityType: "project",
        entityId: projectId,
        action: "update",
        diff: { customDomain: domain },
      });

      return { success: true, verified: false, verificationError: null };
    }),

  verifyProjectDomain: workspaceProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session, workspaceId } = ctx;
      const { projectId } = input;

      const p = await db.query.project.findFirst({
        where: and(eq(project.id, projectId), eq(project.workspaceId, workspaceId)),
      });

      if (!p) throw new Error("Project not found");

      const membership = await db.query.workspaceMember.findFirst({
        where: and(eq(workspaceMember.userId, session.user.id), isNull(workspaceMember.deletedAt)),
      });

      if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
        throw new Error("Forbidden: Insufficient permissions");
      }

      if (!p.customDomain) {
        throw new Error("No domain configured");
      }

      try {
        // Perform CNAME check via Google DNS JSON API
        const response = await fetch(
          `https://dns.google/resolve?name=${p.customDomain}&type=CNAME`,
        );
        const data: any = await response.json();

        // Check for CNAME records pointing to our production domain
        const targetDomain = "kudoswall.org";
        const hasValidCname = data.Answer?.some(
          (record: any) =>
            record.type === 5 &&
            (record.data === targetDomain ||
              record.data === `${targetDomain}.` ||
              record.data.includes("vercel.app") ||
              record.data.includes("pages.dev")),
        );

        if (hasValidCname) {
          await db
            .update(project)
            .set({
              customDomainVerified: true,
              customDomainVerificationError: null,
            })
            .where(eq(project.id, projectId));
          return { success: true, verified: true, verificationError: null };
        } else {
          await db
            .update(project)
            .set({
              customDomainVerified: false,
              customDomainVerificationError: `CNAME record not found or pointing to wrong target. Expected: ${targetDomain}`,
            })
            .where(eq(project.id, projectId));
          return {
            success: true,
            verified: false,
            verificationError: `CNAME not found. Please point it to ${targetDomain}`,
          };
        }
      } catch (err) {
        console.error("DNS check failed", err);
        return {
          success: false,
          verified: false,
          verificationError: "Verification failed. Please try again later.",
        };
      }
    }),

  /**
   * Generates a short-lived signed URL for a private video asset stored in R2.
   * Validates workspace ownership of the testimonial before issuing the token.
   */
  getVideoSignedUrl: workspaceProcedure
    .input(z.object({ testimonialId: z.string() }))
    .query(async ({ ctx, input }): Promise<{ signedUrl: string }> => {
      const { db, workspaceId } = ctx;
      const { testimonialId } = input;

      // Resolve the testimonial and verify workspace ownership
      const t = await db.query.testimonial.findFirst({
        where: and(eq(testimonial.id, testimonialId), eq(testimonial.workspaceId, workspaceId)),
      });

      if (!t || !t.videoUrl) {
        throw new Error("Testimonial not found or has no video");
      }

      const secret = env.R2_SIGNING_SECRET;
      if (!secret) {
        throw new Error("Storage signing is not configured");
      }

      // Extract the R2 key from the stored videoUrl (e.g. "/api/videos/vid_abc.webm" → "vid_abc.webm")
      const videoKey = t.videoUrl.replace(/^\/api\/videos\//, "");

      const signedUrl = await generateSignedUrl(videoKey, secret, 3600);

      return { signedUrl };
    }),
  featureTestimonial: workspaceProcedure
    .input(z.object({ id: z.string(), featured: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session, workspaceId } = ctx;
      const { id, featured } = input;

      const t = await db.query.testimonial.findFirst({
        where: and(eq(testimonial.id, id), eq(testimonial.workspaceId, workspaceId)),
      });

      if (!t) throw new Error("Testimonial not found");

      if (!ctx.permissions.includes("testimonial:update")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Insufficient permissions to update this testimonial",
        });
      }

      await db
        .update(testimonial)
        .set({ featured, updatedAt: new Date() })
        .where(eq(testimonial.id, id));

      await recordAuditLog({
        userId: session.user.id,
        workspaceId,
        entityType: "testimonial",
        entityId: id,
        action: "update",
        diff: { featured },
      });

      return { success: true };
    }),

  reorderFeaturedTestimonials: workspaceProcedure
    .input(z.object({ orders: z.array(z.object({ id: z.string(), featuredOrder: z.number() })) }))
    .mutation(async ({ ctx, input }) => {
      const { db, session, workspaceId } = ctx;
      const { orders } = input;

      if (!ctx.permissions.includes("testimonial:update")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Insufficient permissions to reorder testimonials",
        });
      }

      // Perform updates in a transaction for atomicity
      await db.transaction(async (tx) => {
        for (const order of orders) {
          await tx
            .update(testimonial)
            .set({ featuredOrder: order.featuredOrder, updatedAt: new Date() })
            .where(and(eq(testimonial.id, order.id), eq(testimonial.workspaceId, workspaceId)));
        }
      });

      await recordAuditLog({
        userId: session.user.id,
        workspaceId,
        entityType: "testimonial",
        entityId: "multiple",
        action: "update",
        diff: { reordered: orders.length },
      });

      return { success: true };
    }),

  getPublicTestimonial: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const t = await db.query.testimonial.findFirst({
        where: and(
          eq(testimonial.id, input.id),
          isNull(testimonial.deletedAt),
          eq(testimonial.status, "approved"),
        ),
        with: {
          project: {
            with: {
              workspace: true,
            },
          },
          testimonialToTags: {
            with: {
              tag: true,
            },
          },
        },
      });

      if (!t) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Testimonial not found or is not publicly shared.",
        });
      }

      const signed = await signTestimonials([t]);
      return signed[0];
    }),
});
