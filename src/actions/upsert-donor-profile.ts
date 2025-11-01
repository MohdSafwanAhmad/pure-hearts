"use server";

import { revalidatePath } from "next/cache";
import {
  createAnonymousServerSupabaseClient,
  getDonorProfile,
} from "@/src/lib/supabase/server";
import { buildDonorInsertRow } from "@/src/lib/utils";
import { donorProfileSchema } from "@/src/schemas/donor";

/** Payload your UI sends to upsert - user_id removed for security */
export type UpsertDonorPayload = {
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  profile_completed?: boolean | null;
};

/** Result shape your UI already expects */
export type ActionResult =
  | { ok: true; profile_completed: boolean }
  | { ok: false; error: string };

/**
 * Upsert (insert or update) the donor's profile by user_id.
 */
export async function upsertDonorProfile(
  payload: UpsertDonorPayload
): Promise<ActionResult> {
  const donorProfile = await getDonorProfile();

  if (!donorProfile) {
    return { ok: false, error: "Unauthorized: No donor profile found" };
  }

  // Validate data with Zod
  const result = donorProfileSchema.safeParse(payload);

  if (!result.success) {
    const errors: Record<string, string[]> = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(issue.message);
    });

    const firstError = Object.values(errors)[0]?.[0];
    return { ok: false, error: firstError || "Validation failed" };
  }

  const supabase = await createAnonymousServerSupabaseClient();
  try {
    const row = buildDonorInsertRow(donorProfile.user_id, payload);
    const { data, error } = await supabase
      .from("donors")
      .upsert(row, { onConflict: "user_id" })
      .select("profile_completed")
      .maybeSingle();

    if (error) return { ok: false, error: error.message };

    revalidatePath("/dashboard/donor/profile");
    return { ok: true, profile_completed: !!data?.profile_completed };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unexpected error";
    return { ok: false, error: msg };
  }
}

/**
 * Delete the donor's profile row.
 */
export async function deleteDonorProfile(): Promise<ActionResult> {
  const donorProfile = await getDonorProfile();

  if (!donorProfile) {
    return { ok: false, error: "Unauthorized: No donor profile found" };
  }

  const supabase = await createAnonymousServerSupabaseClient();
  const { error } = await supabase
    .from("donors")
    .delete()
    .eq("user_id", donorProfile.user_id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/donor/profile");
  return { ok: true, profile_completed: false };
}
