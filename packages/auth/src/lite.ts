import { createDb } from "@my-better-t-app/db";
import * as schema from "@my-better-t-app/db/schema/auth";
import { env } from "@my-better-t-app/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

/**
 * A lightweight authentication instance for Edge functions.
 * Excludes all plugins and hooks that are not required for session validation.
 * This significantly reduces bundle size for API routes that only need to verify sessions.
 */
export function createLiteAuth() {
  const db = createDb();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    secret: env.BETTER_AUTH_SECRET || "dummy_secret_for_build",
    baseURL: env.BETTER_AUTH_URL,
    plugins: [nextCookies()],
  });
}

export const authLite = createLiteAuth();
