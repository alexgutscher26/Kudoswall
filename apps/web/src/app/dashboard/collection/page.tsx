import { createAuth } from "@my-better-t-app/auth";
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

export default async function CollectionRoute() {
  const auth = createAuth();
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
      />
    </Suspense>
  );
}

async function CollectionLayoutContent({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const data = await getDashboardData();

  if (!data) {
    redirect("/login");
  }

  return (
    <DashboardShell
      userName={userName}
      userEmail={userEmail}
      initialData={data}
      pageTitle="Collection Pages"
      pageSubtitle="Manage the experience for your reviewers"
    >
      <div className="mx-auto max-w-7xl">
        <CollectionList projects={data.projects} />
      </div>
    </DashboardShell>
  );
}
