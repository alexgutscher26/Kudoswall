import { notFound } from "next/navigation";
import { getProjectBySlug } from "./actions";
import CollectionWizard from "./collection-wizard";
import ErrorBoundary from "@/components/error-boundary";
import { Manrope, Inter } from "next/font/google";
import { X } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-manrope",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
});

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

  const projectName = projectData.name || "SocialProof Pro";

  return (
    <div
      className={`flex min-h-screen flex-col bg-[#f7f9fb] font-[family-name:var(--font-inter)] text-[#191c1e] ${manrope.variable} ${inter.variable}`}
    >
      {/* TopAppBar */}
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-white/80 px-6 backdrop-blur-xl dark:bg-slate-950/80">
        <div className="max-w-[80vw] truncate pr-4 font-[family-name:var(--font-manrope)] text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {projectName}
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <Link
            href="/"
            className="scale-95 text-slate-900 transition-opacity duration-200 hover:opacity-70 dark:text-slate-50"
          >
            <X className="size-6" />
          </Link>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="mx-auto flex w-full max-w-2xl grow flex-col items-center px-4 pt-24 pb-12 sm:px-6">
        <div className="w-full">
          <ErrorBoundary name="Collection Wizard">
            <CollectionWizard project={projectData} />
          </ErrorBoundary>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto w-full bg-slate-900 dark:bg-slate-950">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-8 py-12 md:flex-row">
          <div className="mb-6 text-xs tracking-wide text-slate-300 uppercase md:mb-0 dark:text-slate-400">
            © {new Date().getFullYear()} {projectName}. All rights reserved.
          </div>
          <nav className="flex gap-8">
            <a
              className="text-xs tracking-wide text-slate-400 uppercase transition-colors hover:text-[#4edea3]"
              href="#"
            >
              Support
            </a>
            <a
              className="text-xs tracking-wide text-slate-400 uppercase transition-colors hover:text-[#4edea3]"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-xs tracking-wide text-slate-400 uppercase transition-colors hover:text-[#4edea3]"
              href="#"
            >
              Terms of Service
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
