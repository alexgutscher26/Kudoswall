import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Suspense } from "react";
import DashboardShell from "../dashboard";
import { getDashboardData } from "../actions";
import AnalyticsPage from "./analytics-page";
import AnalyticsLoading from "./loading";

export const metadata = {
  title: "Analytics — KudosWall",
  description: "Track your testimonial performance, page views, and conversions.",
};

export default async function AnalyticsRoute({
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
    <Suspense fallback={<AnalyticsLoading />}>
      <AnalyticsContentWrapper
        userName={session.user.name ?? "User"}
        userEmail={session.user.email ?? ""}
        searchParams={paramsRaw}
      />
    </Suspense>
  );
}

async function AnalyticsContentWrapper({
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
    redirect(`/dashboard/analytics?${nextParams.toString()}`);
  }

  return (
    <DashboardShell
      userName={userName}
      userEmail={userEmail}
      pageTitle="Analytics"
      pageSubtitle="Track how your testimonials are performing across the web"
      initialWorkspaceId={workspaceId}
      initialData={dashData}
    >
      <AnalyticsPage />
    </DashboardShell>
  );
}
