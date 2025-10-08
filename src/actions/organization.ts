"use server";

import {
  createAnonymousServerSupabaseClient,
  getOrganizationProfile,
} from "@/src/lib/supabase/server";
import { organizationSchema } from "@/src/schemas/organization";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { PUBLIC_IMAGE_BUCKET_NAME } from "@/src/lib/constants";
import { optimizeImageToWebp } from "@/src/lib/image-optimization";

type Response = {
  message?: string;
  error?: string;
  success: boolean;
};

/**
 * Server action to update organization information text fields
 * @param formData - FormData containing the organization information text fields
 */
export async function updateOrganization(
  formData: FormData
): Promise<Response> {
  const supabase = await createAnonymousServerSupabaseClient();

  // 1) Get current user
  const organization = await getOrganizationProfile();

  if (!organization) {
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
    .eq("user_id", organization.user_id);

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

/**
 * Server action to update an organization's logo
 * This is just a placeholder that logs information about the uploaded file
 * In the future, this will upload to Supabase, delete the old file, and perform optimization
 *
 * @param formData - FormData containing the new organization logo file
 */
export async function updateOrganizationLogo(
  formData: FormData
): Promise<Response> {
  try {
    // 1) Get current user
    const organization = await getOrganizationProfile();

    if (!organization) {
      return {
        error: "You must be logged in to update organization information",
        success: false,
      };
    }

    // Extract the file from the FormData
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return { error: "No file uploaded", success: false };
    }

    // Convert Blob to Buffer for Node.js compatibility
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { optimizedBuffer } = await optimizeImageToWebp(buffer, {
      idealWidth: 1024,
      idealHeight: 1024,
      maxSizeKB: 100,
      minQuality: 10,
      initialQuality: 80,
    });

    // 2) Upload the new file to Supabase storage
    const filename = `${uuidv4()}-${organization.slug}-logo.${"webp"}`;

    // 3) Get the public URL of the uploaded file
    const supabase = await createAnonymousServerSupabaseClient();
    const { data, error } = await supabase.storage
      .from(PUBLIC_IMAGE_BUCKET_NAME)
      .upload(filename, optimizedBuffer, {
        contentType: "image/webp",
      });

    if (error) {
      const optimizedBufferSizeKB = Math.round(optimizedBuffer.length / 1024);
      console.error(
        "Error uploading file to Supabase:",
        error,
        optimizedBufferSizeKB,
        "KB"
      );
      return { error: "Failed to upload logo", success: false };
    }

    // 4) Delete the old logo file if it exists
    if (organization.logo) {
      const { error: deleteError } = await supabase.storage
        .from(PUBLIC_IMAGE_BUCKET_NAME)
        .remove([organization.logo]);

      if (deleteError) {
        console.error("Error deleting old logo:", deleteError);
        await supabase.storage
          .from(PUBLIC_IMAGE_BUCKET_NAME)
          .remove([data.path]);

        return { error: "Failed to delete old logo", success: false };
      }
    }

    // 4. Update the organization record with the new logo URL
    const { error: updateError } = await supabase
      .from("organizations")
      .update({ logo: data.path })
      .eq("user_id", organization.user_id);

    // delete the uploaded file if the database update fails
    if (updateError) {
      console.error("Error updating organization logo:", updateError);

      await supabase.storage.from(PUBLIC_IMAGE_BUCKET_NAME).remove([data.path]);

      return { error: "Failed to update organization logo", success: false };
    }

    revalidatePath(`/`);

    return {
      success: true,
      message:
        "Logo information received successfully. Supabase integration pending.",
    };
  } catch (error) {
    console.error("Error in updateOrganizationLogo:", error);
    return {
      error: "Failed to process logo update",
      success: false,
    };
  }
}
