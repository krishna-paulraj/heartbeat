import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dispatchNotifications } from "@/lib/notifications/dispatch";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ projectId: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });
  if (!project)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const channels = await prisma.notificationChannel.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(channels);
}

export async function POST(request: NextRequest, { params }: Params) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });
  if (!project)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const { type, enabled } = body;

  if (!type) {
    return NextResponse.json({ error: "type is required" }, { status: 400 });
  }

  const channel = await prisma.notificationChannel.upsert({
    where: { projectId_type: { projectId, type } },
    update: { enabled: enabled ?? true },
    create: { projectId, type, enabled: enabled ?? true },
  });

  // If enabling, notify about any currently active incidents
  if (channel.enabled) {
    const activeIncidents = await prisma.incident.findMany({
      where: {
        resolvedAt: null,
        endpoint: { projectId },
      },
      include: {
        endpoint: {
          include: {
            project: {
              include: { user: { select: { email: true } } },
            },
          },
        },
      },
    });

    for (const incident of activeIncidents) {
      dispatchNotifications(incident, "created").catch(console.error);
    }
  }

  return NextResponse.json(channel);
}
