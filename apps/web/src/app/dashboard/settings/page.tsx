import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import DashboardShell from "../dashboard";
import SettingsPage from "./settings-page";

export const metadata = {
  title: "Settings — KudosWall",
  description: "Manage your workspace settings, collection landing page, and billing.",
};

export default async function SettingsRoute() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <DashboardShell
      userName={session.user.name ?? "User"}
      userEmail={session.user.email ?? ""}
      pageTitle="Settings"
      pageSubtitle="Configure your workspace and collection preferences"
    >
      <SettingsPage />
    </DashboardShell>
  );
}
