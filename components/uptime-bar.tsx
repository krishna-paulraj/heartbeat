"use client";

interface DayStatus {
  date: string;
  uptimePercentage: number;
}

function getColor(pct: number) {
  if (pct >= 99) return "bg-emerald-500";
  if (pct >= 95) return "bg-yellow-500";
  if (pct > 0) return "bg-red-500";
  return "bg-zinc-300 dark:bg-zinc-700";
}

export function UptimeBar({ days }: { days: DayStatus[] }) {
  if (days.length === 0) {
    return (
      <div className="flex h-8 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">No data yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Uptime (last {days.length} days)</span>
      </div>
      <div className="flex gap-[2px]">
        {days.map((day) => (
          <div
            key={day.date}
            className={`h-8 flex-1 rounded-sm ${getColor(day.uptimePercentage)}`}
            title={`${day.date}: ${day.uptimePercentage.toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500">
        <span>{days.length} days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
