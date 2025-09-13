import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Star } from "lucide-react";

const campaigns = [
  {
    title: "Zakat Distribution",
    description:
      "Direct Zakat to verified recipients with full on-chain traceability.",
    image: "/project-zakat.jpg",
    rating: "4.9",
  },
  {
    title: "Orphan Sponsorship",
    description:
      "Sustain education & essentials for orphans via monthly support.",
    image: "/project-orphans.jpg",
    rating: "4.9",
  },
  {
    title: "Family Sponsorship",
    description:
      "Bridge urgent needs—rent, food, utilities—for vulnerable families.",
    image: "/project-family.jpg",
    rating: "4.8",
  },
  {
    title: "Students Sponsorship",
    description: "Back tuition and learning tools for deserving students.",
    image: "/project-students.jpg",
    rating: "4.8",
  },
  {
    title: "Furniture Bank",
    description:
      "Enable dignified living with essential furnishings for newcomers.",
    image: "/project-furniture.jpg",
    rating: "4.7",
  },
  {
    title: "Blockchain Transparency",
    description: "Explore the public ledger that powers our accountability.",
    image: "/project-blockchain.jpg",
    rating: "5.0",
  },
  {
    title: "Canadian Provinces",
    description: "Target aid across provinces with local partners.",
    image: "/project-canada.jpg",
    rating: "4.8",
  },
  {
    title: "US States & International",
    description: "Scale impact across borders with vetted initiatives.",
    image: "/project-international.jpg",
    rating: "4.7",
  },
];

export default function FeatureCampaigns() {
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
          {campaigns.map((proj, i) => (
            <Card
              key={i}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video relative">
                <Image
                  src={proj.image}
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
                      {proj.rating}
                    </span>
                  </div>
                </div>
                <CardDescription>{proj.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Button size="sm">Donate</Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent"
                  >
                    Learn More
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
