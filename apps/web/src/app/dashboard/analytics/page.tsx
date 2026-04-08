import { createAuth } from "@my-better-t-app/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import DashboardShell from "../dashboard";
import AnalyticsPage from "./analytics-page";

export const metadata = {
  title: "Analytics — KudosWall",
  description: "Track impressions, clicks, and conversion rates for your testimonial widgets.",
};

export default async function AnalyticsRoute() {
  const session = await createAuth().api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <DashboardShell
      userName={session.user.name ?? "User"}
      userEmail={session.user.email ?? ""}
      pageTitle="Analytics"
      pageSubtitle="Track how your testimonials are performing across the web"
    >
      <AnalyticsPage />
    </DashboardShell>
  );
}
