import type { Database } from "@my-better-t-app/db";
import { organization, user, workspace } from "@my-better-t-app/db/schema";
import { eq } from "drizzle-orm";
import { stripe } from "../lib/stripe";
import { getPriceToPlan, type Plan } from "../config/plans";
import { env } from "@my-better-t-app/env/server";
import type Stripe from "stripe";

export interface FulfillSessionOptions {
  db: Database;
  sessionId?: string;
  session?: Stripe.Checkout.Session;
}

export interface FulfillSessionResult {
  success: boolean;
  plan: Plan;
  organizationId: string;
  workspaceId?: string;
  userId?: string;
  subscriptionId?: string | null;
  customerId?: string | null;
}

export async function fulfillStripeCheckoutSession({
  db,
  sessionId,
  session: providedSession,
}: FulfillSessionOptions): Promise<FulfillSessionResult> {
  let session: Stripe.Checkout.Session;

  if (providedSession) {
    session = providedSession;
  } else if (sessionId) {
    session = (
      await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["subscription", "line_items"],
      })
    ).data;
  } else {
    throw new Error("Either sessionId or session must be provided");
  }

  const priceToPlan = getPriceToPlan();

  let plan: Plan = (session.metadata?.planId as Plan) || "free";
  let trialEnd: number | null = null;
  let subscriptionStatus = "active";
  let subscriptionId: string | null = null;

  if (session.subscription) {
    let subObj: Stripe.Subscription;
    if (typeof session.subscription === "string") {
      subObj = (await stripe.subscriptions.retrieve(session.subscription)).data;
    } else {
      subObj = session.subscription as Stripe.Subscription;
    }

    subscriptionId = subObj.id;
    subscriptionStatus = subObj.status;
    trialEnd = subObj.trial_end;

    const priceId = subObj.items?.data?.[0]?.price?.id;
    if (priceId && priceToPlan[priceId]) {
      plan = priceToPlan[priceId];
    }
  } else if (session.line_items?.data?.[0]?.price?.id) {
    const priceId = session.line_items.data[0].price.id;
    if (priceToPlan[priceId]) {
      plan = priceToPlan[priceId];
    }
  }

  // Handle Lifetime Deal
  if (session.metadata?.planId === "ltd" || plan === "ltd") {
    plan = "ltd";
    subscriptionStatus = "active";
  }

  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id || null;

  let organizationId = session.client_reference_id || session.metadata?.organizationId;
  const workspaceId = session.metadata?.workspaceId;
  const userId = session.metadata?.userId;

  // Fallback: If organizationId is missing, resolve from workspace or user
  if (!organizationId && workspaceId) {
    const ws = await db.query.workspace.findFirst({
      where: eq(workspace.id, workspaceId),
    });
    if (ws?.organizationId) {
      organizationId = ws.organizationId;
    }
  }

  if (!organizationId && customerId) {
    const org = await db.query.organization.findFirst({
      where: eq(organization.stripeCustomerId, customerId),
    });
    if (org?.id) {
      organizationId = org.id;
    }
  }

  if (!organizationId && userId) {
    const org = await db.query.organization.findFirst({
      where: eq(organization.ownerId, userId),
    });
    if (org?.id) {
      organizationId = org.id;
    }
  }

  if (!organizationId) {
    throw new Error(`Could not determine organizationId for checkout session: ${session.id}`);
  }

  await db.transaction(async (tx) => {
    // 1. Update Organization
    await tx
      .update(organization)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: subscriptionStatus as any,
        plan,
        trialEndsAt: trialEnd ? new Date(trialEnd * 1000) : null,
      })
      .where(eq(organization.id, organizationId));

    // 2. Update Workspaces associated with organization
    if (workspaceId) {
      await tx
        .update(workspace)
        .set({
          plan,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId || "",
          subscriptionStatus: subscriptionStatus as any,
          trialEndsAt: trialEnd ? new Date(trialEnd * 1000) : null,
        })
        .where(eq(workspace.id, workspaceId));
    } else {
      await tx
        .update(workspace)
        .set({
          plan,
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId || "",
          subscriptionStatus: subscriptionStatus as any,
          trialEndsAt: trialEnd ? new Date(trialEnd * 1000) : null,
        })
        .where(eq(workspace.organizationId, organizationId));
    }

    // 3. Update User if present
    if (userId) {
      await tx
        .update(user)
        .set({
          plan,
        })
        .where(eq(user.id, userId));
    }
  });

  // Loops sync if configured
  const loopsApiKey = env.LOOPS_API_KEY;
  const customerEmail = session.customer_details?.email;
  if (loopsApiKey && customerEmail) {
    try {
      const { LoopsService } = await import("@my-better-t-app/email");
      const loops = new LoopsService(loopsApiKey);
      await loops.updateContact({
        email: customerEmail,
        plan,
        subscriptionStatus,
      });
      await loops.sendEvent({
        email: customerEmail,
        eventName: "subscription_created",
        eventProperties: {
          planName: plan,
        },
      });
    } catch (loopsErr) {
      console.error("[Loops Sync] Failed to sync subscription:", loopsErr);
    }
  }

  return {
    success: true,
    plan,
    organizationId,
    workspaceId,
    userId,
    subscriptionId,
    customerId,
  };
}
