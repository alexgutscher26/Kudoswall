import { createAuth } from "@my-better-t-app/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import DashboardShell from "../dashboard";
import EmbedPage from "./embed-page";

export const metadata = {
  title: "Embed Widget — TestimonialWall",
  description: "Customize and embed your testimonial wall on any website with a single line of code.",
};

export default async function EmbedRoute() {
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
      pageTitle="Embed Widget"
      pageSubtitle="Customize your wall and copy the embed code to your site"
    >
      <EmbedPage />
    </DashboardShell>
  );
}
