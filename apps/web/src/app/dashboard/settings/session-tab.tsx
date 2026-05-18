"use client";

import { Laptop, Globe, Trash2, Clock, ShieldAlert, Smartphone as Mobile } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { gooeyToast as toast } from "goey-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/utils/trpc";
import { formatDistanceToNow } from "date-fns";

export default function SessionTab() {
  const { data: sessions, isLoading } = useQuery({
    ...trpc.auth.listSessions.queryOptions(),
  });

  const revokeSession = useMutation({
    ...trpc.auth.revokeSession.mutationOptions(),
    onSuccess: () => {
      toast.success("Session revoked successfully");
      queryClient.invalidateQueries(trpc.auth.listSessions.queryOptions());
    },
    onError: (err) => {
      toast.error("Failed to revoke session: " + err.message);
    },
  });

  const revokeAllOtherSessions = useMutation({
    ...trpc.auth.revokeOtherSessions.mutationOptions(),
    onSuccess: () => {
      toast.success("All other sessions revoked");
      queryClient.invalidateQueries(trpc.auth.listSessions.queryOptions());
    },
    onError: (err) => {
      toast.error("Failed to revoke other sessions: " + err.message);
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-pink-500/20 border-t-pink-500" />
      </div>
    );
  }

  const parseUA = (ua: string | null) => {
    if (!ua) return { browser: "Unknown", device: "Unknown Device" };

    let browser = "Browser";
    if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Edg")) browser = "Edge";
    else if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Safari")) browser = "Safari";

    let device = "Desktop Device";
    if (ua.includes("iPhone") || (ua.includes("Android") && ua.includes("Mobile")))
      device = "Mobile Device";
    else if (ua.includes("iPad") || ua.includes("Tablet")) device = "Tablet Device";

    return { browser, device };
  };

  const formatIP = (ip: string | null) => {
    if (!ip) return "Unknown IP";
    const cleanIP = ip.replace(/^::ffff:/, "");
    if (
      cleanIP === "::1" ||
      cleanIP === "127.0.0.1" ||
      cleanIP.includes("0000:0000:0000:0000:0000:0000:0000:0001")
    )
      return "Localhost";
    if (
      cleanIP === "::" ||
      cleanIP === "0.0.0.0" ||
      cleanIP.includes("0000:0000:0000:0000:0000:0000:0000:0000")
    )
      return "Localhost (Unspecified)";
    return cleanIP;
  };

  return (
    <div className="space-y-8 rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold tracking-tight text-neutral-900">Active Sessions</h3>
            <p className="text-[13px] text-neutral-400">
              Manage your active sessions across all devices and browsers.
            </p>
          </div>
          <button
            onClick={() => {
              toast("Revoke all other sessions?", {
                description: "This will log you out from all other devices instantly.",
                action: {
                  label: "Revoke All",
                  onClick: () => revokeAllOtherSessions.mutate(),
                },
              });
            }}
            disabled={revokeAllOtherSessions.isPending || !sessions || sessions.length <= 1}
            className="rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-[12px] font-bold text-rose-600 transition-all hover:bg-rose-100 disabled:opacity-50"
          >
            Revoke All Others
          </button>
        </div>

        <div className="space-y-4">
          {sessions?.map((session: any) => {
            const { browser, device } = parseUA(session.userAgent);
            // Better-auth returns an array of sessions, the current one is usually identified by context or a flag if we pass it.
            // For now we'll assume the one that matches current headers or just show them all.
            // Better-auth listSessions API usually includes the current session.
            const isCurrent = session.isCurrent;

            return (
              <div
                key={session.id}
                className={`flex items-center justify-between rounded-2xl border p-4 transition-all hover:bg-neutral-50/50 ${
                  isCurrent ? "border-emerald-100 bg-emerald-50/30" : "border-neutral-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex size-12 items-center justify-center rounded-xl bg-white shadow-sm ${isCurrent ? "border border-emerald-100" : ""}`}
                  >
                    {device.includes("Mobile") || device.includes("Tablet") ? (
                      <Mobile
                        className={`size-6 ${isCurrent ? "text-emerald-600" : "text-neutral-400"}`}
                      />
                    ) : (
                      <Laptop
                        className={`size-6 ${isCurrent ? "text-emerald-600" : "text-neutral-400"}`}
                      />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[14px] font-bold text-neutral-800">
                        {browser} on {device}
                      </h4>
                      {isCurrent && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black tracking-widest text-emerald-700 uppercase">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-medium text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Globe className="size-3" /> {formatIP(session.ipAddress)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" /> Last active{" "}
                        {formatDistanceToNow(new Date(session.updatedAt || session.createdAt))} ago
                      </span>
                    </div>
                  </div>
                </div>

                {!isCurrent && (
                  <button
                    onClick={() => {
                      toast("Revoke this session?", {
                        description: "You will be logged out on that device immediately.",
                        action: {
                          label: "Revoke",
                          onClick: () => revokeSession.mutate({ token: session.token }),
                        },
                      });
                    }}
                    disabled={revokeSession.isPending}
                    className="group rounded-xl p-2 text-neutral-400 transition-all hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Trash2 className="size-4 transition-transform group-hover:scale-110" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4 border-t border-neutral-50 pt-8">
        <div className="flex items-start gap-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
          <ShieldAlert className="mt-0.5 size-5 text-amber-600" />
          <div className="space-y-1">
            <p className="text-[13px] font-bold text-amber-900">Security Tip</p>
            <p className="text-[12px] leading-relaxed text-amber-700/80">
              If you see a session or location you don't recognize, revoke it immediately and change
              your password.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
