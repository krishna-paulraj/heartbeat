import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PingStatus } from "@/lib/generated/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Pencil,
  ArrowUpDown,
  Clock,
  Activity,
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { ResponseTimeChart } from "@/components/response-time-chart";
import { UptimeBar } from "@/components/uptime-bar";
import { DeleteEndpointButton } from "./delete-endpoint-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="hover:text-foreground transition-colors"
          >
            {endpoint.project.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{endpoint.name}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {endpoint.name}
              </h1>
              <StatusBadge status={latestPing?.status || null} />
            </div>
            <div className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="font-mono text-xs">
                {endpoint.method}
              </Badge>
              <span className="truncate max-w-md">{endpoint.url}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/dashboard/projects/${projectId}/endpoints/${endpointId}/edit`}
              >
                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                Edit
              </Link>
            </Button>
            <DeleteEndpointButton
              projectId={projectId}
              endpointId={endpointId}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                <ArrowUpDown className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Uptime (24h)</p>
                <p className="text-2xl font-bold">{stats.uptime}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">{stats.avgResponseTime}ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                <Activity className="h-4 w-4 text-violet-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Checks (24h)</p>
                <p className="text-2xl font-bold">{stats.totalPings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="mb-6 space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponseTimeChart data={chartData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">30-Day Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <UptimeBar days={uptimeDays} />
          </CardContent>
        </Card>
      </div>

      {/* Incidents */}
      {incidents.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-center justify-between px-6 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2 w-2 rounded-full ${incident.resolvedAt ? "bg-emerald-500" : "bg-red-500 animate-pulse"}`}
                    />
                    <span className="text-sm font-medium">
                      {incident.resolvedAt ? "Resolved" : "Ongoing"}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {incident.startedAt.toLocaleString()}
                    {incident.resolvedAt &&
                      ` — ${incident.resolvedAt.toLocaleString()}`}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Pings Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Recent Pings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentPings.length === 0 ? (
            <p className="px-6 pb-6 text-sm text-muted-foreground">
              No pings recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t text-muted-foreground">
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                    <th className="px-6 py-3 text-left font-medium">Code</th>
                    <th className="px-6 py-3 text-right font-medium">
                      Response
                    </th>
                    <th className="px-6 py-3 text-right font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentPings.slice(0, 20).map((ping) => (
                    <tr
                      key={ping.id.toString()}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-3">
                        <StatusBadge status={ping.status} />
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {ping.statusCode ?? "—"}
                      </td>
                      <td className="px-6 py-3 text-right text-muted-foreground">
                        {ping.responseTime}ms
                      </td>
                      <td className="px-6 py-3 text-right text-muted-foreground">
                        {ping.checkedAt.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
