import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Progress } from "@/src/components/ui/progress";
import { DonationBox } from "@/src/components/page/project/donationbox";
import { getProjectBySlugs } from "@/src/api/project";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n || 0);

export default async function ProjectBySlugsPage(props: {
  params: { orgslug: string; projectslug: string };
}) {
  const { params } = await Promise.resolve(props);

  const project = await getProjectBySlugs(
    params.orgslug,
    params.projectslug
  );

  if (!project) {
    console.error("project fetch error: not found");
    return <div className="container mx-auto px-4 py-20">Project not found.</div>;
  }

  const cover = project.project_background_image || "/placeholder.jpg";

  return (
    <div className="container mx-auto px-4 py-10">
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
            {/* Overlay gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {/* Title + subheading on image */}
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-sm line-clamp-2">
                {project.title}
              </h1>
              <p className="mt-2 text-white/90 text-sm sm:text-base line-clamp-1">
                {project.organization?.name ?? ""}
                {project.beneficiary?.label ? ` • ${project.beneficiary.label}` : ""}
              </p>
            </div>
          </div>

          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-2xl">{project.title}</CardTitle>
              {project.beneficiary?.label && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {project.beneficiary.label}
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}

            {/* KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-md bg-muted p-3 text-center">
                <div className="text-[11px] text-muted-foreground">Raised</div>
                <div className="font-semibold">${fmt(project.collected)}</div>
              </div>
              <div className="rounded-md bg-muted p-3 text-center">
                <div className="text-[11px] text-muted-foreground">Goal</div>
                <div className="font-semibold">${fmt(project.goal_amount)}</div>
              </div>
              <div className="rounded-md bg-muted p-3 text-center">
                <div className="text-[11px] text-muted-foreground">Remaining</div>
                <div className="font-semibold">${fmt(project.remaining)}</div>
              </div>
              <div className="rounded-md bg-muted p-3 text-center">
                <div className="text-[11px] text-muted-foreground">Progress</div>
                <div className="font-semibold">{project.percent}%</div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>Raised</span>
                <span>
                  ${fmt(project.collected)} / ${fmt(project.goal_amount ?? 0)}
                </span>
              </div>
              <Progress className="h-3" value={project.percent} />
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
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle>Donate</CardTitle>
            </CardHeader>
            <CardContent>
              <DonationBox defaultAmount={50} />
            </CardContent>
          </Card>

          {project.organization && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                {project.organization.logo && (
                  <Image
                    src={project.organization.logo}
                    alt={project.organization.name ?? "Organization logo"}
                    width={48}
                    height={48}
                    className="rounded-full border bg-white object-cover"
                  />
                )}
                <div>
                  <CardTitle className="text-xl">{project.organization.name}</CardTitle>
                  {project.organization.mission_statement && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {project.organization.mission_statement}
                    </p>
                  )}
                  {project.organization.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {project.organization.description}
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 pt-0">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="self-start"
                >
                  <Link href={`/organizations/${project.organization.slug}`}>
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