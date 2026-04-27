import { publicProcedure, router, workspaceProcedure } from "../index";
import { workspace, workspaceMember, workspaceInvitation, user } from "@my-better-t-app/db/schema";
import { eq, and, isNull, gt, count } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import { EmailService } from "@my-better-t-app/email";
import { env } from "@my-better-t-app/env/server";

export const teamRouter = router({
  getMembers: workspaceProcedure.query(async ({ ctx }) => {
    const { db, workspaceId } = ctx;

    const members = await db.query.workspaceMember.findMany({
      where: isNull(workspaceMember.deletedAt),
      with: {
        user: true,
      },
    });

    const invitations = await db.query.workspaceInvitation.findMany({
      where: isNull(workspaceInvitation.deletedAt),
    });

    const ws = await db.query.workspace.findFirst({
      where: eq(workspace.id, workspaceId),
      with: { organization: true },
    });


    const { getWorkspacePermissions } = await import("../logic/billing");
    const permissions = getWorkspacePermissions({
      plan: ws?.plan ?? "free",
      organization: (ws as any)?.organization,
    });
    const planConfig = permissions;


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

  inviteMember: workspaceProcedure
    .input(
      z.object({
        email: z.string().email(),
        role: z.enum(["admin", "member"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session, workspaceId } = ctx;
      const { email, role } = input;

      // Verify inviter is owner or admin
      const inviter = await db.query.workspaceMember.findFirst({
        where: eq(workspaceMember.userId, session.user.id),
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
        with: { organization: true },
      });


      const { getWorkspacePermissions } = await import("../logic/billing");
      const permissions = getWorkspacePermissions({
        plan: ws?.plan ?? "free",
        organization: (ws as any)?.organization,
      });
      const planConfig = permissions;

      if (!planConfig.features.memberInvites) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Member invitations are not available on your current plan. Please upgrade.",
        });
      }

      // Check member limit
      const currentMembers = await db
        .select({ count: count() })
        .from(workspaceMember)
        .where(isNull(workspaceMember.deletedAt));

      const pendingInvites = await db
        .select({ count: count() })
        .from(workspaceInvitation)
        .where(isNull(workspaceInvitation.deletedAt));

      const totalSlots = (currentMembers[0]?.count || 0) + (pendingInvites[0]?.count || 0);
      if (totalSlots >= planConfig.limits.maxTeamMembers) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `You have reached the limit of ${planConfig.limits.maxTeamMembers} team members for your ${planConfig.name} plan.`,
        });
      }

      // Check if already a member
      const targetUser = await db.query.user.findFirst({ where: eq(user.email, email) });
      if (targetUser) {
        const existingMember = await db.query.workspaceMember.findFirst({
          where: eq(workspaceMember.userId, targetUser.id),
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

      // Send email
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
        } catch (error) {
          console.error("Failed to send invitation email details:", error);
        }
      }

      return { success: true };
    }),

  removeMember: workspaceProcedure
    .input(z.object({ memberId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { memberId } = input;

      const actor = await db.query.workspaceMember.findFirst({
        where: eq(workspaceMember.userId, session.user.id),
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

  updateMemberRole: workspaceProcedure
    .input(
      z.object({
        memberId: z.string(),
        role: z.enum(["admin", "member"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { memberId, role } = input;

      const actor = await db.query.workspaceMember.findFirst({
        where: eq(workspaceMember.userId, session.user.id),
      });

      if (!actor || (actor.role !== "owner" && actor.role !== "admin")) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Insufficient permissions" });
      }

      await db.update(workspaceMember).set({ role }).where(eq(workspaceMember.id, memberId));

      return { success: true };
    }),

  revokeInvitation: workspaceProcedure
    .input(z.object({ invitationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const { invitationId } = input;

      const actor = await db.query.workspaceMember.findFirst({
        where: eq(workspaceMember.userId, session.user.id),
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
        await db.delete(workspaceInvitation).where(eq(workspaceInvitation.id, invitation.id));
        return { success: true, workspaceId: invitation.workspaceId };
      }

      await db.insert(workspaceMember).values({
        id: crypto.randomUUID(),
        workspaceId: invitation.workspaceId,
        userId: session.user.id,
        role: invitation.role,
      });

      await db.delete(workspaceInvitation).where(eq(workspaceInvitation.id, invitation.id));

      return { success: true, workspaceId: invitation.workspaceId };
    }),
});
