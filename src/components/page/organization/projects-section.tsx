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
  }[];
}

export function ProjectsSection({ projects }: Props) {
  const completedProjects = projects.filter((project) => {
    if (project.completionDate === undefined) return false;

    if (project.completionDate < new Date()) return true;

    return false;
  });

  const existingProjects = projects.filter((project) => {
    if (project.completionDate === undefined) return true;
    if (project.completionDate >= new Date()) return true;

    return false;
  });

  const [activeProjectType, setActiveProjectType] =
    useState<ProjectType>("completed");
  const projectsPerPage = 4; // Number of projects to show per "page"
  const [displayCount, setDisplayCount] = useState<number>(projectsPerPage);

  const currentProjects =
    activeProjectType === "completed" ? completedProjects : existingProjects;

  const visibleProjects = currentProjects.slice(0, displayCount);
  const hasMoreProjects = currentProjects.length > displayCount;

  // Reset display count when switching project types
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

      {/* Project Toggle */}
      <div className="flex mb-title">
        <div className="rounded-lg border border-gray-200 bg-white p-1">
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

      {/* More Button - Only show if there are more projects to load */}
      {hasMoreProjects && (
        <div className="text-center">
          <Button size={"lg"} onClick={handleShowMore}>
            Show More
          </Button>
        </div>
      )}
    </section>
  );
}
