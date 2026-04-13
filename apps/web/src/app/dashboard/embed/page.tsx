import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import DashboardShell from "../dashboard";
import { getDashboardData } from "../actions";
import WidgetList from "./widget-list";

export const metadata = {
  title: "Embed Widgets — KudosWall",
  description: "Manage your testimonial embed configurations and show social proof on any website.",
};

export default async function EmbedRoute({
  searchParams,
}: {
  searchParams: Promise<{ workspaceId?: string }>;
}) {
  const { workspaceId } = await searchParams;
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
    redirect(`/dashboard/embed?workspaceId=${dashData.workspace.id}`);
  }

  return (
    <DashboardShell
      userName={session.user.name ?? "User"}
      userEmail={session.user.email ?? ""}
      pageTitle="Embed Widgets"
      pageSubtitle="Manage your testimonial wall configurations"
      initialWorkspaceId={workspaceId}
      initialData={dashData}
    >
      <div className="mx-auto max-w-7xl">
        <WidgetList />
      </div>
    </DashboardShell>
  );
}
