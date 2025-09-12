"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createServerSupabaseClient } from "@/src/lib/supabase/server";

const signupAsOrganizationAuthSchema = z.object({
  organizationEmail: z.email("Please enter a valid organization email address"),
  organizationName: z
    .string()
    .min(2, "Organization name must be at least 2 characters long")
    .max(100, "Organization name must be less than 100 characters"),
  legalStatus: z.enum(["NonProfit", "Charity", "NGO", "Other"], {
    message: "Please select your organization's legal status",
  }),
  country: z.string().min(1, "Country selection is required"),
  city: z
    .string()
    .min(2, "City name must be at least 2 characters long")
    .max(50, "City name must be less than 50 characters"),
  address: z
    .string()
    .min(5, "Please provide your complete street address")
    .max(200, "Address must be less than 200 characters"),
  state: z.string().min(1, "Please select your province or territory"),
  contactPersonName: z
    .string()
    .min(2, "Contact person's name must be at least 2 characters long")
    .max(100, "Contact person's name must be less than 100 characters"),
  contactPersonEmail: z.email(
    "Please enter a valid email address for the contact person"
  ),
  contactPersonPhone: z
    .string()
    .min(1, "Contact phone number is required")
    .regex(
      /^(\+?1[-.\s]?)?(\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})$/,
      "Please enter a valid North American phone number (e.g., +1 416 555 0123 or 416-555-0123)"
    ),
  missionStatement: z
    .string()
    .min(10, "Please provide a mission statement with at least 10 characters")
    .max(1000, "Mission statement must be less than 1000 characters"),
  projectAreas: z
    .array(z.string())
    .min(1, "Please select at least one area your organization works in"),
  geographicServed: z
    .array(z.string())
    .min(
      1,
      "Please specify at least one geographic area your organization serves"
    ),
  websiteUrl: z
    .string()
    .min(1, "Organization website URL is required")
    .url(
      "Please enter a valid website URL (must start with http:// or https://)"
    ),
  facebookUrl: z
    .string()
    .min(1, "Facebook page URL is required")
    .url(
      "Please enter a valid Facebook URL (must start with http:// or https://)"
    ),
  twitterUrl: z
    .string()
    .min(1, "Twitter profile URL is required")
    .url(
      "Please enter a valid Twitter URL (must start with http:// or https://)"
    ),
  instagramUrl: z
    .string()
    .min(1, "Instagram profile URL is required")
    .url(
      "Please enter a valid Instagram URL (must start with http:// or https://)"
    ),
  linkedinUrl: z
    .string()
    .min(1, "LinkedIn page URL is required")
    .url(
      "Please enter a valid LinkedIn URL (must start with http:// or https://)"
    ),
});

export async function signupAsOrganization(
  prevState: unknown,
  formData: FormData
): Promise<{
  errors: Partial<
    Record<keyof z.infer<typeof signupAsOrganizationAuthSchema>, string[]>
  > & {
    _form?: string[];
  };
}> {
  const supabase = await createServerSupabaseClient();

  // Parse project areas and geographic areas from form data
  const projectAreas = formData
    .getAll("projectAreas")
    .filter(Boolean) as string[];
  const geographicServed = formData
    .getAll("geographicServed")
    .filter(Boolean) as string[];

  // Build social media links object
  const socialMediaLinks = {
    facebook: (formData.get("facebookUrl") as string) || "",
    twitter: (formData.get("twitterUrl") as string) || "",
    instagram: (formData.get("instagramUrl") as string) || "",
    linkedin: (formData.get("linkedinUrl") as string) || "",
  };

  const result = signupAsOrganizationAuthSchema.safeParse({
    organizationEmail: formData.get("organizationEmail"),
    organizationName: formData.get("organizationName"),
    legalStatus: formData.get("legalStatus"),
    country: formData.get("country"),
    city: formData.get("city"),
    address: formData.get("address"),
    state: formData.get("state"),
    contactPersonName: formData.get("contactPersonName"),
    contactPersonEmail: formData.get("contactPersonEmail"),
    contactPersonPhone: formData.get("contactPersonPhone"),
    missionStatement: formData.get("missionStatement"),
    projectAreas: projectAreas.length > 0 ? projectAreas : [],
    geographicServed: geographicServed.length > 0 ? geographicServed : [],
    websiteUrl: formData.get("websiteUrl"),
    facebookUrl: formData.get("facebookUrl"),
    twitterUrl: formData.get("twitterUrl"),
    instagramUrl: formData.get("instagramUrl"),
    linkedinUrl: formData.get("linkedinUrl"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: result.data.organizationEmail,
    options: {
      data: {
        user_type: "organization",
        organization_name: result.data.organizationName,
        legal_status: result.data.legalStatus,
        country: result.data.country,
        city: result.data.city,
        address: result.data.address,
        state: result.data.state,
        contact_person: {
          name: result.data.contactPersonName,
          email: result.data.contactPersonEmail,
          phone: result.data.contactPersonPhone,
        },
        mission_statement: result.data.missionStatement,
        project_areas: result.data.projectAreas,
        geographic_served: result.data.geographicServed,
        website_url: result.data.websiteUrl,
        social_media_links: socialMediaLinks,
      },
    },
  });

  if (error) {
    return {
      errors: {
        _form: ["Oops! Something went wrong. Please try again."],
      },
    };
  }

  // Redirect with email data
  return redirect(
    `/otp?email=${encodeURIComponent(result.data.organizationEmail)}`
  );
}
