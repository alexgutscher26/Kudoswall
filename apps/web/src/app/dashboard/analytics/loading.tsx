import { Skeleton } from "@my-better-t-app/ui/components/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3 rounded-2xl border border-neutral-100 bg-white p-5">
            <Skeleton className="size-10 rounded-xl" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 rounded-2xl border border-neutral-100 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
        <div className="space-y-6 rounded-2xl border border-neutral-100 bg-white p-6">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
