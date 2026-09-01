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
      event = (await stripe.webhooks.constructEventAsync(body, signature, secret || "")) as any;
      console.log(`✅ Webhook received: ${event.type} [${event.id}]`);
    } catch (error: any) {
      console.error(`❌ Webhook Signature Error: ${error.message}`);
      return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as any;

    // Handle specific events
    if (event.type === "checkout.session.completed") {
      console.log("💳 Processing checkout.session.completed...");

      try {
        const { fulfillStripeCheckoutSession } =
          await import("@my-better-t-app/api/logic/stripe-fulfillment");
        const result = await fulfillStripeCheckoutSession({
          db,
          session,
        });

        console.log(
          `🚀 Checkout session fulfilled successfully! Plan: ${result.plan}, Org: ${result.organizationId}, Workspace: ${result.workspaceId}`,
        );
      } catch (dbError: any) {
        console.error(`❌ Fulfillment / Database Update Error: ${dbError.message}`);
        return new NextResponse("Fulfillment failed: " + dbError.message, { status: 500 });
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

      // Sync update to Loops.so
      const loopsApiKey = env.LOOPS_API_KEY;
      if (loopsApiKey) {
        try {
          const orgData = await db.query.organization.findFirst({
            where: eq(organization.stripeSubscriptionId, subscription.id),
            with: { owner: true },
          });

          if (orgData?.owner?.email) {
            const { LoopsService } = await import("@my-better-t-app/email");
            const loops = new LoopsService(loopsApiKey);
            await loops.updateContact({
              email: orgData.owner.email,
              plan: plan || "free",
              subscriptionStatus: subscription.status as string,
            });
            console.log(
              `[Loops Webhook Sync] Updated subscription synced for ${orgData.owner.email}`,
            );
          }
        } catch (loopsErr) {
          console.error("[Loops Webhook Sync] Failed to sync subscription updated:", loopsErr);
        }
      }
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

      // Sync subscription deletion to Loops.so
      const loopsApiKey = env.LOOPS_API_KEY;
      if (loopsApiKey && organizationData?.owner?.email) {
        try {
          const { LoopsService } = await import("@my-better-t-app/email");
          const loops = new LoopsService(loopsApiKey);
          await loops.updateContact({
            email: organizationData.owner.email,
            plan: "free",
            subscriptionStatus: "canceled",
          });
          await loops.sendEvent({
            email: organizationData.owner.email,
            eventName: "subscription_cancelled",
          });
          console.log(
            `[Loops Webhook Sync] Synced canceled subscription for ${organizationData.owner.email}`,
          );
        } catch (loopsErr) {
          console.error("[Loops Webhook Sync] Failed to sync subscription deleted:", loopsErr);
        }
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (err: any) {
    console.error(`🔴 INTERNAL WEBHOOK ERROR:`, err.message);
    return new NextResponse(`Internal Server Error: ${err.message}`, { status: 500 });
  }
}
