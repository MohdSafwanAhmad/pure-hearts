// app/campaigns/page.tsx
import ProjectCard from "@/src/components/global/project-card";
import Link from "next/link";
import { getProjects } from "@/src/api/project";
import { Button } from "@/src/components/ui/button";

export const revalidate = 0;
export const dynamic = "force-dynamic";

// fmt removed; not needed here

export default async function CampaignsIndexPage({
  searchParams,
}: { searchParams?: { page?: string } }) {
  const page = Math.max(1, Number(searchParams?.page ?? 1));
  const pageSize = 24;
  const offset = (page - 1) * pageSize;

  const projects = await getProjects(pageSize, offset);

  return (
    <>
    <main className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Campaigns</h1>

      {projects.length === 0 ? (
        <div className="text-muted-foreground">No campaigns yet.</div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((p) => {
            const orgSlug = p.organization?.slug;
            const href = orgSlug ? `/campaigns/${orgSlug}/${p.slug}` : `/campaigns/_/${p.slug}`;
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

      <div className="mt-10 flex items-center justify-center gap-3">
        <Button asChild variant="outline" disabled={page <= 1}>
          <Link href={`/campaigns?page=${page - 1}`}>Previous</Link>
        </Button>
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <Button asChild variant="outline" disabled={projects.length < pageSize}>
          <Link href={`/campaigns?page=${page + 1}`}>Next</Link>
        </Button>
      </div>
    </main>
    </>
  );
}
