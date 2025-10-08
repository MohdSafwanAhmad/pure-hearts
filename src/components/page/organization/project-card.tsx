import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Heading } from "@/src/components/global/heading";
import { isProjectCompleted } from "@/src/api/project";

interface Props {
  title: string;
  description: string;
  startDate: Date;
  completionDate?: Date;
  projectBackgroundImage: string;
  slug: string;
  organizationSlug: string;

  // Optional extras if your row has them; safe defaults if not provided
  status?: string | null;
  isCompletedFlag?: boolean | null; // maps to is_completed in DB if you have it
}

export function OrganizationProjectCard({
  title,
  description,
  startDate,
  completionDate,
  projectBackgroundImage,
  slug,
  organizationSlug,
  status = null,
  isCompletedFlag = null,
}: Props) {
  const projectIsCompleted = isProjectCompleted({
    status,
    is_completed: isCompletedFlag ?? null,
    end_date: completionDate ? completionDate.toISOString() : null,
  });

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        <Image
          src={projectBackgroundImage}
          alt="Project Background"
          fill
          className="object-cover"
        />

        {projectIsCompleted && (
          <span className="absolute top-3 -right-16 rotate-45 bg-primary text-white px-12 py-2 text-sm font-semibold transform shadow-lg z-10">
            Project Completed
          </span>
        )}
      </div>
      <CardContent>
        <Heading level={5} className="mb-element">
          {title}
        </Heading>
        <p className="line-clamp-2 mb-paragraph">{description}</p>
        <div className="grid grid-cols-2 gap-4 mb-title">
          <div>
            <span>{projectIsCompleted ? "Completion Date" : "Start Date"}</span>
            <div className="font-semibold">
              {projectIsCompleted && completionDate
                ? completionDate.toLocaleDateString()
                : startDate.toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Button className="w-full" asChild>
            <Link href={`/campaigns/${organizationSlug}/${slug}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
