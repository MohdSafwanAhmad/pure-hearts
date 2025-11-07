"use client";

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { VerificationRequestDialog } from "@/src/components/page/organization/verification-request-dialog";
import { AlertCircle, Clock, XCircle } from "lucide-react";
import { VerificationStatus } from "@/src/api/verification";

interface OrganizationVerificationAlertProps {
  organizationName: string;
  verificationStatus: VerificationStatus;
}

export function OrganizationVerificationAlert({
  organizationName,
  verificationStatus,
}: OrganizationVerificationAlertProps) {
  const { status, canSubmit, message, attemptsUsed, maxAttempts, adminNotes, reviewedBy } = verificationStatus;

  // Different alert variants based on status
  const getAlertConfig = () => {
    switch (status) {
      case "pending":
        return {
          variant: "default" as const,
          icon: <Clock className="h-5 w-5 text-blue-600" />,
          titleColor: "text-blue-900",
          descriptionColor: "text-blue-800",
          bgColor: "bg-blue-50 border-blue-500",
        };
      case "cooldown":
        return {
          variant: "destructive" as const,
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          titleColor: "text-red-900",
          descriptionColor: "text-red-800",
          bgColor: "bg-red-50 border-red-500",
        };
      case "rejected":
        return {
          variant: "destructive" as const,
          icon: <AlertCircle className="h-5 w-5 text-orange-600" />,
          titleColor: "text-orange-900",
          descriptionColor: "text-orange-800",
          bgColor: "bg-orange-50 border-orange-500",
        };
      default:
        return {
          variant: "destructive" as const,
          icon: <AlertCircle className="h-5 w-5 text-orange-600" />,
          titleColor: "text-orange-900",
          descriptionColor: "text-orange-800",
          bgColor: "bg-orange-50 border-orange-500",
        };
    }
  };

  const config = getAlertConfig();

  return (
    <div className="container mx-auto px-4 py-4">
      <Alert variant={config.variant} className={config.bgColor}>
        {config.icon}
        <AlertTitle className={`${config.titleColor} font-semibold`}>
          {status === "pending" ? "Verification Request Pending" : "Organization Not Verified"}
        </AlertTitle>
        <AlertDescription className={config.descriptionColor}>
          <div className="space-y-3">
            {status === "pending" ? (
              <>
                <p>{message}</p>
                <p className="text-sm">
                  <strong>Attempts used:</strong> {attemptsUsed} of {maxAttempts}
                </p>
                {canSubmit && (
                  <>
                    <p className="text-sm mt-2">
                      Need to update your documents? You can resubmit with corrected documents. 
                      Your previous pending request will be automatically cancelled.
                    </p>
                    <div className="pt-2">
                      <VerificationRequestDialog buttonText="Resubmit Documents" />
                    </div>
                  </>
                )}
              </>
            ) : status === "cooldown" ? (
              <>
                <p>{message}</p>
                <p className="text-sm mt-2">
                  After the cooldown period, you&apos;ll be able to submit a new verification request.
                </p>
              </>
            ) : (
              <>
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
                {attemptsUsed > 0 && (
                  <p className="text-sm font-semibold mt-2">
                    Attempts used: {attemptsUsed} of {maxAttempts}
                  </p>
                )}
                {status === "rejected" && (
                  <>
                    <p className="text-sm mt-2 font-semibold">
                      {message}
                    </p>
                    {adminNotes && (
                      <div className="mt-3 p-3 bg-white/50 rounded-md border border-orange-300">
                        <p className="text-sm font-medium mb-1">
                          Feedback from Reviewer{reviewedBy && ` (${reviewedBy})`}:
                        </p>
                        <p className="text-sm whitespace-pre-wrap">{adminNotes}</p>
                      </div>
                    )}
                  </>
                )}
                {canSubmit && (
                  <div className="pt-2">
                    <VerificationRequestDialog />
                  </div>
                )}
              </>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
