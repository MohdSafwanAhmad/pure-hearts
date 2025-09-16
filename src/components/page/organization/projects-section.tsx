"use client";

import { useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Heading } from "@/src/components/global/heading";

type ProjectType = "completed" | "existing";

interface Project {
  id: number;
  title: string;
  completionDate?: string;
  statusNumber: string;
  description: string;
}

const completedProjects: Project[] = [
  {
    id: 1,
    title: "Nutrition for children with Down syndrome",
    completionDate: "24/11/2023",
    statusNumber: "46216",
    description:
      "Providing nutritional support for children with special needs",
  },
  {
    id: 2,
    title: "Health care for needy patients",
    completionDate: "05/10/2023",
    statusNumber: "46040",
    description: "Medical assistance program for underprivileged families",
  },
  {
    id: 3,
    title: "Therapy for children with Down syndrome",
    completionDate: "01/05/2022",
    statusNumber: "22998",
    description: "Therapeutic interventions and support services",
  },
];

const existingProjects: Project[] = [
  {
    id: 4,
    title: "Educational Support Program",
    statusNumber: "50123",
    description: "Ongoing educational assistance for special needs children",
  },
  {
    id: 5,
    title: "Community Outreach Initiative",
    statusNumber: "50456",
    description: "Building community awareness and support networks",
  },
];

export function ProjectsSection() {
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
                ? "text-white bg-emerald-600"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            Completed Projects
          </button>
          <button
            onClick={() => setActiveProjectType("existing")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeProjectType === "existing"
                ? "text-white bg-emerald-600"
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
          <Card key={project.id} className="overflow-hidden">
            <div className="relative h-48 bg-gray-200">
              <div className="absolute top-4 left-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">Logo</span>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-600">{project.title}</span>
              </div>
              <div className="text-xs text-gray-500 mb-3 line-clamp-2">
                {project.description}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">
                    {activeProjectType === "completed"
                      ? "Completion History"
                      : "Start Date"}
                  </span>
                  <div className="font-semibold">
                    {project.completionDate || "01/01/2024"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Status number</span>
                  <div className="font-semibold">{project.statusNumber}</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {activeProjectType === "completed" ? (
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    Review of the report
                  </Button>
                ) : (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Support Project
                  </Button>
                )}
                <Button variant="outline" className="w-full text-gray-600">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* More Button */}
      <div className="text-center">
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2">
          More
        </Button>
      </div>
    </section>
  );
}
