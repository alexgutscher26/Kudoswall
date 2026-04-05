import { createAuth } from "@my-better-t-app/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import DashboardShell from "./dashboard";
import { getDashboardData } from "./actions";
import DashboardLoading from "./loading";

export const metadata = {
  title: "Dashboard — TestimonialWall",
  description: "Manage your testimonials, embed widget, and analytics.",
};

export default async function DashboardPage() {
  const auth = createAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent
        userName={session.user.name ?? "User"}
        userEmail={session.user.email ?? ""}
      />
    </Suspense>
  );
}

async function DashboardContent({ userName, userEmail }: { userName: string; userEmail: string }) {
  const data = await getDashboardData();

  if (!data) {
    redirect("/login");
  }

  return <DashboardShell userName={userName} userEmail={userEmail} initialData={data} />;
}
