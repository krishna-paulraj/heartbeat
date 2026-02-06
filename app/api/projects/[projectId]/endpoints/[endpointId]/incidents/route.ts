import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ projectId: string; endpointId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, endpointId } = await params;
  const endpoint = await prisma.endpoint.findFirst({
    where: { id: endpointId, projectId, project: { userId: session.user.id } },
  });
  if (!endpoint) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const incidents = await prisma.incident.findMany({
    where: { endpointId },
    orderBy: { startedAt: "desc" },
    take: 50,
  });

  return NextResponse.json(incidents);
}
