import { PingStatus } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

export async function handleIncidents(endpointId: string, status: PingStatus) {
  const openIncident = await prisma.incident.findFirst({
    where: { endpointId, resolvedAt: null },
    orderBy: { startedAt: "desc" },
  });

  if (status === PingStatus.DOWN) {
    if (!openIncident) {
      await prisma.incident.create({
        data: {
          endpointId,
          startedAt: new Date(),
        },
      });
    }
  } else if (status === PingStatus.UP) {
    if (openIncident) {
      await prisma.incident.update({
        where: { id: openIncident.id },
        data: { resolvedAt: new Date() },
      });
    }
  }
  // DEGRADED does not open or close incidents
}
