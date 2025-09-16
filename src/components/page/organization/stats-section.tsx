import { OrganizationStatCard } from "./stats-card";

interface Props {
  stats: {
    title: string;
    stat: string;
    description: string;
  }[];
}

export function OrganizationStats({ stats }: Props) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-section">
      {stats.map((stat) => (
        <OrganizationStatCard
          key={stat.title}
          title={stat.title}
          stat={stat.stat}
          description={stat.description}
        />
      ))}
    </section>
  );
}
