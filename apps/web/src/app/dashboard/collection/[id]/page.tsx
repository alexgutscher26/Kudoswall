import { db } from "@/lib/server-db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { project, workspace } from "@my-better-t-app/db/schema";
import { eq } from "drizzle-orm";
import DashboardShell from "../../dashboard";
import { CollectionCustomizer } from "../collection-customizer";
import { getDashboardData } from "../../actions";

import { Suspense } from "react";
import CollectionCustomizerLoading from "./loading";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const paramsRaw = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<CollectionCustomizerLoading />}>
      <CollectionDetailContentWrapper
        userName={session.user.name ?? "User"}
        userEmail={session.user.email ?? ""}
        params={paramsRaw}
        userId={session.user.id}
      />
    </Suspense>
  );
}

async function CollectionDetailContentWrapper({
  userName,
  userEmail,
  params,
  userId,
}: {
  userName: string;
  userEmail: string;
  params: { id: string };
  userId: string;
}) {
  const { id } = params;

  const p = await db.query.project.findFirst({
    where: eq(project.id, id),
    with: {
      workspace: {
        with: { organization: true },
      },
    },
  });

  if (!p || p.workspace.ownerId !== userId) {
    notFound();
  }

  // Fetch initial dashboard data as well to pass to the shell and ensure revalidations
  const data = await getDashboardData(p.workspaceId);
  if (!data) {
    redirect("/login");
  }

  return (
    <DashboardShell
      userName={userName}
      userEmail={userEmail}
      initialData={data}
      pageTitle={`Edit: ${p.name}`}
      pageSubtitle="Customize your collection page experience"
      initialWorkspaceId={p.workspaceId}
    >
      <div className="mx-auto max-w-7xl">
        <CollectionCustomizer
          project={p}
          workspace={p.workspace}
          isPro={(p.workspace.organization?.plan || p.workspace.plan) !== "free"}
          permissions={data.permissions}
        />
      </div>
    </DashboardShell>
  );

}
