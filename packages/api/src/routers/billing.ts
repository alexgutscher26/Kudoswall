import { z } from "zod";
import { publicProcedure, router, workspaceProcedure } from "../index";
import { stripe } from "../lib/stripe";
import { eq, count as dCount } from "drizzle-orm";
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

  createCheckoutSession: workspaceProcedure
    .input(
      z.object({
        priceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session, workspaceId, req } = ctx;
      const { priceId } = input;

      const plan = Object.values(PLANS).find(
        (p) =>
          p.stripePriceIdMonthly === priceId ||
          p.stripePriceIdYearly === priceId ||
          p.stripePriceIdLifetime === priceId,
      );

      const isLTD = plan?.id === "ltd";

      const ws = await db.query.workspace.findFirst({
        where: eq(workspace.id, workspaceId),
      });

      if (!ws) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workspace not found",
        });
      }

      const membership = await db.query.workspaceMember.findFirst({
        where: eq(workspaceMember.userId, session.user.id),
      });

      if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to manage billing for this workspace",
        });
      }

      const stripeSession = await stripe.checkout.sessions.create({
        customer: ws.stripeCustomerId || undefined,
        customer_email: ws.stripeCustomerId ? undefined : session.user.email,
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
                userId: session.user.id,
              },
            },
        allow_promotion_codes: true,
        success_url: `${req.headers.get("origin")}/dashboard/settings?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get("origin")}/dashboard/settings`,
        payment_intent_data: isLTD
          ? {
              setup_future_usage: "on_session",
              metadata: {
                workspaceId,
                userId: session.user.id,
                planId: "ltd",
              },
            }
          : undefined,
        metadata: {
          workspaceId,
          userId: session.user.id,
          planId: isLTD ? "ltd" : (plan?.id ?? "free"),
        },
      });

      return { url: stripeSession.url };
    }),

  createPortalSession: workspaceProcedure.mutation(async ({ ctx }) => {
    const { db, session, workspaceId, req } = ctx;

    const ws = await db.query.workspace.findFirst({
      where: eq(workspace.id, workspaceId),
    });

    if (!ws || !ws.stripeCustomerId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No stripe customer found for this workspace",
      });
    }

    const membership = await db.query.workspaceMember.findFirst({
      where: eq(workspaceMember.userId, session.user.id),
    });

    if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have permission to manage billing for this workspace",
      });
    }

    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: ws.stripeCustomerId,
      return_url: `${req.headers.get("origin")}/dashboard/settings`,
    });

    return { url: stripeSession.url };
  }),
});
