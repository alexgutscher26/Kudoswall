"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { gooeyToast as toast } from "goey-toast";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function InvitePage() {
  const params = useParams<{ token: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Support both /invite/[token] and /accept-invite?token=...
  const token = params?.token || searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  const joinMutation = useMutation({
    ...trpc.team.joinWorkspace.mutationOptions(),
    onSuccess: (data) => {
      setStatus("success");
      toast.success("Successfully joined the workspace!");
      setTimeout(() => {
        router.push(`/dashboard?workspaceId=${data.workspaceId}` as any);
      }, 2000);
    },
    onError: (err) => {
      setStatus("error");
      setError(err.message);
      toast.error("Failed to join: " + err.message);
    },
  });

  useEffect(() => {
    if (token) {
      joinMutation.mutate({ token });
    }
  }, [token]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-6">
      <div className="w-full max-w-md rounded-[40px] border border-neutral-100 bg-white p-12 text-center shadow-2xl">
        {status === "loading" && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <Loader2 className="size-16 animate-spin text-pink-500" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-neutral-900">
              Joining Workspace...
            </h1>
            <p className="text-neutral-400">Please wait while we process your invitation.</p>
          </div>
        )}

        {status === "success" && (
          <div className="animate-in fade-in zoom-in space-y-6 duration-500">
            <div className="flex justify-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                <CheckCircle className="size-12" />
              </div>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-neutral-900">
              Welcome to the Team!
            </h1>
            <p className="text-neutral-400">
              You've successfully joined. Redirecting you to the dashboard...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="animate-in fade-in zoom-in space-y-6 duration-500">
            <div className="flex justify-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                <AlertCircle className="size-12" />
              </div>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-rose-600">Invitation Error</h1>
            <p className="text-neutral-500">
              {error || "This invitation is invalid or has expired."}
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full rounded-2xl bg-neutral-900 py-4 text-[14px] font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
