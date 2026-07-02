import { z } from "zod";
import { publicProcedure, router, workspaceProcedure } from "../index";
import { stripe } from "../lib/stripe";
import { eq, sql } from "drizzle-orm";
import { workspace, workspaceMember, organization } from "@my-better-t-app/db/schema";

import { TRPCError } from "@trpc/server";
import { PLANS } from "../config/plans";

export const billingRouter = router({
  getLTDCount: publicProcedure.query(async ({ ctx }) => {
    // Simple count of workspaces with LTD plan
    const res = await ctx.dbRead
      .select({ count: sql<number>`count(*)` })
      .from(workspace)
      .where(sql`${workspace.plan} = 'ltd'`);

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
        with: { organization: true },
      });

      if (!ws || !ws.organization) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workspace or Organization not found",
        });
      }

      const org = ws.organization;

      const membership = await db.query.workspaceMember.findFirst({
        where: eq(workspaceMember.userId, session.user.id),
      });

      if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to manage billing for this workspace",
        });
      }

      try {
        const origin = req.headers.get("origin") ?? "https://kudoswall.xyz";
        const stripeSession = await stripe.checkout.sessions.create({
          customer: org.stripeCustomerId || undefined,
          customer_email: org.stripeCustomerId ? undefined : session.user.email,

          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode: isLTD ? "payment" : "subscription",
          customer_creation: isLTD && !org.stripeCustomerId ? "always" : undefined,
          client_reference_id: org.id,

          subscription_data: isLTD
            ? undefined
            : {
                trial_period_days: 7,
                metadata: {
                  organizationId: org.id,
                  workspaceId,
                  userId: session.user.id,
                },
              },

          allow_promotion_codes: true,
          success_url: `${origin}/dashboard/settings?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/dashboard/settings`,
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
            organizationId: org.id,
            workspaceId,
            userId: session.user.id,
            planId: isLTD ? "ltd" : (plan?.id ?? "free"),
          },
        });

        return { url: stripeSession.url };
      } catch (err) {
        console.error("❌ Stripe Checkout Error:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err instanceof Error ? err.message : "Failed to create checkout session",
        });
      }
    }),

  createPortalSession: workspaceProcedure.mutation(async ({ ctx }) => {
    const { db, session, workspaceId, req } = ctx;

    let ws = await db.query.workspace.findFirst({
      where: eq(workspace.id, workspaceId),
      with: { organization: true },
    });

    if (!ws || !ws.organization) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Workspace or Organization not found",
      });
    }

    const org = ws.organization;
    let stripeCustomerId = org.stripeCustomerId;

    // If missing, create it on the fly
    if (!stripeCustomerId) {
      try {
        console.log(`[Stripe] Creating missing customer for workspace: ${workspaceId}`);
        const customer = await stripe.customers.create({
          email: session.user.email,
          name: session.user.name || undefined,
          metadata: {
            workspaceId,
            userId: session.user.id,
          },
        });
        stripeCustomerId = customer.id;

        await db.update(organization).set({ stripeCustomerId }).where(eq(organization.id, org.id));

        console.log(`[Stripe] Created customer ${stripeCustomerId} for workspace ${workspaceId}`);
      } catch (err) {
        console.error("❌ Failed to create Stripe customer:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to initialize billing. Please contact support.",
        });
      }
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

    if (!stripeCustomerId?.startsWith("cus_")) {
      console.error(`❌ Invalid Stripe Customer ID: ${stripeCustomerId}`);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Invalid Stripe Customer ID found: ${stripeCustomerId}. Please ensure your workspace is correctly connected to Stripe.`,
      });
    }

    try {
      const origin = req.headers.get("origin") ?? "https://kudoswall.xyz";
      console.log(
        `[StripePortal] Creating session for workspace: ${workspaceId}, customer: ${stripeCustomerId}, origin: ${origin}`,
      );

      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${origin}/dashboard/settings`,
      });

      return { url: stripeSession.url };
    } catch (err) {
      console.error("❌ Stripe Billing Portal Error:", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err instanceof Error ? err.message : "Failed to create billing portal session",
      });
    }
  }),
});
