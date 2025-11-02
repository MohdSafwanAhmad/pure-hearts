"use client";

import Link from "next/link";
import { updateOrganization } from "@/src/actions/organization";
import { EditableDetailsSection } from "@/src/components/page/organization/editable-details-section";
import { EditableHeaderSection } from "@/src/components/page/organization/editable-header-section";
import { ProjectsSection } from "@/src/components/page/organization/projects-section";
import { OrganizationStats } from "@/src/components/page/organization/stats-section";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import {
  TUpdateOrganizationSchema,
  updateOrganizationSchema,
} from "@/src/schemas/organization";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface OrganizationPageClientProps {
  organization: {
    user_id: string;
    organization_name: string;
    organization_phone: string;
    contact_person_name: string;
    contact_person_email: string;
    contact_person_phone: string;
    country: string;
    state: string;
    city: string;
    address: string;
    mission_statement: string;
    project_areas: {
      id: number;
      label: string;
    }[];
    website_url: string | null;
    facebook_url: string | null;
    twitter_url: string | null;
    instagram_url: string | null;
    linkedin_url: string | null;
    logo: string | null;
    slug: string | null;
  };
  isOwner: boolean;
  stats: {
    title: string;
    stat: string;
    description: string;
  }[];
  projects: {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    completionDate: Date | undefined;
    projectId: string;
    projectBackgroundImage: string;
    slug: string;
    goal_amount: number | null;
    collected: number;
    percent: number;
    organizationSlug: string;
    beneficiaryCount: number;
    organization: {
      name: string;
      organizationSlug: string;
    };
  }[];
  projectAreas: { value: number; label: string }[];
}

export function OrganizationPageClient({
  organization,
  isOwner,
  stats,
  projects,
  projectAreas,
}: OrganizationPageClientProps) {
  const [isEditing, setIsEditing] = useState(false);

  const projectAreasIds = organization.project_areas.map((area) => area.id);

  const form = useForm<TUpdateOrganizationSchema>({
    resolver: zodResolver(updateOrganizationSchema),
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
      projectAreas: projectAreasIds,
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

  const onSubmit = async (data: TUpdateOrganizationSchema) => {
    const res = await updateOrganization(data);

    if (res.success) {
      toast.success("Organization information updated successfully");
      form.reset({ ...data });
      setIsEditing(false);
    }

    if (res.error) {
      toast.error(res.error);
    }
  };

  // Button to create a project – passed into ProjectsSection so it shows next to the toggle
  const addProjectButton = isOwner ? (
    <Button asChild>
      <Link href={`/organizations/${organization.slug}/projects/new`}>
        Add Project
      </Link>
    </Button>
  ) : null;

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Global Edit Button (only shown to organization owners) */}
          {isOwner && !isEditing && (
            <div className="container mx-auto px-4 py-4 flex justify-end sticky top-0 ">
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
            <div className="container mx-auto px-4 py-4 flex justify-end gap-2 sticky top-0 ">
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
              projectAreas={projectAreas}
            />

            {/* Projects Section - shows Add Project button beside the toggle */}
            <ProjectsSection
              projects={projects}
              addProjectButton={addProjectButton}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
