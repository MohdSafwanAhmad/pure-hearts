// File: /app/api/campaigns/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/src/lib/supabase/server";
import { Database } from "@/src/types/database-types";

/**
 * Project row type from Supabase
 */
type ProjectRow = {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  project_background_image: string | null;
  organization_user_id: string;
  created_at: string;
  beneficiary_type_id: string | null;
};

/**
 * Organization row type from Supabase
 */
type OrgRow = {
  user_id: string;
  slug: string;
};

export async function GET(req: NextRequest) {
  try {
    // Parse query parameters from URL
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";           // search query
    const sort = searchParams.get("sort") || "relevance";    // relevance | newest
    const category = searchParams.get("category");           // optional category filter (beneficiary_type_id)

    // Create Supabase server client (anonymous)
    const supabase = await createServerSupabaseClient();

    // 1️⃣ Fetch projects from Supabase with optional filters
    let query = supabase
      .from("projects")
      .select(`
        id,
        title,
        description,
        slug,
        project_background_image,
        organization_user_id,
        created_at,
        beneficiary_type_id
      `);

    // Apply text search filter if query is provided (ILIKE for case-insensitive match)
    if (q) {
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
    }

    // Apply category filter if provided
    if (category) {
      query = query.eq("beneficiary_type_id", category);
    }

    // Apply sorting
    if (sort === "newest") {
      query = query.order("created_at", { ascending: false });
    } else {
      // For relevance, we'll sort manually in JS later
      query = query.order("id", { ascending: true });
    }

    // Execute the query
    const { data: projects, error } = await query;

    if (error) {
      console.error("Supabase search error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!projects || projects.length === 0) {
      return NextResponse.json({ results: [] });
    }

    // 2️⃣ Fetch organizations to get orgslug
    const orgIds = projects.map((p: { organization_user_id: any; }) => p.organization_user_id);
    const { data: orgs } = await supabase
      .from("organizations")
      .select("user_id, slug")
      .in("user_id", orgIds);

    // 3️⃣ Map projects to frontend response
    let results = (projects as ProjectRow[]).map((project) => {
      const org = orgs?.find((o: OrgRow) => o.user_id === project.organization_user_id);
      return {
        id: project.id,
        title: project.title,
        description: project.description || "",
        image_url: project.project_background_image || "",
        orgslug: org?.slug || "",
        projectslug: project.slug,
        created_at: project.created_at,
      };
    });

    // 4️⃣ Sort by relevance if requested (based on frequency of query in title+description)
    if (q && sort === "relevance") {
      const regex = new RegExp(q, "gi");
      results.sort((a, b) => {
        const aCount = (a.title + " " + a.description).match(regex)?.length || 0;
        const bCount = (b.title + " " + b.description).match(regex)?.length || 0;
        return bCount - aCount; // descending
      });
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Unexpected search error:", err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
