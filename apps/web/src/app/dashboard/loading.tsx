import { Skeleton } from "@my-better-t-app/ui/components/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Fake Header */}
      <div className="flex h-16 items-center justify-between border-b border-gray-100 px-8">
        <div className="flex items-center gap-6">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-12 p-8">
        {/* Welcome Section */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4 rounded-2xl border border-gray-100 p-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>

        {/* Projects & Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-8 w-40" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-48 space-y-4 rounded-2xl border border-gray-100 p-6">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="mt-auto flex justify-between pt-4">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-6 rounded-2xl border border-gray-100 p-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
