import alchemy from "alchemy";
import { Nextjs, R2Bucket } from "alchemy/cloudflare";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "../../apps/web/.env" });

const app = await alchemy("my-better-t-app");

const videosBucket = await R2Bucket("videos", { devDomain: true });
const imagesBucket = await R2Bucket("images", { devDomain: true });

export const web = await Nextjs("web", {
  cwd: "../../apps/web",
  bindings: {
    DATABASE_URL: alchemy.secret.env.DATABASE_URL!,
    CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
    BETTER_AUTH_SECRET: alchemy.secret.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: alchemy.env.BETTER_AUTH_URL!,
    GITHUB_CLIENT_ID: alchemy.secret.env.GITHUB_CLIENT_ID || "",
    GITHUB_CLIENT_SECRET: alchemy.secret.env.GITHUB_CLIENT_SECRET || "",
    GOOGLE_CLIENT_ID: alchemy.secret.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: alchemy.secret.env.GOOGLE_CLIENT_SECRET || "",
    RESEND_API_KEY: alchemy.secret.env.RESEND_API_KEY || "",
    VIDEOS_BUCKET: videosBucket,
    IMAGES_BUCKET: imagesBucket,
    R2_SIGNING_SECRET: alchemy.secret.env.R2_SIGNING_SECRET || "",
    // Stripe
    STRIPE_SECRET_KEY: alchemy.secret.env.STRIPE_SECRET_KEY || "",
    STRIPE_WEBHOOK_SECRET: alchemy.secret.env.STRIPE_WEBHOOK_SECRET || "",
    // Stripe Price IDs
    STRIPE_PLAN_1_PRICE_ID: alchemy.env.STRIPE_PLAN_1_PRICE_ID || "",
    STRIPE_PLAN_2_PRICE_ID: alchemy.env.STRIPE_PLAN_2_PRICE_ID || "",
    STRIPE_LTD_PRICE_ID: alchemy.env.STRIPE_LTD_PRICE_ID || "",
    STRIPE_PLAN_1_YEARLY_PRICE_ID: alchemy.env.STRIPE_PLAN_1_YEARLY_PRICE_ID || "",
    STRIPE_PLAN_2_YEARLY_PRICE_ID: alchemy.env.STRIPE_PLAN_2_YEARLY_PRICE_ID || "",
    // Email & Marketing
    EMAIL_FROM: alchemy.env.EMAIL_FROM || "",
    LOOPS_API_KEY: alchemy.secret.env.LOOPS_API_KEY || "",
    LOOPS_TRANSACTIONAL_SUBSCRIBED_ID: alchemy.env.LOOPS_TRANSACTIONAL_SUBSCRIBED_ID || "",
    // Cron
    CRON_SECRET: alchemy.secret.env.CRON_SECRET || "",
    // LinkedIn OAuth
    LINKEDIN_CLIENT_ID: alchemy.secret.env.LINKEDIN_CLIENT_ID || "",
    LINKEDIN_CLIENT_SECRET: alchemy.secret.env.LINKEDIN_CLIENT_SECRET || "",
    // Upstash Redis
    UPSTASH_REDIS_REST_URL: alchemy.secret.env.UPSTASH_REDIS_REST_URL || "",
    UPSTASH_REDIS_REST_TOKEN: alchemy.secret.env.UPSTASH_REDIS_REST_TOKEN || "",
    // UploadThing
    UPLOADTHING_TOKEN: alchemy.secret.env.UPLOADTHING_TOKEN || "",
    // Pusher
    PUSHER_APP_ID: alchemy.secret.env.PUSHER_APP_ID || "",
    PUSHER_KEY: alchemy.secret.env.PUSHER_KEY || "",
    PUSHER_SECRET: alchemy.secret.env.PUSHER_SECRET || "",
    PUSHER_CLUSTER: alchemy.env.PUSHER_CLUSTER || "",
  },
  dev: {
    env: {
      PORT: "3001",
    },
  },
});

console.log(`Web    -> ${web.url}`);

await app.finalize();
