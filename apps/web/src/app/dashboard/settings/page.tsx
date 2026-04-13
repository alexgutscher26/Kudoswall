import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import DashboardShell from "../dashboard";
import { getDashboardData } from "../actions";
import SettingsPage from "./settings-page";

export const metadata = {
  title: "Settings — KudosWall",
  description: "Manage your workspace settings, collection landing page, and billing.",
};

export default async function SettingsRoute({
  searchParams,
}: {
  searchParams: Promise<{ workspaceId?: string }>;
}) {
  const paramsRaw = await searchParams;
  const { workspaceId } = paramsRaw;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch data to determine the workspace if not provided
  const dashData = await getDashboardData(workspaceId);
  if (!dashData) {
    redirect("/login");
  }

  if (!workspaceId) {
    const nextParams = new URLSearchParams(paramsRaw as any);
    nextParams.set("workspaceId", dashData.workspace.id);
    redirect(`/dashboard/settings?${nextParams.toString()}`);
  }

  return (
    <DashboardShell
      userName={session.user.name ?? "User"}
      userEmail={session.user.email ?? ""}
      pageTitle="Settings"
      pageSubtitle="Configure your workspace and collection preferences"
      initialWorkspaceId={workspaceId}
      initialData={dashData}
    >
      <SettingsPage />
    </DashboardShell>
  );
}
