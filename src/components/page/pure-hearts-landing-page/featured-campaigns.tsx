"use client"

import Image from "next/image"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Star } from "lucide-react"
import { Project } from "@/src/api/project";

export default function FeaturedCampaigns({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Featured Campaigns</h2>
          <p className="text-muted-foreground">Choose a cause or let our matching engine allocate your Zakat wisely.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((proj) => (
            <Card key={proj.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                      {proj.goal_amount ? `$${Number(proj.goal_amount).toLocaleString()}` : ""}
                    </span>
                  </div>
                </div>
                <CardDescription>{proj.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Button size="sm">Donate</Button>
                  <Button size="sm" variant="outline" className="bg-transparent">Learn More</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
