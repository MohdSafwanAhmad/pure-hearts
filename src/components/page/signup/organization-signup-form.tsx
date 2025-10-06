"use client";
import { signupAsOrganization } from "@/src/actions/auth-organization";
import { BasicInformationSection } from "@/src/components/page/signup/organization-signup-form-sections/basic-information-section";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/src/components/ui/form";
import { toast } from "sonner";

interface Props {
  projectAreas: { label: string; value: number }[];
}
export function OrganizationSignupForm({ projectAreas }: Props) {
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

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const stepFields: Record<number, (keyof TCreateOrganizationSchema)[]> = {
    1: [
      "organizationName",
      "organizationEmail",
      "organizationPhone",
      "contactPersonName",
      "contactPersonEmail",
      "contactPersonPhone",
    ],
    2: ["country", "state", "city", "address"],
    3: [
      "missionStatement",
      "projectAreas",
      "websiteUrl",
      "facebookUrl",
      "twitterUrl",
      "instagramUrl",
      "linkedinUrl",
    ],
  };

  const nextStep = async () => {
    const fields = stepFields[currentStep];
    const valid = await form.trigger(
      fields as (keyof TCreateOrganizationSchema)[]
    );
    if (valid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationSection form={form} />;
      case 2:
        return <LocationSection form={form} />;
      case 3:
        return (
          <MissionProjectsSection projectAreas={projectAreas} form={form} />
        );
      default:
        return null;
    }
  };

  const onSubmit = async (data: TCreateOrganizationSchema) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) formData.append(key, JSON.stringify(value));
      else formData.append(key, value);
    });

    const res = await signupAsOrganization(formData);

    if (res?.error) {
      toast.error(res.error);
    }
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

                {/* Step Content */}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {currentStep === 1 && "Basic Information"}
                      {currentStep === 2 && "Location Details"}
                      {currentStep === 3 && "Mission & Projects"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>{renderStep()}</CardContent>
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        nextStep();
                      }}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="flex items-center gap-2"
                    >
                      {form.formState.isSubmitting
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
