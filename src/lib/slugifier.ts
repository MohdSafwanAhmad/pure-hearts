import "server-only";
import { createServerSupabaseClient } from "./supabase/server";
import slugify from "slugify";

const defaultSlugOptions = {
  replacement: "-",
  remove: /[*+~.()'"!:@]/g,
  lower: true,
  strict: true,
  locale: "en",
};

function generateSlug(organizationName: string): string {
  const slugOptions = { ...defaultSlugOptions };

  return slugify(organizationName, slugOptions).replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Create a unique slug for a given name and table. NOTE: This function assumes
 * that the table has a `slug` column. Can only be used in SERVER-SIDE code.
 * @param name The name to generate a slug for.
 * @param tableName The name of the table to check for existing slugs.
 * @returns A unique slug.
 */
export async function generateUniqueSlug(
  name: string,
  tableName: string
): Promise<string> {
  const supabase = await createServerSupabaseClient();
  const baseSlug = generateSlug(name);

  if (!baseSlug) {
    throw new Error("Unable to generate slug from organization name");
  }

  // Try base slug first
  const { data: existing } = await supabase
    // @ts-expect-error make it more flexible for any table with a slug column
    .from(tableName)
    .select("slug")
    .eq("slug", baseSlug)
    .single();

  if (!existing) {
    return baseSlug;
  }

  // Simple increment approach for collisions
  let counter = 2;
  while (counter <= 99) {
    const slugWithNumber = `${baseSlug}-${counter}`;

    const { data: existingNumbered } = await supabase
      // @ts-expect-error make it more flexible for any table with a slug column
      .from(tableName)
      .select("slug")
      .eq("slug", slugWithNumber)
      .single();

    if (!existingNumbered) {
      return slugWithNumber;
    }

    counter++;
  }

  throw new Error("Unable to generate unique slug after 99 attempts");
}
