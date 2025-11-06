"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface StripeVerificationAlertProps {
  organizationName: string;
}

export function StripeVerificationAlert({
  organizationName,
}: StripeVerificationAlertProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <Alert
        variant="destructive"
        className="relative border-orange-500 bg-orange-50 text-orange-900"
      >
        <AlertCircle className="h-4 w-4 !text-orange-600" />
        <AlertTitle className="text-orange-900">
          Payment Processing Unavailable
        </AlertTitle>
        <AlertDescription className="text-orange-800">
          Your Stripe account for <strong>{organizationName}</strong> is
          currently pending verification or incomplete. You cannot receive
          donations until you complete the stripe verification process. Please
          click on <strong>&quot;Set Up Payments&quot;</strong> or{" "}
          <strong>&quot;Manage Payments Information&quot;</strong> button below
          to complete your account setup.
        </AlertDescription>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 text-orange-900 hover:bg-orange-100"
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  );
}
