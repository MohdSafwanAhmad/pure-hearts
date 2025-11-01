"use client";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { VerificationRequestDialog } from "@/src/components/page/organization/verification-request-dialog";
import { AlertCircle } from "lucide-react";

interface OrganizationVerificationAlertProps {
  organizationName: string;
}

export function OrganizationVerificationAlert({
  organizationName,
}: OrganizationVerificationAlertProps) {
  return (
    <div className="container mx-auto px-4 py-4">
      <Alert variant="destructive" className="border-orange-500 bg-orange-50">
        <AlertCircle className="h-5 w-5 text-orange-600" />
        <AlertTitle className="text-orange-900 font-semibold">
          Organization Not Verified
        </AlertTitle>
        <AlertDescription className="text-orange-800">
          <div className="space-y-3">
            <p>
              <strong>{organizationName}</strong> is not yet verified. Until
              your organization is verified:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
              <li>
                Your organization page will not be visible on public listings
              </li>
              <li>You will not be able to create or publish projects</li>
              <li>
                Donors will not be able to find or donate to your organization
              </li>
            </ul>
            <div className="pt-2">
              <VerificationRequestDialog />
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
