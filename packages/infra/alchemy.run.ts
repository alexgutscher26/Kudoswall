import alchemy from "alchemy";
import { Nextjs, R2Bucket } from "alchemy/cloudflare";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "../../apps/web/.env" });

const app = await alchemy("my-better-t-app");

const videosBucket = await R2Bucket("videos", { devDomain: true });

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
  },
  dev: {
    env: {
      PORT: "3001",
    },
  },
});

console.log(`Web    -> ${web.url}`);

await app.finalize();
