"use client";
import { signupAsOrganization } from "@/src/actions/auth-organization";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import { Progress } from "@/src/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const legalStatusOptions = [
  { value: "NonProfit", label: "Non-Profit" },
  { value: "Charity", label: "Charity" },
  { value: "NGO", label: "NGO" },
  { value: "Other", label: "Other" },
];

const canadianProvinces = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "YT", label: "Yukon" },
];

const projectAreaOptions = [
  "Education",
  "Health",
  "Emergency Relief",
  "Poverty Alleviation",
  "Orphan Care",
  "Clean Water",
  "Environment",
  "Women Empowerment",
  "Elderly Care",
  "Disability Support",
];

export function OrganizationSignupForm() {
  const [signupState, signupAction, isSignupPending] = useActionState(
    signupAsOrganization,
    { errors: {} }
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProjectAreas, setSelectedProjectAreas] = useState<string[]>(
    []
  );
  const [selectedGeographicAreas, setSelectedGeographicAreas] = useState<
    string[]
  >([]);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleProjectAreaChange = (area: string, checked: boolean) => {
    if (checked) {
      setSelectedProjectAreas((prev) => [...prev, area]);
    } else {
      setSelectedProjectAreas((prev) => prev.filter((p) => p !== area));
    }
  };

  const handleGeographicAreaChange = (area: string) => {
    const areas = area
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
    setSelectedGeographicAreas(areas);
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
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid gap-3">
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                name="organizationName"
                type="text"
                placeholder="Your Organization Name"
                required
                defaultValue=""
                className={
                  signupState?.errors?.organizationName ? "border-red-500" : ""
                }
              />
              {signupState?.errors?.organizationName && (
                <p className="text-sm text-red-500">
                  {signupState.errors.organizationName[0]}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="organizationEmail">Organization Email</Label>
              <Input
                id="organizationEmail"
                name="organizationEmail"
                type="email"
                placeholder="contact@organization.org"
                required
                defaultValue=""
                className={
                  signupState?.errors?.organizationEmail ? "border-red-500" : ""
                }
              />
              {signupState?.errors?.organizationEmail && (
                <p className="text-sm text-red-500">
                  {signupState.errors.organizationEmail[0]}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="legalStatus">Legal Status</Label>
              <Select name="legalStatus" required defaultValue="">
                <SelectTrigger
                  className={
                    signupState?.errors?.legalStatus ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Select legal status" />
                </SelectTrigger>
                <SelectContent>
                  {legalStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {signupState?.errors?.legalStatus && (
                <p className="text-sm text-red-500">
                  {signupState.errors.legalStatus[0]}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label>Contact Person</Label>
              <div className="grid gap-3">
                <Input
                  name="contactPersonName"
                  placeholder="Contact person name"
                  required
                  defaultValue=""
                  className={
                    signupState?.errors?.contactPersonName
                      ? "border-red-500"
                      : ""
                  }
                />
                {signupState?.errors?.contactPersonName && (
                  <p className="text-sm text-red-500">
                    {signupState.errors.contactPersonName[0]}
                  </p>
                )}
                <Input
                  name="contactPersonEmail"
                  type="email"
                  placeholder="Contact person email"
                  required
                  defaultValue=""
                  className={
                    signupState?.errors?.contactPersonEmail
                      ? "border-red-500"
                      : ""
                  }
                />
                {signupState?.errors?.contactPersonEmail && (
                  <p className="text-sm text-red-500">
                    {signupState.errors.contactPersonEmail[0]}
                  </p>
                )}
                <Input
                  name="contactPersonPhone"
                  type="tel"
                  required
                  defaultValue=""
                  placeholder="Phone number (e.g., +1 416 555 0123)"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid gap-3">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                type="text"
                value="Canada"
                disabled={true}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="state">Province</Label>
              <Select name="state" required defaultValue="">
                <SelectTrigger
                  className={signupState?.errors?.state ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {canadianProvinces.map((province) => (
                    <SelectItem key={province.value} value={province.value}>
                      {province.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {signupState?.errors?.state && (
                <p className="text-sm text-red-500">
                  {signupState.errors.state[0]}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                type="text"
                placeholder="Toronto"
                required
                defaultValue=""
                className={signupState?.errors?.city ? "border-red-500" : ""}
              />
              {signupState?.errors?.city && (
                <p className="text-sm text-red-500">
                  {signupState.errors.city[0]}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Main Street"
                required
                defaultValue=""
                className={signupState?.errors?.address ? "border-red-500" : ""}
              />
              {signupState?.errors?.address && (
                <p className="text-sm text-red-500">
                  {signupState.errors.address[0]}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid gap-3">
              <Label htmlFor="missionStatement">Mission Statement</Label>
              <Textarea
                id="missionStatement"
                name="missionStatement"
                placeholder="Describe your organization's mission and goals..."
                required
                defaultValue=""
                className={
                  signupState?.errors?.missionStatement ? "border-red-500" : ""
                }
              />
              {signupState?.errors?.missionStatement && (
                <p className="text-sm text-red-500">
                  {signupState.errors.missionStatement[0]}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label>Project Areas</Label>
              <p className="text-xs text-muted-foreground">
                Select the areas your organization works in
              </p>
              <div className="grid grid-cols-2 gap-3">
                {projectAreaOptions.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={selectedProjectAreas.includes(area)}
                      onCheckedChange={(checked) =>
                        handleProjectAreaChange(area, checked as boolean)
                      }
                    />
                    <Label htmlFor={area} className="text-sm">
                      {area}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedProjectAreas.map((area) => (
                <input
                  key={area}
                  type="hidden"
                  name="projectAreas"
                  value={area}
                />
              ))}
              {signupState?.errors?.projectAreas && (
                <p className="text-sm text-red-500">
                  {signupState.errors.projectAreas[0]}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="geographicServed">Geographic Areas Served</Label>
              <Textarea
                id="geographicServed"
                name="geographicServed"
                placeholder="e.g., Greater Toronto Area, Ontario, Remote communities in Northern Canada"
                onChange={(e) => handleGeographicAreaChange(e.target.value)}
                defaultValue=""
                className={
                  signupState?.errors?.geographicServed ? "border-red-500" : ""
                }
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple areas with commas
              </p>
              {selectedGeographicAreas.map((area) => (
                <input
                  key={area}
                  type="hidden"
                  name="geographicServed"
                  value={area}
                />
              ))}
              {signupState?.errors?.geographicServed && (
                <p className="text-sm text-red-500">
                  {signupState.errors.geographicServed[0]}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                placeholder="https://www.yourorganization.org"
                required
                defaultValue=""
              />
            </div>

            <div className="space-y-3">
              <Label>Social Media Links</Label>
              <div className="grid gap-3">
                <Input
                  name="facebookUrl"
                  type="url"
                  placeholder="Facebook URL"
                  required
                  defaultValue=""
                />
                <Input
                  name="twitterUrl"
                  type="url"
                  placeholder="Twitter URL"
                  required
                  defaultValue=""
                />
                <Input
                  name="instagramUrl"
                  type="url"
                  placeholder="Instagram URL"
                  required
                  defaultValue=""
                />
                <Input
                  name="linkedinUrl"
                  type="url"
                  placeholder="LinkedIn URL"
                  required
                  defaultValue=""
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form action={signupAction} className="p-6 md:p-8">
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
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/signup-image.webp"
              alt="Organization Registration"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              width={400}
              height={500}
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance">
        By clicking continue, you agree to our{" "}
        <Link href="#" className="underline underline-offset-4">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
