// src/api/project.ts
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import type { Tables } from "@/src/types/database-types";

export type Project = Tables<"projects">;

/** Get a single project by id */
export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createServerSupabaseClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    return null;
  }

  return project as Project;
}

/** Get all projects (optionally with a limit to get featured projects for now. TO DO: Add logic to get featured projects) */
export async function getAllProjects(limit?: number): Promise<Project[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return (data ?? []) as Project[];
}
