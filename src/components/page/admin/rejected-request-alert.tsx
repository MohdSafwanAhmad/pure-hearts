"use client";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { XCircle } from "lucide-react";

interface RejectedRequestAlertProps {
  adminNotes: string | null;
  reviewedByFirstName: string | null;
  reviewedByLastName: string | null;
}

export function RejectedRequestAlert({
  adminNotes,
  reviewedByFirstName,
  reviewedByLastName,
}: RejectedRequestAlertProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Alert variant="destructive">
        <XCircle className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold">
          Verification Request Rejected
        </AlertTitle>
        <AlertDescription className="mt-2">
          <p>
            This verification request has already been rejected. The organization
            will need to submit a new verification request with updated
            documentation.
          </p>
          {adminNotes && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-sm font-semibold">Admin Notes:</p>
              <p className="text-sm">{adminNotes}</p>
            </div>
          )}
          {reviewedByFirstName && (
            <p className="text-sm mt-2">
              Reviewed by: {reviewedByFirstName} {reviewedByLastName}
            </p>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
