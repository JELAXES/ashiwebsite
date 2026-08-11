import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  suffix?: string;
  trend?: string;
  className?: string;
  emphasize?: boolean;
}

export function StatCard({ label, value, icon: Icon, suffix, trend, className, emphasize }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {Icon && <Icon className="size-4 text-muted-foreground" aria-hidden="true" />}
      </div>
      <div className="mt-2.5 flex items-baseline gap-1">
        <span
          className={cn(
            "font-heading text-3xl font-semibold tracking-tight",
            emphasize ? "text-primary" : "text-foreground",
          )}
        >
          {value}
        </span>
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </div>
      {trend && <p className="mt-1 text-xs text-muted-foreground">{trend}</p>}
    </div>
  );
}
