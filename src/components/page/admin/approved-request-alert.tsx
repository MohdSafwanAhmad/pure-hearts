"use client";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

interface ApprovedRequestAlertProps {
  organizationName: string;
  reviewedByFirstName: string | null;
  reviewedByLastName: string | null;
  reviewedAt: string | null;
  adminNotes: string | null;
}

export function ApprovedRequestAlert({
  organizationName,
  reviewedByFirstName,
  reviewedByLastName,
  reviewedAt,
  adminNotes,
}: ApprovedRequestAlertProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Alert className="bg-green-50 border-green-500">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-lg font-semibold text-green-900">
          Organization Verified
        </AlertTitle>
        <AlertDescription className="mt-2 text-green-800">
          <p>
            <strong>{organizationName}</strong> has been successfully verified.
          </p>
          {reviewedByFirstName && (
            <p className="text-sm mt-2">
              Verified by: {reviewedByFirstName} {reviewedByLastName}
            </p>
          )}
          {reviewedAt && (
            <p className="text-sm">
              Verified on: {new Date(reviewedAt).toLocaleDateString()}
            </p>
          )}
          {adminNotes && (
            <div className="mt-3 p-3 bg-muted rounded-md">
              <p className="text-sm font-medium text-foreground mb-1">
                Admin Notes:
              </p>
              <p className="text-sm text-muted-foreground">{adminNotes}</p>
            </div>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
