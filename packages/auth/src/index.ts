import { createDb } from "@my-better-t-app/db";
import * as schema from "@my-better-t-app/db/schema/auth";
import { env } from "@my-better-t-app/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { magicLink, emailOTP, haveIBeenPwned, lastLoginMethod } from "better-auth/plugins";

export function createAuth() {
  const db = createDb();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: schema,
    }),
    trustedOrigins: [env.CORS_ORIGIN],
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,

    emailAndPassword: {
      enabled: true,
    },

    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID || "",
        clientSecret: env.GITHUB_CLIENT_SECRET || "",
      },
      google: {
        clientId: env.GOOGLE_CLIENT_ID || "",
        clientSecret: env.GOOGLE_CLIENT_SECRET || "",
      },
    },

    plugins: [
      nextCookies(),
      magicLink({
        sendMagicLink: async ({ email, token, url }, ctx) => {
          console.log(`[Magic Link] Sent to ${email}: ${url}`);
        },
      }),
      emailOTP({
        sendVerificationOTP: async ({ email, otp, type }, ctx) => {
          console.log(`[Email OTP] ${type} for ${email}: ${otp}`);
        },
      }),
      haveIBeenPwned(),
      lastLoginMethod(),
    ],
  });
}

export const auth = createAuth();
