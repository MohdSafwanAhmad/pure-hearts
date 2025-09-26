"use client";

import { Heading } from "@/src/components/global/heading";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Home, User, BarChart3 } from "lucide-react";
import LogoutButton from "@/src/components/global/logout-button";

export interface Props {
  dashboardType: "organization" | "donor";
  children: React.ReactNode;
  sections: {
    id: string;
    name: string;
    icon: string;
    href: string;
  }[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  User,
  BarChart3,
};

export function DashboardNavigation({
  dashboardType,
  children,
  sections,
}: Props) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-svh bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
              <Heading
                level={5}
                className="text-lg font-semibold text-sidebar-foreground"
              >
                {dashboardType === "organization"
                  ? "Organization Dashboard"
                  : "Donor Dashboard"}
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
                const Icon = iconMap[section.icon];
                const isActive = pathname.endsWith(section.id);
                return (
                  <Link key={section.id} href={section.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      {section.name}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="p-4 pb-8">
            {/* Logout button at the bottom of the sidebar */}
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <Heading level={5} className="text-lg font-semibold">
            {dashboardType === "organization"
              ? "Organization Dashboard"
              : "Donor Dashboard"}
          </Heading>
          <div className="w-8" />
        </div>
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
