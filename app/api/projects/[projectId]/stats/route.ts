import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PingStatus } from "@/lib/generated/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ projectId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
    include: { endpoints: { select: { id: true } } },
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const endpointIds = project.endpoints.map((e) => e.id);

  if (endpointIds.length === 0) {
    return NextResponse.json({
      totalEndpoints: 0,
      up: 0,
      down: 0,
      degraded: 0,
    });
  }

  // Get the latest ping for each endpoint
  const latestPings = await Promise.all(
    endpointIds.map((id) =>
      prisma.ping.findFirst({
        where: { endpointId: id },
        orderBy: { checkedAt: "desc" },
        select: { status: true },
      })
    )
  );

  const counts = { up: 0, down: 0, degraded: 0 };
  for (const ping of latestPings) {
    if (!ping) continue;
    if (ping.status === PingStatus.UP) counts.up++;
    else if (ping.status === PingStatus.DOWN) counts.down++;
    else if (ping.status === PingStatus.DEGRADED) counts.degraded++;
  }

  return NextResponse.json({
    totalEndpoints: endpointIds.length,
    ...counts,
  });
}
