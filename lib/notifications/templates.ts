export function incidentCreatedEmail(
  endpointName: string,
  endpointUrl: string,
  projectName: string,
  timestamp: Date,
) {
  const subject = `🔴 Down: ${endpointName} (${projectName})`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="margin: 0 0 4px; color: #991b1b; font-size: 18px;">Endpoint is Down</h2>
        <p style="margin: 0; color: #b91c1c; font-size: 14px;">We detected downtime on one of your monitored endpoints.</p>
      </div>
      <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #71717a; width: 120px;">Endpoint</td>
          <td style="padding: 8px 0; color: #18181b; font-weight: 500;">${endpointName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #71717a;">URL</td>
          <td style="padding: 8px 0; color: #18181b;">${endpointUrl}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #71717a;">Project</td>
          <td style="padding: 8px 0; color: #18181b;">${projectName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #71717a;">Detected at</td>
          <td style="padding: 8px 0; color: #18181b;">${timestamp.toUTCString()}</td>
        </tr>
      </table>
      <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
      <p style="font-size: 12px; color: #a1a1aa; margin: 0;">Sent by Heartbeat. You can disable notifications in your project settings.</p>
    </div>
  `;

  return { subject, html };
}

export function incidentResolvedEmail(
  endpointName: string,
  endpointUrl: string,
  projectName: string,
  startedAt: Date,
  resolvedAt: Date,
) {
  const durationMs = resolvedAt.getTime() - startedAt.getTime();
  const durationMinutes = Math.round(durationMs / 60000);
  const durationText =
    durationMinutes < 1
      ? "less than a minute"
      : durationMinutes === 1
        ? "1 minute"
        : `${durationMinutes} minutes`;

  const subject = `🟢 Recovered: ${endpointName} (${projectName})`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto;">
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h2 style="margin: 0 0 4px; color: #166534; font-size: 18px;">Endpoint Recovered</h2>
        <p style="margin: 0; color: #15803d; font-size: 14px;">Your endpoint is back up and responding normally.</p>
      </div>
      <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #71717a; width: 120px;">Endpoint</td>
          <td style="padding: 8px 0; color: #18181b; font-weight: 500;">${endpointName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #71717a;">URL</td>
          <td style="padding: 8px 0; color: #18181b;">${endpointUrl}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #71717a;">Project</td>
          <td style="padding: 8px 0; color: #18181b;">${projectName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #71717a;">Down since</td>
          <td style="padding: 8px 0; color: #18181b;">${startedAt.toUTCString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #71717a;">Recovered at</td>
          <td style="padding: 8px 0; color: #18181b;">${resolvedAt.toUTCString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #71717a;">Duration</td>
          <td style="padding: 8px 0; color: #18181b;">${durationText}</td>
        </tr>
      </table>
      <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
      <p style="font-size: 12px; color: #a1a1aa; margin: 0;">Sent by Heartbeat. You can disable notifications in your project settings.</p>
    </div>
  `;

  return { subject, html };
}
