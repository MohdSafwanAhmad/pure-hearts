"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { Database } from "@/src/types/database-types";

/** DB helpers (typed from your generated Database type) */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type DonorRow = Database["public"]["Tables"]["donors"]["Row"];
type DonorInsert = Database["public"]["Tables"]["donors"]["Insert"];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type DonorUpdate = Database["public"]["Tables"]["donors"]["Update"];

/** Payload your UI sends to upsert */
export type UpsertDonorPayload = {
  user_id: string;
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
function buildInsertRow(payload: UpsertDonorPayload): DonorInsert {
  const raw = {
    user_id: payload.user_id,
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
  if (!payload.user_id) {
    return { ok: false, error: "Missing user_id" };
  }

  const supabase = await createServerSupabaseClient();

  try {
    const row = buildInsertRow(payload);

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
 * Delete the donor's profile row (by user_id).
 */
export async function deleteDonorProfile(
  userId: string
): Promise<ActionResult> {
  if (!userId) {
    return { ok: false, error: "Missing user_id" };
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("donors")
    .delete()
    .eq("user_id", userId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/donor/profile");
  return { ok: true, profile_completed: false };
}
