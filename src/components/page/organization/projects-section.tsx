"use client";

import { Heading } from "@/src/components/global/heading";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { OrganizationProjectCard } from "./project-card";

import { FolderOpen } from "lucide-react";

type ProjectType = "completed" | "existing";

interface Props {
  projects: {
    title: string;
    description: string;
    projectId: string;
    startDate: Date;
    completionDate?: Date;
    projectBackgroundImage: string;
    slug: string;
    organizationSlug: string;
  }[];
}

export function ProjectsSection({ projects }: Props) {
  const completedProjects = projects.filter(
    (project) => project.completionDate
  );
  const existingProjects = projects.filter(
    (project) => !project.completionDate
  );

  const [activeProjectType, setActiveProjectType] =
    useState<ProjectType>("completed");

  const currentProjects =
    activeProjectType === "completed" ? completedProjects : existingProjects;

  return (
    <section className="mb-section">
      <Heading level={2} className="mb-subtitle">
        The list of projects
      </Heading>

      {/* Project Toggle */}
      <div className="flex mb-title">
        <div className="rounded-lg border border-gray-200 bg-white p-1">
          <button
            onClick={() => setActiveProjectType("completed")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeProjectType === "completed"
                ? "text-white bg-primary"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Completed Projects
          </button>
          <button
            onClick={() => setActiveProjectType("existing")}
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
            />
          ))}
        </div>
      )}

      {/* More Button */}
      <div className="text-center">
        <Button size={"lg"} disabled={currentProjects.length === 0}>
          More
        </Button>
      </div>
    </section>
  );
}
