import { HttpMethod, PingStatus } from "@/lib/generated/prisma";

export interface CheckResult {
  status: PingStatus;
  statusCode: number | null;
  responseTime: number;
  message: string | null;
}

export async function checkEndpoint(
  url: string,
  method: HttpMethod
): Promise<CheckResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  const start = Date.now();

  try {
    const response = await fetch(url, {
      method,
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Heartbeat-Monitor/1.0",
      },
    });

    const responseTime = Date.now() - start;
    const isSuccess = response.status >= 200 && response.status < 400;

    let status: PingStatus;
    if (!isSuccess) {
      status = PingStatus.DOWN;
    } else if (responseTime >= 5000) {
      status = PingStatus.DEGRADED;
    } else {
      status = PingStatus.UP;
    }

    return {
      status,
      statusCode: response.status,
      responseTime,
      message: isSuccess ? null : `HTTP ${response.status} ${response.statusText}`,
    };
  } catch (error) {
    const responseTime = Date.now() - start;
    const message =
      error instanceof DOMException && error.name === "AbortError"
        ? "Request timed out (10s)"
        : error instanceof Error
          ? error.message
          : "Unknown error";

    return {
      status: PingStatus.DOWN,
      statusCode: null,
      responseTime,
      message,
    };
  } finally {
    clearTimeout(timeout);
  }
}
