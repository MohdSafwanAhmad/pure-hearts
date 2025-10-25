"use client";

import { updateOrganization } from "@/src/actions/organization";
import { goToStripeDashboard, linkStripeAccount } from "@/src/actions/payment";
import { EditableDetailsSection } from "@/src/components/page/organization/editable-details-section";
import { EditableHeaderSection } from "@/src/components/page/organization/editable-header-section";
import { ProjectsSection } from "@/src/components/page/organization/projects-section";
import { OrganizationStats } from "@/src/components/page/organization/stats-section";
import { StripeVerificationAlert } from "@/src/components/page/organization/stripe-verification-alert";
import { Button } from "@/src/components/ui/button";
import { Form } from "@/src/components/ui/form";
import {
  TUpdateOrganizationSchema,
  updateOrganizationSchema,
} from "@/src/schemas/organization";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Edit2, Loader2, Save, X } from "lucide-react";
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
    stripe_account_id: string | null;
    is_stripe_account_connected?: boolean;
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
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

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

  const handleSetupPayments = async () => {
    setIsLoadingPayment(true);
    const result = await linkStripeAccount();
    if (!result.success) {
      toast.error("Failed to set up payment information");
    }
    setIsLoadingPayment(false);
  };

  const handleGoToDashboard = async () => {
    setIsLoadingDashboard(true);
    try {
      await goToStripeDashboard();
    } catch {
      toast.error("Failed to open Stripe dashboard");
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  // Import the editable components
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Stripe Verification Alert - Only show if owner, has stripe account but not connected */}
          {isOwner &&
            organization.stripe_account_id &&
            !organization.is_stripe_account_connected && (
              <StripeVerificationAlert
                organizationName={organization.organization_name}
              />
            )}

          {/* Global Edit Button (only shown to organization owners) */}
          {isOwner && !isEditing && (
            <div className="container mx-auto px-4 py-4 flex justify-end gap-2  top-0 ">
              {organization.is_stripe_account_connected ? (
                <Button
                  onClick={handleGoToDashboard}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  disabled={isLoadingDashboard}
                >
                  {isLoadingDashboard ? (
                    <>
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      Opening...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-1 h-4 w-4" />
                      Manage Payments Information
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleSetupPayments}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  disabled={isLoadingPayment}
                >
                  {isLoadingPayment ? (
                    <>
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      Setting Up...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-1 h-4 w-4" />
                      Set Up Payments
                    </>
                  )}
                </Button>
              )}
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

            {/* Projects Section - This is not editable */}
            <ProjectsSection projects={projects} />
          </div>
        </form>
      </Form>
    </div>
  );
}
