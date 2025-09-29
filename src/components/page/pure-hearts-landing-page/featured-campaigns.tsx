// src/components/page/pure-hearts-landing-page/featured-campaigns.tsx
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { getProjects } from "@/src/api/project";

const fmt = (n: number | null | undefined) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(n ?? 0));

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
          {projects.map((proj) => (
            <Card
              key={proj.id}
              className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <Link
                href={`/campaigns/${proj.organization!.slug}/${proj.slug}`}
                aria-label={`View ${proj.title}`}
                className="absolute inset-0 z-10"
              />
              <div className="aspect-video relative">
                <Image
                  src={proj.project_background_image || "/placeholder.jpg"}
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
