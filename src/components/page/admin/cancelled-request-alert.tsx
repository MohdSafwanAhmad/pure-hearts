"use client";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import { ExternalLink, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface CancelledRequestAlertProps {
  latestPendingRequestId: string | null;
}

export function CancelledRequestAlert({
  latestPendingRequestId,
}: CancelledRequestAlertProps) {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Alert variant="destructive">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold">
          Verification Request Cancelled
        </AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">
            This verification request has been cancelled by the organization. It
            was replaced by a newer submission.
          </p>
          {latestPendingRequestId && (
            <Button
              onClick={() =>
                router.push(
                  `/admin/verify-organization/${latestPendingRequestId}`
                )
              }
              variant="outline"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Go to Latest Pending Request
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
