"use server";

import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

import {
  createServerSupabaseClient,
  getOrganizationProfile,
} from "@/src/lib/supabase/server";
import { PUBLIC_IMAGE_BUCKET_NAME } from "@/src/lib/constants";
import { optimizeImageToWebp } from "@/src/lib/image-optimization";
import { createProjectSchema } from "@/src/schemas/project";
import { ActionResponse } from "@/src/types/actions-types";

/**
 * Creates a new project for the currently authenticated organization.  This
 * server action validates incoming form data, uploads an optional
 * background image to Supabase storage, inserts the new project into the
 * `projects` table and triggers a path revalidation so that the new
 * project appears immediately on the organization page.  A slug is
 * generated from the title with a unique suffix to avoid collisions.
 *
 * @param formData - The multipart form data from the client
 * @returns An ActionResponse indicating success or failure
 */
export async function createProject(formData: FormData): Promise<ActionResponse> {
  try {
    const supabase = await createServerSupabaseClient();
    const organization = await getOrganizationProfile();

    if (!organization) {
      return {
        error: "You must be logged in as an organization to create a project.",
        success: false,
      };
    }

    // Extract primitive values from the form data
    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      goalAmount: formData.get("goalAmount"),
      beneficiaryType: formData.get("beneficiaryType"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
    };

    // Validate using zod; collect all errors but send generic message back
    const parsed = createProjectSchema.safeParse(payload);
    if (!parsed.success) {
      const errors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(issue.message);
      });
      console.error("Validation errors creating project:", errors);
      return {
        error:
          "There were validation errors. Please check your input and try again.",
        success: false,
      };
    }

    const data = parsed.data;
    // Generate a slug from the title.  Replace non‑alphanumeric characters
    // with hyphens, collapse multiple hyphens and trim leading/trailing ones.
    // Generate the base slug from the title
    const slugBase = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check whether this slug (or numbered variants) already exists for this organization
    let slugCandidate = slugBase;
    let suffix = 1;
    while (true) {
      const { data: existing } = await supabase
        .from("projects")
        .select("slug", { head: true }) // head: true means we only care if a row exists
        .eq("organization_user_id", organization.user_id)
        .eq("slug", slugCandidate)
        .maybeSingle();

      if (!existing) {
        break; // slugCandidate is available
      }

      suffix += 1;
      slugCandidate = `${slugBase}-${suffix}`;
    }

    const slug = slugCandidate;
    // const slugSuffix = uuidv4().split("-")[0]; <-- uuid can be attached as a suffix to the slug to handle unique project slugs
    // const slug = `${slugBase}`;

    // Convert optional numeric fields
    let goalAmountNumber: number | null = null;
    if (data.goalAmount) {
      const parsedNumber = Number(data.goalAmount);
      goalAmountNumber = isNaN(parsedNumber) ? null : parsedNumber;
    }

    // Convert date fields to ISO format (YYYY-MM-DD) or null
    const startDate = data.startDate
      ? new Date(data.startDate).toISOString().split("T")[0]
      : null;
    const endDate = data.endDate
      ? new Date(data.endDate).toISOString().split("T")[0]
      : null;

    // Prepare background image upload if provided
    let backgroundImagePath: string | null = null;
    const file = formData.get("file");
    if (file && file instanceof Blob && file.size > 0) {
      // Convert Blob to Buffer
      const arrayBuffer = await (file as Blob).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      try {
        const { optimizedBuffer } = await optimizeImageToWebp(buffer, {
          idealWidth: 1920,
          idealHeight: 1080,
          maxSizeKB: 500,
          initialQuality: 80,
          minQuality: 10,
        });

        const filename = `${uuidv4()}-${slug}.webp`;
        const { error: uploadError } = await supabase.storage
          .from(PUBLIC_IMAGE_BUCKET_NAME)
          .upload(filename, optimizedBuffer, {
            contentType: "image/webp",
          });
        if (uploadError) {
          console.error("Error uploading project background image:", uploadError);
          return {
            error: "Failed to upload project background image.",
            success: false,
          };
        }
        backgroundImagePath = filename;
      } catch (err) {
        console.error("Image optimization failed:", err);
        return {
          error: "Failed to process project background image.",
          success: false,
        };
      }
    }

    // Insert new project record
    const { error: insertError } = await supabase.from("projects").insert({
      organization_user_id: organization.user_id,
      title: data.title,
      description: data.description,
      goal_amount: goalAmountNumber,
      beneficiary_type_id: data.beneficiaryType,
      start_date: startDate,
      end_date: endDate,
      project_background_image: backgroundImagePath,
      slug,
    });
    if (insertError) {
      console.error("Database insert error creating project:", insertError);
      return {
        error: "Failed to create project. Please try again.",
        success: false,
      };
    }

    // Revalidate the organization page to show the new project immediately
    revalidatePath(`/organizations/${organization.slug}`);

    return {
      success: true,
      message: "Project created successfully.",
    };
  } catch (err) {
    console.error("Unexpected error creating project:", err);
    return {
      error: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
}