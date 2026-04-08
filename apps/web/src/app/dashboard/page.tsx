import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import DashboardShell from "./dashboard";
import { getDashboardData } from "./actions";
import DashboardLoading from "./loading";

export const metadata = {
  title: "Dashboard — KudosWall",
  description: "Manage your testimonials, embed widget, and analytics.",
};

export default async function DashboardPage() {
  let session;
  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (err: any) {
    console.error("❌ Auth getSession failed:", err.message);
    if (err.cause) console.error("   Cause:", err.cause.message);
    if (err.stack) console.error(err.stack);
    redirect("/login");
  }

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
