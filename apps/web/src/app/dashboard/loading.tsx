import { Skeleton } from "@my-better-t-app/ui/components/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar Skeleton (Desktop only) */}
      <aside className="fixed top-0 left-0 z-40 hidden h-screen w-60 flex-col border-r border-neutral-100 bg-white lg:flex">
        <div className="border-b border-neutral-50 px-3 pt-5 pb-4">
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-3 py-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2">
              <Skeleton className="size-4 shrink-0 rounded-md" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
        <div className="px-3 pb-3">
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
        <div className="flex items-center gap-3 border-t border-neutral-50 px-4 py-4">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-2 w-28" />
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col lg:ml-60">
        {/* Top Bar Skeleton */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-neutral-50 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full lg:hidden" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="hidden h-3 w-40 sm:block" />
            </div>
          </div>
          <Skeleton className="h-8 w-24 rounded-full sm:w-32" />
        </header>

        {/* Main Content Skeleton */}
        <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3 rounded-2xl border border-neutral-50 p-4 sm:p-5">
                <Skeleton className="size-9 rounded-xl" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-4 sm:gap-5 xl:grid-cols-3">
            <div className="rounded-2xl border border-neutral-100 bg-white xl:col-span-2">
              <div className="flex items-center justify-between border-b border-neutral-50 px-4 py-4 sm:px-6">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="hidden h-3 w-48 sm:block" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              </div>
              <div className="divide-y divide-neutral-50">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="size-10 rounded-xl" />
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <Skeleton className="size-8 rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5 xl:col-span-1">
              <div className="rounded-2xl border border-neutral-100 bg-white p-6">
                <Skeleton className="mb-4 h-6 w-32" />
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="size-5 rounded-md" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
