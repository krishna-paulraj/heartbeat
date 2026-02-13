import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PingStatus } from "@/lib/generated/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  ArrowUpDown,
  Radio,
  Activity,
  ChevronRight,
} from "lucide-react";
import { NewProjectSheet } from "@/components/new-project-sheet";
import { Card, CardContent } from "@/components/ui/card";

function statusDot(status: string | null) {
  switch (status) {
    case "UP":
      return "bg-emerald-500";
    case "DEGRADED":
      return "bg-yellow-500";
    case "DOWN":
      return "bg-red-500";
    default:
      return "bg-muted-foreground/30";
  }
}

function statusLabel(status: string | null) {
  switch (status) {
    case "UP":
      return "Operational";
    case "DEGRADED":
      return "Degraded";
    case "DOWN":
      return "Down";
    default:
      return "No data";
  }
}

function statusTextColor(status: string | null) {
  switch (status) {
    case "UP":
      return "text-emerald-500";
    case "DEGRADED":
      return "text-yellow-500";
    case "DOWN":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      endpoints: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const projectsWithStatus = await Promise.all(
    projects.map(async (project) => {
      if (project.endpoints.length === 0) {
        return {
          ...project,
          overallStatus: null as PingStatus | null,
          endpointCount: 0,
          uptime: null as number | null,
          avgResponse: null as number | null,
        };
      }

      const endpointIds = project.endpoints.map((e) => e.id);

      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const [latestPings, totalPings, upPings, avgResp] = await Promise.all([
        Promise.all(
          project.endpoints.map((e) =>
            prisma.ping.findFirst({
              where: { endpointId: e.id },
              orderBy: { checkedAt: "desc" },
              select: { status: true },
            }),
          ),
        ),
        prisma.ping.count({
          where: {
            endpointId: { in: endpointIds },
            checkedAt: { gte: twentyFourHoursAgo },
          },
        }),
        prisma.ping.count({
          where: {
            endpointId: { in: endpointIds },
            checkedAt: { gte: twentyFourHoursAgo },
            status: { in: [PingStatus.UP, PingStatus.DEGRADED] },
          },
        }),
        prisma.ping.aggregate({
          where: {
            endpointId: { in: endpointIds },
            checkedAt: { gte: twentyFourHoursAgo },
          },
          _avg: { responseTime: true },
        }),
      ]);

      const statuses = latestPings.filter(Boolean).map((p) => p!.status);
      let overallStatus: PingStatus | null = null;
      if (statuses.includes(PingStatus.DOWN)) overallStatus = PingStatus.DOWN;
      else if (statuses.includes(PingStatus.DEGRADED))
        overallStatus = PingStatus.DEGRADED;
      else if (statuses.length > 0) overallStatus = PingStatus.UP;

      return {
        ...project,
        overallStatus,
        endpointCount: project.endpoints.length,
        uptime:
          totalPings > 0
            ? Math.round((upPings / totalPings) * 10000) / 100
            : null,
        avgResponse: avgResp._avg.responseTime
          ? Math.round(avgResp._avg.responseTime)
          : null,
      };
    }),
  );

  const totalEndpoints = projectsWithStatus.reduce(
    (sum, p) => sum + p.endpointCount,
    0,
  );
  const allOperational = projectsWithStatus.every(
    (p) => p.overallStatus === "UP" || p.overallStatus === null,
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            {projectsWithStatus.length > 0
              ? `${projectsWithStatus.length} project${projectsWithStatus.length !== 1 ? "s" : ""}, ${totalEndpoints} endpoint${totalEndpoints !== 1 ? "s" : ""}`
              : "Manage your monitored services"}
          </p>
        </div>
        <NewProjectSheet projectCount={projectsWithStatus.length} />
      </div>

      {/* Overall status banner */}
      {projectsWithStatus.length > 0 && (
        <Card
          className={
            allOperational
              ? "border-emerald-500/20 bg-emerald-500/5"
              : "border-red-500/20 bg-red-500/5"
          }
        >
          <CardContent className="flex items-center gap-3 py-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${allOperational ? "bg-emerald-500" : "bg-red-500 animate-pulse"}`}
            />
            <span className="text-sm font-medium">
              {allOperational
                ? "All systems operational"
                : "Some services are experiencing issues"}
            </span>
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      {projectsWithStatus.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Globe className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">No projects yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first project to start monitoring endpoints.
            </p>
            <div className="mt-6">
              <NewProjectSheet projectCount={projectsWithStatus.length} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {projectsWithStatus.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="group block"
            >
              <Card className="transition-all hover:shadow-md group-hover:border-foreground/20">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-4">
                    {/* Status dot */}
                    <div className="relative flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span
                        className={`absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-background ${statusDot(project.overallStatus)}`}
                      />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="truncate font-semibold">
                          {project.name}
                        </h2>
                        <span
                          className={`text-xs font-medium ${statusTextColor(project.overallStatus)}`}
                        >
                          {statusLabel(project.overallStatus)}
                        </span>
                      </div>
                      {project.description && (
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                          {project.description}
                        </p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="hidden items-center gap-6 sm:flex">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Endpoints
                        </p>
                        <p className="text-sm font-semibold tabular-nums">
                          {project.endpointCount}
                        </p>
                      </div>
                      {project.uptime !== null && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Uptime
                          </p>
                          <p className="text-sm font-semibold tabular-nums">
                            {project.uptime}%
                          </p>
                        </div>
                      )}
                      {project.avgResponse !== null && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Avg Response
                          </p>
                          <p className="text-sm font-semibold tabular-nums">
                            {project.avgResponse}ms
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
