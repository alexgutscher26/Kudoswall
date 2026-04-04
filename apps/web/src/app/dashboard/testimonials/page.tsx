import { createAuth } from "@my-better-t-app/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import DashboardShell from "../dashboard";
import TestimonialsPage from "./testimonials-page";

export const metadata = {
  title: "Testimonials — TestimonialWall",
  description: "View, approve, reject, and manage all your testimonials in one place.",
};

export default async function TestimonialsRoute() {
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
      pageTitle="Testimonials"
      pageSubtitle="Review, approve, and manage your social proof"
    >
      <TestimonialsPage />
    </DashboardShell>
  );
}
