"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserMinus,
  ShieldCheck,
  Mail,
  X,
  Plus,
  Clock,
  Trash2,
  ShieldAlert,
  Lock,
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import { useQuery, useMutation } from "@tanstack/react-query";
import { gooeyToast as toast } from "goey-toast";
import { useWorkspace } from "@/components/dashboard/WorkspaceContext";

export default function TeamTab() {
  const { activeWorkspaceId } = useWorkspace();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    if (isInviteModalOpen) {
      document.body.setAttribute("data-modal-open", "true");
    } else {
      document.body.removeAttribute("data-modal-open");
    }
    return () => {
      document.body.removeAttribute("data-modal-open");
    };
  }, [isInviteModalOpen]);

  const { data, isLoading, refetch } = useQuery({
    ...trpc.team.getMembers.queryOptions({
      workspaceId: activeWorkspaceId,
    }),
  });

  const inviteMutation = useMutation({
    ...trpc.team.inviteMember.mutationOptions(),
    onSuccess: () => {
      toast.success("Invitation sent!");
      setIsInviteModalOpen(false);
      setInviteEmail("");
      refetch();
    },
    onError: (err) => {
      toast.error("Failed to invite: " + err.message);
    },
  });

  const removeMutation = useMutation({
    ...trpc.team.removeMember.mutationOptions(),
    onSuccess: () => {
      toast.success("Member removed");
      refetch();
    },
    onError: (err) => {
      toast.error("Failed to remove: " + err.message);
    },
  });

  const updateRoleMutation = useMutation({
    ...trpc.team.updateMemberRole.mutationOptions(),
    onSuccess: () => {
      toast.success("Role updated");
      refetch();
    },
    onError: (err) => {
      toast.error("Failed to update role: " + err.message);
    },
  });

  const revokeMutation = useMutation({
    ...trpc.team.revokeInvitation.mutationOptions(),
    onSuccess: () => {
      toast.success("Invitation revoked");
      refetch();
    },
    onError: (err) => {
      toast.error("Failed to revoke: " + err.message);
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-pink-500/20 border-t-pink-500" />
      </div>
    );
  }

  const members = data?.members || [];
  const invitations = data?.invitations || [];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-neutral-900">Workspace Members</h3>
            <p className="text-[13px] text-neutral-400">Manage who has access to this workspace.</p>
          </div>
          <button
            type="button"
            disabled={!data?.memberInvitesEnabled}
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: "#171717" }}
            title={!data?.memberInvitesEnabled ? "Upgrade to Pro to invite members" : ""}
          >
            {!data?.memberInvitesEnabled ? (
              <Lock className="size-3.5" />
            ) : (
              <Plus className="size-3.5" />
            )}
            Invite Member
          </button>
        </div>

        {!data?.memberInvitesEnabled && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-pink-100 bg-pink-50/50 p-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600">
              <Lock className="size-4" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-pink-900">Feature Locked</p>
              <p className="text-[12px] text-pink-700">
                Member invitations are only available on Pro and Agency plans.
              </p>
            </div>
            <button
              onClick={() => (window.location.href = "/dashboard/billing")}
              className="ml-auto rounded-lg bg-pink-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-pink-700"
            >
              Upgrade
            </button>
          </div>
        )}

        <div className="mt-8 divide-y divide-neutral-50">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-neutral-100 font-bold text-neutral-400">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name || ""}
                      className="size-full object-cover"
                    />
                  ) : (
                    (member.name || "?").charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-[14px] font-bold text-neutral-800">
                    {member.name}
                    {member.role === "owner" && (
                      <span className="flex items-center gap-1 rounded-full bg-pink-50 px-2 py-0.5 text-[10px] text-pink-600">
                        <ShieldCheck className="size-3" /> Owner
                      </span>
                    )}
                  </h4>
                  <p className="text-[12px] text-neutral-400">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {member.role !== "owner" && (
                  <>
                    <select
                      value={member.role}
                      onChange={(e) =>
                        updateRoleMutation.mutate({
                          workspaceId: activeWorkspaceId,
                          memberId: member.id,
                          role: e.target.value as "admin" | "member",
                        })
                      }
                      className="rounded-lg border border-neutral-100 bg-neutral-50 px-2 py-1 text-[11px] font-bold outline-none focus:border-pink-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        toast(`Remove ${member.name}?`, {
                          description: "They will lose access to this workspace.",
                          action: {
                            label: "Remove Member",
                            onClick: () =>
                              removeMutation.mutate({
                                workspaceId: activeWorkspaceId,
                                memberId: member.id,
                              }),
                          },
                        });
                      }}
                      className="rounded-lg p-2 text-neutral-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
                    >
                      <UserMinus className="size-4" />
                    </button>
                  </>
                )}
                {member.role === "owner" && (
                  <span className="px-4 text-[11px] font-bold tracking-widest text-neutral-300 uppercase">
                    Primary
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {invitations.length > 0 && (
        <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="text-lg font-bold tracking-tight text-neutral-900">Pending Invitations</h3>
          <div className="mt-6 divide-y divide-neutral-50">
            {invitations.map((invite) => (
              <div key={invite.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-neutral-50 text-neutral-300">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-neutral-800">{invite.email}</h4>
                    <p className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                      <Clock className="size-3" /> Expires on{" "}
                      {new Date(invite.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold text-neutral-500 uppercase">
                    {invite.role}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      revokeMutation.mutate({
                        workspaceId: activeWorkspaceId,
                        invitationId: invite.id,
                      })
                    }
                    className="rounded-lg p-2 text-neutral-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite Modal Overlay */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="animate-in fade-in zoom-in w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-neutral-900">Invite Team Member</h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="rounded-full p-2 transition-colors hover:bg-neutral-100"
              >
                <X className="size-5 text-neutral-400" />
              </button>
            </div>

            <div className="mt-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-[14px] outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                  Workspace Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      id: "member",
                      label: "Member",
                      desc: "Can manage projects & testimonials",
                      icon: Users,
                    },
                    {
                      id: "admin",
                      label: "Admin",
                      desc: "Full access + team management",
                      icon: ShieldAlert,
                    },
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setInviteRole(role.id as any)}
                      className={`flex flex-col gap-2 rounded-2xl border p-4 text-left transition-all ${
                        inviteRole === role.id
                          ? "border-pink-500 bg-pink-50/50"
                          : "border-neutral-100 bg-white hover:border-neutral-200"
                      }`}
                    >
                      <role.icon
                        className={`size-4 ${inviteRole === role.id ? "text-pink-600" : "text-neutral-400"}`}
                      />
                      <div>
                        <p className="text-[13px] font-bold text-neutral-800">{role.label}</p>
                        <p className="text-[10px] leading-tight text-neutral-400">{role.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() =>
                    inviteMutation.mutate({
                      workspaceId: activeWorkspaceId,
                      email: inviteEmail,
                      role: inviteRole,
                    })
                  }
                  disabled={inviteMutation.isPending || !inviteEmail.includes("@")}
                  className="w-full rounded-2xl bg-neutral-900 py-4 text-[14px] font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                >
                  {inviteMutation.isPending ? "Sending Invitation..." : "Send Invitation"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
