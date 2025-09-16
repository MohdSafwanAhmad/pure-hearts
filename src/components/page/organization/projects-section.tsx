"use client";

import { Heading } from "@/src/components/global/heading";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";
import { OrganizationProjectCard } from "./project-card";

type ProjectType = "completed" | "existing";

interface Props {
  projects: {
    title: string;
    description: string;
    projectId: string;
    startDate: Date;
    completionDate?: Date;
    projectBackgroundImage: string;
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
      <div className="flex mb-subtitle">
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {currentProjects.map((project) => (
          <OrganizationProjectCard
            key={project.projectId}
            title={project.title}
            description={project.description}
            projectBackgroundImage={project.projectBackgroundImage}
            completionDate={project.completionDate}
            startDate={project.startDate}
            projectId={project.projectId}
          />
        ))}
      </div>

      {/* More Button */}
      <div className="text-center">
        <Button size={"lg"}>More</Button>
      </div>
    </section>
  );
}
