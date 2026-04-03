"use client";

import { useState } from "react";
import { Github, Chrome, Zap, BadgeCheck, ArrowRight, Mail, Lock, ShieldCheck, Timer } from "lucide-react";
import { Button } from "@my-better-t-app/ui/components/button";
import { Input } from "@my-better-t-app/ui/components/input";
import { Label } from "@my-better-t-app/ui/components/label";
import { Card } from "@my-better-t-app/ui/components/card";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type AuthTab = "standard" | "magic-link";

export default function LoginPage() {
  const [tab, setTab] = useState<AuthTab>("standard");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSocial = async (provider: "google" | "github") => {
    setLoading(true);
    try {
      await authClient.signIn.social({ provider, callbackURL: "/" });
    } catch (e: any) {
      toast.error(e.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    if (!email || !password) return toast.error("Enter both email and password");
    setLoading(true);
    try {
      await authClient.signIn.email({ email, password, callbackURL: "/" });
      toast.success("Welcome back!");
    } catch (e: any) {
      toast.error(e.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[420px] p-6 !pt-4 border-2 border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-[2rem] bg-white relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 blur-3xl pointer-events-none" />

      <div className="space-y-4">
        {/* Header - More Compact */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-pink-50 text-[#e8527a] text-[9px] font-black uppercase tracking-widest border border-pink-100">
            <Zap className="size-2.5 fill-pink-500" />
            Founder
          </div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            Welcome back.
          </h1>
          <p className="text-[11px] text-neutral-400 font-medium leading-tight px-6">
            Turn your praise into your greatest sales asset.
          </p>
        </div>

        {/* Tab Switcher - More Compact */}
        <div className="flex p-0.5 bg-neutral-100 rounded-xl w-full border border-neutral-200">
          <button
            onClick={() => setTab("standard")}
            className={`flex-1 py-2 rounded-[10px] text-[10px] font-bold uppercase tracking-wider transition-all ${
              tab === "standard"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-400 hover:text-neutral-500"
            }`}
          >
            Password
          </button>
          <button
            onClick={() => setTab("magic-link")}
            className={`flex-1 py-2 rounded-[10px] text-[10px] font-bold uppercase tracking-wider transition-all ${
              tab === "magic-link"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-400 hover:text-neutral-500"
            }`}
          >
            Magic Link
          </button>
        </div>

        {/* Form Content */}
        <div className="min-h-[290px] flex flex-col pt-1">
          {tab === "standard" && (
            <div className="space-y-4 animate-in fade-in duration-500">
              {/* Socials - Side by Side Icons */}
              <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    className="flex-1 h-11 rounded-xl border-2 hover:bg-neutral-50 flex items-center justify-center gap-2 group transition-all"
                    onClick={() => handleSocial("google")}
                    disabled={loading}
                >
                    <Chrome className="size-4 text-red-500" />
                    <span className="font-bold text-neutral-700 text-[10px] uppercase tracking-wide">Google</span>
                </Button>
                <Button 
                    variant="outline" 
                    className="flex-1 h-11 rounded-xl border-2 hover:bg-neutral-50 flex items-center justify-center gap-2 group transition-all"
                    onClick={() => handleSocial("github")}
                    disabled={loading}
                >
                    <Github className="size-4 text-neutral-900" />
                    <span className="font-bold text-neutral-700 text-[10px] uppercase tracking-wide">GitHub</span>
                </Button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-[1px] bg-neutral-100" />
                <span className="text-[9px] font-black text-neutral-300 uppercase tracking-widest whitespace-nowrap">Or email</span>
                <div className="flex-1 h-[1px] bg-neutral-100" />
              </div>

              {/* Inputs */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[9px] font-black uppercase text-neutral-400 tracking-widest ml-1">Email</Label>
                  <Input 
                      id="email" 
                      type="email" 
                      placeholder="you@company.com" 
                      className="h-11 rounded-xl border-2 px-4 text-sm font-medium focus:ring-0 focus:border-pink-500/50 transition-colors" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password" className="text-[9px] font-black uppercase text-neutral-400 tracking-widest">Password</Label>
                    <a href="#" className="text-[9px] font-black uppercase text-pink-500 hover:text-pink-600">Forgot?</a>
                  </div>
                  <div className="relative">
                    <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        className="h-11 rounded-xl border-2 px-4 text-sm font-medium focus:ring-0 focus:border-pink-500/50 transition-colors" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 size-3.5 text-neutral-300" />
                  </div>
                </div>
                <Button 
                  className="w-full h-12 mt-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-black/5"
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
            <div className="space-y-5 animate-in fade-in duration-500 pt-6">
              <div className="text-center space-y-2">
                 <div className="mx-auto size-12 rounded-xl bg-pink-50 flex items-center justify-center border border-pink-100">
                    <Mail className="size-6 text-[#e8527a]" />
                 </div>
                 <h3 className="text-sm font-bold text-neutral-900">One-click log in</h3>
                 <p className="text-[10px] text-neutral-400 font-medium max-w-[200px] mx-auto">Enter your email and we'll send you a secure link.</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="magic-email" className="text-[9px] font-black uppercase text-neutral-400 tracking-widest ml-1">Work Email</Label>
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
                  className="w-full h-12 rounded-xl bg-[#e8527a] hover:bg-[#d44169] text-white font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-pink-500/10"
                  onClick={async () => {
                    setLoading(true);
                    try { await authClient.signIn.magicLink({ email, callbackURL: "/verify-otp" }); toast.success("Check your email!"); } catch (e: any) { toast.error(e.message); } finally { setLoading(false); }
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
        <div className="pt-4 border-t border-neutral-100 text-center space-y-3">
             <p className="text-[10px] text-neutral-400 font-medium">
                New to Wall?{" "}
                <a href="/signup" className="text-pink-500 font-bold hover:underline">Create Account</a>
            </p>
            <div className="flex items-center justify-center gap-4 text-[8px] font-black text-neutral-300 uppercase tracking-[0.2em] opacity-80">
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

function History({ className }: { className?: string }) {
    return <Timer className={className} />;
}
