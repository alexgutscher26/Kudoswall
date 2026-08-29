import Stripe from "stripe";
import { env } from "@my-better-t-app/env/server";

let _stripeInstance: Stripe | null = null;
let _lastSecretKey: string | undefined = undefined;

export function getStripeClient(): Stripe {
  const secretKey = env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  if (!_stripeInstance || _lastSecretKey !== secretKey) {
    _lastSecretKey = secretKey;
    _stripeInstance = new Stripe(secretKey || "dummy_key_for_build", {
      apiVersion: "2025-02-24.acacia" as any,
      appInfo: {
        name: "KudosWall",
        version: "1.0.0",
      },
    });
  }
  return _stripeInstance;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    const client = getStripeClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export default stripe;
