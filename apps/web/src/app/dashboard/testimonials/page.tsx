import { createAuth } from "@my-better-t-app/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import DashboardShell from "../dashboard";
import { getProjectTestimonials, getDashboardData } from "../actions";
import { TestimonialInbox } from "./components";
import { MessageSquareQuote, Plus } from "lucide-react";
import Link from "next/link";

export default async function TestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const { project: projectId } = await searchParams;

  const session = await createAuth().api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Fetch dashboard data to get the list of projects for fallback
  const dashData = await getDashboardData();
  if (!dashData) {
    redirect("/dashboard");
  }

  // If no project is specified, pick the first one from the workspace
  let activeProjectId = projectId;
  if (!activeProjectId && dashData.projects.length > 0) {
    activeProjectId = dashData.projects[0].id;
  }

  // If no project exists at all, show an empty state
  if (!activeProjectId) {
    return (
      <DashboardShell
        userName={session.user.name ?? "User"}
        userEmail={session.user.email ?? ""}
        pageTitle="Testimonials"
        pageSubtitle="Manage your testimonials and approve them for your wall."
        initialData={dashData}
      >
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="size-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-6">
            <MessageSquareQuote className="size-8 text-pink-500" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">No projects yet</h2>
          <p className="text-neutral-500 max-w-sm mb-8">
            Create your first project to start collecting and managing testimonials.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#171717] text-white font-bold text-[14px] shadow-lg shadow-black/5 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Plus className="size-4" />
            Create Project
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const data = await getProjectTestimonials(activeProjectId);

  if (!data) {
    notFound();
  }

  return (
    <DashboardShell
      userName={session.user.name ?? "User"}
      userEmail={session.user.email ?? ""}
      pageTitle={`Inbox — ${data.project.name}`}
      pageSubtitle="Manage your testimonials and approve them for your wall."
      initialData={dashData}
    >
      <TestimonialInbox 
        initialTestimonials={data.testimonials as any} 
        project={data.project} 
      />
    </DashboardShell>
  );
}
