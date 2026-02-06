import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 1000);
  const offset = parseInt(url.searchParams.get("offset") || "0");

  const ms = PERIOD_MS[period] || PERIOD_MS["24h"];
  const since = new Date(Date.now() - ms);

  const pings = await prisma.ping.findMany({
    where: { endpointId, checkedAt: { gte: since } },
    orderBy: { checkedAt: "desc" },
    take: limit,
    skip: offset,
  });

  // Convert BigInt id to string for JSON serialization
  const serialized = pings.map((p) => ({ ...p, id: p.id.toString() }));

  return NextResponse.json(serialized);
}
