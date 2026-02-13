"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface DataPoint {
  checkedAt: string;
  responseTime: number;
}

const chartConfig = {
  responseTime: {
    label: "Response Time",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

export function ResponseTimeChart({ data }: { data: DataPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        No data yet
      </div>
    );
  }

  const formatted = data.map((d) => ({
    time: new Date(d.checkedAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    responseTime: d.responseTime,
  }));

  return (
    <ChartContainer config={chartConfig} className="h-48 w-full">
      <AreaChart
        data={formatted}
        margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="fillResponseTime" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-responseTime)"
              stopOpacity={0.3}
            />
            <stop
              offset="100%"
              stopColor="var(--color-responseTime)"
              stopOpacity={0.02}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
          interval="preserveStartEnd"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
          tickFormatter={(v) => `${v}ms`}
          width={50}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => value}
              formatter={(value) => [`${value}ms`, "Response Time"]}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="responseTime"
          stroke="var(--color-responseTime)"
          strokeWidth={2}
          fill="url(#fillResponseTime)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
