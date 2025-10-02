import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { Button } from "@/src/components/ui/button";

interface ProjectCardProps {
  href: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  organizationName?: string | null;
  beneficiaryLabel?: string | null;
  collected?: number;
  goalAmount?: number | null;
  percent?: number;
  ctaLabel?: string;
}

const fmt = (n: number | null | undefined) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(n ?? 0));

export default function ProjectCard({
  href,
  title,
  description,
  imageUrl,
  organizationName,
  beneficiaryLabel,
  collected,
  goalAmount,
  percent,
  ctaLabel = "View Details",
}: ProjectCardProps) {
  return (
    <Card
      className="
        relative h-full overflow-hidden flex flex-col group cursor-pointer
        transition duration-200
        hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/30
        focus-within:shadow-lg
      "
    >
      {/* Full-card click target */}
      <Link
        href={href}
        aria-label={`View ${title}`}
        className="absolute inset-0 z-10"
        tabIndex={-1}
      />

      <div className="relative aspect-video overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.jpg"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          priority={false}
        />
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-lg flex-1">{title}</CardTitle>
          {beneficiaryLabel && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary whitespace-nowrap">
              {beneficiaryLabel}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex flex-col flex-1 pt-0">
        {description && (
          <p className="line-clamp-3 text-sm text-muted-foreground">{description}</p>
        )}

        {typeof percent === "number" && (
          <div className="flex-1 flex flex-col justify-end">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Raised</span>
              <span>
                ${fmt(collected)} / ${fmt(goalAmount ?? 0)}
              </span>
            </div>
            <Progress value={percent} className="h-2" />
            <div className="mt-1 text-right text-[11px] text-muted-foreground">{percent}%</div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span className="truncate">{organizationName ?? ""}</span>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="
              w-full transition
              group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary
              focus-visible:ring-2 focus-visible:ring-primary
            "
          >
            {ctaLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
