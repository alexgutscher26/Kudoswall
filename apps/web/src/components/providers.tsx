"use client";

import { Toaster } from "@my-better-t-app/ui/components/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient } from "@/utils/trpc";


import { ThemeCookies } from "./theme-cookies";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeCookies />
      {children}
      <ReactQueryDevtools />
      <Toaster richColors />
    </QueryClientProvider>
  );
}
