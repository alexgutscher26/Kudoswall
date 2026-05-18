import { Skeleton } from "@my-better-t-app/ui/components/skeleton";

export default function CollectionLoading() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-44 rounded-full" />
      </div>

      {/* Campaign List Skeleton */}
      <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-50 px-6 py-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        <div className="divide-y divide-neutral-50">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-5">
              <div className="flex flex-1 items-center gap-4">
                <Skeleton className="size-12 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-3 w-64" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden space-y-1 sm:block">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-10 w-28 rounded-xl" />
                <Skeleton className="size-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
