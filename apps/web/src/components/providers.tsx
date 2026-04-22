"use client";

import { useEffect } from "react";
import { Toaster } from "@my-better-t-app/ui/components/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient } from "@/utils/trpc";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Basic CSRF token initialization if missing
    // We check document.cookie directly for the 'csrf-token'
    const hasCsrfToken = document.cookie.split("; ").find((row) => row.startsWith("csrf-token="));

    if (!hasCsrfToken) {
      const token =
        Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
      const isSecure = window.location.protocol === "https:";
      document.cookie = `csrf-token=${token}; path=/; SameSite=Lax${isSecure ? "; Secure" : ""}`;
      console.log("[CSRF] Initialized new token");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
      <Toaster />
    </QueryClientProvider>
  );
}
