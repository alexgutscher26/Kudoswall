import Stripe from "stripe";
import { env } from "@my-better-t-app/env/server";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20", // Standard stable version
  appInfo: {
    name: "KudosWall",
    version: "1.0.0",
  },
});
