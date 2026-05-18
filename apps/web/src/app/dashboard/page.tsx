import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import DashboardShell from "./dashboard";
import { getDashboardData } from "./actions";
import DashboardLoading from "./loading";
import Overview from "./Overview";

export const metadata = {
  title: "Dashboard — KudosWall",
  description: "Manage your testimonials, embed widget, and analytics.",
};

export const experimental_ppr = true;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ workspaceId?: string }>;
}) {
  const paramsRaw = await searchParams;

  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (err: any) {
    console.error("❌ Auth getSession failed:", err.message);
    session = null;
  }

  if (!session?.user) {
    redirect("/login");
  }

  // We show the shell immediately, and suspend the data-heavy content
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContentWrapper
        userName={session.user.name ?? "User"}
        userEmail={session.user.email ?? ""}
        searchParams={paramsRaw}
      />
    </Suspense>
  );
}

async function DashboardContentWrapper({
  userName,
  userEmail,
  searchParams,
}: {
  userName: string;
  userEmail: string;
  searchParams: { workspaceId?: string };
}) {
  const { workspaceId } = searchParams;
  const data = await getDashboardData(workspaceId);

  if (!data) {
    redirect("/login");
  }

  // If no workspaceId is in the URL, redirect to a URL that has it
  if (!workspaceId && data.workspace.id) {
    const nextParams = new URLSearchParams(searchParams as any);
    nextParams.set("workspaceId", data.workspace.id);
    redirect(`/dashboard?${nextParams.toString()}`);
  }

  return (
    <DashboardShell
      userName={userName}
      userEmail={userEmail}
      initialData={data}
      initialWorkspaceId={workspaceId}
    >
      <Overview data={data} workspaceId={workspaceId} />
    </DashboardShell>
  );
}
