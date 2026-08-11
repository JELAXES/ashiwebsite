import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FollowUpSuggestionsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
  className?: string;
}

export function FollowUpSuggestions({ suggestions, onSelect, className }: FollowUpSuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {suggestions.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onSelect(s)}
          className="group inline-flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-3.5 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {s}
          <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
