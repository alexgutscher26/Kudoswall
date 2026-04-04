import type { ReactNode } from "react";

/**
 * Dashboard layout — intentionally excludes the global marketing <Navbar />.
 * All navigation lives inside the DashboardShell sidebar.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
