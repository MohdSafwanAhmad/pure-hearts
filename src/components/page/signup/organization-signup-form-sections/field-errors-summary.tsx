import { Card, CardContent } from "@/src/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface FieldErrorsSummaryProps {
  errors: Record<string, string[]>;
}

// Map field names to human-readable labels
const fieldLabels: Record<string, string> = {
  organizationName: "Organization Name",
  organizationEmail: "Organization Email",
  organizationPhone: "Organization Phone",
  contactPersonName: "Contact Person Name",
  contactPersonEmail: "Contact Person Email",
  contactPersonPhone: "Contact Person Phone",
  country: "Country",
  state: "Province/Territory",
  city: "City",
  address: "Address",
  missionStatement: "Mission Statement",
  projectAreas: "Project Areas",
  websiteUrl: "Website URL",
  facebookUrl: "Facebook URL",
  twitterUrl: "Twitter URL",
  instagramUrl: "Instagram URL",
  linkedinUrl: "LinkedIn URL",
};

export function FieldErrorsSummary({ errors }: FieldErrorsSummaryProps) {
  // Filter out the general form error (_form) and only show field-specific errors
  const fieldErrors = Object.entries(errors).filter(
    ([key, value]) => key !== "_form" && value && value.length > 0
  );

  if (fieldErrors.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-3 flex-1">
            <p className="font-medium text-red-800 dark:text-red-200">
              Please fix the following errors before submitting:
            </p>
            <ul className="space-y-2">
              {fieldErrors.map(([fieldName, fieldErrorMessages]) => (
                <li key={fieldName} className="text-sm">
                  <span className="font-medium text-red-700 dark:text-red-300">
                    {fieldLabels[fieldName] || fieldName}:
                  </span>
                  <ul className="ml-4 mt-1 space-y-1">
                    {fieldErrorMessages.map((error, index) => (
                      <li
                        key={index}
                        className="text-red-600 dark:text-red-400 text-sm"
                      >
                        • {error}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
