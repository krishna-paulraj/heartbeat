"use client";

interface DataPoint {
  checkedAt: string;
  responseTime: number;
}

export function ResponseTimeChart({ data }: { data: DataPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No data yet</p>
      </div>
    );
  }

  const maxTime = Math.max(...data.map((d) => d.responseTime), 1);
  const height = 192;
  const width = 100; // percentage-based
  const padding = 4;

  const points = data
    .map((d, i) => {
      const x = (i / Math.max(data.length - 1, 1)) * (width - padding * 2) + padding;
      const y = height - (d.responseTime / maxTime) * (height - 32) - 16;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Response Time</span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">{maxTime}ms max</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-emerald-500"
          points={points}
        />
        {/* Fill area under line */}
        <polygon
          className="text-emerald-500/10"
          fill="currentColor"
          points={`${padding},${height - 16} ${points} ${width - padding},${height - 16}`}
        />
      </svg>
    </div>
  );
}
