"use server";

import { revalidatePath } from "next/cache";
import {
  createAnonymousServerSupabaseClient,
  getDonorProfile,
} from "@/src/lib/supabase/server";
import type { Database } from "@/src/types/database-types";
import { donorProfileSchema } from "@/src/schemas/donor";

/** DB helpers (typed from your generated Database type) */
type DonorInsert = Database["public"]["Tables"]["donors"]["Insert"];

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
 * Build an Insert object safely.
 */
function buildInsertRow(
  userId: string,
  payload: UpsertDonorPayload
): DonorInsert {
  const raw = {
    user_id: userId,
    first_name: payload.first_name ?? null,
    last_name: payload.last_name ?? null,
    phone: payload.phone ?? null,
    address: payload.address ?? null,
    city: payload.city ?? null,
    state: payload.state ?? null,
    country: payload.country ?? null,
    profile_completed: payload.profile_completed ?? true,
  } satisfies Record<string, unknown>;
  return raw as unknown as DonorInsert;
}

/**
 * Upsert (insert or update) the donor's profile by user_id.
 */
export async function upsertDonorProfile(
  payload: UpsertDonorPayload
): Promise<ActionResult> {
  // Check if user is actually logged in
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

    // Return first error message
    const firstError = Object.values(errors)[0]?.[0];
    return { ok: false, error: firstError || "Validation failed" };
  }

  const supabase = await createAnonymousServerSupabaseClient();
  try {
    const row = buildInsertRow(donorProfile.user_id, payload);
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
  // Check if user is actually logged in
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