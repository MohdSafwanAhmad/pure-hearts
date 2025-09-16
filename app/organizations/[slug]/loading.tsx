import { Skeleton } from "@/src/components/ui/skeleton";
export default function OrganizationLoading() {
  return (
    <div>
      {/* Header Section Skeleton - match gradient, height, logo size */}
      <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 mb-section">
        <div className="container mx-auto py-12 px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-center text-white">
            {/* Logo Skeleton */}
            <div className="w-48 h-48 lg:w-64 lg:h-64 bg-background rounded-lg shadow-lg overflow-hidden relative flex items-center justify-center">
              <Skeleton className="w-40 h-40 lg:w-56 lg:h-56 rounded-lg" />
            </div>
            {/* Info Skeleton */}
            <div className="flex-1 text-center lg:text-left">
              <Skeleton className="h-10 w-2/3 mb-2 mx-auto lg:mx-0" />
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <Skeleton className="h-6 w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards Skeleton - match stats-section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-section container mx-auto">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center"
          >
            <Skeleton className="h-6 w-2/3 mb-2" />
            <Skeleton className="h-10 w-1/2 mb-1" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </section>

      {/* Organization Details Tabs Skeleton - match details-section */}
      <section className="mb-section container mx-auto">
        <div className="shadow-sm p-8">
          {/* Description Skeleton */}
          <div className="mb-subtitle">
            <Skeleton className="h-8 w-1/2 mb-element" />
            <Skeleton className="h-4 w-full mb-paragraph" />
          </div>
          {/* Tabs Skeleton */}
          <div className="border-b border-gray-200 mb-element">
            <div className="flex space-x-8 px-0">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-32 mb-element" />
              ))}
            </div>
          </div>
          {/* Tab Content Skeleton */}
          <div className="grid gap-x-6 grid-cols-1 sm:grid-cols-2 divide-y">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="py-4">
                <Skeleton className="h-4 w-1/2 mb-element" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section Skeleton - keep as before */}
      <div className="container mx-auto px-4 mb-section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm overflow-hidden mb-element"
            >
              <Skeleton className="h-32 w-full mb-title" />
              <div className="p-4">
                <Skeleton className="h-6 w-2/3 mb-paragraph" />
                <Skeleton className="h-4 w-full mb-paragraph" />
                <Skeleton className="h-4 w-1/2 mb-element" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
