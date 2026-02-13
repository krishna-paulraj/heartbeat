import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Radio } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { ProjectActions } from "./project-actions";
import { NewEndpointSheet } from "@/components/new-endpoint-sheet";
import { NotificationSettings } from "@/components/notification-settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{project.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          {project.description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>
        <ProjectActions projectId={projectId} />
      </div>

      <Separator />

      {/* Endpoints */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Endpoints</CardTitle>
            <CardDescription>
              {project.endpoints.length} endpoint
              {project.endpoints.length !== 1 ? "s" : ""} monitored
            </CardDescription>
          </div>
          <NewEndpointSheet
            projectId={projectId}
            endpointCount={project.endpoints.length}
          />
        </CardHeader>
        <CardContent className="p-0">
          {endpointsWithStatus.length === 0 ? (
            <div className="flex flex-col items-center justify-center border-t py-16">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Radio className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold">No endpoints yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add an endpoint to start monitoring.
              </p>
              <div className="mt-4">
                <NewEndpointSheet
                  projectId={projectId}
                  endpointCount={project.endpoints.length}
                />
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Response</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {endpointsWithStatus.map((endpoint) => {
                  const href = `/dashboard/projects/${projectId}/endpoints/${endpoint.id}`;
                  return (
                    <TableRow key={endpoint.id} className="cursor-pointer">
                      <TableCell className="pl-6">
                        <Link
                          href={href}
                          className="font-medium hover:underline"
                        >
                          {endpoint.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <Link href={href}>
                          <span className="inline-block max-w-[260px] truncate font-mono text-xs">
                            {endpoint.url}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={href}>
                          <StatusBadge status={endpoint.currentStatus} />
                        </Link>
                      </TableCell>
                      <TableCell className="text-right pr-6 tabular-nums text-muted-foreground">
                        <Link href={href}>
                          {endpoint.responseTime !== null
                            ? `${endpoint.responseTime}ms`
                            : "—"}
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
          <CardDescription>
            Configure how you want to be alerted when endpoints go down.
          </CardDescription>
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
