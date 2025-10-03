"use client";

import { updateOrganization } from "@/src/actions/organization";
import { BasicInformationSection } from "@/src/components/page/organization-dashboard/profile/sections/basic-information-section";
import { LocationSection } from "@/src/components/page/organization-dashboard/profile/sections/location-section";
import { MissionProjectsSection } from "@/src/components/page/organization-dashboard/profile/sections/mission-projects-section";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import {
  organizationSchema,
  TOrganizationSchema,
} from "@/src/schemas/organization";
import { Database } from "@/src/types/database-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type OrganizationData = Database["public"]["Tables"]["organizations"]["Row"];

interface OrganizationUpdateFormProps {
  initialData: OrganizationData;
}

function parseProjectAreas(projectAreas: unknown): string[] {
  if (Array.isArray(projectAreas)) {
    return projectAreas.filter((v) => typeof v === "string");
  }
  if (typeof projectAreas === "string") {
    try {
      const parsed = JSON.parse(projectAreas);
      if (Array.isArray(parsed)) {
        return parsed.filter((v) => typeof v === "string");
      }
    } catch {
      return [];
    }
  }
  return [];
}

export function OrganizationUpdateForm({
  initialData,
}: OrganizationUpdateFormProps) {
  const form = useForm<TOrganizationSchema>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      organizationName: initialData.organization_name || "",
      organizationPhone: initialData.organization_phone || "",
      contactPersonName: initialData.contact_person_name || "",
      contactPersonEmail: initialData.contact_person_email || "",
      contactPersonPhone: initialData.contact_person_phone || "",
      country: initialData.country || "Canada",
      state: initialData.state || "",
      city: initialData.city || "",
      address: initialData.address || "",
      missionStatement: initialData.mission_statement || "",
      projectAreas: parseProjectAreas(initialData.project_areas),
      websiteUrl: initialData.website_url || "",
      facebookUrl: initialData.facebook_url || "",
      twitterUrl: initialData.twitter_url || "",
      instagramUrl: initialData.instagram_url || "",
      linkedinUrl: initialData.linkedin_url || "",
    },
  });

  const onSubmit = async (data: TOrganizationSchema) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "projectAreas") {
        formData.append(key, JSON.stringify(value));
      } else {
        if (!Array.isArray(value)) formData.append(key, value ?? "");
      }
    });

    const res = await updateOrganization(formData);

    if (res.success) {
      toast.success("Organization information updated successfully");
      form.reset(data);
    }

    if (res.error) {
      toast.error(res.error);
    }
  };

  // Reset to initialData
  const handleReset = () => {
    form.reset();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <BasicInformationSection form={form} />

          {/* Location Section */}
          <LocationSection form={form} />

          {/* Mission & Projects Section */}
          <MissionProjectsSection form={form} />

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
            >
              Reset Changes
            </Button>

            <Button
              type="submit"
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
              className="min-w-32"
            >
              {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
