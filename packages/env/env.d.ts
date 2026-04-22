import { type web as server } from "@my-better-t-app/infra/alchemy.run";

// This file infers types for the cloudflare:workers environment from your Alchemy Worker.
// @see https://alchemy.run/concepts/bindings/#type-safe-bindings

export type CloudflareEnv = typeof server.Env;

declare global {
  type Env = CloudflareEnv & {
    RESEND_API_KEY?: string;
    EMAIL_FROM?: string;
    CRON_SECRET?: string;
    DATABASE_URL?: string;
    DATABASE_READ_URL?: string;
    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;
    UPLOADTHING_TOKEN?: string;
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
    STRIPE_PLAN_1_PRICE_ID?: string;
    STRIPE_PLAN_2_PRICE_ID?: string;
    STRIPE_LTD_PRICE_ID?: string;
    STRIPE_PLAN_1_YEARLY_PRICE_ID?: string;
    STRIPE_PLAN_2_YEARLY_PRICE_ID?: string;
    NEXT_PUBLIC_STRIPE_PLAN_1_PRICE_ID?: string;
    NEXT_PUBLIC_STRIPE_PLAN_2_PRICE_ID?: string;
    NEXT_PUBLIC_STRIPE_LTD_PRICE_ID?: string;
    NEXT_PUBLIC_STRIPE_PLAN_1_YEARLY_PRICE_ID?: string;
    NEXT_PUBLIC_STRIPE_PLAN_2_YEARLY_PRICE_ID?: string;
    NEXT_PUBLIC_ENABLE_VIDEO?: string;
    /** Secret for signing private R2 asset URLs (HMAC-SHA256). Must be set in production. */
    R2_SIGNING_SECRET?: string;
    /** R2 bucket for public images (avatars, logos). Separate from VIDEOS_BUCKET. */
    IMAGES_BUCKET?: R2Bucket;
    VIRUSTOTAL_API_KEY?: string;
  };
}

declare module "cloudflare:workers" {
  namespace Cloudflare {
    export interface Env extends CloudflareEnv {}
  }
}
