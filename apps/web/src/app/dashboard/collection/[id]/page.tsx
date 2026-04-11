import { db } from "@/lib/server-db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { project, workspace } from "@my-better-t-app/db/schema";
import { eq } from "drizzle-orm";
import DashboardShell from "../../dashboard";
import { CollectionCustomizer } from "../collection-customizer";
import { getDashboardData } from "../../actions";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch initial dashboard data as well to pass to the shell and ensure revalidations
  const data = await getDashboardData();
  if (!data) {
    redirect("/login");
  }

  const p = await db.query.project.findFirst({
    where: eq(project.id, id),
    with: {
      workspace: true,
    },
  });

  if (!p || p.workspace.ownerId !== session.user.id) {
    notFound();
  }

  return (
    <DashboardShell
      userName={session.user.name ?? "User"}
      userEmail={session.user.email ?? ""}
      initialData={data}
      pageTitle={`Edit: ${p.name}`}
      pageSubtitle="Customize your collection page experience"
    >
      <div className="mx-auto max-w-7xl">
        <CollectionCustomizer project={p} workspace={p.workspace} isPro={p.workspace.isPro} />
      </div>
    </DashboardShell>
  );
}
