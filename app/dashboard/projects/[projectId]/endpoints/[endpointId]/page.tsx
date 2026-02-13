import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PingStatus } from "@/lib/generated/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpDown, Clock, Activity } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { ResponseTimeChart } from "@/components/response-time-chart";
import { UptimeBar } from "@/components/uptime-bar";
import { EndpointActions } from "./endpoint-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

export default async function EndpointDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; endpointId: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const { projectId, endpointId } = await params;

  const endpoint = await prisma.endpoint.findFirst({
    where: { id: endpointId, projectId, project: { userId: session.user.id } },
    include: { project: { select: { name: true } } },
  });

  if (!endpoint) notFound();

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [recentPings, stats, incidents, dailyPings] = await Promise.all([
    prisma.ping.findMany({
      where: { endpointId, checkedAt: { gte: twentyFourHoursAgo } },
      orderBy: { checkedAt: "desc" },
      take: 100,
    }),
    (async () => {
      const [total, up, avg] = await Promise.all([
        prisma.ping.count({
          where: { endpointId, checkedAt: { gte: twentyFourHoursAgo } },
        }),
        prisma.ping.count({
          where: {
            endpointId,
            checkedAt: { gte: twentyFourHoursAgo },
            status: { in: [PingStatus.UP, PingStatus.DEGRADED] },
          },
        }),
        prisma.ping.aggregate({
          where: { endpointId, checkedAt: { gte: twentyFourHoursAgo } },
          _avg: { responseTime: true },
        }),
      ]);
      return {
        uptime: total > 0 ? Math.round((up / total) * 10000) / 100 : 100,
        avgResponseTime: Math.round(avg._avg.responseTime || 0),
        totalPings: total,
      };
    })(),
    prisma.incident.findMany({
      where: { endpointId },
      orderBy: { startedAt: "desc" },
      take: 10,
    }),
    prisma.ping.findMany({
      where: { endpointId, checkedAt: { gte: thirtyDaysAgo } },
      select: { status: true, checkedAt: true },
      orderBy: { checkedAt: "asc" },
    }),
  ]);

  const latestPing = recentPings[0] || null;

  const chartData = [...recentPings].reverse().map((p) => ({
    checkedAt: p.checkedAt.toISOString(),
    responseTime: p.responseTime,
  }));

  const dayMap = new Map<string, { total: number; up: number }>();
  for (const ping of dailyPings) {
    const day = ping.checkedAt.toISOString().split("T")[0];
    const entry = dayMap.get(day) || { total: 0, up: 0 };
    entry.total++;
    if (ping.status !== PingStatus.DOWN) entry.up++;
    dayMap.set(day, entry);
  }
  const uptimeDays = Array.from(dayMap.entries()).map(([date, data]) => ({
    date,
    uptimePercentage: data.total > 0 ? (data.up / data.total) * 100 : 100,
  }));

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
            <BreadcrumbLink asChild>
              <Link href={`/dashboard/projects/${projectId}`}>
                {endpoint.project.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{endpoint.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {endpoint.name}
            </h1>
            <StatusBadge status={latestPing?.status || null} />
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="font-mono text-xs">
              {endpoint.method}
            </Badge>
            <span className="truncate max-w-md font-mono text-xs">
              {endpoint.url}
            </span>
          </div>
        </div>
        <EndpointActions projectId={projectId} endpointId={endpointId} />
      </div>

      <Separator />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-xs font-medium">
              Uptime (24h)
            </CardDescription>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.uptime}%</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.uptime >= 99
                ? "All systems operational"
                : stats.uptime >= 95
                  ? "Minor issues detected"
                  : "Degraded performance"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-xs font-medium">
              Avg Response
            </CardDescription>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.avgResponseTime}ms</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.avgResponseTime < 200
                ? "Excellent performance"
                : stats.avgResponseTime < 500
                  ? "Good performance"
                  : "Slow response times"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription className="text-xs font-medium">
              Checks (24h)
            </CardDescription>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalPings}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Every {endpoint.checkInterval}s interval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Response Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Response Time</CardTitle>
          <CardDescription>Last 24 hours of response times</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponseTimeChart data={chartData} />
        </CardContent>
      </Card>

      {/* 30-Day Uptime */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">30-Day Uptime</CardTitle>
          <CardDescription>
            Daily uptime percentage over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UptimeBar days={uptimeDays} />
        </CardContent>
      </Card>

      {/* Incidents */}
      {incidents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Incidents</CardTitle>
            <CardDescription>
              {incidents.filter((i) => !i.resolvedAt).length} ongoing,{" "}
              {incidents.filter((i) => i.resolvedAt).length} resolved
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Status</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead className="pr-6">Resolved</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${incident.resolvedAt ? "bg-emerald-500" : "bg-red-500 animate-pulse"}`}
                        />
                        <Badge
                          variant={
                            incident.resolvedAt ? "secondary" : "destructive"
                          }
                          className="text-xs"
                        >
                          {incident.resolvedAt ? "Resolved" : "Ongoing"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {incident.startedAt.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground pr-6">
                      {incident.resolvedAt
                        ? incident.resolvedAt.toLocaleString()
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Recent Pings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Pings</CardTitle>
          <CardDescription>
            Last {Math.min(recentPings.length, 20)} checks
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {recentPings.length === 0 ? (
            <div className="flex items-center justify-center border-t py-12">
              <p className="text-sm text-muted-foreground">
                No pings recorded yet.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Status</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead className="text-right">Response</TableHead>
                  <TableHead className="text-right pr-6">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPings.slice(0, 20).map((ping) => (
                  <TableRow key={ping.id.toString()}>
                    <TableCell className="pl-6">
                      <StatusBadge status={ping.status} />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {ping.statusCode ?? "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {ping.responseTime}ms
                    </TableCell>
                    <TableCell className="text-right pr-6 text-muted-foreground">
                      {ping.checkedAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
