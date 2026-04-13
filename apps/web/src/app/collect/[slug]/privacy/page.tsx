import { notFound } from "next/navigation";
import { db } from "@/lib/server-db";
import { project } from "@my-better-t-app/db/schema";
import { eq, or } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface PrivacyPageProps {
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

  const settings = result.collectionSettingsJson ? JSON.parse(result.collectionSettingsJson) : null;

  return {
    ...result,
    settings,
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { slug } = await params;
  const projectData = await getProjectByCollectionSlug(slug);

  if (!projectData || !projectData.settings?.compliance?.privacyPolicyContent) {
    notFound();
  }

  const { settings } = projectData;
  const content = settings.compliance.privacyPolicyContent;
  const accentColor = settings?.accentColor || "#e8527a";

  return (
    <main className="min-h-screen bg-[#fafafa] px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/collect/${slug}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-neutral-400 transition-colors hover:text-neutral-900"
        >
          <ChevronLeft className="size-4" />
          Back to collection
        </Link>

        <div className="overflow-hidden rounded-3xl border border-neutral-100 bg-white p-8 shadow-sm md:p-12">
          <div className="mb-8 flex items-center gap-4">
            <div
              className="h-10 w-1 rounded-full px-0.5"
              style={{ backgroundColor: accentColor }}
            />
            <h1 className="text-3xl font-black tracking-tight text-neutral-900">Privacy Policy</h1>
          </div>

          <div className="space-y-6">
            {/* Very basic markdown rendering using split/map for paragraphs and headings */}
            {content.split("\n\n").map((block: string, i: number) => {
              if (block.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="mt-8 mb-4 border-b border-neutral-50 pb-2 text-xl font-bold text-neutral-900"
                  >
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              if (block.startsWith("### ")) {
                return (
                  <h3 key={i} className="mt-6 mb-3 text-lg font-bold text-neutral-800">
                    {block.replace("### ", "")}
                  </h3>
                );
              }
              return (
                <p key={i} className="text-sm leading-relaxed whitespace-pre-wrap text-neutral-600">
                  {block}
                </p>
              );
            })}
          </div>

          <div className="mt-12 border-t border-neutral-100 pt-8 text-center text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
            © {new Date().getFullYear()} {projectData.workspace.name}
          </div>
        </div>
      </div>
    </main>
  );
}
