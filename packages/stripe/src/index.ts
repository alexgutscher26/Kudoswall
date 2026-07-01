import Stripe from "stripe";
import { env } from "@my-better-t-app/env/server";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY || "dummy_key_for_build", {
  apiVersion: "2025-02-24.acacia" as any, // Using as any to avoid strict type mismatch
  appInfo: {
    name: "KudosWall",
    version: "1.0.0",
  },
});

export default stripe;
