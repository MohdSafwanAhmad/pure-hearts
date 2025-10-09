// src/lib/projects.ts

export type MinimalProject = {
  status?: string | null;
  is_completed?: boolean | null;
  end_date?: string | null; // ISO or YYYY-MM-DD
};

/**
 * Treat nulls as NOT completed.
 * Completed if:
 *  - status === "completed" (case-insensitive), OR
 *  - is_completed === true, OR
 *  - end_date is a valid date strictly before today (date-only compare)
 */
export function isProjectCompleted(p: MinimalProject): boolean {
  const statusCompleted =
    typeof p.status === "string" &&
    p.status.toLowerCase().trim() === "completed";

  const flagCompleted = p.is_completed === true;

  const endDateCompleted =
    !!p.end_date &&
    !Number.isNaN(Date.parse(p.end_date)) &&
    new Date(p.end_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

  return statusCompleted || flagCompleted || endDateCompleted;
}
