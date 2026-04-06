import { notFound } from "next/navigation";
import Image from "next/image";
import { getProjectBySlug } from "./actions";
import CollectionWizard from "./collection-wizard";
import ErrorBoundary from "@/components/error-boundary";
export const dynamic = "force-dynamic";

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

  const settings = projectData.collectionSettingsJson
    ? (JSON.parse(projectData.collectionSettingsJson) as any)
    : null;
  const backgroundColor = settings?.backgroundColor || "#fafafa";

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 transition-colors duration-500 sm:px-6"
      style={{ backgroundColor }}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-10%] right-[-5%] size-96 rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] size-[500px] rounded-full bg-blue-500/5 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-size-[24px_24px]" />
      </div>

      <div className="z-10 mx-auto w-full max-w-4xl space-y-12">
        <div className="space-y-4 text-center">
          {projectData.workspace?.logoUrl && (
            <Image
              src={projectData.workspace.logoUrl}
              alt={projectData.workspace.name}
              width={48}
              height={48}
              priority
              className="mx-auto mb-6 size-12 rounded-xl opacity-50 shadow-sm grayscale"
            />
          )}
          <h1 className="text-4xl font-black tracking-tight text-neutral-900 sm:text-5xl">
            Share your story
          </h1>
          <p className="mx-auto max-w-xl font-medium text-neutral-500">
            You're leaving a review for{" "}
            <span className="font-bold text-neutral-900 underline decoration-pink-500/30 underline-offset-4">
              {projectData.name}
            </span>
            .
          </p>
        </div>

        <ErrorBoundary name="Collection Wizard">
          <CollectionWizard project={projectData} />
        </ErrorBoundary>

        <footer className="mt-12 text-center">
          <p className="text-[11px] font-bold tracking-widest text-neutral-300 uppercase">
            Powered by TestimonialWall
          </p>
        </footer>
      </div>
    </main>
  );
}
