"use server";

import { redirect } from "next/navigation";

import { generateUniqueSlug } from "@/src/lib/slugifier";
import { createAnonymousServerSupabaseClient } from "@/src/lib/supabase/server";
import { createOrganizationSchema } from "@/src/schemas/organization";
import { ActionResponse } from "@/src/types/actions-types";

export async function signupAsOrganization(
  formData: FormData
): Promise<ActionResponse> {
  // 1) Create supabase anonymous server side client, like that it can handle the cookies
  const supabase = await createAnonymousServerSupabaseClient();

  // 2) Validate form data
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

  const result = createOrganizationSchema.safeParse(dataObj);

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

  // 3) Create unique slug
  let slug: string;
  try {
    slug = await generateUniqueSlug(
      result.data.organizationName,
      "organizations"
    );
  } catch {
    return {
      error:
        "An organization with this name already exists. Please try again with a different name.",
      success: false,
    };
  }

  // 4) Sign up the user (this will send the OTP email)
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
      error: "An error occurred while sending the OTP email. Please try again.",
      success: false,
    };
  }

  // 5) Redirect with email data
  return redirect(
    `/otp?email=${encodeURIComponent(result.data.organizationEmail)}`
  );
}
