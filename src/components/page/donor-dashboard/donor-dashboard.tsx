"use client";

import { Heading } from "@/src/components/global/heading";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { BarChart3, Home, Menu, User, X } from "lucide-react";
import { useState } from "react";
import DashboardView from "./dashboard-view";

export interface Props {
  profile: {
    user_id: string;
    first_name: string;
    last_name: string;
  };
}

export function DonorDashboard({ profile }: Props) {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sections = [
    {
      id: "overview",
      name: "Overview",
      icon: Home,
      content: <DashboardView />,
    },
    {
      id: "analytics",
      name: "Analytics",
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "View your data insights",
      content:
        "This section contains all your analytics and reporting tools. You can view performance metrics, generate reports, and analyze trends over time. Perfect for data visualization and business intelligence.",
    },
    {
      id: "profile",
      name: "Profile",
      icon: User,
      content:
        "This is the profile section. Here you can view and edit your profile information.",
    },
  ];

  const currentSection = sections.find(
    (section) => section.id === activeSection
  );

  return (
    <div className="flex min-h-svh bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <Heading
            level={5}
            className="text-lg font-semibold text-sidebar-foreground"
          >
            Organization Dashboard
          </Heading>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  activeSection === section.id
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
                onClick={() => {
                  setActiveSection(section.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon className="h-4 w-4" />
                {section.name}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <Heading level={5} className="text-lg font-semibold">
            Organization Dashboard
          </Heading>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>

        {/* Content area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">{currentSection?.content}</div>
        </main>
      </div>
    </div>
  );
}
