"use client";

import { useState } from "react";
import { Github, Chrome, Zap, ShieldCheck, Mail, ArrowRight, Check, Timer } from "lucide-react";
import { Button } from "@my-better-t-app/ui/components/button";
import { Input } from "@my-better-t-app/ui/components/input";
import { Label } from "@my-better-t-app/ui/components/label";
import { Card } from "@my-better-t-app/ui/components/card";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) return toast.error("Please fill in all fields");
    setLoading(true);
    try {
      await authClient.signUp.email({ 
        email, 
        password, 
        name,
        callbackURL: "/" 
      });
      toast.success("Account created! Welcome to TestimonialWall.");
    } catch (e: any) {
      toast.error(e.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider: "google" | "github") => {
    setLoading(true);
    try {
      await authClient.signIn.social({ provider, callbackURL: "/" });
    } catch (e: any) {
      toast.error(e.message || "Social signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-[420px] p-6 !pt-4 border-2 border-neutral-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] rounded-[2rem] bg-white relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 blur-3xl pointer-events-none" />

      <div className="space-y-4">
        {/* Header - Compact */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-pink-50 text-[#e8527a] text-[9px] font-black uppercase tracking-widest border border-pink-100">
            <Zap className="size-2.5 fill-pink-500" />
            Limited Beta Access
          </div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            Start collecting praise.
          </h1>
          <p className="text-[11px] text-neutral-400 font-medium leading-tight px-6">
            Join the founders building high-converting brand social proof.
          </p>
        </div>

        {/* Social Options - Side by Side */}
        <div className="flex gap-2 pt-1">
             <Button 
                variant="outline" 
                className="flex-1 h-11 rounded-xl border-2 hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 group"
                disabled={loading}
                onClick={() => handleSocial("google")}
            >
                <Chrome className="size-4 text-red-500" />
                <span className="font-bold text-neutral-700 text-[10px] uppercase tracking-wide">Google</span>
            </Button>
            <Button 
                variant="outline" 
                className="flex-1 h-11 rounded-xl border-2 hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 group"
                disabled={loading}
                onClick={() => handleSocial("github")}
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

        {/* Signup Form */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-[9px] font-black uppercase text-neutral-400 tracking-widest ml-1">Full name</Label>
            <Input 
                id="name" 
                placeholder="Jane Doe" 
                className="h-11 rounded-xl border-2 px-4 text-sm font-medium focus:ring-0 focus:border-pink-500/50 transition-colors" 
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[9px] font-black uppercase text-neutral-400 tracking-widest ml-1">Work email</Label>
            <Input 
                id="email" 
                type="email" 
                placeholder="jane@company.com" 
                className="h-11 rounded-xl border-2 px-4 text-sm font-medium focus:ring-0 focus:border-pink-500/50 transition-colors" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[9px] font-black uppercase text-neutral-400 tracking-widest ml-1">Password</Label>
            <Input 
                id="password" 
                type="password" 
                placeholder="Make it strong" 
                className="h-11 rounded-xl border-2 px-4 text-sm font-medium focus:ring-0 focus:border-pink-500/50 transition-colors" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center gap-1.5 pt-0.5 ml-1">
                <ShieldCheck className="size-3 text-pink-500" />
                <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Checked for leaks with HIBP</span>
            </div>
          </div>

          <Button 
            className="w-full h-12 mt-1 rounded-xl bg-[#e8527a] hover:bg-[#d44169] text-white font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-pink-500/10"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Founder Account"}
            <ArrowRight className="ml-2 size-3.5" />
          </Button>

          {/* Social Proof - Extra Small */}
          <div className="flex flex-col items-center gap-1.5 pt-1">
              <div className="flex -space-x-1 grayscale opacity-50">
                {[1,2,3].map(i => (
                    <div key={i} className="size-5 rounded-full bg-neutral-100 border border-white flex items-center justify-center text-[7px] font-bold text-neutral-400">
                        {i}
                    </div>
                ))}
              </div>
              <p className="text-[9px] text-neutral-400 font-medium">
                  Join 400+ founders transforming their walls.
              </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-100 text-center">
            <p className="text-[10px] text-neutral-400 font-medium">
                Already have an account?{" "}
                <a href="/login" className="text-pink-500 font-bold hover:underline">
                    Log in here
                </a>
            </p>
        </div>
      </div>
    </Card>
  );
}
