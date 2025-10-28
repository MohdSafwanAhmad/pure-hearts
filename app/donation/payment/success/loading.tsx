import { Skeleton } from "@/src/components/ui/skeleton";

export default function DonationSuccessLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-col items-center justify-center space-y-8 rounded-lg bg-white p-8 shadow-lg">
        {/* Success Icon Skeleton */}
        <Skeleton className="h-24 w-24 rounded-full" />

        {/* Title and Subtitle Skeletons */}
        <div className="space-y-2 text-center w-full">
          <Skeleton className="h-9 w-96 mx-auto" />
          <Skeleton className="h-7 w-80 mx-auto" />
        </div>

        {/* Donation Details Card Skeleton */}
        <div className="w-full max-w-md rounded-md bg-muted/50 p-6">
          <div className="space-y-4">
            {/* Amount Row */}
            <div className="flex justify-between border-b pb-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-32" />
            </div>
            {/* Project Row */}
            <div className="flex justify-between border-b pb-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-40" />
            </div>
            {/* Organization Row */}
            <div className="flex justify-between">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-6 w-36" />
            </div>
          </div>
        </div>

        {/* Receipt Message Skeleton */}
        <div className="space-y-2 pt-4 text-center">
          <Skeleton className="h-5 w-72 mx-auto" />
        </div>

        {/* Action Buttons Skeletons */}
        <div className="flex w-full flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  );
}
