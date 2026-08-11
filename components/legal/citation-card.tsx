import { ScrollText, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface CitationCardProps {
  label: string;
  source: string;
  historical?: boolean;
  className?: string;
}

/** Distinct, restrained citation chip for a section / article reference. */
export function CitationCard({ label, source, historical = false, className }: CitationCardProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md border-l-2 bg-secondary/60 px-3.5 py-2.5",
        historical ? "border-l-muted-foreground/40" : "border-l-primary",
        className,
      )}
    >
      <div className="mt-0.5 shrink-0">
        {historical ? (
          <History className="size-4 text-muted-foreground" aria-hidden="true" />
        ) : (
          <ScrollText className="size-4 text-primary" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0">
        {historical && (
          <span className="mb-0.5 block text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
            Historical
          </span>
        )}
        <p
          className={cn(
            "text-sm font-semibold tracking-tight",
            historical ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {label}
        </p>
        <p className="text-xs text-muted-foreground">{source}</p>
      </div>
    </div>
  );
}
