import { notFound } from "next/navigation";
import { db } from "@/lib/server-db";
import { project } from "@my-better-t-app/db/schema";
import { eq } from "drizzle-orm";
import CollectionWizard from "../../[workspaceSlug]/[projectSlug]/collection-wizard";

interface CollectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProjectByCollectionSlug(slug: string) {
  const result = await db.query.project.findFirst({
    where: eq(project.collectionSlug, slug),
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
      branding: result.workspace.brandingJson ? JSON.parse(result.workspace.brandingJson) : {
        accentColor: "#e8527a",
        font: "sans",
        logoUrl: result.workspace.logoUrl
      }
    }
  };
}

export default async function CollectPage({ params }: CollectPageProps) {
  const { slug } = await params;
  const projectData = await getProjectByCollectionSlug(slug);

  if (!projectData) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fafafa] relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-10%] right-[-5%] size-96 bg-pink-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] size-[500px] bg-blue-500/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="w-full max-w-4xl mx-auto z-10 space-y-12">
        <div className="text-center space-y-4">
          {projectData.workspace?.branding.logoUrl && (
            <img 
              src={projectData.workspace.branding.logoUrl} 
              alt={projectData.workspace.name} 
              className="size-16 rounded-2xl mx-auto mb-8 shadow-2xl object-cover border border-neutral-100 bg-white p-1"
            />
          )}
          <h1 className="text-4xl sm:text-6xl font-black text-neutral-900 tracking-tight leading-none">
            Share your story
          </h1>
          <p className="text-neutral-500 font-bold text-lg max-w-xl mx-auto">
            You&apos;re leaving a review for <span className="text-neutral-900 border-b-4 pb-0.5" style={{ borderColor: `${projectData.workspace.branding.accentColor}30` }}>{projectData.name}</span>
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
