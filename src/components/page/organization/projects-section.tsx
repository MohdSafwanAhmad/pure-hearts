"use client";

import { Heading } from "@/src/components/global/heading";
import ProjectCard from "@/src/components/global/project-card";
import { Button } from "@/src/components/ui/button";
import { FolderOpen } from "lucide-react";
import { useState } from "react";

type ProjectType = "completed" | "existing";

interface Props {
  projects: {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    completionDate: Date | undefined;
    projectId: string;
    projectBackgroundImage: string;
    slug: string;
    goal_amount: number | null;
    collected: number;
    percent: number;
    organizationSlug: string;
    beneficiaryCount: number;
    organization: {
      name: string;
      organizationSlug: string;
    };
    /** NEW: present if you include deleted_at in your server query */
    deletedAt?: string | null;
  }[];
  addProjectButton?: React.ReactNode;
}

export function ProjectsSection({ projects, addProjectButton }: Props) {
  // Filter out soft-deleted first (works whether parent selects deleted_at or not)
  const activeProjects = projects.filter((p) => !p.deletedAt);

  const completedProjects = activeProjects.filter((project) => {
    if (project.completionDate === undefined) return false;
    return project.completionDate < new Date();
  });

  const existingProjects = activeProjects.filter((project) => {
    if (project.completionDate === undefined) return true;
    return project.completionDate >= new Date();
  });

  const [activeProjectType, setActiveProjectType] =
    useState<ProjectType>("completed");
  const projectsPerPage = 4;
  const [displayCount, setDisplayCount] = useState<number>(projectsPerPage);

  const currentProjects =
    activeProjectType === "completed" ? completedProjects : existingProjects;

  const visibleProjects = currentProjects.slice(0, displayCount);
  const hasMoreProjects = currentProjects.length > displayCount;

  const handleProjectTypeChange = (type: ProjectType) => {
    setActiveProjectType(type);
    setDisplayCount(projectsPerPage);
  };

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + 3);
  };

  return (
    <section className="mb-section">
      <Heading level={2} className="mb-subtitle">
        Projects
      </Heading>

      {/* Toggle + Add button */}
      <div className="flex mb-title items-center">
        <div className="rounded-lg border border-gray-200 bg-white p-1 flex">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleProjectTypeChange("completed");
            }}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeProjectType === "completed"
                ? "text-white bg-primary"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Completed Projects
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleProjectTypeChange("existing");
            }}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeProjectType === "existing"
                ? "text-white bg-primary"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Existing Projects
          </button>
        </div>

        {addProjectButton && (
          <div className="m-2">
            <div className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary/90 transition-colors">
              {addProjectButton}
            </div>
          </div>
        )}
      </div>

      {/* Grid / Empty */}
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
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              href={`/campaigns/${project.organizationSlug}/${project.slug}`}
              title={project.title}
              description={project.description}
              imageUrl={project.projectBackgroundImage}
              organizationName={project.organization.name}
              beneficiaryLabel={
                project.beneficiaryCount
                  ? `${project.beneficiaryCount} beneficiaries`
                  : undefined
              }
              collected={project.collected}
              goalAmount={project.goal_amount}
              percent={project.percent}
            />
          ))}
        </div>
      )}

      {hasMoreProjects && (
        <div className="text-center">
          <Button size="lg" onClick={handleShowMore}>
            Show More
          </Button>
        </div>
      )}
    </section>
  );
}
