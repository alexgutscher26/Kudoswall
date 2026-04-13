import { Skeleton } from "@my-better-t-app/ui/components/skeleton";

export default function WidgetCustomizerLoading() {
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
              {[...Array(5)].map((_, i) => (
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
          <div className="sticky top-20 flex min-h-[600px] flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-neutral-50 p-8">
            <Skeleton className="h-[400px] w-full max-w-lg rounded-2xl shadow-xl" />
            <div className="mt-8 flex gap-4">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="size-10 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
