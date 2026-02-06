const styles = {
  UP: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  DOWN: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  DEGRADED: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
};

const dots = {
  UP: "bg-emerald-500",
  DOWN: "bg-red-500",
  DEGRADED: "bg-yellow-500",
};

export function StatusBadge({ status }: { status: "UP" | "DOWN" | "DEGRADED" | null }) {
  if (!status) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
        No data
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
      {status === "UP" ? "Up" : status === "DOWN" ? "Down" : "Degraded"}
    </span>
  );
}
