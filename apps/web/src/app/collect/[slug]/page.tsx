import { notFound } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/server-db";
import { project } from "@my-better-t-app/db/schema";
import { eq, or } from "drizzle-orm";
import CollectionWizard from "../../[workspaceSlug]/[projectSlug]/collection-wizard";
import ErrorBoundary from "@/components/error-boundary";

interface CollectPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    t?: string;
  }>;
}

export async function generateMetadata({ params }: CollectPageProps) {
  const { slug } = await params;
  const projectData = await getProjectByCollectionSlug(slug);

  if (!projectData) return {};

  const headline = projectData.settings?.pageContent?.headline || "Share your story";
  const subheading =
    projectData.settings?.pageContent?.subheading ||
    `You're leaving a review for ${projectData.name}`;

  return {
    title: `${headline} | ${projectData.name} on TestimonialWall`,
    description: subheading,
    openGraph: {
      title: `${headline} | ${projectData.name}`,
      description: subheading,
      images: projectData.workspace.logoUrl ? [{ url: projectData.workspace.logoUrl }] : [],
    },
  };
}

async function getProjectByCollectionSlug(slug: string) {
  const result = await db.query.project.findFirst({
    where: or(eq(project.collectionSlug, slug), eq(project.slug, slug)),
    with: {
      workspace: true,
    },
  });

  if (!result) return null;

  const settings = result.collectionSettingsJson ? JSON.parse(result.collectionSettingsJson) : null;

  // Enhance with branding logic
  return {
    ...result,
    settings,
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

export default async function CollectPage({ params, searchParams }: CollectPageProps) {
  const { slug } = await params;
  const { t } = await searchParams;
  const projectData = await getProjectByCollectionSlug(slug);

  if (!projectData) {
    notFound();
  }

  const settings = projectData.settings;
  const accentColor =
    settings?.accentColor || projectData.workspace?.branding.accentColor || "#e8527a";
  const backgroundColor = settings?.backgroundColor || "#fafafa";
  const logoUrl = settings?.logoUrl || projectData.workspace?.branding.logoUrl;
  const headline = settings?.pageContent?.headline || "Share your story";
  const subheading =
    settings?.pageContent?.subheading || `You're leaving a review for ${projectData.name}`;

  return (
    <main
      className="relative flex h-screen items-center justify-center overflow-hidden px-4 sm:px-6"
      style={{ backgroundColor }}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute -top-[10%] -right-[5%] size-[600px] animate-pulse rounded-full blur-[120px]"
          style={{ backgroundColor: `${accentColor}10` }}
        />
        <div className="absolute -bottom-[10%] -left-[5%] size-[700px] rounded-full bg-indigo-500/5 blur-[150px]" />
        <div className="absolute top-1/4 left-1/3 size-[500px] rounded-full bg-blue-500/3 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] bg-size-[32px_32px] opacity-40" />
      </div>

      <div className="z-10 mx-auto w-full max-w-4xl origin-center scale-95 lg:scale-100">
        <div className="mb-6 space-y-4 text-center">
          {logoUrl && (
            <div className="group relative inline-block">
              <div
                className="absolute -inset-2 rounded-[24px] opacity-20 blur-xl transition-opacity group-hover:opacity-40"
                style={{ backgroundColor: accentColor }}
              />
              <Image
                src={logoUrl}
                alt={projectData.workspace.name}
                width={56}
                height={56}
                priority
                className="relative mx-auto size-14 rounded-[18px] border border-neutral-100 bg-white object-cover p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              />
            </div>
          )}
          <div className="space-y-1">
            <h1 className="text-3xl leading-tight font-black tracking-tighter text-neutral-900 sm:text-5xl">
              {headline}
            </h1>
            <p className="text-md mx-auto max-w-xl font-medium text-neutral-500">{subheading}</p>
          </div>
        </div>

        <ErrorBoundary name="Collection Wizard">
          <CollectionWizard
            project={projectData as any}
            initialType={t === "v" ? "video" : t === "t" ? "text" : null}
          />
        </ErrorBoundary>
      </div>
    </main>
  );
}
