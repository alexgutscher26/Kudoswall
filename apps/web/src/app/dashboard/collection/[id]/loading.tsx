import { Skeleton } from "@my-better-t-app/ui/components/skeleton";

export default function CollectionCustomizerLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Settings Panel */}
        <div className="space-y-6 lg:col-span-5">
          <div className="space-y-6 rounded-2xl border border-neutral-100 bg-white p-6">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-7">
          <div className="sticky top-20 flex min-h-[700px] flex-col items-center rounded-2xl border border-neutral-100 bg-neutral-100 p-8">
            <div className="relative aspect-[9/16] w-full max-w-[400px] overflow-hidden rounded-[3rem] border-[8px] border-neutral-900 bg-white shadow-2xl">
              <div className="space-y-6 p-8">
                <Skeleton className="mx-auto h-8 w-32" />
                <Skeleton className="h-40 w-full rounded-2xl" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="space-y-3 pt-8">
                  <Skeleton className="h-12 w-full rounded-full" />
                  <Skeleton className="h-12 w-full rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
