"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@my-better-t-app/ui/components/button";
import { Input } from "@my-better-t-app/ui/components/input";
import { Label } from "@my-better-t-app/ui/components/label";
import { Card } from "@my-better-t-app/ui/components/card";
import { authClient } from "@/lib/auth-client";
import { gooeyToast as toast } from "goey-toast";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const t = searchParams.get("token");
    if (!t) {
      toast.error("Invalid or missing reset token");
      router.push("/login");
    } else {
      setToken(t);
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("Reset token is missing");
    if (!password) return toast.error("Please enter a new password");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token: token,
      });

      if (error) {
        toast.error(error.message || "Failed to reset password");
      } else {
        toast.success("Password reset successfully!");
        router.push("/login");
      }
    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <Card className="animate-in fade-in zoom-in-95 relative w-full max-w-[420px] overflow-hidden rounded-[2rem] border-2 border-neutral-100 bg-white p-6 pt-4! shadow-[0_20px_50px_rgba(0,0,0,0.06)] duration-500">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 bg-pink-500/5 blur-3xl" />

      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-1.5 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-100 bg-pink-50 px-2 py-0.5 text-[9px] font-black tracking-widest text-[#e8527a] uppercase">
            <Lock className="size-2.5 fill-pink-500" />
            Security
          </div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">Reset password</h1>
          <p className="px-6 text-[11px] leading-tight font-medium text-neutral-400">
            Choose a strong password to protect your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="ml-1 text-[9px] font-black tracking-widest text-neutral-400 uppercase"
              >
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 rounded-xl border-2 px-10 text-sm font-medium transition-colors focus:border-pink-500/50 focus:ring-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <ShieldCheck className="absolute top-1/2 left-4 size-3.5 -translate-y-1/2 text-neutral-300" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="confirm-password"
                className="ml-1 text-[9px] font-black tracking-widest text-neutral-400 uppercase"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  className="h-11 rounded-xl border-2 px-10 text-sm font-medium transition-colors focus:border-pink-500/50 focus:ring-0"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                <ShieldCheck className="absolute top-1/2 left-4 size-3.5 -translate-y-1/2 text-neutral-300" />
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-neutral-900 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-black/5 transition-all hover:bg-neutral-800 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Update Password"}
              <ArrowRight className="ml-2 size-3.5" />
            </Button>
          </div>
        </form>

        {/* Requirements */}
        <div className="rounded-xl bg-neutral-50 p-4">
          <h4 className="mb-2 text-[10px] font-black tracking-widest text-neutral-400 uppercase">
            Password Requirements
          </h4>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2 text-[10px] font-medium text-neutral-500">
              <div
                className={`size-1.5 rounded-full ${password.length >= 8 ? "bg-green-500" : "bg-neutral-300"}`}
              />
              At least 8 characters long
            </li>
            <li className="flex items-center gap-2 text-[10px] font-medium text-neutral-500">
              <div
                className={`size-1.5 rounded-full ${password === confirmPassword && password !== "" ? "bg-green-500" : "bg-neutral-300"}`}
              />
              Passwords must match
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
