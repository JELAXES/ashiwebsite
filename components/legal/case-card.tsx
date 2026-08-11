import { Landmark, ArrowUpRight } from "lucide-react";
import type { LandmarkCase } from "@/lib/legal/types";
import { cn } from "@/lib/utils";

interface CaseCardProps {
  item: LandmarkCase;
  className?: string;
  onClick?: () => void;
}

export function CaseCard({ item, className, onClick }: CaseCardProps) {
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
            <Landmark className="size-3" aria-hidden="true" />
            {item.subject}
          </span>
          <span className="text-xs font-medium text-muted-foreground">{item.year}</span>
        </div>
        <h3 className="font-heading text-base leading-snug font-semibold text-balance text-foreground">
          {item.name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{item.court}</p>
      </div>
      <div className="mt-4 border-t border-border pt-3">
        <p className="text-[11px] font-semibold tracking-wide text-primary uppercase">
          {item.principle}
        </p>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{item.summary}</p>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
        View case brief
        <ArrowUpRight className="size-3.5" aria-hidden="true" />
      </div>
    </button>
  );
}
