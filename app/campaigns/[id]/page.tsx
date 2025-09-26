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
import { DonationBox } from "@/src/components/page/project/donationbox"; // <— IMPORTANT

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

  // Always show a cover (fallback to placeholder)
  const cover = project.project_background_image || "/placeholder.jpg";

  return (
    <div className="container mx-auto px-4 py-10">
      {/* 12-col layout: left 7 / right 5 */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* LEFT */}
        <Card className="overflow-hidden lg:col-span-7">
          <div className="relative aspect-video">
            <Image
              src={cover}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <CardHeader>
            <CardTitle className="text-2xl">{project.title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-muted-foreground">{project.description}</p>

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

            <div className="flex gap-3">
              <Button size="lg">Donate</Button>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT: Donate box + Organization */}
        <div className="space-y-6 lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Donate</CardTitle>
            </CardHeader>
            <CardContent>
              <DonationBox defaultAmount={50} />
            </CardContent>
          </Card>

          {project.organization && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Organization</CardTitle>
              </CardHeader>
              <CardContent className="flex h-full flex-col gap-3">
                <div className="font-medium">{project.organization.name}</div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-auto self-start"
                >
                  <Link href={`/organizations/${project.organization.user_id}`}>
                    Visit organization
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
