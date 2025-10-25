import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Database } from "@/src/types/database-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** DB helpers (typed from your generated Database type) */
type DonorInsert = Database["public"]["Tables"]["donors"]["Insert"];

/**
 * Build a typed Insert object for the donors table.
 * Used when upserting donor profile data.
 */
export function buildDonorInsertRow(
  userId: string,
  payload: {
    first_name?: string | null;
    last_name?: string | null;
    phone?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    profile_completed?: boolean | null;
  }
): DonorInsert {
  return {
    user_id: userId,
    first_name: payload.first_name ?? null,
    last_name: payload.last_name ?? null,
    phone: payload.phone ?? null,
    address: payload.address ?? null,
    city: payload.city ?? null,
    state: payload.state ?? null,
    country: payload.country ?? null,
    profile_completed: payload.profile_completed ?? true,
  } as DonorInsert;
}
