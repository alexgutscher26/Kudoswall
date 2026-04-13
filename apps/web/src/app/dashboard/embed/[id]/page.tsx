import { db } from "@/lib/server-db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { widget, workspace } from "@my-better-t-app/db/schema";
import { eq } from "drizzle-orm";
import DashboardShell from "../../dashboard";
import WidgetCustomizer from "./customizer";

export default async function WidgetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const w = await db.query.widget.findFirst({
    where: eq(widget.id, id),
    with: {
      workspace: true,
    },
  });

  if (!w || w.workspace.ownerId !== session.user.id) {
    notFound();
  }

  const settings = JSON.parse(w.settingsJson);

  return (
    <DashboardShell
      userName={session.user.name ?? "User"}
      userEmail={session.user.email ?? ""}
      pageTitle={`Edit: ${w.name}`}
      pageSubtitle="Customize your embed widget settings"
      initialWorkspaceId={w.workspaceId}
    >
      <div className="mx-auto max-w-7xl">
        <WidgetCustomizer
          widgetId={w.id}
          workspaceId={w.workspaceId}
          initialSettings={settings}
          isPro={true} // TODO: Hardcoded to true for testing Pro features change later
        />
      </div>
    </DashboardShell>
  );
}
