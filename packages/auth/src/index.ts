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
// import { EmailService } from "@my-better-t-app/email"; // Moved to dynamic imports to save Edge bundle size

export function createAuth() {
  const db = createDb();
  // const emailService = new EmailService(env.RESEND_API_KEY || ""); // Moved to dynamic imports

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
        trustedDevice: schema.trustedDevice,
      },
    }),
    user: {
      additionalFields: {
        referralCode: { type: "string", required: false },
        referredById: { type: "string", required: false },
        referralActivatedAt: { type: "date", required: false },
      },
    },
    trustedOrigins: [
      env.CORS_ORIGIN,
      env.BETTER_AUTH_URL,
      "https://kudoswall.org",
      "https://www.kudoswall.org",
    ].filter(Boolean),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL || "https://kudoswall.org",
    debug: true,
    advanced: {
      defaultCookieAttributes: {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
      trustHost: true,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24 * 1, // 1 day
    },
    rateLimit: {
      enabled: true,
      window: 10, // 10 seconds
      max: 500, // Very high limit for development
    },

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      autoSignIn: true,
      sendResetPassword: async ({ user, url }) => {
        const { EmailService } = await import("@my-better-t-app/email");
        const emailService = new EmailService(env.RESEND_API_KEY || "");
        await emailService.resend.emails.send({
          from: "Alex from KudosWall <alex@kudoswall.org>",
          to: user.email,
          subject: "Reset your KudosWall password",
          html: `<p>Click <a href="${url}">here</a> to reset your KudosWall password.</p>`,
        });
        console.log(`[Reset Password] Link sent to ${user.email}`);
      },
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
      ...(env.LINKEDIN_CLIENT_ID && env.LINKEDIN_CLIENT_SECRET
        ? {
            linkedin: {
              clientId: env.LINKEDIN_CLIENT_ID,
              clientSecret: env.LINKEDIN_CLIENT_SECRET,
            },
          }
        : {}),
    },

    plugins: [
      nextCookies(),
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          const { EmailService } = await import("@my-better-t-app/email");
          const emailService = new EmailService(env.RESEND_API_KEY || "");
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
          const { EmailService } = await import("@my-better-t-app/email");
          const emailService = new EmailService(env.RESEND_API_KEY || "");
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
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            try {
              const { workspace, workspaceMember, organization } =
                await import("@my-better-t-app/db/schema/app");
              const { user: userTable } = await import("@my-better-t-app/db/schema/auth");
              const { eq } = await import("drizzle-orm");

              // --- Referral Resolution ---
              const currentRefCode = (user as any).referralCode;
              const newReferralCode = `${user.name?.split(" ")[0]?.toUpperCase() || "USER"}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

              if (currentRefCode) {
                const referrer = await db.query.user.findFirst({
                  where: eq(userTable.referralCode, currentRefCode),
                });

                if (referrer && referrer.id !== user.id) {
                  console.log(`[REFERRAL] Linking user ${user.id} to referrer ${referrer.id}`);
                  await db
                    .update(userTable)
                    .set({
                      referredById: referrer.id,
                      referralCode: newReferralCode,
                    })
                    .where(eq(userTable.id, user.id));
                } else {
                  await db
                    .update(userTable)
                    .set({ referralCode: newReferralCode })
                    .where(eq(userTable.id, user.id));
                }
              } else {
                await db
                  .update(userTable)
                  .set({ referralCode: newReferralCode })
                  .where(eq(userTable.id, user.id));
              }

              // Ensure workspace exists
              const existing = await db.query.workspace.findFirst({
                where: eq(workspace.ownerId, user.id),
              });

              if (!existing) {
                const wsId = crypto.randomUUID();
                const generateSlug = (name: string) =>
                  name.toLowerCase().replace(/\s+/g, "-") +
                  "-" +
                  Math.random().toString(36).substring(2, 6);

                // Create Stripe customer
                let stripeCustomerId: string | null = null;
                try {
                  const { stripe } = await import("@my-better-t-app/stripe");
                  const customer = await stripe.customers.create({
                    email: user.email,
                    name: user.name || undefined,
                    metadata: {
                      userId: user.id,
                      workspaceId: wsId,
                    },
                  });
                  stripeCustomerId = customer.id;
                  console.log(`[STRIPE] Created customer ${stripeCustomerId} for ${user.email}`);
                } catch (stripeError) {
                  console.error("[STRIPE] Error creating customer:", stripeError);
                }

                const orgId = crypto.randomUUID();
                const newOrg = {
                  id: orgId,
                  name: `${user.name || "My"}'s Org`,
                  ownerId: user.id,
                  stripeCustomerId,
                  plan: "free" as const,
                };

                const newWorkspace = {
                  id: wsId,
                  name: `${user.name || "My"}'s Workspace`,
                  slug: generateSlug(user.name || "user"),
                  ownerId: user.id,
                  organizationId: orgId,
                  stripeCustomerId,

                  onboardingStatus: JSON.stringify({
                    step1: false,
                    step2: false,
                    step3: false,
                    step4: false,
                    step5: false,
                  }),
                  dpaAcceptedAt: null,
                  dpaAcceptedById: null,
                  retentionEnabled: false,
                  retentionDays: 365,
                  plan: "free" as const,
                  subscriptionStatus: null,
                };

                await db.transaction(async (tx) => {
                  await tx.insert(organization).values(newOrg);
                  await tx.insert(workspace).values(newWorkspace);
                  await tx.insert(workspaceMember).values({
                    id: crypto.randomUUID(),
                    workspaceId: wsId,
                    userId: user.id,
                    role: "owner" as const,
                  });
                });
                console.log(
                  `[WORKSPACE] Created for ${user.email} with Stripe ID: ${stripeCustomerId}`,
                );
              }

              const { EmailService } = await import("@my-better-t-app/email");
              const emailService = new EmailService(env.RESEND_API_KEY || "");
              await emailService.sendWelcomeEmail(user.email, user.name || "there");
              console.log(`[Welcome Email] Sent to ${user.email}`);

              // Sync to Loops.so if key is present
              const loopsApiKey = env.LOOPS_API_KEY;
              if (loopsApiKey) {
                try {
                  const { LoopsService } = await import("@my-better-t-app/email");
                  const loopsService = new LoopsService(loopsApiKey);
                  await loopsService.createContact({
                    email: user.email,
                    firstName: user.name?.split(" ")[0] || "",
                    lastName: user.name?.split(" ").slice(1).join(" ") || "",
                    userGroup: "Free Tier",
                    source: "KudosWall Signup",
                    plan: "free",
                    testimonialCount: 0,
                    projectCount: 0,
                    widgetCount: 0,
                  } as any);
                  console.log(`[Loops Sync] User ${user.email} synced successfully.`);
                } catch (loopsError) {
                  console.error(`[Loops Sync] Failed to sync ${user.email}:`, loopsError);
                }
              } else {
                console.log(
                  `[Loops Sync] LOOPS_API_KEY is not defined. Skipping sync for ${user.email}.`,
                );
              }
            } catch (error) {
              console.error(`[Signup Hook] Error for ${user.email}:`, error);
            }
          },
        },
      },
      session: {
        create: {
          after: async (session) => {
            try {
              const { trustedDevice, user } = await import("@my-better-t-app/db/schema/auth");
              const { eq, and } = await import("drizzle-orm");

              const ip = session.ipAddress;
              const ua = session.userAgent;
              const userId = session.userId;

              if (!ip || !ua) return;

              // Check if this (IP, UA) is already trusted for this user
              const existingTrusted = await db.query.trustedDevice.findFirst({
                where: and(
                  eq(trustedDevice.userId, userId),
                  eq(trustedDevice.ipAddress, ip),
                  eq(trustedDevice.userAgent, ua),
                ),
              });

              if (existingTrusted) {
                // Update last used
                await db
                  .update(trustedDevice)
                  .set({ lastUsedAt: new Date() })
                  .where(eq(trustedDevice.id, existingTrusted.id));
                return;
              }

              // It's a new device/IP.
              // Check if user has ANY trusted devices already
              const anyTrusted = await db.query.trustedDevice.findFirst({
                where: eq(trustedDevice.userId, userId),
              });

              // Add current to trusted
              await db.insert(trustedDevice).values({
                id: crypto.randomUUID(),
                userId,
                ipAddress: ip,
                userAgent: ua,
                lastUsedAt: new Date(),
              });

              // If user had previous trusted devices, this is "suspicious" (new)
              if (anyTrusted) {
                const userData = await db.query.user.findFirst({
                  where: eq(user.id, userId),
                });

                if (userData) {
                  const { EmailService } = await import("@my-better-t-app/email");
                  const emailService = new EmailService(env.RESEND_API_KEY || "");

                  await emailService.sendSuspiciousLoginEmail(userData.email, userData.name, {
                    ipAddress: ip,
                    userAgent: ua,
                    time: new Date().toLocaleString("en-US", {
                      timeZone: "UTC",
                      dateStyle: "medium",
                      timeStyle: "short",
                    }),
                  });
                  console.log(`[Suspicious Login] Alert sent to ${userData.email}`);
                }
              }
            } catch (error) {
              console.error("[Suspicious Login Hook] Error:", error);
            }
          },
        },
      },
    },
  });
}

export const auth = createAuth();
