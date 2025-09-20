"use client";

import { updateOrganization } from "@/src/actions/update-organization";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { Database } from "@/src/types/database-types";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { BasicInformationSection } from "./sections/basic-information-section";
import { LocationSection } from "./sections/location-section";
import { MissionProjectsSection } from "./sections/mission-projects-section";

type OrganizationData = Database["public"]["Tables"]["organizations"]["Row"];

interface OrganizationUpdateFormProps {
  initialData: OrganizationData;
}

export function OrganizationUpdateForm({
  initialData,
}: OrganizationUpdateFormProps) {
  const [formState, formAction, isPending] = useActionState(
    updateOrganization,
    { errors: {} }
  );

  // Convert project_areas from Json to string array
  const initialProjectAreas = Array.isArray(initialData.project_areas)
    ? (initialData.project_areas as string[])
    : [];

  const [formData, setFormData] = useState({
    organizationName: initialData.organization_name,
    organizationPhone: initialData.organization_phone,
    country: initialData.country,
    state: initialData.state,
    city: initialData.city,
    address: initialData.address,
    contactPersonName: initialData.contact_person_name,
    contactPersonEmail: initialData.contact_person_email,
    contactPersonPhone: initialData.contact_person_phone,
    missionStatement: initialData.mission_statement,
    projectAreas: initialProjectAreas,
    websiteUrl: initialData.website_url || "",
    facebookUrl: initialData.facebook_url || "",
    twitterUrl: initialData.twitter_url || "",
    instagramUrl: initialData.instagram_url || "",
    linkedinUrl: initialData.linkedin_url || "",
  });

  // Track the current baseline for change detection (updates after successful save)
  const [currentBaseline, setCurrentBaseline] = useState(formData);
  const [hasChanges, setHasChanges] = useState(false);

  // Show toast notifications based on form state
  useEffect(() => {
    if (formState.success) {
      toast.success("Organization information updated successfully!");
      // Update the baseline to current form data after successful save
      setCurrentBaseline({ ...formData });
      setHasChanges(false);
    } else if (formState.errors._form) {
      toast.error(formState.errors._form[0]);
    }
  }, [formState.success, formState.errors._form]);

  // Check if form has changes compared to current baseline
  useEffect(() => {
    const hasDataChanged =
      formData.organizationName !== currentBaseline.organizationName ||
      formData.organizationPhone !== currentBaseline.organizationPhone ||
      formData.country !== currentBaseline.country ||
      formData.state !== currentBaseline.state ||
      formData.city !== currentBaseline.city ||
      formData.address !== currentBaseline.address ||
      formData.contactPersonName !== currentBaseline.contactPersonName ||
      formData.contactPersonEmail !== currentBaseline.contactPersonEmail ||
      formData.contactPersonPhone !== currentBaseline.contactPersonPhone ||
      formData.missionStatement !== currentBaseline.missionStatement ||
      JSON.stringify(formData.projectAreas.sort()) !==
        JSON.stringify(currentBaseline.projectAreas.sort()) ||
      formData.websiteUrl !== currentBaseline.websiteUrl ||
      formData.facebookUrl !== currentBaseline.facebookUrl ||
      formData.twitterUrl !== currentBaseline.twitterUrl ||
      formData.instagramUrl !== currentBaseline.instagramUrl ||
      formData.linkedinUrl !== currentBaseline.linkedinUrl;

    setHasChanges(hasDataChanged);
  }, [formData, currentBaseline]);

  // Handle form submission
  const handleSubmit = (formDataObj: FormData) => {
    formAction(formDataObj);
  };

  // Handle input changes
  const handleInputChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  // Handle select changes
  const handleSelectChange =
    (field: keyof typeof formData) => (value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  // Handle project area changes
  const handleProjectAreaChange = (area: string, checked: boolean) => {
    setFormData((prev) => {
      const currentAreas = prev.projectAreas || [];
      if (checked) {
        return { ...prev, projectAreas: [...currentAreas, area] };
      } else {
        return {
          ...prev,
          projectAreas: currentAreas.filter((p) => p !== area),
        };
      }
    });
  };

  // Reset form to current baseline (last saved state)
  const handleReset = () => {
    setFormData(currentBaseline);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Update Organization Information
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Modify your organization details and save changes
          </p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <BasicInformationSection
          formData={{
            organizationName: formData.organizationName,
            organizationPhone: formData.organizationPhone,
            contactPersonName: formData.contactPersonName,
            contactPersonEmail: formData.contactPersonEmail,
            contactPersonPhone: formData.contactPersonPhone,
          }}
          errors={formState.errors}
          onInputChange={
            handleInputChange as (
              field: string
            ) => (
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => void
          }
        />

        {/* Location Section */}
        <LocationSection
          formData={{
            country: formData.country,
            state: formData.state,
            city: formData.city,
            address: formData.address,
          }}
          errors={formState.errors}
          onInputChange={
            handleInputChange as (
              field: string
            ) => (
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => void
          }
          onSelectChange={
            handleSelectChange as (field: string) => (value: string) => void
          }
        />

        {/* Mission & Projects Section */}
        <MissionProjectsSection
          formData={{
            missionStatement: formData.missionStatement,
            projectAreas: formData.projectAreas,
            websiteUrl: formData.websiteUrl,
            facebookUrl: formData.facebookUrl,
            twitterUrl: formData.twitterUrl,
            instagramUrl: formData.instagramUrl,
            linkedinUrl: formData.linkedinUrl,
          }}
          errors={formState.errors}
          onInputChange={
            handleInputChange as (
              field: string
            ) => (
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => void
          }
          onProjectAreaChange={handleProjectAreaChange}
        />

        <Separator />

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges || isPending}
          >
            Reset Changes
          </Button>

          <Button
            type="submit"
            disabled={!hasChanges || isPending}
            className="min-w-32"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
