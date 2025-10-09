"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heading } from "@/src/components/global/heading";
import ProjectCard from "@/src/components/global/project-card";
import { Button } from "@/src/components/ui/button";
import { FolderOpen } from "lucide-react";
import { isProjectCompleted } from "@/src/lib/projects";

type ProjectType = "completed" | "existing";

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  completionDate?: Date;
  projectId: string;
  projectBackgroundImage: string;
  slug: string;
  goal_amount: number | null;
  collected: number;
  percent: number;
  organizationSlug: string;
  beneficiaryCount: number;
  organization: { name: string; organizationSlug: string };
  status?: string | null;
  is_completed?: boolean | null;
}

export function ProjectsSection({
  projects,
  organizationSlug,
  isOwnOrganization = false,
}: {
  projects: ProjectItem[];
  organizationSlug: string;
  isOwnOrganization?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabParam = (searchParams.get("tab") as ProjectType) || "existing";
  const [activeProjectType, setActiveProjectType] =
    useState<ProjectType>(tabParam);

  useEffect(() => {
    if (tabParam !== activeProjectType) setActiveProjectType(tabParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam]);

  const toMinimal = (p: ProjectItem) => ({
    status: p.status ?? null,
    is_completed: p.is_completed ?? null,
    end_date: p.completionDate ? p.completionDate.toISOString() : null,
  });

  const completedProjects = useMemo(
    () => projects.filter((p) => isProjectCompleted(toMinimal(p))),
    [projects]
  );

  const existingProjects = useMemo(
    () => projects.filter((p) => !isProjectCompleted(toMinimal(p))),
    [projects]
  );

  const currentProjects =
    activeProjectType === "completed" ? completedProjects : existingProjects;

  const projectsPerPage = 4;
  const [displayCount, setDisplayCount] = useState<number>(projectsPerPage);
  useEffect(() => setDisplayCount(projectsPerPage), [activeProjectType]);

  const visibleProjects = currentProjects.slice(0, displayCount);
  const hasMoreProjects = currentProjects.length > displayCount;

  const setTab = (tab: ProjectType) => {
    setActiveProjectType(tab);
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <section className="mb-section">
      <Heading level={2} className="mb-4">
        Projects
      </Heading>

      {/* Segmented control with inline “+ Add Project” */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="rounded-lg border border-gray-200 bg-white p-1 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setTab("existing")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeProjectType === "existing"
                ? "text-white bg-primary"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Existing Projects
          </button>
          <button
            type="button"
            onClick={() => setTab("completed")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeProjectType === "completed"
                ? "text-white bg-primary"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Completed Projects
          </button>

          {/* Inline + Add Project like a third tab (inactive style) */}
          {isOwnOrganization && (
            <Link
              href={`/organizations/${organizationSlug}/add-project`}
              className="px-4 py-2 text-sm font-medium rounded-md transition-colors text-gray-700 hover:text-gray-900"
            >
              + Add Project
            </Link>
          )}
        </div>
      </div>

      {/* Projects grid / empty state */}
      {currentProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center mb-section text-gray-500">
          <FolderOpen className="h-16 w-16 mb-subtitle text-gray-300" />
          <span className="text-lg font-semibold text-center mb-element">
            No projects found.
          </span>
          <span className="text-sm text-center">
            Check back later or contact the organization for updates.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-section">
          {visibleProjects.map((p) => (
            <ProjectCard
              key={p.id}
              href={`/campaigns/${p.organizationSlug}/${p.slug}`}
              title={p.title}
              description={p.description}
              imageUrl={p.projectBackgroundImage}
              organizationName={p.organization.name}
              beneficiaryLabel={
                p.beneficiaryCount
                  ? `${p.beneficiaryCount} beneficiaries`
                  : undefined
              }
              collected={p.collected}
              goalAmount={p.goal_amount}
              percent={p.percent}
            />
          ))}
        </div>
      )}

      {hasMoreProjects && (
        <div className="text-center">
          <Button size="lg" onClick={() => setDisplayCount((n) => n + 3)}>
            Show More
          </Button>
        </div>
      )}
    </section>
  );
}
