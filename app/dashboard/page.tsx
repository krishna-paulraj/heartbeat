import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PingStatus } from "@/lib/generated/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";

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

  // Get latest ping status for each project's endpoints
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
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Projects
        </h1>
        <Link
          href="/dashboard/new-project"
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          New Project
        </Link>
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
              className="rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-medium text-zinc-900 dark:text-zinc-50">
                    {project.name}
                  </h2>
                  {project.description && (
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {project.description}
                    </p>
                  )}
                </div>
                <StatusBadge status={project.overallStatus} />
              </div>
              <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
                {project.endpointCount} endpoint
                {project.endpointCount !== 1 ? "s" : ""}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
