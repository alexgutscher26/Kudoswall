import { notFound } from "next/navigation";
import { getProjectBySlug } from "./actions";
import CollectionWizard from "./collection-wizard";

interface ProjectPageProps {
  params: Promise<{
    workspaceSlug: string;
    projectSlug: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { workspaceSlug, projectSlug } = await params;
  const projectData = await getProjectBySlug(workspaceSlug, projectSlug);

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
          {projectData.workspace?.logoUrl && (
            <img 
              src={projectData.workspace.logoUrl} 
              alt={projectData.workspace.name} 
              className="size-12 rounded-xl mx-auto mb-6 shadow-sm grayscale opacity-50"
            />
          )}
          <h1 className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight">
            Share your story
          </h1>
          <p className="text-neutral-500 font-medium max-w-xl mx-auto">
            You're leaving a review for <span className="text-neutral-900 font-bold underline decoration-pink-500/30 underline-offset-4">{projectData.name}</span>.
          </p>
        </div>

        <CollectionWizard project={projectData} />

        <footer className="mt-12 text-center">
          <p className="text-[11px] font-bold text-neutral-300 uppercase tracking-widest">
            Powered by TestimonialWall
          </p>
        </footer>
      </div>
    </main>
  );
}
