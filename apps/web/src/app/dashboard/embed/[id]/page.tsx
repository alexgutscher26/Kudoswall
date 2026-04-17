import { db } from "@/lib/server-db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { widget } from "@my-better-t-app/db/schema";
import { eq } from "drizzle-orm";
import DashboardShell from "../../dashboard";
import WidgetCustomizer from "./customizer";

import { Suspense } from "react";
import WidgetCustomizerLoading from "./loading";

export default async function WidgetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const paramsRaw = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<WidgetCustomizerLoading />}>
      <WidgetDetailContentWrapper
        userName={session.user.name ?? "User"}
        userEmail={session.user.email ?? ""}
        params={paramsRaw}
        userId={session.user.id}
      />
    </Suspense>
  );
}

async function WidgetDetailContentWrapper({
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

  const w = await db.query.widget.findFirst({
    where: eq(widget.id, id),
    with: {
      workspace: true,
    },
  });

  if (!w || w.workspace.ownerId !== userId) {
    notFound();
  }

  const settings = JSON.parse(w.settingsJson);

  return (
    <DashboardShell
      userName={userName}
      userEmail={userEmail}
      pageTitle={`Edit: ${w.name}`}
      pageSubtitle="Customize your embed widget settings"
      initialWorkspaceId={w.workspaceId}
    >
      <div className="mx-auto max-w-7xl">
        <WidgetCustomizer
          widgetId={w.id}
          workspaceId={w.workspaceId}
          initialSettings={settings}
          isPro={w.workspace.plan !== "free"}
        />
      </div>
    </DashboardShell>
  );
}
