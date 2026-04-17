"use client";

import { Suspense, useState } from "react";
import { Github, Chrome, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@my-better-t-app/ui/components/button";
import { Input } from "@my-better-t-app/ui/components/input";
import { Label } from "@my-better-t-app/ui/components/label";
import { Card } from "@my-better-t-app/ui/components/card";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { gooeyToast as toast } from "goey-toast";

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSignup = async () => {
    if (!name || !email || !password) return toast.error("Please fill in all fields");
    setLoading(true);
    try {
      await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: redirect,
      });
      toast.success("Account created! Welcome to KudosWall.");
    } catch (e: any) {
      toast.error(e.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider: "google" | "github") => {
    setLoading(true);
    try {
      await authClient.signIn.social({ provider, callbackURL: redirect });
    } catch (e: any) {
      toast.error(e.message || "Social signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="animate-in fade-in zoom-in-95 relative w-full max-w-[420px] overflow-hidden rounded-[2rem] border-2 border-neutral-100 bg-white p-6 pt-4! shadow-[0_20px_50px_rgba(0,0,0,0.06)] duration-500">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 bg-pink-500/5 blur-3xl" />

      <div className="space-y-4">
        {/* Header - Compact */}
        <div className="space-y-1.5 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-100 bg-pink-50 px-2 py-0.5 text-[9px] font-black tracking-widest text-[#e8527a] uppercase">
            <Zap className="size-2.5 fill-pink-500" />
            Limited Beta Access
          </div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">
            Start collecting praise.
          </h1>
          <p className="px-6 text-[11px] leading-tight font-medium text-neutral-400">
            Join the founders building high-converting brand social proof.
          </p>
        </div>

        {/* Social Options - Side by Side */}
        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            className="group flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border-2 transition-all hover:bg-neutral-50"
            disabled={loading}
            onClick={() => handleSocial("google")}
          >
            <Chrome className="size-4 text-red-500" />
            <span className="text-[10px] font-bold tracking-wide text-neutral-700 uppercase">
              Google
            </span>
          </Button>
          <Button
            variant="outline"
            className="group flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border-2 transition-all hover:bg-neutral-50"
            disabled={loading}
            onClick={() => handleSocial("github")}
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

        {/* Signup Form */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="name"
              className="ml-1 text-[9px] font-black tracking-widest text-neutral-400 uppercase"
            >
              Full name
            </Label>
            <Input
              id="name"
              placeholder="Jane Doe"
              className="h-11 rounded-xl border-2 px-4 text-sm font-medium transition-colors focus:border-pink-500/50 focus:ring-0"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="ml-1 text-[9px] font-black tracking-widest text-neutral-400 uppercase"
            >
              Work email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="jane@company.com"
              className="h-11 rounded-xl border-2 px-4 text-sm font-medium transition-colors focus:border-pink-500/50 focus:ring-0"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="ml-1 text-[9px] font-black tracking-widest text-neutral-400 uppercase"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Make it strong"
              className="h-11 rounded-xl border-2 px-4 text-sm font-medium transition-colors focus:border-pink-500/50 focus:ring-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="ml-1 flex items-center gap-1.5 pt-0.5">
              <ShieldCheck className="size-3 text-pink-500" />
              <span className="text-[8px] font-bold tracking-wider text-neutral-400 uppercase">
                Checked for leaks with HIBP
              </span>
            </div>
          </div>

          <Button
            className="mt-1 h-12 w-full rounded-xl bg-[#e8527a] text-xs font-black tracking-widest text-white uppercase shadow-lg shadow-pink-500/10 transition-all hover:bg-[#d44169] active:scale-[0.98]"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Founder Account"}
            <ArrowRight className="ml-2 size-3.5" />
          </Button>

          {/* Social Proof - Extra Small */}
          <div className="flex flex-col items-center gap-1.5 pt-1">
            <div className="flex -space-x-1 opacity-50 grayscale">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex size-5 items-center justify-center rounded-full border border-white bg-neutral-100 text-[7px] font-bold text-neutral-400"
                >
                  {i}
                </div>
              ))}
            </div>
            <p className="text-[9px] font-medium text-neutral-400">
              Join 400+ founders transforming their walls.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-100 pt-4 text-center">
          <p className="text-[10px] font-medium text-neutral-400">
            Already have an account?{" "}
            <a href="/login" className="font-bold text-pink-500 hover:underline">
              Log in here
            </a>
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
