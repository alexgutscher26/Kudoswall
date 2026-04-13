import { Skeleton } from "@my-better-t-app/ui/components/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-neutral-100 bg-white">
            <div className="border-b border-neutral-50 px-6 py-4">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-6 p-6">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-1 sm:col-span-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                  <div className="sm:col-span-2">
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>
                </div>
              ))}
              <div className="flex justify-end pt-4">
                <Skeleton className="h-10 w-28 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
