import { createAuth } from "@my-better-t-app/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import DashboardShell from "../dashboard";
import { getDashboardData } from "../actions";
import DashboardLoading from "../loading";
import { CollectionCustomizer } from "./collection-customizer";

export const metadata = {
  title: "Customize Collection Page — TestimonialWall",
  description: "Customize the shareable collection page for your projects.",
};

interface PageProps {
  searchParams: Promise<{ project?: string }>;
}

export default async function CollectionPage({ searchParams }: PageProps) {
  const auth = createAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const { project: projectId } = await searchParams;

  return (
    <Suspense fallback={<DashboardLoading />}>
      <CollectionContent
        userName={session.user.name ?? "User"}
        userEmail={session.user.email ?? ""}
        selectedProjectId={projectId}
      />
    </Suspense>
  );
}

async function CollectionContent({
  userName,
  userEmail,
  selectedProjectId,
}: {
  userName: string;
  userEmail: string;
  selectedProjectId?: string;
}) {
  const data = await getDashboardData();

  if (!data) {
    redirect("/login");
  }

  const selectedProject = selectedProjectId
    ? data.projects.find((p: any) => p.id === selectedProjectId)
    : data.projects[0];

  return (
    <DashboardShell
      userName={userName}
      userEmail={userEmail}
      initialData={data}
      pageTitle="Collection Page"
      pageSubtitle="Customize the experience for your reviewers"
    >
      <div className="flex flex-col gap-6">
        {data.projects.length > 1 && (
          <div className="flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
            <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
              Select Project:
            </span>
            <div className="flex gap-2">
              {data.projects.map((p: any) => (
                <a
                  key={p.id}
                  href={`/dashboard/collection?project=${p.id}`}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    selectedProject?.id === p.id
                      ? "bg-pink-50 text-pink-500 ring-1 ring-pink-100"
                      : "text-neutral-500 hover:bg-neutral-50"
                  }`}
                >
                  {p.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {selectedProject ? (
          <CollectionCustomizer
            project={selectedProject}
            workspace={data.workspace}
            isPro={true} // TODO: Hardcoded to true for testing Pro features
          />
        ) : (
          <div className="flex h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-white p-12 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-neutral-50">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-lg font-bold text-neutral-900">No projects yet</h3>
            <p className="mt-2 max-w-sm text-sm text-neutral-500">
              Create your first project to start customizing your collection page.
            </p>
            <a
              href="/dashboard?new=project"
              className="mt-6 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              Create Project
            </a>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
