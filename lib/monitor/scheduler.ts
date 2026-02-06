import { prisma } from "@/lib/prisma";
import { checkEndpoint } from "./check-endpoint";
import { recordPing } from "./record-ping";
import { handleIncidents } from "./handle-incidents";

// Track when each endpoint was last checked
const lastChecked = new Map<string, number>();

let running = false;
let intervalId: ReturnType<typeof setInterval> | null = null;

async function tick() {
  if (running) return; // prevent overlapping ticks
  running = true;

  try {
    const endpoints = await prisma.endpoint.findMany({
      where: { isActive: true },
    });

    const now = Date.now();
    const due = endpoints.filter((ep) => {
      const last = lastChecked.get(ep.id) || 0;
      return now - last >= ep.checkInterval * 1000;
    });

    if (due.length === 0) {
      running = false;
      return;
    }

    // Mark as checked immediately to prevent double-checking
    for (const ep of due) {
      lastChecked.set(ep.id, now);
    }

    await Promise.allSettled(
      due.map(async (endpoint) => {
        try {
          const result = await checkEndpoint(endpoint.url, endpoint.method);
          await recordPing(endpoint.id, result);
          await handleIncidents(endpoint.id, result.status);
          console.log(
            `[monitor] ${endpoint.name} (${endpoint.url}): ${result.status} ${result.responseTime}ms`
          );
        } catch (err) {
          console.error(`[monitor] Error checking ${endpoint.url}:`, err);
        }
      })
    );
  } catch (err) {
    console.error("[monitor] Scheduler tick error:", err);
  } finally {
    running = false;
  }
}

export function startScheduler() {
  if (intervalId) return; // already running
  console.log("[monitor] Starting scheduler...");
  // Run a tick every second to check if any endpoints are due
  intervalId = setInterval(tick, 1000);
  // Run immediately on start
  tick();
}

export function stopScheduler() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("[monitor] Scheduler stopped.");
  }
}
