import { notFound } from "next/navigation";
import { getProjectBySlug } from "./actions";
import CollectionForm from "./collection-form";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ workspaceSlug: string; projectSlug: string }>;
}) {
  const { workspaceSlug, projectSlug } = await params;
  const project = await getProjectBySlug(workspaceSlug, projectSlug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Background decoration */}
      <div 
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />
      
      <div className="w-full max-w-xl relative animate-in fade-in slide-in-from-bottom-5 duration-700">
        <header className="text-center mb-10">
          {project.workspace.logoUrl && (
            <img 
              src={project.workspace.logoUrl} 
              alt={project.workspace.name} 
              className="size-16 mx-auto mb-6 rounded-2xl shadow-sm border border-neutral-100" 
            />
          )}
          <h1 
            className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight mb-3"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {project.name}
          </h1>
          <p className="text-[15px] text-neutral-500 max-w-md mx-auto leading-relaxed">
            {project.description || "We would love to hear about your experience! Share your story below."}
          </p>
        </header>

        <CollectionForm project={project} />

        <footer className="mt-12 text-center">
          <p className="text-[11px] font-bold text-neutral-300 uppercase tracking-widest">
            Powered by TestimonialWall
          </p>
        </footer>
      </div>
    </div>
  );
}
