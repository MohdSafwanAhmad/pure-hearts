import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Heading } from "@/src/components/global/heading";

interface Props {
  title: string;
  description: string;
  startDate: Date;
  completionDate?: Date;
  projectBackgroundImage: string;
  slug: string;
  organizationSlug: string;
}

export function OrganizationProjectCard({
  title,
  description,
  startDate,
  completionDate,
  projectBackgroundImage,
  slug,
  organizationSlug,
}: Props) {
  const projectIsCompleted = Boolean(completionDate);

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
          <span className="absolute top-3 -right-16 rotate-50 bg-primary text-white px-12 py-2 text-sm font-semibold transform shadow-lg z-10">
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
              {completionDate
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
