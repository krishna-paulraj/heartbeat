import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: Promise<{ projectId: string; channelId: string }> };

async function getOwnedChannel(projectId: string, channelId: string, userId: string) {
  return prisma.notificationChannel.findFirst({
    where: {
      id: channelId,
      projectId,
      project: { userId },
    },
  });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, channelId } = await params;
  const existing = await getOwnedChannel(projectId, channelId, session.user.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const { enabled } = body;

  const channel = await prisma.notificationChannel.update({
    where: { id: channelId },
    data: { ...(enabled !== undefined && { enabled }) },
  });

  return NextResponse.json(channel);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, channelId } = await params;
  const existing = await getOwnedChannel(projectId, channelId, session.user.id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.notificationChannel.delete({ where: { id: channelId } });

  return NextResponse.json({ success: true });
}
