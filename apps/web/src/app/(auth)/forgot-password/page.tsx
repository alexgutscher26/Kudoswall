"use client";

import { useState } from "react";
import { ArrowLeft, Mail, ArrowRight, Zap } from "lucide-react";
import { Button } from "@my-better-t-app/ui/components/button";
import { Input } from "@my-better-t-app/ui/components/input";
import { Label } from "@my-better-t-app/ui/components/label";
import { Card } from "@my-better-t-app/ui/components/card";
import { authClient } from "@/lib/auth-client";
import { gooeyToast as toast } from "goey-toast";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (error) {
        toast.error(error.message || "Failed to send reset link");
      } else {
        setSubmitted(true);
        toast.success("Reset link sent to your email!");
      }
    } catch (e: any) {
      toast.error(e.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="animate-in fade-in zoom-in-95 relative w-full max-w-[420px] overflow-hidden rounded-[2rem] border-2 border-neutral-100 bg-white p-6 pt-4! shadow-[0_20px_50px_rgba(0,0,0,0.06)] duration-500">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 bg-pink-500/5 blur-3xl" />

      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-1.5 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-100 bg-pink-50 px-2 py-0.5 text-[9px] font-black tracking-widest text-[#e8527a] uppercase">
            <Zap className="size-2.5 fill-pink-500" />
            Security
          </div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">
            {submitted ? "Check your email" : "Forgot password?"}
          </h1>
          <p className="px-6 text-[11px] leading-tight font-medium text-neutral-400">
            {submitted
              ? "We've sent a recovery link to your inbox."
              : "No worries, it happens. We'll send you a link to reset it."}
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="ml-1 text-[9px] font-black tracking-widest text-neutral-400 uppercase"
              >
                Account Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="h-11 rounded-xl border-2 px-10 text-sm font-medium transition-colors focus:border-pink-500/50 focus:ring-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <Mail className="absolute top-1/2 left-4 size-3.5 -translate-y-1/2 text-neutral-300" />
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-neutral-900 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-black/5 transition-all hover:bg-neutral-800 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
              <ArrowRight className="ml-2 size-3.5" />
            </Button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 transition-colors hover:text-neutral-600"
              >
                <ArrowLeft className="size-3" />
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="space-y-6 pt-6 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-pink-100 bg-pink-50">
              <Mail className="size-8 animate-bounce text-[#e8527a]" />
            </div>
            <p className="px-4 text-[10px] font-medium text-neutral-400">
              Didn't receive the email? Check your spam folder or try again in a few minutes.
            </p>
            <Button
              variant="outline"
              className="h-11 w-full rounded-xl border-2 text-[10px] font-bold tracking-wider uppercase transition-all hover:bg-neutral-50"
              onClick={() => setSubmitted(false)}
            >
              Try another email
            </Button>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 transition-colors hover:text-neutral-600"
              >
                <ArrowLeft className="size-3" />
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
