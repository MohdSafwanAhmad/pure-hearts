import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import Image from "next/image";
import { useState } from "react";

type Props = {
  project: {
    title: string;
    description: string;
    goal_amount: number | null;
    collected: number;
    percent: number;
    beneficiary_count: number;
    project_background_image: string | null;
    organization: { name: string; organizationSlug: string };
    slug: string;
  };
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n || 0);

export function ProjectCard({ project }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <div className="relative aspect-video">
        <Image
          src={project.project_background_image || "/placeholder.jpg"}
          alt={project.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2 text-lg">{project.title}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col flex-1">
        <div className="description-container mb-4">
          {!expanded ? (
            <div className="flex items-center gap-1">
              <p className="text-sm text-muted-foreground line-clamp-1 flex-grow">
                {project.description}
              </p>
              {project.description.length > 50 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setExpanded(true);
                  }}
                  className="text-xs text-primary hover:underline focus:outline-none whitespace-nowrap flex-shrink-0"
                >
                  Read more
                </button>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
              <button
                onClick={() => setExpanded(false)}
                className="text-xs text-primary hover:underline focus:outline-none mt-1 block"
              >
                Show less
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-paragraph">
          <span>Raised</span>
          <span>
            ${fmt(project.collected)} / ${fmt(project.goal_amount ?? 0)}
          </span>
        </div>
        <Progress value={project.percent} className="mb-paragraph" />
        <div className="text-right text-[11px] text-muted-foreground mb-paragraph">
          {project.percent}%
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-title">
          <span>
            Beneficiaries: <strong>{project.beneficiary_count}</strong>
          </span>
          {project.organization.name && (
            <span className="truncate">{project.organization.name}</span>
          )}
        </div>

        <Button asChild className="w-full">
          <Link
            href={`/campaigns/${project.organization.organizationSlug}/${project.slug}`}
          >
            View Campaign
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
