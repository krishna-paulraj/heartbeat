import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Plus, Pencil } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { DeleteProjectButton } from "./delete-project-button";
import { NotificationSettings } from "@/components/notification-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link
            href="/dashboard"
            className="hover:text-foreground transition-colors"
          >
            Projects
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{project.name}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {project.name}
            </h1>
            {project.description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {project.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/projects/${projectId}/edit`}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                Edit
              </Link>
            </Button>
            <DeleteProjectButton projectId={projectId} />
          </div>
        </div>
      </div>

      {/* Endpoints */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base">
            Endpoints ({project.endpoints.length})
          </CardTitle>
          <Button size="sm" asChild>
            <Link href={`/dashboard/projects/${projectId}/new-endpoint`}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Endpoint
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {endpointsWithStatus.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No endpoints yet"
                description="Add an endpoint to start monitoring."
                actionLabel="Add Endpoint"
                actionHref={`/dashboard/projects/${projectId}/new-endpoint`}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t text-muted-foreground">
                    <th className="px-6 py-3 text-left font-medium">Name</th>
                    <th className="px-6 py-3 text-left font-medium">URL</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                    <th className="px-6 py-3 text-right font-medium">
                      Response
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {endpointsWithStatus.map((endpoint) => {
                    const href = `/dashboard/projects/${projectId}/endpoints/${endpoint.id}`;
                    return (
                      <tr
                        className="hover:bg-muted/50 transition-colors cursor-pointer"
                        key={endpoint.id}
                      >
                        <td className="p-0">
                          <Link
                            href={href}
                            className="block px-6 py-3.5 font-medium"
                          >
                            {endpoint.name}
                          </Link>
                        </td>
                        <td className="p-0 text-muted-foreground">
                          <Link href={href} className="block px-6 py-3.5">
                            <span className="inline-block max-w-[240px] truncate">
                              {endpoint.url}
                            </span>
                          </Link>
                        </td>
                        <td className="p-0">
                          <Link href={href} className="block px-6 py-3.5">
                            <StatusBadge status={endpoint.currentStatus} />
                          </Link>
                        </td>
                        <td className="p-0 text-right text-muted-foreground">
                          <Link href={href} className="block px-6 py-3.5">
                            {endpoint.responseTime !== null
                              ? `${endpoint.responseTime}ms`
                              : "—"}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="mt-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationSettings
            projectId={projectId}
            userEmail={session.user.email}
          />
        </CardContent>
      </Card>
    </div>
  );
}
