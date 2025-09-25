// src/components/page/pure-hearts-landing-page/featured-campaigns.tsx
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { getFeaturedProjectsWithTotals } from "@/src/lib/supabase/queries/get-featured-projects";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

export default async function FeaturedCampaigns() {
  const projects = await getFeaturedProjectsWithTotals(4);

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Featured Campaigns</h2>
          <p className="text-muted-foreground">
            Choose a cause or let our matching engine allocate your Zakat
            wisely.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((proj) => (
            <Card
              key={proj.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video relative">
                <Image
                  src="/placeholder.jpg"
                  alt={proj.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 360px, 100vw"
                />
              </div>

              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{proj.title}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">
                      ${fmt(proj.goal_amount)}
                    </span>
                  </div>
                </div>
                <CardDescription>{proj.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Raised</span>
                  <span>
                    ${fmt(proj.collected)} / ${fmt(proj.goal_amount)}
                  </span>
                </div>
                <Progress value={proj.percent} className="h-2 bg-muted" />
                <div className="text-xs text-right text-muted-foreground">
                  {proj.percent}%
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button size="sm">Donate</Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
