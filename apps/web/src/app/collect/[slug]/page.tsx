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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fafafa] px-4 py-12 sm:px-6">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-10%] right-[-5%] size-96 rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] size-[500px] rounded-full bg-blue-500/5 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:24px_24px]" />
      </div>

      <div className="z-10 mx-auto w-full max-w-4xl space-y-12">
        <div className="space-y-4 text-center">
          {projectData.workspace?.branding.logoUrl && (
            <img
              src={projectData.workspace.branding.logoUrl}
              alt={projectData.workspace.name}
              className="mx-auto mb-8 size-16 rounded-2xl border border-neutral-100 bg-white object-cover p-1 shadow-2xl"
            />
          )}
          <h1 className="text-4xl leading-none font-black tracking-tight text-neutral-900 sm:text-6xl">
            Share your story
          </h1>
          <p className="mx-auto max-w-xl text-lg font-bold text-neutral-500">
            You&apos;re leaving a review for{" "}
            <span
              className="border-b-4 pb-0.5 text-neutral-900"
              style={{ borderColor: `${projectData.workspace.branding.accentColor}30` }}
            >
              {projectData.name}
            </span>
          </p>
        </div>

        <CollectionWizard project={projectData as any} />

        <footer className="mt-12 text-center">
          {/* 
                Only show powered by if not pro? 
                Actually the user said "Free tier: generic branding". 
                The wizard already handles the footer branding. 
            */}
        </footer>
      </div>
    </main>
  );
}
