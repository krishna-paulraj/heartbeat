import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PingStatus } from "@/lib/generated/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const PERIOD_MS: Record<string, number> = {
  "1h": 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

type Params = { params: Promise<{ projectId: string; endpointId: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, endpointId } = await params;
  const endpoint = await prisma.endpoint.findFirst({
    where: { id: endpointId, projectId, project: { userId: session.user.id } },
  });
  if (!endpoint) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const url = new URL(request.url);
  const period = url.searchParams.get("period") || "24h";
  const ms = PERIOD_MS[period] || PERIOD_MS["24h"];
  const since = new Date(Date.now() - ms);

  const [totalPings, upPings, avgResult, latestPing] = await Promise.all([
    prisma.ping.count({
      where: { endpointId, checkedAt: { gte: since } },
    }),
    prisma.ping.count({
      where: { endpointId, checkedAt: { gte: since }, status: { in: [PingStatus.UP, PingStatus.DEGRADED] } },
    }),
    prisma.ping.aggregate({
      where: { endpointId, checkedAt: { gte: since } },
      _avg: { responseTime: true },
    }),
    prisma.ping.findFirst({
      where: { endpointId },
      orderBy: { checkedAt: "desc" },
    }),
  ]);

  const uptimePercentage = totalPings > 0 ? (upPings / totalPings) * 100 : 100;

  return NextResponse.json({
    uptimePercentage: Math.round(uptimePercentage * 100) / 100,
    avgResponseTime: Math.round(avgResult._avg.responseTime || 0),
    totalPings,
    currentStatus: latestPing?.status || null,
    lastCheckedAt: latestPing?.checkedAt || null,
  });
}
