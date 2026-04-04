import { createAuth } from "@my-better-t-app/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import DashboardShell from "./dashboard";
import { getDashboardData } from "./actions";

export const metadata = {
  title: "Dashboard — TestimonialWall",
  description: "Manage your testimonials, embed widget, and analytics.",
};

export default async function DashboardPage() {
  const session = await createAuth().api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const data = await getDashboardData();

  if (!data) {
    redirect("/login");
  }

  return (
    <DashboardShell
      userName={session.user.name ?? "User"}
      userEmail={session.user.email ?? ""}
      initialData={data}
    />
  );
}
