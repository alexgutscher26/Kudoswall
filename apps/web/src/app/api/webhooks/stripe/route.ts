import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@my-better-t-app/api/lib/stripe";
import { db } from "@/lib/server-db";
import { workspace } from "@my-better-t-app/db/schema";
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

      // If it's a subscription, retrieve it to get the price ID
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = subscription.items.data[0]?.price.id;
        plan = priceId ? priceToPlan[priceId] : plan;
      }

      const workspaceId = session.metadata?.workspaceId;
      console.log(`🔍 Metadata:`, { workspaceId, plan });

      if (!workspaceId) {
        console.error("❌ No workspaceId found in checkout session metadata");
        return new NextResponse("No workspaceId in metadata", { status: 400 });
      }

      try {
        await db
          .update(workspace)
          .set({
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription || null,
            subscriptionStatus: session.subscription ? "active" : "active", // LTD is active forever
            plan: plan || "free",
          })
          .where(eq(workspace.id, workspaceId));

        console.log(`🚀 Workspace ${workspaceId} updated to plan: ${plan || "free"}`);
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

      await db
        .update(workspace)
        .set({
          subscriptionStatus: subscription.status as any,
          plan: plan || undefined,
        })
        .where(eq(workspace.stripeSubscriptionId, subscription.id));

      console.log(`✅ Subscription ${subscription.id} updated. Plan: ${plan}`);
    }

    if (event.type === "customer.subscription.deleted") {
      console.log("🗑️ Processing customer.subscription.deleted...");
      const subscription = event.data.object as Stripe.Subscription;

      await db
        .update(workspace)
        .set({
          subscriptionStatus: "canceled",
          plan: "free",
        })
        .where(eq(workspace.stripeSubscriptionId, subscription.id));

      console.log(`✅ Subscription ${subscription.id} marked as canceled.`);
    }

    return new NextResponse(null, { status: 200 });
  } catch (err: any) {
    console.error(`🔴 INTERNAL WEBHOOK ERROR:`, err.message);
    return new NextResponse(`Internal Server Error: ${err.message}`, { status: 500 });
  }
}
