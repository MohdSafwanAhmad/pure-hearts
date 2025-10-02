import ProjectCard from "@/src/components/global/project-card";

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
  projectBackgroundImage,
  slug,
  organizationSlug,
}: Props) {
  // Keep API consistent; currently card doesn't render dates/completion status

  return (
    <ProjectCard
      href={`/campaigns/${organizationSlug}/${slug}`}
      title={title}
      description={description}
      imageUrl={projectBackgroundImage}
      ctaLabel="View Details"
    />
  );
}
