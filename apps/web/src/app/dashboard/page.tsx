import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import DashboardShell from "./dashboard";
import { getDashboardData } from "./actions";
import DashboardLoading from "./loading";

export const metadata = {
  title: "Dashboard — KudosWall",
  description: "Manage your testimonials, embed widget, and analytics.",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ workspaceId?: string }>;
}) {
  const { workspaceId } = await searchParams;
  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (err: any) {
    console.error("❌ Auth getSession failed:", err.message);
    if (err.cause) console.error("   Cause:", err.cause.message);
    if (err.stack) console.error(err.stack);
    redirect("/login");
  }

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent
        userName={session.user.name ?? "User"}
        userEmail={session.user.email ?? ""}
        workspaceId={workspaceId}
      />
    </Suspense>
  );
}

async function DashboardContent({
  userName,
  userEmail,
  workspaceId,
}: {
  userName: string;
  userEmail: string;
  workspaceId?: string;
}) {
  const data = await getDashboardData(workspaceId);

  if (!data) {
    redirect("/login");
  }

  // If no workspaceId is in the URL, redirect to a URL that has it
  // to ensure state is consistent across navigations and bookmarks
  if (!workspaceId && data.workspace.id) {
    redirect(`/dashboard?workspaceId=${data.workspace.id}`);
  }

  return (
    <DashboardShell
      userName={userName}
      userEmail={userEmail}
      initialData={data}
      initialWorkspaceId={workspaceId}
    />
  );
}
