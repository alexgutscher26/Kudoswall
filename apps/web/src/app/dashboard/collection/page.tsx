import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import DashboardShell from "../dashboard";
import { getDashboardData } from "../actions";
import DashboardLoading from "../loading";
import CollectionList from "./collection-list";

export const metadata = {
  title: "Manage Collection Pages — KudosWall",
  description: "Manage and create dedicated collection pages for your projects.",
};

export default async function CollectionRoute({
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

  return (
    <Suspense fallback={<DashboardLoading />}>
      <CollectionLayoutContent
        userName={session.user.name ?? "User"}
        userEmail={session.user.email ?? ""}
        workspaceId={workspaceId}
      />
    </Suspense>
  );
}

async function CollectionLayoutContent({
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

  // Auto-redirect if workspaceId is missing from URL
  if (!workspaceId && data.workspace.id) {
    redirect(`/dashboard/collection?workspaceId=${data.workspace.id}`);
  }

  return (
    <DashboardShell
      userName={userName}
      userEmail={userEmail}
      initialData={data}
      initialWorkspaceId={workspaceId}
      pageTitle="Collection Pages"
      pageSubtitle="Manage the experience for your reviewers"
    >
      <div className="mx-auto max-w-7xl">
        <CollectionList projects={data.projects} />
      </div>
    </DashboardShell>
  );
}
