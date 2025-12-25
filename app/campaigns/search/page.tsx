/**
 * app/campaigns/search/page.tsx
 * Campaign Search Page (Server Component)
 * ----------------------------------------------------
 * - URL-based search, sorting, filtering, pagination
 * - Calls server-side searchCampaigns()
 * - No API route indirection
 */

import Link from "next/link";
import { Suspense } from "react";

import ProjectCard from "@/src/components/global/project-card";
import { Button } from "@/src/components/ui/button";
import { LoadingSpinner } from "@/src/components/common/LoadingSpinner";
import { searchCampaigns, ProjectSearchRow } from "@/src/api/campaigns";
import { getProjectAreas } from "@/src/api/organization";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SearchParams {
  q?: string;
  page?: string;
  sort?: "relevance" | "newest";
  area?: string;
}

const buildQueryString = (params: Record<string, string | undefined>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) search.set(k, v);
  });
  return search.toString();
};

export default async function CampaignSearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q = "", page = "1", sort = "relevance", area } =
    await searchParams;

  const pageNumber = Math.max(1, Number(page) || 1);
  const pageSize = 24;
  const offset = (pageNumber - 1) * pageSize;

    /**
   * Convert area param to number (or undefined)
   */
  const areaId = area ? Number(area) : undefined;

  const campaigns: ProjectSearchRow[] = await searchCampaigns({
    query: q,
    areaId,
    sortBy: sort,
    limit: pageSize,
    offset,
  });

  const projectAreas = await getProjectAreas();


  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Search Campaigns</h1>

      {/* Filters (GET only) */}
      <form method="get" className="mb-8 grid gap-4 md:grid-cols-4">
        <input
          type="search"
          name="q"
          defaultValue={q}
          autoFocus
          placeholder="Search campaigns..."
          className="rounded-md border px-3 py-2 text-sm"
        />

        <select
          name="sort"
          defaultValue={sort}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="relevance">Relevance</option>
          <option value="newest">Newest</option>
        </select>

                {/* Project Areas */}
        <select
          key={area ?? "all"}   // force remount when Clear button pressed
          name="area"
          defaultValue={area ?? ""}
          className="rounded-md border px-3 py-2 text-sm"
        >
          <option value="">All categories</option>

          {projectAreas.map((area) => (
            <option key={area.value} value={area.value}>
              {area.label}
            </option>
          ))}
        </select>




        <div className="flex gap-2">
          <Button type="submit">Apply</Button>
          <Button asChild variant="outline">
            <Link href="/campaigns/search">Clear</Link>
          </Button>
        </div>
      </form>

      <Suspense fallback={<LoadingSpinner />}>
        {campaigns.length === 0 ? (
          <p className="text-muted-foreground">No campaigns found.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {campaigns.map((p) => {
              const href = p.organization
                ? `/campaigns/${p.organization.slug}/${p.slug}`
                : `/campaigns/_/${p.slug}`;

              return (
                <li key={p.id}>
                  <ProjectCard
                    href={href}
                    title={p.title}
                    description={p.description}
                    imageUrl={p.project_background_image}
                    organizationName={p.organization?.name ?? null}
                    beneficiaryLabel={p.beneficiary?.label ?? null}
                    collected={p.collected}
                    goalAmount={p.goal_amount}
                    percent={p.percent}
                    ctaLabel="View Details"
                  />
                </li>
              );
            })}
          </ul>
        )}
      </Suspense>

      {/* Pagination */}
      <nav className="mt-10 flex items-center justify-center gap-4">
        {pageNumber > 1 && (
          <Button asChild variant="outline">
            <Link
              href={`/campaigns/search?${buildQueryString({
                q,
                sort,
                area,
                page: String(pageNumber - 1),
              })}`}
            >
              Previous
            </Link>
          </Button>
        )}

        <span className="text-sm text-muted-foreground">
          Page {pageNumber}
        </span>

        {campaigns.length === pageSize && (
          <Button asChild variant="outline">
            <Link
              href={`/campaigns/search?${buildQueryString({
                q,
                sort,
                area,
                page: String(pageNumber + 1),
              })}`}
            >
              Next
            </Link>
          </Button>
        )}
      </nav>
    </main>
  );
}