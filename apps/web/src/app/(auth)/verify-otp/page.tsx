"use client";

import { useState, useEffect } from "react";
import { Mail, ArrowRight, Zap, RefreshCw, BadgeCheck, Timer, ShieldCheck } from "lucide-react";
import { Button } from "@my-better-t-app/ui/components/button";
import { Input } from "@my-better-t-app/ui/components/input";
import { Label } from "@my-better-t-app/ui/components/label";
import { Card } from "@my-better-t-app/ui/components/card";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
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
        callbackURL: "/" 
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
    <Card className="p-8 border-2 border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-[2.5rem] bg-white relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-pink-500/5 to-transparent pointer-events-none" />

      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-[#e8527a] text-[10px] font-black uppercase tracking-widest border border-pink-100 mb-4">
            <Timer className="size-3" />
            Temporary Access Code
          </div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight leading-tight">
            Verify Identity.
          </h1>
          <p className="text-sm text-neutral-500 font-medium px-4">
            We've sent a unique 6-digit secure code to: <br />
            <span className="text-neutral-900 font-bold block mt-1">{email || "your inbox"}</span>
          </p>
        </div>

        {/* OTP Input UI */}
        <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
               <div className="w-full">
                <Label htmlFor="otp" className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1 block mb-2 text-center">Secure 6-Digit Code</Label>
                <Input 
                    id="otp" 
                    placeholder="0 0 0 0 0 0" 
                    className="h-20 rounded-2xl border-2 px-6 font-black text-3xl tracking-[1em] text-center focus:border-pink-500/50" 
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                />
               </div>
            </div>

          <Button 
            className="w-full h-14 rounded-2xl bg-[#171717] hover:bg-neutral-800 text-white font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Code"}
            <BadgeCheck className="ml-2 size-4" />
          </Button>

          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl border-2 hover:bg-neutral-50 font-bold text-xs uppercase tracking-widest text-neutral-400"
            onClick={handleResend}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 size-3 ${loading ? "animate-spin" : ""}`} />
            Resend Code
          </Button>
        </div>

        {/* Dynamic Context Footer */}
        <div className="pt-8 border-t border-neutral-100 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-neutral-400 grayscale opacity-50 font-bold uppercase tracking-widest text-[9px]">
                <ShieldCheck className="size-4" />
                <span>Protected by bank-level encryption</span>
            </div>
            <p className="text-xs text-neutral-400 font-medium">
                Wrong email?{" "}
                <a href="/login" className="text-pink-500 font-bold hover:underline">
                    Back to login
                </a>
            </p>
        </div>
      </div>
    </Card>
  );
}
