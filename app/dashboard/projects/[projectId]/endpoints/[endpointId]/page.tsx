import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PingStatus } from "@/lib/generated/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { ResponseTimeChart } from "@/components/response-time-chart";
import { UptimeBar } from "@/components/uptime-bar";
import { DeleteEndpointButton } from "./delete-endpoint-button";

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
    // Last 100 pings for the table
    prisma.ping.findMany({
      where: { endpointId, checkedAt: { gte: twentyFourHoursAgo } },
      orderBy: { checkedAt: "desc" },
      take: 100,
    }),
    // Stats for the period
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
    // Recent incidents
    prisma.incident.findMany({
      where: { endpointId },
      orderBy: { startedAt: "desc" },
      take: 10,
    }),
    // Daily pings for uptime bar (last 30 days)
    prisma.ping.findMany({
      where: { endpointId, checkedAt: { gte: thirtyDaysAgo } },
      select: { status: true, checkedAt: true },
      orderBy: { checkedAt: "asc" },
    }),
  ]);

  const latestPing = recentPings[0] || null;

  // Build chart data (reverse for chronological order)
  const chartData = [...recentPings].reverse().map((p) => ({
    checkedAt: p.checkedAt.toISOString(),
    responseTime: p.responseTime,
  }));

  // Build daily uptime data
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
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link
            href="/dashboard"
            className="hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            Projects
          </Link>
          <span>/</span>
          <Link
            href={`/dashboard/projects/${projectId}`}
            className="hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            {endpoint.project.name}
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-50">
            {endpoint.name}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                {endpoint.name}
              </h1>
              <StatusBadge status={latestPing?.status || null} />
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {endpoint.method} {endpoint.url}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/projects/${projectId}/endpoints/${endpointId}/edit`}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Edit
            </Link>
            <DeleteEndpointButton
              projectId={projectId}
              endpointId={endpointId}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Uptime (24h)
          </p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {stats.uptime}%
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Avg Response
          </p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {stats.avgResponseTime}ms
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Checks (24h)
          </p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {stats.totalPings}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="mb-6 space-y-4">
        <ResponseTimeChart data={chartData} />
        <UptimeBar days={uptimeDays} />
      </div>

      {/* Incidents */}
      {incidents.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Recent Incidents
          </h2>
          <div className="space-y-2">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-2 w-2 rounded-full ${incident.resolvedAt ? "bg-emerald-500" : "bg-red-500"}`}
                  />
                  <span className="text-sm text-zinc-900 dark:text-zinc-50">
                    {incident.resolvedAt ? "Resolved" : "Ongoing"}
                  </span>
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {incident.startedAt.toLocaleString()}
                  {incident.resolvedAt &&
                    ` — ${incident.resolvedAt.toLocaleString()}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Pings Table */}
      <div>
        <h2 className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Recent Pings
        </h2>
        {recentPings.length === 0 ? (
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            No pings recorded yet. Run the cron job to start monitoring.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium text-zinc-500 dark:text-zinc-400">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-left font-medium text-zinc-500 dark:text-zinc-400">
                    Code
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium text-zinc-500 dark:text-zinc-400">
                    Response
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium text-zinc-500 dark:text-zinc-400">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {recentPings.slice(0, 20).map((ping) => (
                  <tr
                    key={ping.id.toString()}
                    className="bg-white dark:bg-zinc-950"
                  >
                    <td className="px-4 py-2.5">
                      <StatusBadge status={ping.status} />
                    </td>
                    <td className="px-4 py-2.5 text-zinc-500 dark:text-zinc-400">
                      {ping.statusCode ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right text-zinc-500 dark:text-zinc-400">
                      {ping.responseTime}ms
                    </td>
                    <td className="px-4 py-2.5 text-right text-zinc-500 dark:text-zinc-400">
                      {ping.checkedAt.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
