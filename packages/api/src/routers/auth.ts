import { z } from "zod";
import { protectedProcedure, router } from "../index";
import { auth } from "@my-better-t-app/auth";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  listSessions: protectedProcedure.query(async ({ ctx }) => {
    try {
      const sessions = await auth.api.listSessions({
        headers: ctx.req.headers,
      });
      return sessions.map((s: any) => ({
        ...s,
        isCurrent: s.id === ctx.session?.session.id,
      }));
    } catch (error) {
      console.error("[AUTH_ROUTER] Error listing sessions:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to list active sessions",
      });
    }
  }),

  revokeSession: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        await auth.api.revokeSession({
          body: {
            token: input.token,
          },
          headers: ctx.req.headers,
        });
        return { success: true };
      } catch (error) {
        console.error("[AUTH_ROUTER] Error revoking session:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to revoke session",
        });
      }
    }),

  revokeOtherSessions: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      await auth.api.revokeOtherSessions({
        headers: ctx.req.headers,
      });
      return { success: true };
    } catch (error) {
      console.error("[AUTH_ROUTER] Error revoking other sessions:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to revoke other sessions",
      });
    }
  }),
});
