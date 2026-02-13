"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DayStatus {
  date: string;
  uptimePercentage: number;
}

function getColor(pct: number) {
  if (pct >= 99) return "bg-emerald-500";
  if (pct >= 95) return "bg-yellow-500";
  if (pct > 0) return "bg-red-500";
  return "bg-muted";
}

export function UptimeBar({ days }: { days: DayStatus[] }) {
  if (days.length === 0) {
    return (
      <div className="flex h-10 items-center justify-center text-sm text-muted-foreground">
        No data yet
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-[3px]">
        {days.map((day) => (
          <Tooltip key={day.date}>
            <TooltipTrigger asChild>
              <div
                className={`h-8 flex-1 rounded-sm transition-opacity hover:opacity-80 ${getColor(day.uptimePercentage)}`}
              />
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              <p className="font-medium">{day.date}</p>
              <p className="text-muted-foreground">
                {day.uptimePercentage.toFixed(1)}% uptime
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
        <span>{days.length} days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
