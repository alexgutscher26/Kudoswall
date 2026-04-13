import { notFound } from "next/navigation";
import { getProjectBySlug } from "./actions";
import CollectionPageView from "@/components/collection-page-view";

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

  return <CollectionPageView project={projectData} />;
}
