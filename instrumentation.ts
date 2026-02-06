export async function register() {
  // Only run the scheduler on the server (not during build or on the client)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startScheduler } = await import("@/lib/monitor/scheduler");
    startScheduler();
  }
}
