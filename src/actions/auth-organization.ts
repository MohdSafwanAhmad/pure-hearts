"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { generateUniqueSlug } from "@/src/lib/slugifier";

const signupAsOrganizationAuthSchema = z.object({
  organizationEmail: z.email("Please enter a valid organization email address"),
  organizationName: z
    .string()
    .min(2, "Organization name must be at least 2 characters long")
    .max(100, "Organization name must be less than 100 characters"),
  organizationPhone: z
    .string()
    .min(1, "Organization phone number is required")
    .regex(
      /^\+\d{11}$/,
      "Please enter a valid phone number in format +15554443333"
    ),
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
      /^\+\d{11}$/,
      "Please enter a valid phone number in format +15554443333"
    ),
  missionStatement: z
    .string()
    .min(10, "Please provide a mission statement with at least 10 characters")
    .max(1000, "Mission statement must be less than 1000 characters"),
  projectAreas: z
    .array(z.string())
    .min(1, "Please select at least one area your organization works in"),
  websiteUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.url().safeParse(val).success, {
      message:
        "Please enter a valid website URL (must start with http:// or https://)",
    }),
  facebookUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.url().safeParse(val).success, {
      message:
        "Please enter a valid Facebook URL (must start with http:// or https://)",
    }),
  twitterUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.url().safeParse(val).success, {
      message:
        "Please enter a valid Twitter URL (must start with http:// or https://)",
    }),
  instagramUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.url().safeParse(val).success, {
      message:
        "Please enter a valid Instagram URL (must start with http:// or https://)",
    }),
  linkedinUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.url().safeParse(val).success, {
      message:
        "Please enter a valid LinkedIn URL (must start with http:// or https://)",
    }),
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

  // Parse project areas from form data
  const projectAreas = formData
    .getAll("projectAreas")
    .filter(Boolean) as string[];

  const result = signupAsOrganizationAuthSchema.safeParse({
    organizationEmail: formData.get("organizationEmail"),
    organizationName: formData.get("organizationName"),
    organizationPhone: formData.get("organizationPhone"),
    country: formData.get("country"),
    city: formData.get("city"),
    address: formData.get("address"),
    state: formData.get("state"),
    contactPersonName: formData.get("contactPersonName"),
    contactPersonEmail: formData.get("contactPersonEmail"),
    contactPersonPhone: formData.get("contactPersonPhone"),
    missionStatement: formData.get("missionStatement"),
    projectAreas: projectAreas.length > 0 ? projectAreas : [],
    websiteUrl: formData.get("websiteUrl") || undefined,
    facebookUrl: formData.get("facebookUrl") || undefined,
    twitterUrl: formData.get("twitterUrl") || undefined,
    instagramUrl: formData.get("instagramUrl") || undefined,
    linkedinUrl: formData.get("linkedinUrl") || undefined,
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  let slug: string;
  try {
    slug = await generateUniqueSlug(
      result.data.organizationName,
      "organizations"
    );
  } catch {
    return {
      errors: {
        organizationName: [
          "An organization with this name already exists. Please choose a different name.",
        ],
      },
    };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: result.data.organizationEmail,
    options: {
      data: {
        user_type: "organization",
        organization_name: result.data.organizationName,
        organization_phone: result.data.organizationPhone,
        country: result.data.country,
        city: result.data.city,
        address: result.data.address,
        state: result.data.state,
        contact_person_name: result.data.contactPersonName,
        contact_person_email: result.data.contactPersonEmail,
        contact_person_phone: result.data.contactPersonPhone,
        mission_statement: result.data.missionStatement,
        project_areas: result.data.projectAreas,
        website_url: result.data.websiteUrl,
        facebook_url: result.data.facebookUrl,
        twitter_url: result.data.twitterUrl,
        instagram_url: result.data.instagramUrl,
        linkedin_url: result.data.linkedinUrl,
        slug: slug,
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
