import { prisma } from "@/lib/prisma";
import { checkEndpoint } from "@/lib/monitor/check-endpoint";
import { recordPing } from "@/lib/monitor/record-ping";
import { handleIncidents } from "@/lib/monitor/handle-incidents";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const endpoints = await prisma.endpoint.findMany({
    where: { isActive: true },
  });

  const results = await Promise.allSettled(
    endpoints.map(async (endpoint) => {
      const result = await checkEndpoint(endpoint.url, endpoint.method);
      await recordPing(endpoint.id, result);
      await handleIncidents(endpoint.id, result.status);
      return { endpointId: endpoint.id, url: endpoint.url, ...result };
    })
  );

  const summary = results.map((r) =>
    r.status === "fulfilled"
      ? r.value
      : { error: r.reason?.message ?? "Unknown error" }
  );

  return NextResponse.json({
    checked: endpoints.length,
    results: summary,
  });
}
