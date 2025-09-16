import { Card, CardContent } from "@/src/components/ui/card";

interface Props {
  title: string;
  stat: string;
  description: string;
}

export function OrganizationStatCard({ title, stat, description }: Props) {
  return (
    <Card className="bg-transparent border border-gray-300">
      <CardContent className="px-4 text-left">
        <div className="text-emerald-600 text-sm font-semibold mb-1">
          {title}
        </div>
        <div className="text-2xl font-bold">{stat}</div>
        <div className="text-gray-600 text-sm">{description}</div>
      </CardContent>
    </Card>
  );
}
