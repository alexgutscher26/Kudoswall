import { z } from "zod";
import { protectedProcedure, router } from "../index";
import { stripe } from "../lib/stripe";
import { eq, and } from "drizzle-orm";
import { workspace, workspaceMember } from "@my-better-t-app/db/schema";
import { TRPCError } from "@trpc/server";

export const billingRouter = router({
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        priceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { workspaceId, priceId } = input;

      // Verify workspace ownership
      const ws = await ctx.db.query.workspace.findFirst({
        where: eq(workspace.id, workspaceId),
      });

      if (!ws) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workspace not found",
        });
      }

      const membership = await ctx.db.query.workspaceMember.findFirst({
        where: and(
          eq(workspaceMember.workspaceId, workspaceId),
          eq(workspaceMember.userId, ctx.session.user.id),
        ),
      });

      if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to manage billing for this workspace",
        });
      }

      const session = await stripe.checkout.sessions.create({
        customer: ws.stripeCustomerId || undefined,
        customer_email: ws.stripeCustomerId ? undefined : ctx.session.user.email,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        subscription_data: {
          trial_period_days: 7,
          metadata: {
            workspaceId,
            userId: ctx.session.user.id,
          },
        },
        mode: "subscription",
        allow_promotion_codes: true,
        success_url: `${ctx.req.headers.get("origin")}/dashboard/settings?workspaceId=${workspaceId}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${ctx.req.headers.get("origin")}/dashboard/settings?workspaceId=${workspaceId}`,
        metadata: {
          workspaceId,
          userId: ctx.session.user.id,
        },
      });

      return { url: session.url };
    }),

  createPortalSession: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { workspaceId } = input;

      const ws = await ctx.db.query.workspace.findFirst({
        where: eq(workspace.id, workspaceId),
      });

      if (!ws || !ws.stripeCustomerId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No stripe customer found for this workspace",
        });
      }

      const membership = await ctx.db.query.workspaceMember.findFirst({
        where: and(
          eq(workspaceMember.workspaceId, workspaceId),
          eq(workspaceMember.userId, ctx.session.user.id),
        ),
      });

      if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to manage billing for this workspace",
        });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: ws.stripeCustomerId,
        return_url: `${ctx.req.headers.get("origin")}/dashboard/settings?workspaceId=${workspaceId}`,
      });

      return { url: session.url };
    }),
});
