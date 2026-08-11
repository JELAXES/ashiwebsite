import { BookText, History, ArrowUpRight } from "lucide-react";
import type { LegalAct } from "@/lib/legal/types";
import { cn } from "@/lib/utils";

interface ActCardProps {
  item: LegalAct;
  className?: string;
  onClick?: () => void;
}

export function ActCard({ item, className, onClick }: ActCardProps) {
  const isHistorical = item.status === "historical";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex h-full flex-col justify-between rounded-lg border border-border bg-card p-5 text-left transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
            {isHistorical ? (
              <History className="size-3" aria-hidden="true" />
            ) : (
              <BookText className="size-3" aria-hidden="true" />
            )}
            {item.category}
          </span>
          <span
            className={cn(
              "text-[10px] font-semibold tracking-wide uppercase",
              isHistorical ? "text-muted-foreground" : "text-primary",
            )}
          >
            {isHistorical ? "Historical" : "Current"}
          </span>
        </div>
        <h3 className="font-heading text-base leading-snug font-semibold text-balance text-foreground">
          {item.name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{item.inForceNote}</p>
      </div>
      <div className="mt-4 border-t border-border pt-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">{item.summary}</p>
        {(item.supersededBy || item.supersedes) && (
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            {item.supersededBy ? `Superseded by ${item.supersededBy}` : `Supersedes ${item.supersedes}`}
          </p>
        )}
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
        View provisions
        <ArrowUpRight className="size-3.5" aria-hidden="true" />
      </div>
    </button>
  );
}
