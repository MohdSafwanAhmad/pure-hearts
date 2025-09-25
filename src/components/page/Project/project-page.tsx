// app/campaigns/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { getProjectByIdWithTotals } from "@/src/lib/supabase/queries/get-project-by-id";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Progress } from "@/src/components/ui/progress";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n || 0);

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProjectByIdWithTotals(params.id);

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-20">Project not found.</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* LEFT: Project */}
        <Card className="overflow-hidden">
          {project.project_background_image && (
            <div className="relative aspect-video">
              <Image
                src={project.project_background_image}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl">{project.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            <p className="text-muted-foreground">{project.description}</p>

            {/* === Your 3 items under the description === */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-muted p-4 text-center">
                <div className="text-xs text-muted-foreground">Collected</div>
                <div className="font-semibold">${fmt(project.collected)}</div>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <div className="text-xs text-muted-foreground">Remaining</div>
                <div className="font-semibold">${fmt(project.remaining)}</div>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <div className="text-xs text-muted-foreground">
                  Beneficiaries
                </div>
                <div className="font-semibold">
                  {project.beneficiary_count ?? "—"}
                </div>
              </div>
            </div>

            {/* Progress */}
            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>Raised</span>
                <span>
                  ${fmt(project.collected)} / ${fmt(project.goal_amount ?? 0)}
                </span>
              </div>
              <Progress value={project.percent} />
              <div className="mt-1 text-right text-xs text-muted-foreground">
                {project.percent}%
              </div>
            </div>

            {/* Actions (no cart icon) */}
            <div className="flex gap-3">
              <Button size="lg">Donate</Button>
              {project.organization && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Organization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="font-medium">
                      {project.organization.name ?? "Visit organization"}
                    </div>

                    <Button asChild variant="outline">
                      <Link
                        href={`/organizations/${project.organization.user_id}`}
                      >
                        Visit organization
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* RIGHT: Organization panel (no city/type blocks) */}

        {project.organization && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="font-medium">{project.organization.name}</div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/organizations/${project.organization.user_id}`}>
                  Visit organization Visit organization
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
