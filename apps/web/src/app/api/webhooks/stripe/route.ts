import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@my-better-t-app/api/lib/stripe";
import { db } from "@/lib/server-db";
import { workspace, user, organization } from "@my-better-t-app/db/schema";

import { eq } from "drizzle-orm";
import { env } from "@my-better-t-app/env/server";
import type Stripe from "stripe";

export async function POST(req: Request) {
  try {
    console.log("⚡ [STRIPE] Webhook request received!");
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
      const secret = env.STRIPE_WEBHOOK_SECRET;
      if (!secret) {
        console.error("❌ STRIPE_WEBHOOK_SECRET is not defined in environment variables");
      }
      event = stripe.webhooks.constructEvent(body, signature, secret || "") as any;
      console.log(`✅ Webhook received: ${event.type} [${event.id}]`);
    } catch (error: any) {
      console.error(`❌ Webhook Signature Error: ${error.message}`);
      return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as any;

    // Handle specific events
    if (event.type === "checkout.session.completed") {
      console.log("💳 Processing checkout.session.completed...");

      const { getPriceToPlan } = await import("@my-better-t-app/api/config/plans");
      const priceToPlan = getPriceToPlan();

      let plan = session.metadata?.planId;

      let trialEnd: number | null = null;
      // If it's a subscription, retrieve it to get the price ID
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = subscription.items.data[0]?.price.id;
        plan = priceId ? priceToPlan[priceId] : plan;
        trialEnd = subscription.trial_end;
      }

      const organizationId = session.client_reference_id || session.metadata?.organizationId;
      const workspaceId = session.metadata?.workspaceId;
      const userId = session.metadata?.userId;

      console.log(`🔍 Received Webhook Session:`, {
        id: session.id,
        customer: session.customer,
        workspaceId,
        userId,
        plan,
        client_ref: session.client_reference_id,
      });

      if (!organizationId) {
        console.error(
          "❌ CRITICAL: No organizationId found in checkout session metadata OR client_reference_id",
        );
        return new NextResponse("No organizationId found to link payment", { status: 400 });
      }

      try {
        await db.transaction(async (tx) => {
          // 1. Update Organization
          await tx
            .update(organization)
            .set({
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription || null,
              subscriptionStatus: "active",
              plan: plan || "free",
              trialEndsAt: trialEnd ? new Date(trialEnd * 1000) : null,
            })
            .where(eq(organization.id, organizationId));

          // 2. Optional: Sync to Workspace (legacy/fallback)
          if (workspaceId) {
            await tx
              .update(workspace)
              .set({
                plan: plan || "free",
                subscriptionStatus: "active",
              })
              .where(eq(workspace.id, workspaceId));
          }

          // 2. Update User if present
          if (userId) {
            await tx
              .update(user)
              .set({
                plan: plan || "free",
              })
              .where(eq(user.id, userId));
          }
        });

        console.log(
          `🚀 Workspace ${workspaceId} and User ${userId} updated to plan: ${plan || "free"}`,
        );
      } catch (dbError: any) {
        console.error(`❌ Database Update Error: ${dbError.message}`);
        return new NextResponse("Database update failed", { status: 500 });
      }
    }

    if (event.type === "customer.subscription.updated") {
      console.log("🔄 Processing customer.subscription.updated...");
      const { getPriceToPlan } = await import("@my-better-t-app/api/config/plans");
      const priceToPlan = getPriceToPlan();
      const subscription = event.data.object as Stripe.Subscription;
      const priceId = subscription.items.data[0]?.price.id;
      const plan = priceId ? priceToPlan[priceId] : undefined;
      const userId = subscription.metadata?.userId;
      const organizationId = subscription.metadata?.organizationId;

      await db.transaction(async (tx) => {
        // Update Organization
        await tx
          .update(organization)
          .set({
            subscriptionStatus: subscription.status as any,
            plan: plan || undefined,
            trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
          })
          .where(eq(organization.stripeSubscriptionId, subscription.id));

        // Sync Workspaces
        if (organizationId) {
          await tx
            .update(workspace)
            .set({
              subscriptionStatus: subscription.status as any,
              plan: plan || undefined,
            })
            .where(eq(workspace.organizationId, organizationId));
        }

        if (userId && plan) {
          await tx
            .update(user)
            .set({
              plan: plan as any,
            })
            .where(eq(user.id, userId));
        }
      });

      console.log(`✅ Subscription ${subscription.id} and User ${userId} updated. Plan: ${plan}`);
    }

    if (event.type === "customer.subscription.deleted") {
      console.log("🗑️ Processing customer.subscription.deleted...");
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      const organizationData = await db.query.organization.findFirst({
        where: eq(organization.stripeSubscriptionId, subscription.id),
        with: { owner: true, workspaces: true },
      });

      await db.transaction(async (tx) => {
        await tx
          .update(organization)
          .set({
            subscriptionStatus: "canceled",
            plan: "free",
          })
          .where(eq(organization.stripeSubscriptionId, subscription.id));

        if (organizationData?.id) {
          await tx
            .update(workspace)
            .set({
              subscriptionStatus: "canceled",
              plan: "free",
            })
            .where(eq(workspace.organizationId, organizationData.id));
        }

        if (userId) {
          await tx
            .update(user)
            .set({
              plan: "free",
            })
            .where(eq(user.id, userId));
        }
      });

      if (organizationData?.owner?.email) {
        try {
          const { EmailService } = await import("@my-better-t-app/email");
          const emailService = new EmailService(env.RESEND_API_KEY || "", env.EMAIL_FROM);
          await emailService.sendCancellationEmail(
            organizationData.owner.email,
            organizationData.owner.name || "there",
          );
        } catch (emailError) {
          console.error("❌ Failed to send cancellation email:", emailError);
        }
      }

      console.log(`✅ Subscription ${subscription.id} and User ${userId} marked as canceled.`);
    }

    return new NextResponse(null, { status: 200 });
  } catch (err: any) {
    console.error(`🔴 INTERNAL WEBHOOK ERROR:`, err.message);
    return new NextResponse(`Internal Server Error: ${err.message}`, { status: 500 });
  }
}
