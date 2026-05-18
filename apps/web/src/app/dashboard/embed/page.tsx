import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Suspense } from "react";
import DashboardShell from "../dashboard";
import { getDashboardData } from "../actions";
import WidgetList from "./widget-list";
import EmbedLoading from "./loading";

export const metadata = {
  title: "Embed Widgets — KudosWall",
  description: "Manage your testimonial embed configurations and show social proof on any website.",
};

export default async function EmbedRoute({
  searchParams,
}: {
  searchParams: Promise<{ workspaceId?: string }>;
}) {
  const paramsRaw = await searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<EmbedLoading />}>
      <EmbedContentWrapper
        userName={session.user.name ?? "User"}
        userEmail={session.user.email ?? ""}
        searchParams={paramsRaw}
      />
    </Suspense>
  );
}

async function EmbedContentWrapper({
  userName,
  userEmail,
  searchParams,
}: {
  userName: string;
  userEmail: string;
  searchParams: { workspaceId?: string };
}) {
  const { workspaceId } = searchParams;

  // Fetch data to determine the workspace if not provided
  const dashData = await getDashboardData(workspaceId);
  if (!dashData) {
    redirect("/login");
  }

  if (!workspaceId) {
    const nextParams = new URLSearchParams(searchParams as any);
    nextParams.set("workspaceId", dashData.workspace.id);
    redirect(`/dashboard/embed?${nextParams.toString()}`);
  }

  return (
    <DashboardShell
      userName={userName}
      userEmail={userEmail}
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
