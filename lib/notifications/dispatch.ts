import { prisma } from "@/lib/prisma";
import { NotificationChannelType } from "@/lib/generated/prisma";
import { sendEmail } from "./send-email";
import { incidentCreatedEmail, incidentResolvedEmail } from "./templates";

type IncidentWithContext = {
  id: string;
  startedAt: Date;
  resolvedAt: Date | null;
  endpoint: {
    name: string;
    url: string;
    project: {
      id: string;
      name: string;
      user: {
        email: string;
      };
    };
  };
};

export async function dispatchNotifications(
  incident: IncidentWithContext,
  type: "created" | "resolved",
) {
  const { endpoint } = incident;
  const { project } = endpoint;

  const channels = await prisma.notificationChannel.findMany({
    where: { projectId: project.id, enabled: true },
  });

  console.log(
    `[notifications] Found ${channels.length} enabled channel(s) for project ${project.id}`,
  );

  for (const channel of channels) {
    let success = true;
    let message: string | null = null;

    try {
      if (channel.type === NotificationChannelType.EMAIL) {
        const { subject, html } =
          type === "created"
            ? incidentCreatedEmail(
                endpoint.name,
                endpoint.url,
                project.name,
                incident.startedAt,
              )
            : incidentResolvedEmail(
                endpoint.name,
                endpoint.url,
                project.name,
                incident.startedAt,
                incident.resolvedAt!,
              );

        console.log(
          `[notifications] Sending email to ${project.user.email}: ${subject}`,
        );
        await sendEmail(project.user.email, subject, html);
        console.log(`[notifications] Email sent successfully`);
      }
    } catch (err) {
      success = false;
      message = err instanceof Error ? err.message : "Unknown error";
      console.error(
        `[notifications] Failed to send ${channel.type} for incident ${incident.id}:`,
        err,
      );
    }

    await prisma.notificationLog.create({
      data: {
        incidentId: incident.id,
        channelId: channel.id,
        success,
        message,
      },
    });
  }
}
