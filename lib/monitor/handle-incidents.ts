import { PingStatus } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { dispatchNotifications } from "@/lib/notifications/dispatch";

const incidentInclude = {
  endpoint: {
    include: {
      project: {
        include: {
          user: { select: { email: true } },
        },
      },
    },
  },
} as const;

export async function handleIncidents(endpointId: string, status: PingStatus) {
  const openIncident = await prisma.incident.findFirst({
    where: { endpointId, resolvedAt: null },
    orderBy: { startedAt: "desc" },
  });

  if (status === PingStatus.DOWN) {
    if (!openIncident) {
      const incident = await prisma.incident.create({
        data: {
          endpointId,
          startedAt: new Date(),
        },
        include: incidentInclude,
      });

      console.log(
        `[notifications] Incident created for ${incident.endpoint.name}, dispatching notification...`,
      );
      dispatchNotifications(incident, "created").catch(console.error);
    }
  } else if (status === PingStatus.UP) {
    if (openIncident) {
      const incident = await prisma.incident.update({
        where: { id: openIncident.id },
        data: { resolvedAt: new Date() },
        include: incidentInclude,
      });

      console.log(
        `[notifications] Incident resolved for ${incident.endpoint.name}, dispatching notification...`,
      );
      dispatchNotifications(incident, "resolved").catch(console.error);
    }
  }
  // DEGRADED does not open or close incidents
}
