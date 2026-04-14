import { protectedProcedure, router } from "../index";
import { tag, workspace, testimonialToTag } from "@my-better-t-app/db/schema";
import { eq, and, desc, isNull } from "drizzle-orm";
import { recordAuditLog } from "@my-better-t-app/db";
import { z } from "zod";

export const tagRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;

    const ws = await db.query.workspace.findFirst({
      where: eq(workspace.ownerId, session.user.id),
    });

    if (!ws) return [];

    return db.query.tag.findMany({
      where: and(eq(tag.workspaceId, ws.id), isNull(tag.deletedAt)),
      orderBy: desc(tag.createdAt),
    });
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string(), color: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const ws = await db.query.workspace.findFirst({
        where: eq(workspace.ownerId, session.user.id),
      });

      if (!ws) throw new Error("Workspace not found");

      const id = crypto.randomUUID();
      await db.insert(tag).values({
        id,
        workspaceId: ws.id,
        name: input.name,
        color: input.color,
      });

      await recordAuditLog({
        userId: session.user.id,
        entityType: "tag",
        entityId: id,
        action: "create",
        diff: { name: input.name, color: input.color },
      });

      return { id };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const t = await db.query.tag.findFirst({
        where: eq(tag.id, input.id),
        with: {
          workspace: true,
        },
      });

      if (!t || t.workspace.ownerId !== session.user.id) {
        throw new Error("Forbidden");
      }

      await db.update(tag).set({ deletedAt: new Date().toISOString() }).where(eq(tag.id, input.id));

      await recordAuditLog({
        userId: session.user.id,
        entityType: "tag",
        entityId: input.id,
        action: "delete",
      });

      return { success: true };
    }),

  assign: protectedProcedure
    .input(z.object({ testimonialId: z.string(), tagId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { testimonialId, tagId } = input;

      // Verify tag ownership
      const t = await db.query.tag.findFirst({
        where: eq(tag.id, tagId),
        with: { workspace: true },
      });

      if (!t || t.workspace.ownerId !== session.user.id) {
        throw new Error("Forbidden: Tag ownership");
      }

      await db
        .insert(testimonialToTag)
        .values({
          testimonialId,
          tagId,
        })
        .onConflictDoNothing();

      return { success: true };
    }),

  unassign: protectedProcedure
    .input(z.object({ testimonialId: z.string(), tagId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { testimonialId, tagId } = input;

      // Verify tag ownership
      const t = await db.query.tag.findFirst({
        where: eq(tag.id, tagId),
        with: { workspace: true },
      });

      if (!t || t.workspace.ownerId !== session.user.id) {
        throw new Error("Forbidden: Tag ownership");
      }

      await db
        .delete(testimonialToTag)
        .where(
          and(eq(testimonialToTag.testimonialId, testimonialId), eq(testimonialToTag.tagId, tagId)),
        );

      return { success: true };
    }),
});
