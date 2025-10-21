/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { JSX, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";

import { updateOrganization } from "@/src/actions/organization";
import { EditableDetailsSection } from "@/src/components/page/organization/editable-details-section";
import { EditableHeaderSection } from "@/src/components/page/organization/editable-header-section";
import { ProjectsSection } from "@/src/components/page/organization/projects-section";
import { OrganizationStats } from "@/src/components/page/organization/stats-section";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import { TUpdateOrganizationSchema } from "@/src/schemas/organization";
import { updateOrganizationSchema } from "@/src/schemas/organization";

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
    project_areas: { id: number; label: string }[];
    website_url: string | null;
    facebook_url: string | null;
    twitter_url: string | null;
    instagram_url: string | null;
    linkedin_url: string | null;
    logo: string | null;
    slug: string | null; // source may be null
    is_verified?: boolean | null; // source may be missing
  };
  isOwner: boolean;
  stats: { title: string; stat: string; description: string }[];
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
    organization: { name: string; organizationSlug: string };
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

  // Normalize slug to non-null string once
  const normalizedSlug: string =
    organization.slug ??
    (organization as unknown as { organizationSlug?: string })
      ?.organizationSlug ??
    "";

  // Build a safe org object (slug: string, is_verified: boolean|null)
  const safeOrg: typeof organization & {
    slug: string;
    is_verified: boolean | null;
  } = {
    ...organization,
    slug: normalizedSlug,
    is_verified:
      (organization as { is_verified?: boolean | null }).is_verified ?? false,
  };

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

  const startEditing = () => setIsEditing(true);
  const cancelEditing = () => {
    form.reset();
    setIsEditing(false);
  };

  // Convert JSON -> FormData because updateOrganization expects FormData
  function toFormData(obj: Record<string, unknown>): FormData {
    const fd = new FormData();
    Object.entries(obj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => fd.append(key, String(v)));
      } else if (value !== undefined && value !== null) {
        fd.append(key, String(value));
      } else {
        fd.append(key, "");
      }
    });
    return fd;
  }

  const onSubmit = async (data: TUpdateOrganizationSchema) => {
    const res = await updateOrganization(toFormData(data));
    if (res.success) {
      toast.success("Organization information updated successfully");
      form.reset({ ...data });
      setIsEditing(false);
    } else if (res.error) {
      toast.error(res.error);
    }
  };

  // ---- TEMP TYPE SHIMS (so child Prop types don't block you during merge) ----
  // If EditableHeaderSection/EditableDetailsSection props are slightly different on master,
  // these local aliases relax prop type checking at the call site.
  const Header = EditableHeaderSection as unknown as (p: any) => JSX.Element;
  const Details = EditableDetailsSection as unknown as (p: any) => JSX.Element;
  // ---------------------------------------------------------------------------

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Global Edit Button (only shown to organization owners) */}
          {isOwner && !isEditing && (
            <div className="container mx-auto px-4 py-4 flex justify-end sticky top-0">
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
            <div className="container mx-auto px-4 py-4 flex justify-end gap-2 sticky top-0">
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

          {/* Organization Header — needs slug:string and is_verified:boolean|null */}
          <Header organization={safeOrg} isEditing={isEditing} form={form} />

          <div className="container mx-auto px-4">
            {/* Statistics Cards */}
            <OrganizationStats stats={stats} />

            {/* Organization Details — some branches expect different prop names; shimmed above */}
            <Details
              organization={safeOrg}
              isEditing={isEditing}
              form={form}
              projectAreas={projectAreas}
            />

            {/* Projects Section (+ Add Project button uses slug + ownership) */}
            <ProjectsSection
              projects={projects}
              organizationSlug={normalizedSlug}
              isOwnOrganization={isOwner}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}

export default OrganizationPageClient;
