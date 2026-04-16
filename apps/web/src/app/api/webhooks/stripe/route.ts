import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@my-better-t-app/api/lib/stripe";
import { db } from "@/lib/server-db";
import { workspace } from "@my-better-t-app/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@my-better-t-app/env/server";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET || "") as any;
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  // Handle specific events
  if (event.type === "checkout.session.completed") {
    const { PRICE_TO_PLAN } = await import("@my-better-t-app/api/config/plans");
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    const priceId = subscription.items.data[0]?.price.id;
    const plan = priceId ? PRICE_TO_PLAN[priceId] : undefined;

    const workspaceId = session.metadata.workspaceId;
    if (!workspaceId) {
      return new NextResponse("No workspaceId in metadata", { status: 400 });
    }

    await db
      .update(workspace)
      .set({
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        subscriptionStatus: subscription.status as any,
        plan: plan || "free",
      })
      .where(eq(workspace.id, workspaceId));
  }

  if (event.type === "customer.subscription.updated") {
    const { PRICE_TO_PLAN } = await import("@my-better-t-app/api/config/plans");
    const subscription = event.data.object as Stripe.Subscription;
    const priceId = subscription.items.data[0]?.price.id;
    const plan = priceId ? PRICE_TO_PLAN[priceId] : undefined;

    await db
      .update(workspace)
      .set({
        subscriptionStatus: subscription.status as any,
        plan: plan || undefined,
      })
      .where(eq(workspace.stripeSubscriptionId, subscription.id));
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    await db
      .update(workspace)
      .set({
        subscriptionStatus: "canceled",
        plan: "free",
      })
      .where(eq(workspace.stripeSubscriptionId, subscription.id));
  }

  return new NextResponse(null, { status: 200 });
}
