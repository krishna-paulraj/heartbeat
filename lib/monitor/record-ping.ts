import { prisma } from "@/lib/prisma";
import type { CheckResult } from "./check-endpoint";

export async function recordPing(endpointId: string, result: CheckResult) {
  return prisma.ping.create({
    data: {
      endpointId,
      status: result.status,
      statusCode: result.statusCode,
      responseTime: result.responseTime,
      message: result.message,
      checkedAt: new Date(),
    },
  });
}
