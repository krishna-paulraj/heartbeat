import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PingStatus } from "@/lib/generated/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Globe } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
        };
      }

      const latestPings = await Promise.all(
        project.endpoints.map((e) =>
          prisma.ping.findFirst({
            where: { endpointId: e.id },
            orderBy: { checkedAt: "desc" },
            select: { status: true },
          }),
        ),
      );

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
      };
    }),
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Manage your monitored services
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new-project">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {projectsWithStatus.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create your first project to start monitoring endpoints."
          actionLabel="New Project"
          actionHref="/dashboard/new-project"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projectsWithStatus.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/projects/${project.id}`}
              className="group"
            >
              <Card className="transition-all hover:shadow-md hover:border-border/80 group-hover:-translate-y-0.5">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <h2 className="font-semibold">{project.name}</h2>
                        {project.description && (
                          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={project.overallStatus} />
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      {project.endpointCount} endpoint
                      {project.endpointCount !== 1 ? "s" : ""}
                    </span>
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
