import { protectedProcedure, publicProcedure, router } from "../index";
import { workspace, workspaceMember, workspaceInvitation, user } from "@my-better-t-app/db/schema";
import { eq, and, isNull, gt } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import { EmailService } from "@my-better-t-app/email";
import { env } from "@my-better-t-app/env/server";
import { getPlanConfig } from "../config/plans";

export const teamRouter = router({
  getMembers: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { workspaceId } = input;

      // First verify user is a member/owner
      const membership = await db.query.workspaceMember.findFirst({
        where: and(
          eq(workspaceMember.workspaceId, workspaceId),
          eq(workspaceMember.userId, session.user.id),
        ),
      });

      if (!membership) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not a member of this workspace" });
      }

      const members = await db.query.workspaceMember.findMany({
        where: and(eq(workspaceMember.workspaceId, workspaceId), isNull(workspaceMember.deletedAt)),
        with: {
          user: true,
        },
      });

      const invitations = await db.query.workspaceInvitation.findMany({
        where: and(
          eq(workspaceInvitation.workspaceId, workspaceId),
          isNull(workspaceInvitation.deletedAt),
        ),
      });

      const ws = await db.query.workspace.findFirst({
        where: eq(workspace.id, workspaceId),
        columns: {
          plan: true,
        },
      });

      const planConfig = getPlanConfig(ws?.plan);

      return {
        members: members.map((m) => ({
          id: m.id,
          userId: m.userId,
          name: m.user.name,
          email: m.user.email,
          image: m.user.image,
          role: m.role,
          createdAt: m.createdAt,
        })),
        invitations: invitations.map((i) => ({
          id: i.id,
          email: i.email,
          role: i.role,
          expiresAt: i.expiresAt,
          createdAt: i.createdAt,
        })),
        plan: ws?.plan || "free",
        memberInvitesEnabled: planConfig.features.memberInvites,
      };
    }),

  inviteMember: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        email: z.string().email(),
        role: z.enum(["admin", "member"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { workspaceId, email, role } = input;

      // Verify inviter is owner or admin
      const inviter = await db.query.workspaceMember.findFirst({
        where: and(
          eq(workspaceMember.workspaceId, workspaceId),
          eq(workspaceMember.userId, session.user.id),
        ),
      });

      if (!inviter || (inviter.role !== "owner" && inviter.role !== "admin")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only owners and admins can invite members",
        });
      }

      // Check plan restrictions
      const ws = await db.query.workspace.findFirst({
        where: eq(workspace.id, workspaceId),
        columns: {
          plan: true,
          name: true,
        },
      });

      const planConfig = getPlanConfig(ws?.plan);
      if (!planConfig.features.memberInvites) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Member invitations are not available on your current plan. Please upgrade.",
        });
      }

      // Check if already a member
      const targetUser = await db.query.user.findFirst({ where: eq(user.email, email) });
      if (targetUser) {
        const existingMember = await db.query.workspaceMember.findFirst({
          where: and(
            eq(workspaceMember.workspaceId, workspaceId),
            eq(workspaceMember.userId, targetUser.id),
          ),
        });
        if (existingMember) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "User is already a member" });
        }
      }

      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

      await db.insert(workspaceInvitation).values({
        id: crypto.randomUUID(),
        workspaceId,
        email,
        role,
        token,
        invitedById: session.user.id,
        expiresAt,
      });

      // Fetch workspace info for the email (already fetched above)
      if (ws) {
        const emailService = new EmailService(env.RESEND_API_KEY || "", env.EMAIL_FROM);
        const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://kudoswall.org").replace(
          /\/$/,
          "",
        );
        const inviteLink = `${appUrl}/invite/${token}`;

        try {
          await emailService.sendInviteEmail(
            email,
            session.user.name || "A team member",
            ws.name,
            inviteLink,
          );
          console.log(`[INVITE] Email sent to ${email}`);
        } catch (error) {
          console.error("Failed to send invitation email details:", error);
          // We don't throw here to ensure the invitation is still recorded in DB
        }
      }

      return { success: true };
    }),

  removeMember: protectedProcedure
    .input(z.object({ workspaceId: z.string(), memberId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { workspaceId, memberId } = input;

      const actor = await db.query.workspaceMember.findFirst({
        where: and(
          eq(workspaceMember.workspaceId, workspaceId),
          eq(workspaceMember.userId, session.user.id),
        ),
      });

      if (!actor || (actor.role !== "owner" && actor.role !== "admin")) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Insufficient permissions" });
      }

      const target = await db.query.workspaceMember.findFirst({
        where: eq(workspaceMember.id, memberId),
      });

      if (!target) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Member not found" });
      }

      // Prevent removing owners (unless done by another owner?) - let's stick to only owner removing others
      if (target.role === "owner" && actor.role !== "owner") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot remove an owner" });
      }

      if (target.userId === session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot remove yourself (use leave instead)",
        });
      }

      await db.delete(workspaceMember).where(eq(workspaceMember.id, memberId));

      return { success: true };
    }),

  updateMemberRole: protectedProcedure
    .input(
      z.object({
        workspaceId: z.string(),
        memberId: z.string(),
        role: z.enum(["admin", "member"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { workspaceId, memberId, role } = input;

      const actor = await db.query.workspaceMember.findFirst({
        where: and(
          eq(workspaceMember.workspaceId, workspaceId),
          eq(workspaceMember.userId, session.user.id),
        ),
      });

      if (!actor || (actor.role !== "owner" && actor.role !== "admin")) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Insufficient permissions" });
      }

      await db.update(workspaceMember).set({ role }).where(eq(workspaceMember.id, memberId));

      return { success: true };
    }),

  revokeInvitation: protectedProcedure
    .input(z.object({ workspaceId: z.string(), invitationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { workspaceId, invitationId } = input;

      const actor = await db.query.workspaceMember.findFirst({
        where: and(
          eq(workspaceMember.workspaceId, workspaceId),
          eq(workspaceMember.userId, session.user.id),
        ),
      });

      if (!actor || (actor.role !== "owner" && actor.role !== "admin")) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Insufficient permissions" });
      }

      await db.delete(workspaceInvitation).where(eq(workspaceInvitation.id, invitationId));

      return { success: true };
    }),

  joinWorkspace: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const { token } = input;

      const invitation = await db.query.workspaceInvitation.findFirst({
        where: and(
          eq(workspaceInvitation.token, token),
          gt(workspaceInvitation.expiresAt, new Date()),
        ),
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invitation not found or expired",
        });
      }

      // Check if user is already a member
      const existing = await db.query.workspaceMember.findFirst({
        where: and(
          eq(workspaceMember.workspaceId, invitation.workspaceId),
          eq(workspaceMember.userId, session.user.id),
          isNull(workspaceMember.deletedAt),
        ),
      });

      if (existing) {
        // Just delete invitation and return success if they are already there
        await db.delete(workspaceInvitation).where(eq(workspaceInvitation.id, invitation.id));
        return { success: true, workspaceId: invitation.workspaceId };
      }

      // Create membership
      await db.insert(workspaceMember).values({
        id: crypto.randomUUID(),
        workspaceId: invitation.workspaceId,
        userId: session.user.id,
        role: invitation.role,
      });

      // Delete invitation
      await db.delete(workspaceInvitation).where(eq(workspaceInvitation.id, invitation.id));

      return { success: true, workspaceId: invitation.workspaceId };
    }),
});
