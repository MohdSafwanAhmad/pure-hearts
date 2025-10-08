import { createServerSupabaseClient } from "@/src/lib/supabase/server";

/** Server-side query used by the Add Project page */
export async function getBeneficiaryTypes(): Promise<
  Array<{ id: string; label: string; code: string }>
> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("beneficiary_types")
    .select("id, label, code")
    .order("label", { ascending: true });

  if (error) {
    console.error("getBeneficiaryTypes error:", error.message);
    return [];
  }
  return data ?? [];
}
