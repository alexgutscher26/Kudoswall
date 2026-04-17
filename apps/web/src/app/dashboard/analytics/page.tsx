import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BarChart2, ChevronRight } from "lucide-react";

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

  const isPro = dashData.workspace.plan && dashData.workspace.plan !== "free";

  return (
    <DashboardShell
      userName={userName}
      userEmail={userEmail}
      pageTitle="Analytics"
      pageSubtitle={
        isPro
          ? "Track how your testimonials are performing across the web"
          : "Upgrade to unlock advanced insights"
      }
      initialWorkspaceId={workspaceId}
      initialData={dashData}
    >
      {isPro ? (
        <AnalyticsPage />
      ) : (
        <div className="relative flex flex-col items-center justify-center py-20">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div
              className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-neutral-50"
              style={{ border: "1px solid rgba(0,0,0,0.05)" }}
            >
              <BarChart2 className="size-8 text-neutral-400" />
            </div>
            <h2
              className="mb-3 text-2xl font-bold tracking-tight text-neutral-900"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Analytics is a Pro Feature
            </h2>
            <p className="mb-8 max-w-sm text-[14px] leading-relaxed text-neutral-500">
              Track your testimonial performance, page views, and conversions in real-time. Upgrade
              your workspace to unlock these insights.
            </p>
            <Link
              href={`/dashboard/settings?workspaceId=${workspaceId}` as any}
              className="flex items-center gap-2 rounded-full px-8 py-3 text-[14px] font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: "#171717" }}
            >
              Upgrade Workspace
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
