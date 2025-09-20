"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";

const updateOrganizationSchema = z.object({
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

export async function updateOrganization(
  prevState: unknown,
  formData: FormData
): Promise<{
  errors: Partial<
    Record<keyof z.infer<typeof updateOrganizationSchema>, string[]>
  > & {
    _form?: string[];
  };
  success?: boolean;
}> {
  const supabase = await createServerSupabaseClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      errors: {
        _form: ["You must be logged in to update organization information"],
      },
    };
  }

  // Parse form data
  const formDataObj = {
    organizationName: formData.get("organizationName") as string,
    organizationPhone: formData.get("organizationPhone") as string,
    country: formData.get("country") as string,
    city: formData.get("city") as string,
    address: formData.get("address") as string,
    state: formData.get("state") as string,
    contactPersonName: formData.get("contactPersonName") as string,
    contactPersonEmail: formData.get("contactPersonEmail") as string,
    contactPersonPhone: formData.get("contactPersonPhone") as string,
    missionStatement: formData.get("missionStatement") as string,
    projectAreas: formData.getAll("projectAreas") as string[],
    websiteUrl: formData.get("websiteUrl") as string,
    facebookUrl: formData.get("facebookUrl") as string,
    twitterUrl: formData.get("twitterUrl") as string,
    instagramUrl: formData.get("instagramUrl") as string,
    linkedinUrl: formData.get("linkedinUrl") as string,
  };

  // Validate data
  const result = updateOrganizationSchema.safeParse(formDataObj);

  if (!result.success) {
    const errors: Record<string, string[]> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(issue.message);
    });
    return { errors };
  }

  // Update organization in database
  const { error: updateError } = await supabase
    .from("organizations")
    .update({
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
      website_url: result.data.websiteUrl || null,
      facebook_url: result.data.facebookUrl || null,
      twitter_url: result.data.twitterUrl || null,
      instagram_url: result.data.instagramUrl || null,
      linkedin_url: result.data.linkedinUrl || null,
    })
    .eq("user_id", user.id);

  if (updateError) {
    console.error("Update error:", updateError);
    return {
      errors: {
        _form: ["Failed to update organization information. Please try again."],
      },
    };
  }

  revalidatePath("/dashboard/organization/update");
  return {
    errors: {},
    success: true,
  };
}
