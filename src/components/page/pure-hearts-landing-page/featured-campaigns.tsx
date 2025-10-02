// src/components/page/pure-hearts-landing-page/featured-campaigns.tsx
import ProjectCard from "@/src/components/global/project-card";
import { getProjects } from "@/src/api/project";

export default async function FeaturedCampaigns() {
  const projects = await getProjects(8, 0);

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Featured Campaigns</h2>
          <p className="text-muted-foreground">Choose a cause</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              href={`/campaigns/${p.organization!.slug}/${p.slug}`}
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
          ))}
        </div>
      </div>
    </section>
  );
}
