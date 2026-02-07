import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { DeleteProjectButton } from "./delete-project-button";
import { NotificationSettings } from "@/components/notification-settings";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const { projectId } = await params;
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
    include: {
      endpoints: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!project) notFound();

  // Get latest ping for each endpoint
  const endpointsWithStatus = await Promise.all(
    project.endpoints.map(async (endpoint) => {
      const latestPing = await prisma.ping.findFirst({
        where: { endpointId: endpoint.id },
        orderBy: { checkedAt: "desc" },
      });
      return {
        ...endpoint,
        currentStatus: latestPing?.status || null,
        responseTime: latestPing?.responseTime || null,
        lastCheckedAt: latestPing?.checkedAt || null,
      };
    }),
  );

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link
            href="/dashboard"
            className="hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            Projects
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-50">
            {project.name}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {project.name}
            </h1>
            {project.description && (
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {project.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/projects/${projectId}/edit`}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Edit
            </Link>
            <DeleteProjectButton projectId={projectId} />
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Endpoints ({project.endpoints.length})
        </h2>
        <Link
          href={`/dashboard/projects/${projectId}/new-endpoint`}
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Add Endpoint
        </Link>
      </div>

      {endpointsWithStatus.length === 0 ? (
        <EmptyState
          title="No endpoints yet"
          description="Add an endpoint to start monitoring."
          actionLabel="Add Endpoint"
          actionHref={`/dashboard/projects/${projectId}/new-endpoint`}
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-zinc-500 dark:text-zinc-400">
                  Name
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-zinc-500 dark:text-zinc-400">
                  URL
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-zinc-500 dark:text-zinc-400">
                  Status
                </th>
                <th className="px-4 py-2.5 text-right font-medium text-zinc-500 dark:text-zinc-400">
                  Response
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {endpointsWithStatus.map((endpoint) => (
                <tr key={endpoint.id} className="bg-white dark:bg-zinc-950">
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/projects/${projectId}/endpoints/${endpoint.id}`}
                      className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                    >
                      {endpoint.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">
                    <span className="inline-block max-w-[200px] truncate">
                      {endpoint.url}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={endpoint.currentStatus} />
                  </td>
                  <td className="px-4 py-3 text-right text-zinc-500 dark:text-zinc-400">
                    {endpoint.responseTime !== null
                      ? `${endpoint.responseTime}ms`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8">
        <h2 className="mb-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Notifications
        </h2>
        <NotificationSettings
          projectId={projectId}
          userEmail={session.user.email}
        />
      </div>
    </div>
  );
}
