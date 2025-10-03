"use client";
import { signupAsOrganization } from "@/src/actions/auth-organization";
import { BasicInformationSection } from "@/src/components/page/signup/organization-signup-form-sections/basic-information-section";
import { FieldErrorsSummary } from "@/src/components/page/signup/organization-signup-form-sections/field-errors-summary";
import { LocationSection } from "@/src/components/page/signup/organization-signup-form-sections/location-section";
import { MissionProjectsSection } from "@/src/components/page/signup/organization-signup-form-sections/mission-projects-section";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import {
  TCreateOrganizationSchema,
  createOrganizationSchema,
} from "@/src/schemas/organization";
import { OrganizationFormData } from "@/src/types/auth-organizations-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "../../ui/form";

export function OrganizationSignupForm() {
  const [signupState, signupAction, isSignupPending] = useActionState(
    signupAsOrganization,
    { errors: {} }
  );

  const form = useForm<TCreateOrganizationSchema>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      organizationName: "",
      organizationEmail: "",
      organizationPhone: "",
      contactPersonName: "",
      contactPersonEmail: "",
      contactPersonPhone: "",
      country: "Canada",
      state: "",
      city: "",
      address: "",
      missionStatement: "",
      projectAreas: [],
      websiteUrl: "",
      facebookUrl: "",
      twitterUrl: "",
      instagramUrl: "",
      linkedinUrl: "",
    },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OrganizationFormData>({
    // Basic Information
    organizationName: "",
    organizationEmail: "",
    organizationPhone: "",
    contactPersonName: "",
    contactPersonEmail: "",
    contactPersonPhone: "",

    // Location
    country: "Canada",
    state: "",
    city: "",
    address: "",

    // Mission & Projects
    missionStatement: "",
    projectAreas: [],
    websiteUrl: "",
    facebookUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    linkedinUrl: "",
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleUpdateFormData = (updates: Partial<OrganizationFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    const sectionProps = {
      formData,
      errors: signupState?.errors || {},
      onUpdateFormData: handleUpdateFormData,
    };

    switch (currentStep) {
      case 1:
        return <BasicInformationSection form={form} />;
      case 2:
        return <LocationSection form={form} />;
      case 3:
        return <MissionProjectsSection {...sectionProps} />;
      default:
        return null;
    }
  };

  const onSubmit = async (data: TCreateOrganizationSchema) => {};

  // Helper function to serialize form data for submission
  const prepareFormData = () => {
    const formDataToSubmit = new FormData();

    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "projectAreas" && Array.isArray(value)) {
        value.forEach((area) => formDataToSubmit.append("projectAreas", area));
      } else if (value !== null && value !== undefined) {
        formDataToSubmit.append(key, String(value));
      }
    });

    return formDataToSubmit;
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">
                    Register Your Organization
                  </h1>
                  <p className="text-muted-foreground text-balance">
                    Join our platform to receive donations
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      Step {currentStep} of {totalSteps}
                    </span>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>

                {signupState?.errors?._form && (
                  <div className="text-sm text-red-500">
                    {signupState.errors._form.map((error, i) => (
                      <p key={i}>{error}</p>
                    ))}
                  </div>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {currentStep === 1 && "Basic Information"}
                      {currentStep === 2 && "Location Details"}
                      {currentStep === 3 && "Mission & Projects"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderStep()}

                    {/* Show field errors summary on the final step */}
                    {currentStep === totalSteps && (
                      <div className="mt-4">
                        <FieldErrorsSummary
                          errors={signupState?.errors || {}}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSignupPending}
                      className="flex items-center gap-2"
                    >
                      {isSignupPending
                        ? "Submitting..."
                        : "Complete Registration"}
                    </Button>
                  )}
                </div>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <Link href="/terms-and-conditions">Terms and Conditions</Link> and{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>.
      </div>
    </div>
  );
}
