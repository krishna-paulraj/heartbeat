import { Badge } from "@/components/ui/badge";

const config = {
  UP: {
    label: "Up",
    className:
      "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  DOWN: {
    label: "Down",
    className:
      "bg-red-500/10 text-red-600 hover:bg-red-500/10 border-red-500/20 dark:text-red-400",
    dot: "bg-red-500",
  },
  DEGRADED: {
    label: "Degraded",
    className:
      "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/10 border-yellow-500/20 dark:text-yellow-400",
    dot: "bg-yellow-500",
  },
};

export function StatusBadge({
  status,
}: {
  status: "UP" | "DOWN" | "DEGRADED" | null;
}) {
  if (!status) {
    return (
      <Badge variant="secondary" className="gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
        No data
      </Badge>
    );
  }

  const { label, className, dot } = config[status];

  return (
    <Badge variant="outline" className={`gap-1.5 ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </Badge>
  );
}
