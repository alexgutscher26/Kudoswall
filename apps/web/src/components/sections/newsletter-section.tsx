"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { gooeyToast as toast } from "goey-toast";
import { Mail, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@my-better-t-app/ui/components/button";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const subscribeMutation = useMutation({
    ...trpc.newsletter.subscribe.mutationOptions(),
    onSuccess: (data) => {
      toast.success(data.message || "Subscribed successfully!");
      setEmail("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    subscribeMutation.mutate({ email });
  };

  return (
    <section className="relative overflow-hidden px-4 py-24" style={{ backgroundColor: "#ffffff" }}>
      {/* Dot-grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative mx-auto max-w-4xl">
        <div
          className="relative overflow-hidden rounded-[2.5rem] border border-neutral-100 p-8 sm:p-12 md:p-16"
          style={{
            backgroundColor: "#fafafa",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.02)",
          }}
        >
          {/* Subtle top glow */}
          <div
            className="pointer-events-none absolute -top-32 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full blur-[100px]"
            style={{ backgroundColor: "rgba(232, 82, 122, 0.08)" }}
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Tag/Badge */}
            <div
              className="mb-6 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold shadow-sm"
              style={{ backgroundColor: "#fff5f7", color: "#e8527a" }}
            >
              <Sparkles className="size-3.5 fill-current" />
              <span>Weekly Marketing Playbook</span>
            </div>

            {/* Heading */}
            <h2 className="max-w-xl text-3xl leading-tight font-black tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
              Get social proof playbooks in your{" "}
              <span className="relative inline-block">
                <span className="relative z-10" style={{ color: "#e8527a" }}>
                  inbox
                </span>
                <span
                  className="absolute bottom-1 left-0 h-2 w-full -rotate-1 rounded-sm"
                  style={{ backgroundColor: "#fff5f7", zIndex: 1 }}
                />
              </span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed font-medium text-neutral-500">
              Join 4,200+ founders & marketers learning how to turn customer feedback into their
              most effective sales engine.
            </p>

            {/* Subscription Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-neutral-400">
                  <Mail className="size-5" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subscribeMutation.isPending}
                  className="h-12 w-full rounded-2xl border border-neutral-200 bg-white pr-4 pl-12 text-sm font-semibold text-neutral-800 placeholder-neutral-400 transition-all outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 disabled:opacity-50"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="group flex h-12 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black text-white shadow-lg transition-transform active:scale-98"
                style={{ backgroundColor: "#171717" }}
              >
                {subscribeMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>

            {/* Footer subtext */}
            <p className="mt-4 text-xs font-bold text-neutral-400">
              No spam. Unsubscribe in one click at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
