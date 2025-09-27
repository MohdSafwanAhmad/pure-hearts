"use server";

import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { organizationSchema } from "@/src/schemas/organization";
import { revalidatePath } from "next/cache";

type Response = {
  message?: string;
  error?: string;
  success: boolean;
};

export async function updateOrganization(
  formData: FormData
): Promise<Response> {
  const supabase = await createServerSupabaseClient();

  // 1) Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: "You must be logged in to update organization information",
      success: false,
    };
  }

  // 2) Validate data
  const dataObj = Object.fromEntries(formData.entries()) as Record<
    string,
    string | string[] | undefined
  >;
  if (typeof dataObj.projectAreas === "string") {
    try {
      dataObj.projectAreas = JSON.parse(dataObj.projectAreas);
    } catch {
      dataObj.projectAreas = [];
    }
  }

  const result = organizationSchema.safeParse(dataObj);

  if (!result.success) {
    const errors: Record<string, string[]> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(issue.message);
    });

    console.error("Validation errors:", errors);

    return {
      error:
        "There were validation errors. Please check your input and try again.",
      success: false,
    };
  }

  // 3) Update organization in database
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
      error:
        "An error occurred while updating the organization. Please try again.",
      success: false,
    };
  }

  revalidatePath("/");

  return {
    message: "Organization information updated successfully.",
    success: true,
  };
}
