"use client";

import { Suspense, useState } from "react";
import {
  Github,
  Chrome,
  Zap,
  BadgeCheck,
  ArrowRight,
  Mail,
  Lock,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { Button } from "@my-better-t-app/ui/components/button";
import { Input } from "@my-better-t-app/ui/components/input";
import { Label } from "@my-better-t-app/ui/components/label";
import { Card } from "@my-better-t-app/ui/components/card";
import { Checkbox } from "@my-better-t-app/ui/components/checkbox";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { gooeyToast as toast } from "goey-toast";
import Link from "next/link";

type AuthTab = "standard" | "magic-link";

function LoginForm() {
  const [tab, setTab] = useState<AuthTab>("standard");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSocial = async (provider: "google" | "github") => {
    setLoading(true);
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: redirect,
    });
    setLoading(false);
    if (error) toast.error(error.message ?? "Failed to sign in");
  };

  const handlePasswordLogin = async () => {
    if (!email || !password) return toast.error("Enter both email and password");
    setLoading(true);
    const { error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: redirect,
      rememberMe: rememberMe,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message ?? "Invalid credentials");
    } else {
      toast.success("Welcome back!");
    }
  };

  return (
    <Card className="animate-in fade-in zoom-in-95 relative w-full max-w-[420px] overflow-hidden rounded-[2rem] border-2 border-neutral-100 bg-white p-6 pt-4! shadow-[0_20px_50px_rgba(0,0,0,0.06)] duration-500">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 bg-pink-500/5 blur-3xl" />

      <div className="space-y-4">
        {/* Header - More Compact */}
        <div className="space-y-1.5 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-100 bg-pink-50 px-2 py-0.5 text-[9px] font-black tracking-widest text-[#e8527a] uppercase">
            <Zap className="size-2.5 fill-pink-500" />
            Founder
          </div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">Welcome back.</h1>
          <p className="px-6 text-[11px] leading-tight font-medium text-neutral-400">
            Turn your praise into your greatest sales asset.
          </p>
        </div>

        {/* Tab Switcher - More Compact */}
        <div className="flex w-full rounded-xl border border-neutral-200 bg-neutral-100 p-0.5">
          <button
            onClick={() => setTab("standard")}
            className={`flex-1 rounded-[10px] py-2 text-[10px] font-bold tracking-wider uppercase transition-all ${
              tab === "standard"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-400 hover:text-neutral-500"
            }`}
          >
            Password
          </button>
          <button
            onClick={() => setTab("magic-link")}
            className={`flex-1 rounded-[10px] py-2 text-[10px] font-bold tracking-wider uppercase transition-all ${
              tab === "magic-link"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-400 hover:text-neutral-500"
            }`}
          >
            Magic Link
          </button>
        </div>

        {/* Form Content */}
        <div className="flex min-h-[290px] flex-col pt-1">
          {tab === "standard" && (
            <div className="animate-in fade-in space-y-4 duration-500">
              {/* Socials - Side by Side Icons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="group flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border-2 transition-all hover:bg-neutral-50"
                  onClick={() => handleSocial("google")}
                  disabled={loading}
                >
                  <Chrome className="size-4 text-red-500" />
                  <span className="text-[10px] font-bold tracking-wide text-neutral-700 uppercase">
                    Google
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="group flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border-2 transition-all hover:bg-neutral-50"
                  onClick={() => handleSocial("github")}
                  disabled={loading}
                >
                  <Github className="size-4 text-neutral-900" />
                  <span className="text-[10px] font-bold tracking-wide text-neutral-700 uppercase">
                    GitHub
                  </span>
                </Button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center gap-3">
                <div className="h-px flex-1 bg-neutral-100" />
                <span className="text-[9px] font-black tracking-widest whitespace-nowrap text-neutral-300 uppercase">
                  Or email
                </span>
                <div className="h-px flex-1 bg-neutral-100" />
              </div>

              {/* Inputs */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="ml-1 text-[9px] font-black tracking-widest text-neutral-400 uppercase"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className="h-11 rounded-xl border-2 px-4 text-sm font-medium transition-colors focus:border-pink-500/50 focus:ring-0"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="ml-1 flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-[9px] font-black tracking-widest text-neutral-400 uppercase"
                    >
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-[9px] font-black text-pink-500 uppercase hover:text-pink-600"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-11 rounded-xl border-2 px-4 text-sm font-medium transition-colors focus:border-pink-500/50 focus:ring-0"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Lock className="absolute top-1/2 right-4 size-3.5 -translate-y-1/2 text-neutral-300" />
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    className="size-4 border-2 border-neutral-200 data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900"
                  />
                  <label
                    htmlFor="remember"
                    className="text-[10px] font-bold tracking-tight text-neutral-500 cursor-pointer select-none"
                  >
                    Remember this device for 30 days
                  </label>
                </div>

                <Button
                  className="mt-2 h-12 w-full rounded-xl bg-neutral-900 text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-black/5 transition-all hover:bg-neutral-800 active:scale-[0.98]"
                  onClick={handlePasswordLogin}
                  disabled={loading}
                >
                  {loading ? "Please wait..." : "Sign in now"}
                  <ArrowRight className="ml-2 size-3.5" />
                </Button>
              </div>
            </div>
          )}

          {tab === "magic-link" && (
            <div className="animate-in fade-in space-y-5 pt-6 duration-500">
              <div className="space-y-2 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-pink-100 bg-pink-50">
                  <Mail className="size-6 text-[#e8527a]" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900">One-click log in</h3>
                <p className="mx-auto max-w-[200px] text-[10px] font-medium text-neutral-400">
                  Enter your email and we'll send you a secure link.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="magic-email"
                    className="ml-1 text-[9px] font-black tracking-widest text-neutral-400 uppercase"
                  >
                    Work Email
                  </Label>
                  <Input
                    id="magic-email"
                    type="email"
                    placeholder="you@company.com"
                    className="h-11 rounded-xl border-2 px-4 text-sm font-medium focus:ring-0"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button
                  className="h-12 w-full rounded-xl bg-[#e8527a] text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-pink-500/10 transition-all hover:bg-[#d44169] active:scale-[0.98]"
                  onClick={async () => {
                    setLoading(true);
                    const { error } = await authClient.signIn.magicLink({
                      email,
                      callbackURL: redirect,
                    });
                    setLoading(false);
                    if (error) toast.error(error.message ?? "Failed to send magic link");
                    else toast.success("Check your email!");
                  }}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Magic Link"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info - even more compact */}
        <div className="space-y-3 border-t border-neutral-100 pt-4 text-center">
          <p className="text-[10px] font-medium text-neutral-400">
            New to Wall?{" "}
            <a href="/signup" className="font-bold text-pink-500 hover:underline">
              Create Account
            </a>
          </p>
          <div className="flex items-center justify-center gap-4 text-[8px] font-black tracking-[0.2em] text-neutral-300 uppercase opacity-80">
            <div className="flex items-center gap-1">
              <ShieldCheck className="size-3" />
              <span>HIBP SECURE</span>
            </div>
            <div className="flex items-center gap-1">
              <History className="size-3" />
              <span>OTP VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function History({ className }: { className?: string }) {
  return <Timer className={className} />;
}
