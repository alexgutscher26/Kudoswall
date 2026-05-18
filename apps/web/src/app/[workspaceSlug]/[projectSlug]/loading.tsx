import { Skeleton } from "@my-better-t-app/ui/components/skeleton";

export default function CollectionPublicLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f9fb]">
      {/* Header Skeleton */}
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-white/80 px-6 backdrop-blur-xl">
        <Skeleton className="h-6 w-48 rounded-md" />
        <Skeleton className="size-6 rounded-full" />
      </header>

      {/* Main Content Skeleton */}
      <main className="mx-auto flex w-full max-w-2xl grow flex-col items-center px-4 pt-24 pb-12 sm:px-6">
        <div className="w-full space-y-8">
          {/* Hero Area */}
          <div className="flex flex-col items-center space-y-4 text-center">
            <Skeleton className="h-12 w-64 rounded-xl" />
            <Skeleton className="h-4 w-full max-w-sm rounded-lg" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 w-32 rounded-full" />
              <Skeleton className="h-12 w-32 rounded-full" />
            </div>
          </div>

          {/* Steps/Questions skeleton */}
          <div className="space-y-6 rounded-3xl border border-white bg-white/40 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md">
            <div className="space-y-3">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                ))}
              </div>
            </div>
            <div className="space-y-3 pt-4">
              <Skeleton className="h-10 w-full rounded-2xl" />
              <Skeleton className="h-10 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="mt-auto w-full bg-slate-900 py-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-8 md:flex-row">
          <Skeleton className="h-4 w-64 bg-slate-800" />
          <div className="mt-6 flex gap-8 md:mt-0">
            <Skeleton className="h-4 w-20 bg-slate-800" />
            <Skeleton className="h-4 w-20 bg-slate-800" />
            <Skeleton className="h-4 w-20 bg-slate-800" />
          </div>
        </div>
      </footer>
    </div>
  );
}
