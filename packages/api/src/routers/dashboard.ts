import { protectedProcedure, router } from "../index";
import {
  workspace,
  project,
  testimonial,
  widget,
  analyticsEvent,
  user,
} from "@my-better-t-app/db/schema";
import { eq, and, desc, count, sql, gte, inArray, isNull } from "drizzle-orm";
import { recordAuditLog } from "@my-better-t-app/db";
import { z } from "zod";
import { EmailService } from "@my-better-t-app/email";
import { env } from "@my-better-t-app/env/server";

import type { Database } from "@my-better-t-app/db";

/**
 * Helper to ensure the user has a workspace.
 */
async function getOrCreateWorkspace(db: Database, userId: string, userName: string) {
  const existing = await db.query.workspace.findFirst({
    where: eq(workspace.ownerId, userId),
  });

  if (existing) return existing;

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

  const newWorkspace = {
    id: crypto.randomUUID(),
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
  };

  await db.insert(workspace).values(newWorkspace);

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

export const dashboardRouter = router({
  getData: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const ws = await getOrCreateWorkspace(db, session.user.id, session.user.name);

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
    };

    // Calculate Conversion Rate
    const testimonialsCount = Number(testimonialCount?.value || 0);
    const conversionRate =
      totalViews > 0 ? ((testimonialsCount / totalViews) * 100).toFixed(1) + "%" : "—";

    return {
      workspace: ws,
      projects,
      recentTestimonials,
      onboarding,
      stats: {
        testimonials: testimonialsCount,
        pending: Number(pendingCount?.value || 0),
        views: totalViews,
        conversion: conversionRate,
      },
    };
  }),

  getProjectTestimonials: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { projectId } = input;

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
    }),

  updateProjectSettings: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        settings: z.unknown(),
        name: z.string().optional(),
        collectionSlug: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { projectId, settings, name, collectionSlug } = input;

      const p = await db.query.project.findFirst({
        where: eq(project.id, projectId),
        with: {
          workspace: true,
        },
      });

      if (!p || p.workspace.ownerId !== session.user.id) {
        throw new Error("Forbidden");
      }

      await db
        .update(project)
        .set({
          collectionSettingsJson: JSON.stringify(settings),
          ...(name ? { name } : {}),
          ...(collectionSlug ? { collectionSlug } : {}),
        })
        .where(eq(project.id, projectId));

      await recordAuditLog({
        userId: session.user.id,
        entityType: "project",
        entityId: projectId,
        action: "update",
        diff: { collectionSettingsJson: settings, name, collectionSlug },
      });

      return { success: true };
    }),

  deleteProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { id } = input;

      const p = await db.query.project.findFirst({
        where: eq(project.id, id),
        with: {
          workspace: true,
        },
      });

      if (!p || p.workspace.ownerId !== session.user.id) {
        throw new Error("Forbidden");
      }

      await db.update(project).set({ deletedAt: new Date() }).where(eq(project.id, id));

      await recordAuditLog({
        userId: session.user.id,
        entityType: "project",
        entityId: id,
        action: "delete",
      });

      return { success: true };
    }),

  duplicateProject: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { id } = input;

      const p = await db.query.project.findFirst({
        where: eq(project.id, id),
        with: {
          workspace: true,
        },
      });

      if (!p || p.workspace.ownerId !== session.user.id) {
        throw new Error("Forbidden");
      }

      const generateSlug = (name: string) =>
        name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

      const newName = `${p.name} (Copy)`;
      const newSlug = generateSlug(newName);

      const newProject = {
        id: crypto.randomUUID(),
        workspaceId: p.workspaceId,
        name: newName,
        slug: newSlug,
        collectionSlug: newSlug,
        collectionSettingsJson: p.collectionSettingsJson,
      };

      await db.insert(project).values(newProject);

      await recordAuditLog({
        userId: session.user.id,
        entityType: "project",
        entityId: newProject.id,
        action: "create",
        diff: { duplicatedFrom: id },
      });

      return { success: true, newProjectId: newProject.id };
    }),

  completeOnboardingStep: protectedProcedure
    .input(z.object({ step: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { step } = input;

      const ws = await db.query.workspace.findFirst({
        where: eq(workspace.ownerId, session.user.id),
      });

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

  // TODO: (Paid Plan) Implement Weekly Digest (Monday 8am)
  // This should probably be a separate background job (e.g. Upstash QStash)
  // getWeeklyDigestData: protectedProcedure.query(async ({ ctx }) => { ... }),
});
