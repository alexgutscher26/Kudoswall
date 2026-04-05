import { notFound } from "next/navigation";
import { db } from "@/lib/server-db";
import { project } from "@my-better-t-app/db/schema";
import { eq, or } from "drizzle-orm";
import CollectionWizard from "../../[workspaceSlug]/[projectSlug]/collection-wizard";

interface CollectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProjectByCollectionSlug(slug: string) {
  const result = await db.query.project.findFirst({
    where: or(eq(project.collectionSlug, slug), eq(project.slug, slug)),
    with: {
      workspace: true,
    },
  });

  if (!result) return null;

  // Enhance with branding logic
  return {
    ...result,
    workspace: {
      ...result.workspace,
      branding: result.workspace.brandingJson
        ? JSON.parse(result.workspace.brandingJson)
        : {
            accentColor: "#e8527a",
            font: "sans",
            logoUrl: result.workspace.logoUrl,
          },
    },
  };
}

export default async function CollectPage({ params }: CollectPageProps) {
  const { slug } = await params;
  const projectData = await getProjectByCollectionSlug(slug);

  if (!projectData) {
    notFound();
  }

  return (
    <main className="relative flex h-screen items-center justify-center overflow-hidden bg-[#fafafa] px-4 sm:px-6">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[10%] -right-[5%] size-[600px] animate-pulse rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[5%] size-[700px] rounded-full bg-indigo-500/5 blur-[150px]" />
        <div className="absolute top-1/4 left-1/3 size-[500px] rounded-full bg-blue-500/[0.03] blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] [background-size:32px_32px] opacity-40" />
      </div>

      <div className="z-10 mx-auto w-full max-w-4xl origin-center scale-95 lg:scale-100">
        <div className="mb-6 space-y-4 text-center">
          {projectData.workspace?.branding.logoUrl && (
            <div className="group relative inline-block">
              <div
                className="absolute -inset-2 rounded-[24px] opacity-20 blur-xl transition-opacity group-hover:opacity-40"
                style={{ backgroundColor: projectData.workspace.branding.accentColor }}
              />
              <img
                src={projectData.workspace.branding.logoUrl}
                alt={projectData.workspace.name}
                className="relative mx-auto size-14 rounded-[18px] border border-neutral-100 bg-white object-cover p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              />
            </div>
          )}
          <div className="space-y-1">
            <h1 className="text-3xl leading-tight font-black tracking-tighter text-neutral-900 sm:text-5xl">
              Share your story
            </h1>
            <p className="text-md mx-auto max-w-xl font-medium text-neutral-500">
              You&apos;re leaving a review for{" "}
              <span className="inline-flex items-center rounded-lg border border-neutral-100 bg-white px-2 py-0.5 text-neutral-900 shadow-sm">
                {projectData.name}
              </span>
            </p>
          </div>
        </div>

        <CollectionWizard project={projectData as any} />
      </div>
    </main>
  );
}
