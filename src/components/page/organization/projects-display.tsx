// src/components/page/organization/projects-display.tsx (Client Component)
"use client";

import { ProjectDetail } from "@/src/api/project";

export function ProjectsDisplay({ projects }: { projects: ProjectDetail[] }) {
  // Your client-side rendering logic here
  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  );
}
