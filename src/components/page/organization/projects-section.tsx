"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Heading } from "@/src/components/global/heading";
import { Button } from "@/src/components/ui/button";
import { OrganizationProjectCard } from "./project-card";
import { FolderOpen } from "lucide-react";
import { isProjectCompleted } from "@/src/api/project";

type ProjectType = "completed" | "existing";

interface ProjectItem {
  title: string;
  description: string;
  projectId: string;
  startDate: Date;
  completionDate?: Date;
  projectBackgroundImage: string;
  slug: string;
  organizationSlug: string;

  // optional if your row has them; not required
  status?: string | null;
  is_completed?: boolean | null;
}

interface Props {
  projects: ProjectItem[];
  organizationSlug: string;
  isOwnOrganization?: boolean;
}

export function ProjectsSection({
  projects,
  organizationSlug,
  isOwnOrganization = false,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // read ?tab= from URL; default to "existing"
  const tabParam = (searchParams.get("tab") as ProjectType) || "existing";
  const [activeProjectType, setActiveProjectType] =
    useState<ProjectType>(tabParam);

  // keep local state in sync if URL changes (e.g., after form redirect)
  useEffect(() => {
    if (tabParam !== activeProjectType) setActiveProjectType(tabParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam]);

  // small mapper to the helper shape
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

  // when clicking the tab buttons, also update the URL (?tab=...)
  const setTab = (tab: ProjectType) => {
    setActiveProjectType(tab);
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <section className="mb-section">
      <Heading level={2} className="mb-subtitle">
        The list of projects
      </Heading>

      {/* Project Toggle */}
      <div className="flex mb-title">
        <div className="rounded-lg border border-gray-200 bg-white p-1">
          <button
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
            onClick={() => setTab("completed")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeProjectType === "completed"
                ? "text-white bg-primary"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Completed Projects
          </button>
        </div>

        <div className="flex justify-between items-center mb-4 ml-3">
          {isOwnOrganization && (
            <Link href={`/organizations/${organizationSlug}/add-project`}>
              <Button>+ Add New Project</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Projects Grid or Empty State */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-section">
          {currentProjects.map((project) => (
            <OrganizationProjectCard
              key={project.projectId}
              title={project.title}
              description={project.description}
              projectBackgroundImage={project.projectBackgroundImage}
              completionDate={project.completionDate}
              startDate={project.startDate}
              slug={project.slug}
              organizationSlug={project.organizationSlug}
              // optional props (safe if undefined)
              status={project.status ?? null}
              isCompletedFlag={project.is_completed ?? null}
            />
          ))}
        </div>
      )}

      {/* More Button */}
      <div className="text-center">
        <Button size="lg" disabled={currentProjects.length === 0}>
          More
        </Button>
      </div>
    </section>
  );
}
