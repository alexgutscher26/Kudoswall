"use client";

import { useState, useEffect } from "react";
import { Mail, ArrowRight, Zap, RefreshCw, BadgeCheck, Timer, ShieldCheck } from "lucide-react";
import { Button } from "@my-better-t-app/ui/components/button";
import { Input } from "@my-better-t-app/ui/components/input";
import { Label } from "@my-better-t-app/ui/components/label";
import { Card } from "@my-better-t-app/ui/components/card";
import { authClient } from "@/lib/auth-client";
import { gooeyToast as toast } from "goey-toast";
import { useRouter } from "next/navigation";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Retrieve email from storage or URL for context
  useEffect(() => {
    const savedEmail = localStorage.getItem("pending_auth_email");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleVerify = async () => {
    if (otp.length < 6) return toast.error("Enter the 6-digit code");
    setLoading(true);
    try {
      await authClient.signIn.emailOtp({
        email,
        otp,
        callbackURL: "/",
      });
      toast.success("Identity verified! Welcome.");
      router.push("/");
    } catch (e: any) {
      toast.error(e.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return toast.error("Email not found");
    setLoading(true);
    try {
      await authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" });
      toast.success("Code resent to your inbox.");
    } catch (e: any) {
      toast.error(e.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="relative overflow-hidden rounded-[2.5rem] border-2 border-neutral-100 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-pink-500/5 to-transparent" />

      <div className="space-y-6">
        {/* Header */}
        <div className="mb-10 space-y-2 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-pink-100 bg-pink-50 px-3 py-1 text-[10px] font-black tracking-widest text-[#e8527a] uppercase">
            <Timer className="size-3" />
            Temporary Access Code
          </div>
          <h1 className="text-3xl leading-tight font-black tracking-tight text-neutral-900">
            Verify Identity.
          </h1>
          <p className="px-4 text-sm font-medium text-neutral-500">
            We've sent a unique 6-digit secure code to: <br />
            <span className="mt-1 block font-bold text-neutral-900">{email || "your inbox"}</span>
          </p>
        </div>

        {/* OTP Input UI */}
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-full">
              <Label
                htmlFor="otp"
                className="mb-2 ml-1 block text-center text-[10px] font-black tracking-widest text-neutral-400 uppercase"
              >
                Secure 6-Digit Code
              </Label>
              <Input
                id="otp"
                placeholder="0 0 0 0 0 0"
                className="h-20 rounded-2xl border-2 px-6 text-center text-3xl font-black tracking-[1em] focus:border-pink-500/50"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              />
            </div>
          </div>

          <Button
            className="h-14 w-full rounded-2xl bg-[#171717] text-sm font-black tracking-widest text-white uppercase shadow-xl transition-all hover:bg-neutral-800 active:scale-[0.98]"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Code"}
            <BadgeCheck className="ml-2 size-4" />
          </Button>

          <Button
            variant="outline"
            className="h-12 w-full rounded-xl border-2 text-xs font-bold tracking-widest text-neutral-400 uppercase hover:bg-neutral-50"
            onClick={handleResend}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 size-3 ${loading ? "animate-spin" : ""}`} />
            Resend Code
          </Button>
        </div>

        {/* Dynamic Context Footer */}
        <div className="flex flex-col items-center gap-4 border-t border-neutral-100 pt-8">
          <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest text-neutral-400 uppercase opacity-50 grayscale">
            <ShieldCheck className="size-4" />
            <span>Protected by bank-level encryption</span>
          </div>
          <p className="text-xs font-medium text-neutral-400">
            Wrong email?{" "}
            <a href="/login" className="font-bold text-pink-500 hover:underline">
              Back to login
            </a>
          </p>
        </div>
      </div>
    </Card>
  );
}
