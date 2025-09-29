"use client";

import { updateOrganization } from "@/src/actions/update-organization";
import { Organization } from "@/src/api/organization";
import { EditableHeaderSection } from "@/src/components/page/organization/editable-header-section";
import { EditableDetailsSection } from "@/src/components/page/organization/editable-details-section";
import { OrganizationStats } from "@/src/components/page/organization/stats-section";
import { ProjectsSection } from "@/src/components/page/organization/projects-section";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import {
  organizationSchema,
  TOrganizationSchema,
} from "@/src/schemas/organization";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface OrganizationPageClientProps {
  organization: Organization;
  isOwner: boolean;
  stats: {
    title: string;
    stat: string;
    description: string;
  }[];
  projects: {
    title: string;
    description: string;
    startDate: Date;
    completionDate?: Date;
    projectId: string;
    projectBackgroundImage: string;
    slug: string;
    organizationSlug: string;
  }[];
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

export function OrganizationPageClient({
  organization,
  isOwner,
  stats,
  projects,
}: OrganizationPageClientProps) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<TOrganizationSchema>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      organizationName: organization.organization_name || "",
      organizationPhone: organization.organization_phone || "",
      contactPersonName: organization.contact_person_name || "",
      contactPersonEmail: organization.contact_person_email || "",
      contactPersonPhone: organization.contact_person_phone || "",
      country: organization.country || "Canada",
      state: organization.state || "",
      city: organization.city || "",
      address: organization.address || "",
      missionStatement: organization.mission_statement || "",
      projectAreas: parseProjectAreas(organization.project_areas),
      websiteUrl: organization.website_url || "",
      facebookUrl: organization.facebook_url || "",
      twitterUrl: organization.twitter_url || "",
      instagramUrl: organization.instagram_url || "",
      linkedinUrl: organization.linkedin_url || "",
    },
  });

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    form.reset();
    setIsEditing(false);
  };

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
      form.reset({ ...data });
      setIsEditing(false);
    }

    if (res.error) {
      toast.error(res.error);
    }
  };

  // Import the editable components
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Global Edit Button (only shown to organization owners) */}
          {isOwner && !isEditing && (
            <div className="container mx-auto px-4 py-4 flex justify-end sticky top-0 z-10 bg-white bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-90 shadow-sm">
              <Button
                onClick={startEditing}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Edit2 className="mr-1 h-4 w-4" />
                Edit Organization Information
              </Button>
            </div>
          )}

          {/* Form Action Buttons (only shown when editing) */}
          {isOwner && isEditing && (
            <div className="container mx-auto px-4 py-4 flex justify-end gap-2 sticky top-0 z-10 bg-white bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-90 shadow-sm">
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={form.formState.isSubmitting}
              >
                <Save className="mr-1 h-4 w-4" />
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={cancelEditing}
                disabled={form.formState.isSubmitting}
              >
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}

          {/* Organization Header */}
          <EditableHeaderSection
            organization={organization}
            isEditing={isEditing}
            form={form}
          />

          <div className="container mx-auto px-4">
            {/* Statistics Cards */}
            <OrganizationStats stats={stats} />

            {/* Organization Details */}
            <EditableDetailsSection
              organization={organization}
              isEditing={isEditing}
              form={form}
            />

            {/* Projects Section - This doesn't need to be editable */}
            <ProjectsSection projects={projects} />
          </div>
        </form>
      </Form>
    </div>
  );
}
