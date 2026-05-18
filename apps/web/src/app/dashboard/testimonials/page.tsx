import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import DashboardShell from "../dashboard";
import { getProjectTestimonials, getDashboardData } from "../actions";
import { TestimonialInbox } from "./components";
import { MessageSquareQuote, Plus } from "lucide-react";
import Link from "next/link";

import { Suspense } from "react";
import TestimonialsLoading from "./loading";

export default async function TestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string; workspaceId?: string }>;
}) {
  const paramsRaw = await searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<TestimonialsLoading />}>
      <TestimonialsContentWrapper
        userName={session.user.name ?? "User"}
        userEmail={session.user.email ?? ""}
        searchParams={paramsRaw}
      />
    </Suspense>
  );
}

async function TestimonialsContentWrapper({
  userName,
  userEmail,
  searchParams,
}: {
  userName: string;
  userEmail: string;
  searchParams: { project?: string; workspaceId?: string };
}) {
  const { project: projectId, workspaceId } = searchParams;

  // Fetch dashboard data with the selected workspace
  const dashData = await getDashboardData(workspaceId);
  if (!dashData) {
    redirect("/dashboard");
  }

  // If no workspaceId is in the URL, redirect to a URL that has it
  if (!workspaceId && dashData.workspace.id) {
    const params = new URLSearchParams(searchParams as any);
    params.set("workspaceId", dashData.workspace.id);
    redirect(`/dashboard/testimonials?${params.toString()}`);
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
        userName={userName}
        userEmail={userEmail}
        pageTitle="Testimonials"
        pageSubtitle="Manage your testimonials and approve them for your wall."
        initialData={dashData}
        initialWorkspaceId={workspaceId}
      >
        <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
          <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-pink-50">
            <MessageSquareQuote className="size-8 text-pink-500" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-neutral-900">No projects yet</h2>
          <p className="mb-8 max-w-sm text-neutral-500">
            Create your first project to start collecting and managing testimonials.
          </p>
          <Link
            href={`?new=project&workspaceId=${dashData.workspace.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#171717] px-6 py-3 text-[14px] font-bold text-white shadow-lg shadow-black/5 transition-all hover:opacity-90 active:scale-[0.98]"
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
      userName={userName}
      userEmail={userEmail}
      pageTitle={`Inbox — ${data.project.name}`}
      pageSubtitle="Manage your testimonials and approve them for your wall."
      initialData={dashData}
      initialWorkspaceId={workspaceId}
    >
      <TestimonialInbox
        key={activeProjectId}
        initialTestimonials={data.testimonials}
        project={data.project}
        projects={dashData.projects.map((p: any) => ({ id: p.id, name: p.name }))}
        permissions={dashData.permissions}
      />
    </DashboardShell>
  );
}
