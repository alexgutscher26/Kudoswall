import { z } from "zod";
import { protectedProcedure, router } from "../index";
import { user, workspace } from "@my-better-t-app/db/schema";
import { eq, and, count, isNotNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { differenceInDays } from "date-fns";

export const referralRouter = router({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const userId = session.user.id;

    // 1. Get the current user's referral info
    let userData = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    if (!userData) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    // 2. Generate referral code if missing (lazy init)
    if (!userData.referralCode) {
      const newCode = `${userData.name?.split(" ")[0]?.toUpperCase() || "USER"}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      await db.update(user).set({ referralCode: newCode }).where(eq(user.id, userId));
      userData.referralCode = newCode;
    }

    // 3. Get referral metrics
    const referrals = await db
      .select({ count: count() })
      .from(user)
      .where(eq(user.referredById, userId));

    const activated = await db
      .select({ count: count() })
      .from(user)
      .where(and(eq(user.referredById, userId), isNotNull(user.referralActivatedAt)));

    // 4. Get badge removal status from primary workspace
    const ws = await db.query.workspace.findFirst({
      where: eq(workspace.ownerId, userId),
    });

    const badgeRemovedUntil = ws?.badgeRemovedUntil;
    const isBadgeRemoved = badgeRemovedUntil ? badgeRemovedUntil > new Date() : false;
    const daysRemaining =
      badgeRemovedUntil && isBadgeRemoved ? differenceInDays(badgeRemovedUntil, new Date()) : 0;

    return {
      referralCode: userData.referralCode,
      referralLink: `https://kudoswall.org/signup?ref=${userData.referralCode}`,
      totalReferred: referrals[0]?.count || 0,
      totalActivated: activated[0]?.count || 0,
      isBadgeRemoved,
      daysRemaining,
      badgeRemovedUntil: badgeRemovedUntil?.toISOString(),
    };
  }),

  getReferralList: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;

    const list = await db.query.user.findMany({
      where: eq(user.referredById, session.user.id),
      columns: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        referralActivatedAt: true,
      },
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });

    return list.map((u) => ({
      ...u,
      status: u.referralActivatedAt ? "Activated" : "Pending",
    }));
  }),

  claim: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const userId = session.user.id;

      const userData = await db.query.user.findFirst({
        where: eq(user.id, userId),
      });

      if (!userData) throw new TRPCError({ code: "NOT_FOUND" });
      if (userData.referredById) return { success: true, message: "Already referred" };

      const referrer = await db.query.user.findFirst({
        where: eq(user.referralCode, input.code),
      });

      if (!referrer || referrer.id === userId) {
        return { success: false, message: "Invalid referral code" };
      }

      await db.update(user).set({ referredById: referrer.id }).where(eq(user.id, userId));

      return { success: true };
    }),
});
