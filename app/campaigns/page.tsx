// app/campaigns/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/src/api/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { Button } from "@/src/components/ui/button";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n || 0);

export default async function CampaignsIndexPage({
  searchParams,
}: { searchParams?: { page?: string } }) {
  const page = Math.max(1, Number(searchParams?.page ?? 1));
  const pageSize = 24;
  const offset = (page - 1) * pageSize;

  const projects = await getProjects(pageSize, offset);

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Campaigns</h1>

      {projects.length === 0 ? (
        <div className="text-muted-foreground">No campaigns yet.</div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((p) => {
            const orgSlug = p.organization?.slug;
            const href = orgSlug
              ? `/campaigns/${orgSlug}/${p.slug}`
              : `/campaigns/_/${p.slug}`;

            return (
              <li key={p.id}>
                <Card className="relative h-full overflow-hidden group cursor-pointer">
                  <Link
                    href={href}
                    aria-label={`View ${p.title}`}
                    className="absolute inset-0 z-10"
                  />
                  <div className="relative aspect-video">
                    <Image
                      src={p.project_background_image || "/placeholder.jpg"}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-lg">{p.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {p.description}
                    </p>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Raised</span>
                        <span>
                          ${fmt(p.collected)} / ${fmt(p.goal_amount ?? 0)}
                        </span>
                      </div>
                      <Progress value={p.percent} />
                      <div className="mt-1 text-right text-[11px] text-muted-foreground">
                        {p.percent}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Beneficiary Type: <strong>{p.beneficiary?.label ?? "—"}</strong></span>
                      {p.organization?.name && <span className="truncate">{p.organization.name}</span>}
                    </div>

                    <Button className="w-full" variant="outline">
                      View Campaign
                    </Button>
                  </CardContent>
                </Card>
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
  );
}
