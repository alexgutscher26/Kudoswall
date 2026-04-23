import { workspaceProcedure, router } from "../index";
import { tag, testimonialToTag } from "@my-better-t-app/db/schema";
import { eq, and, desc, isNull } from "drizzle-orm";
import { recordAuditLog } from "@my-better-t-app/db";
import { z } from "zod";

export const tagRouter = router({
  list: workspaceProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    return db.query.tag.findMany({
      where: isNull(tag.deletedAt),
      orderBy: desc(tag.createdAt),
    });
  }),

  create: workspaceProcedure
    .input(z.object({ name: z.string(), color: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const id = crypto.randomUUID();
      await db.insert(tag).values({
        id,
        workspaceId: ctx.workspaceId,
        name: input.name,
        color: input.color,
      });

      await recordAuditLog({
         userId: session.user.id,
        workspaceId: ctx.workspaceId,
        entityType: "tag",
        entityId: id,
        action: "create",
        diff: { name: input.name, color: input.color },
      });

      return { id };
    }),

  delete: workspaceProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const t = await db.query.tag.findFirst({
        where: eq(tag.id, input.id),
      });

      if (!t) {
        throw new Error("Forbidden or not found");
      }

      await db.update(tag).set({ deletedAt: new Date() }).where(eq(tag.id, input.id));

      await recordAuditLog({
        userId: session.user.id,
        entityType: "tag",
        entityId: input.id,
        action: "delete",
      });

      return { success: true };
    }),

  assign: workspaceProcedure
    .input(z.object({ testimonialId: z.string(), tagId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { testimonialId, tagId } = input;

      // Verify tag ownership (handled by tenantDb)
      const t = await db.query.tag.findFirst({
        where: eq(tag.id, tagId),
      });

      if (!t) {
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

  unassign: workspaceProcedure
    .input(z.object({ testimonialId: z.string(), tagId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { testimonialId, tagId } = input;

      // Verify tag ownership (handled by tenantDb)
      const t = await db.query.tag.findFirst({
        where: eq(tag.id, tagId),
      });

      if (!t) {
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
