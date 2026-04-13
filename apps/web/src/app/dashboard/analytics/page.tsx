import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import DashboardShell from "../dashboard";
import { getDashboardData } from "../actions";
import AnalyticsPage from "./analytics-page";

export const metadata = {
  title: "Analytics — KudosWall",
  description: "Track your testimonial performance, page views, and conversions.",
};

export default async function AnalyticsRoute({
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
    redirect(`/dashboard/analytics?workspaceId=${dashData.workspace.id}`);
  }

  return (
    <DashboardShell
      userName={session.user.name ?? "User"}
      userEmail={session.user.email ?? ""}
      pageTitle="Analytics"
      pageSubtitle="Track how your testimonials are performing across the web"
      initialWorkspaceId={workspaceId}
      initialData={dashData}
    >
      <AnalyticsPage />
    </DashboardShell>
  );
}
