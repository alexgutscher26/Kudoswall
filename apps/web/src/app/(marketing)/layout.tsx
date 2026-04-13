import type { ReactNode } from "react";
import Navbar from "@/components/navbar";
import { headers } from "next/headers";
import { isCustomDomain } from "@/proxy";

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const host = (await headers()).get("host") || "";
  const hideNavbar = isCustomDomain(host);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}
