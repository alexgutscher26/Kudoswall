import { Skeleton } from "@my-better-t-app/ui/components/skeleton";

export default function EmbedLoading() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-40 rounded-full" />
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="space-y-0 overflow-hidden rounded-2xl border border-neutral-100 bg-white"
          >
            <Skeleton className="h-48 w-full" />
            <div className="space-y-4 p-5">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-full" />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Skeleton className="h-9 flex-1 rounded-xl" />
                <Skeleton className="size-10 h-9 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
