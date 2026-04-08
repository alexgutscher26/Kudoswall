import { createDb } from "@my-better-t-app/db";
import * as schema from "@my-better-t-app/db/schema/auth";
import { env } from "@my-better-t-app/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins/magic-link";
import { emailOTP } from "better-auth/plugins/email-otp";
import { haveIBeenPwned } from "better-auth/plugins/haveibeenpwned";
import { lastLoginMethod } from "better-auth/plugins";
import { EmailService } from "@my-better-t-app/email";

export function createAuth() {
  const db = createDb();
  const emailService = new EmailService(env.RESEND_API_KEY || "");

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
    trustedOrigins: [env.CORS_ORIGIN],
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    debug: true,
    advanced: {
      defaultCookieAttributes: {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    },
    rateLimit: {
      enabled: true,
      window: 60, // 1 minute
      max: 100, // Increased from 10 to handle dashboard polling and parallel queries
    },

    emailAndPassword: {
      enabled: true,
    },

    socialProviders: {
      ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
        ? {
            github: {
              clientId: env.GITHUB_CLIENT_ID,
              clientSecret: env.GITHUB_CLIENT_SECRET,
            },
          }
        : {}),
      ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
              clientId: env.GOOGLE_CLIENT_ID,
              clientSecret: env.GOOGLE_CLIENT_SECRET,
            },
          }
        : {}),
    },

    plugins: [
      nextCookies(),
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          await emailService.resend.emails.send({
            from: "Alex from KudosWall <alex@kudoswall.org>",
            to: email,
            subject: "Your Magic Link for KudosWall",
            html: `<p>Click <a href="${url}">here</a> to sign in to KudosWall.</p>`,
          });
          console.log(`[Magic Link] Sent to ${email}`);
        },
      }),
      emailOTP({
        sendVerificationOTP: async ({ email, otp, type }) => {
          await emailService.resend.emails.send({
            from: "Alex from KudosWall <alex@kudoswall.org>",
            to: email,
            subject: `${type} for KudosWall`,
            html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
          });
          console.log(`[Email OTP] ${type} for ${email}`);
        },
      }),
      haveIBeenPwned(),
      lastLoginMethod(),
    ],
  });
}

export const auth = createAuth();
