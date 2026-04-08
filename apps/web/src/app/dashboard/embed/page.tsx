import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import DashboardShell from "../dashboard";
import WidgetList from "./widget-list";

export const metadata = {
  title: "Embed Widgets — KudosWall",
  description: "Manage your testimonial embed configurations and show social proof on any website.",
};

export default async function EmbedRoute() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <DashboardShell
      userName={session.user.name ?? "User"}
      userEmail={session.user.email ?? ""}
      pageTitle="Embed Widgets"
      pageSubtitle="Manage your testimonial wall configurations"
    >
      <div className="mx-auto max-w-7xl">
        <WidgetList />
      </div>
    </DashboardShell>
  );
}
