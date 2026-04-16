import Stripe from "stripe";
import { env } from "@my-better-t-app/env/server";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-03-25.dahlia", // Use the latest stable or the one you prefer
  appInfo: {
    name: "KudosWall",
    version: "1.0.0",
  },
});
