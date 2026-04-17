import { type web as server } from "@my-better-t-app/infra/alchemy.run";

// This file infers types for the cloudflare:workers environment from your Alchemy Worker.
// @see https://alchemy.run/concepts/bindings/#type-safe-bindings

export type CloudflareEnv = typeof server.Env;

declare global {
  type Env = CloudflareEnv & {
    RESEND_API_KEY?: string;
    EMAIL_FROM?: string;
    CRON_SECRET?: string;
    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;
    UPLOADTHING_TOKEN?: string;
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
    STRIPE_PLAN_1_PRICE_ID?: string;
    STRIPE_PLAN_2_PRICE_ID?: string;
    STRIPE_PLAN_3_PRICE_ID?: string;
    NEXT_PUBLIC_STRIPE_PLAN_1_PRICE_ID?: string;
    NEXT_PUBLIC_STRIPE_PLAN_2_PRICE_ID?: string;
    NEXT_PUBLIC_STRIPE_PLAN_3_PRICE_ID?: string;
  };
}

declare module "cloudflare:workers" {
  namespace Cloudflare {
    export interface Env extends CloudflareEnv {}
  }
}
