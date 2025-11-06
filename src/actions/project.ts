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

/**
 * Updates an existing project belonging to the currently authenticated organization.
 * This action validates incoming form data, uploads an optional new background
 * image, updates the project record and revalidates the affected pages.  The
 * slug for the project remains unchanged to avoid breaking existing links.
 *
 * @param projectId - The UUID of the project to update
 * @param formData - The multipart form data from the client containing
 *   updated project fields
 * @returns An ActionResponse indicating success or failure
 */
export async function updateProject(
  projectId: string,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const supabase = await createServerSupabaseClient();
    const organization = await getOrganizationProfile();

    if (!organization) {
      return {
        error: "You must be logged in as an organization to update a project.",
        success: false,
      };
    }

    // Fetch the existing project and verify ownership
    const { data: existingProject, error: selectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .maybeSingle();
    if (selectError || !existingProject) {
      if (selectError) {
        console.error("updateProject: error fetching existing project", selectError.message);
      }
      return {
        error: "Project not found.",
        success: false,
      };
    }
    if (existingProject.organization_user_id !== organization.user_id) {
      return {
        error: "You are not authorized to update this project.",
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

    // Validate using zod; reuse createProjectSchema for field validation
    const parsed = createProjectSchema.safeParse(payload);
    if (!parsed.success) {
      // Log all validation errors but return a generic message
      const errors: Record<string, string[]> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      });
      console.error("Validation errors updating project:", errors);
      return {
        error: "There were validation errors. Please check your input and try again.",
        success: false,
      };
    }

    const data = parsed.data;

    // Convert numeric fields
    let goalAmountNumber: number | null = null;
    if (data.goalAmount) {
      const parsedNumber = Number(data.goalAmount);
      goalAmountNumber = isNaN(parsedNumber) ? null : parsedNumber;
    }

    // Convert date fields to ISO format (YYYY‑MM‑DD) or null
    const startDate = data.startDate
      ? new Date(data.startDate).toISOString().split("T")[0]
      : null;
    const endDate = data.endDate
      ? new Date(data.endDate).toISOString().split("T")[0]
      : null;

    // Handle background image upload; if a new file is provided, replace the old one
    let backgroundImagePath: string | null = existingProject.project_background_image ?? null;
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
        const filename = `${uuidv4()}-${existingProject.slug}.webp`;
        const { error: uploadError } = await supabase.storage
          .from(PUBLIC_IMAGE_BUCKET_NAME)
          .upload(filename, optimizedBuffer, {
            contentType: "image/webp",
          });
        if (uploadError) {
          console.error("updateProject: error uploading new background image", uploadError);
          return {
            error: "Failed to upload project background image.",
            success: false,
          };
        }
        // Remove the old image if it exists
        if (existingProject.project_background_image) {
          await supabase.storage
            .from(PUBLIC_IMAGE_BUCKET_NAME)
            .remove([existingProject.project_background_image]);
        }
        backgroundImagePath = filename;
      } catch (err) {
        console.error("updateProject: image optimization failed", err);
        return {
          error: "Failed to process project background image.",
          success: false,
        };
      }
    }

    // Perform the update; slug remains unchanged
    const { error: updateError } = await supabase
      .from("projects")
      .update({
        title: data.title,
        description: data.description,
        goal_amount: goalAmountNumber,
        beneficiary_type_id: data.beneficiaryType,
        start_date: startDate,
        end_date: endDate,
        project_background_image: backgroundImagePath,
      })
      .eq("id", projectId);
    if (updateError) {
      console.error("updateProject: database update error", updateError.message);
      return {
        error: "Failed to update project. Please try again.",
        success: false,
      };
    }

    // Revalidate the organization page and the specific project page to reflect updates
    revalidatePath(`/organizations/${organization.slug}`);
    revalidatePath(`/campaigns/${organization.slug}/${existingProject.slug}`);

    return {
      success: true,
      message: "Project updated successfully.",
    };
  } catch (err) {
    console.error("updateProject: unexpected error", err);
    return {
      error: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
}

/**
 * Deletes a project belonging to the currently authenticated organization.  This
 * performs a soft delete by removing the project record and its associated
 * background image from storage.  Donation records remain untouched.  After
 * deletion, the organization page is revalidated so that the project list
 * refreshes.
 *
 * @param projectId - The UUID of the project to delete
 * @returns An ActionResponse indicating success or failure
 */
export async function deleteProject(projectId: string): Promise<ActionResponse> {
  try {
    const supabase = await createServerSupabaseClient();
    const organization = await getOrganizationProfile();
    if (!organization) {
      return {
        error: "You must be logged in as an organization to delete a project.",
        success: false,
      };
    }
    // Fetch the project to verify ownership and get slug for revalidation
    const { data: existingProject, error: selectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .maybeSingle();
    if (selectError || !existingProject) {
      if (selectError) {
        console.error("deleteProject: error fetching existing project", selectError.message);
      }
      return {
        error: "Project not found.",
        success: false,
      };
    }
    if (existingProject.organization_user_id !== organization.user_id) {
      return {
        error: "You are not authorized to delete this project.",
        success: false,
      };
    }
    // Remove background image if present
    if (existingProject.project_background_image) {
      await supabase.storage
        .from(PUBLIC_IMAGE_BUCKET_NAME)
        .remove([existingProject.project_background_image]);
    }
    // Instead of physically deleting the record (which would cascade due to
    // foreign key constraints), perform a soft delete by marking the record
    // with a deleted_at timestamp.  This preserves donation records and
    // allows you to filter out deleted projects from queries.  Note: your
    // database must have a `deleted_at` column on the projects table for this
    // to work.  If it does not exist, please add it via a migration.
    const deletedAt = new Date().toISOString();
    const { error: deleteError } = await supabase
      .from("projects")
      .update({ deleted_at: deletedAt })
      .eq("id", projectId);
    if (deleteError) {
      console.error("deleteProject: database update (soft delete) error", deleteError.message);
      return {
        error: "Failed to delete project. Please try again.",
        success: false,
      };
    }
    // Revalidate organization page (project list) and old project path
    revalidatePath(`/organizations/${organization.slug}`);
    revalidatePath(`/campaigns/${organization.slug}/${existingProject.slug}`);
    return {
      success: true,
      message: "Project deleted successfully.",
    };
  } catch (err) {
    console.error("deleteProject: unexpected error", err);
    return {
      error: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
}