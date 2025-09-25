import type { Database } from "@/src/types/database-types";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

export type FeaturedProject = {
  id: string;
  title: string;
  description: string | null;
  goal_amount: number;
  collected: number;
  remaining: number;
  percent: number;
  organization_user_id: string;
  project_background_image: string | null;
};

export async function getFeaturedProjectsWithTotals(
  limit = 8
): Promise<FeaturedProject[]> {
  const supabase = await createServerSupabaseClient();

  // 1) fetch the few columns we need
  const { data: projects, error: projErr } = await supabase
    .from("projects")
    .select(
      "id, title, description, goal_amount, organization_user_id, project_background_image"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (projErr) {
    console.error("projects fetch error:", projErr.message);
    return [];
  }
  if (!projects?.length) return [];

  // 2) get totals via RPC (cast because your Database types don't know this RPC)
  const ids = projects.map((p) => p.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: totals, error: totErr } = await (supabase.rpc as any)(
    "get_project_donation_totals",
    { ids }
  );

  if (totErr) {
    console.error("totals rpc error:", totErr.message);
  }

  const totalById = new Map<string, number>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (totals ?? []).map((t: any) => [String(t.project_id), Number(t.total ?? 0)])
  );

  // 3) build view models
  return projects.map((p): FeaturedProject => {
    const goal = Number(p.goal_amount ?? 0);
    const collected = totalById.get(p.id) ?? 0;
    const remaining = Math.max(goal - collected, 0);
    const percent =
      goal > 0 ? Math.min(100, Math.round((collected / goal) * 100)) : 0;

    return {
      id: p.id,
      title: p.title ?? "",
      description: p.description,
      goal_amount: goal,
      collected,
      remaining,
      percent,
      organization_user_id: p.organization_user_id,
      project_background_image: p.project_background_image,
    };
  });
}
