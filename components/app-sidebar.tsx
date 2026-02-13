"use client";

import * as React from "react";
import {
  IconActivity,
  IconCircleFilled,
  IconHelp,
  IconLayoutDashboard,
  IconPlus,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavUser } from "@/components/nav-user";
import { NewProjectSheet } from "@/components/new-project-sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

type ProjectItem = {
  id: string;
  name: string;
  overallStatus: "UP" | "DOWN" | "DEGRADED" | null;
  endpointCount: number;
};

function statusColor(status: string | null) {
  switch (status) {
    case "UP":
      return "text-emerald-500";
    case "DEGRADED":
      return "text-yellow-500";
    case "DOWN":
      return "text-red-500";
    default:
      return "text-muted-foreground/40";
  }
}

export function AppSidebar({
  user,
  projects,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string };
  projects: ProjectItem[];
}) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <IconActivity className="!size-5 text-emerald-500" />
                <span className="text-base font-semibold">Heartbeat</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        {/* Main nav */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  tooltip="Projects"
                >
                  <Link href="/dashboard">
                    <IconLayoutDashboard />
                    <span>Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/settings"}
                  tooltip="Settings"
                >
                  <Link href="/dashboard/settings">
                    <IconSettings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Projects list */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between pr-1">
            <span>Projects</span>
            <NewProjectSheet projectCount={projects.length}>
              <button className="flex h-5 w-5 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <IconPlus className="size-3.5" />
              </button>
            </NewProjectSheet>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.length === 0 ? (
                <div className="px-2 py-3 text-xs text-muted-foreground">
                  No projects yet
                </div>
              ) : (
                projects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(
                        `/dashboard/projects/${project.id}`,
                      )}
                      tooltip={project.name}
                    >
                      <Link href={`/dashboard/projects/${project.id}`}>
                        <IconCircleFilled
                          className={`!size-2.5 shrink-0 ${statusColor(project.overallStatus)}`}
                        />
                        <span className="truncate">{project.name}</span>
                        <span className="ml-auto text-xs tabular-nums text-sidebar-foreground/60">
                          {project.endpointCount}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Help">
                  <a href="mailto:krishnapaulraj2004@gmail.com">
                    <IconHelp />
                    <span>Help</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
