import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function ProjectLoading() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* LEFT: Project Card Skeleton */}
        <Card className="overflow-hidden lg:col-span-7">
          <div className="relative aspect-video">
            <Skeleton className="absolute inset-0 w-full h-full" />
            {/* Simulated overlay + text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 space-y-2">
              <Skeleton className="h-8 sm:h-10 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-7 w-1/2" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-4 w-full" />
            {/* KPI Row (4 items) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
            </div>
            <div>
              <Skeleton className="h-3 w-1/2 mb-2" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/4 mt-1 ml-auto" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
        {/* RIGHT: Donate Box + Organization Skeleton */}
        <div className="space-y-6 lg:col-span-5">
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-6 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-10 w-32 mt-4" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-2/3 mt-2" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 pt-0">
              <Skeleton className="h-8 w-40" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}