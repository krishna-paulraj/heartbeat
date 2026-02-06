import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ projectId: string; endpointId: string }> };

async function getOwnedEndpoint(projectId: string, endpointId: string, userId: string) {
  return prisma.endpoint.findFirst({
    where: {
      id: endpointId,
      projectId,
      project: { userId },
    },
  });
}

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, endpointId } = await params;
  const endpoint = await prisma.endpoint.findFirst({
    where: {
      id: endpointId,
      projectId,
      project: { userId: session.user.id },
    },
  });

  if (!endpoint) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(endpoint);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, endpointId } = await params;
  const existing = await getOwnedEndpoint(projectId, endpointId, session.user.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const { url, name, method, checkInterval, isActive } = body;

  const endpoint = await prisma.endpoint.update({
    where: { id: endpointId },
    data: {
      ...(url !== undefined && { url }),
      ...(name !== undefined && { name }),
      ...(method !== undefined && { method }),
      ...(checkInterval !== undefined && { checkInterval }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json(endpoint);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, endpointId } = await params;
  const existing = await getOwnedEndpoint(projectId, endpointId, session.user.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.endpoint.delete({ where: { id: endpointId } });

  return NextResponse.json({ success: true });
}
