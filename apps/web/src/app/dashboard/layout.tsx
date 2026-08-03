import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Dashboard layout — intentionally excludes the global marketing <Navbar />.
 * All navigation lives inside the DashboardShell sidebar.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
