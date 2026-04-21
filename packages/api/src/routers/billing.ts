import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../index";
import { stripe } from "../lib/stripe";
import { eq, and, count as dCount } from "drizzle-orm";
import { workspace, workspaceMember } from "@my-better-t-app/db/schema";
import { TRPCError } from "@trpc/server";
import { PLANS } from "../config/plans";

export const billingRouter = router({
  getLTDCount: publicProcedure.query(async ({ ctx }) => {
    // Simple count of workspaces with LTD plan
    const res = await ctx.dbRead
      .select({ count: dCount() })
      .from(workspace)
      .where(eq(workspace.plan, "ltd"));

    const count = res[0]?.count || 0;

    return { count: Number(count) };
  }),

  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        priceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { workspaceId, priceId } = input;

      const plan = Object.values(PLANS).find(
        (p) =>
          p.stripePriceIdMonthly === priceId ||
          p.stripePriceIdYearly === priceId ||
          p.stripePriceIdLifetime === priceId,
      );

      const isLTD = plan?.id === "ltd";

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
        mode: isLTD ? "payment" : "subscription",
        customer_creation: isLTD ? "always" : undefined,
        client_reference_id: workspaceId,
        subscription_data: isLTD
          ? undefined
          : {
              trial_period_days: 7,
              metadata: {
                workspaceId,
                userId: ctx.session.user.id,
              },
            },
        allow_promotion_codes: true,
        success_url: `${ctx.req.headers.get("origin")}/dashboard/settings?workspaceId=${workspaceId}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${ctx.req.headers.get("origin")}/dashboard/settings?workspaceId=${workspaceId}`,
        payment_intent_data: isLTD
          ? {
              setup_future_usage: "on_session",
              metadata: {
                workspaceId,
                userId: ctx.session.user.id,
                planId: "ltd",
              },
            }
          : undefined,
        metadata: {
          workspaceId,
          userId: ctx.session.user.id,
          planId: isLTD ? "ltd" : (plan?.id ?? "free"),
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
