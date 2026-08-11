import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LegalDisclaimerProps {
  className?: string;
  variant?: "inline" | "block";
  text?: string;
}

export function LegalDisclaimer({
  className,
  variant = "inline",
  text = "Educational use only — not legal advice.",
}: LegalDisclaimerProps) {
  if (variant === "block") {
    return (
      <div
        className={cn(
          "flex items-start gap-2.5 rounded-md border border-border bg-muted/50 px-3.5 py-2.5 text-xs text-muted-foreground",
          className,
        )}
        role="note"
      >
        <InfoIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <p>{text}</p>
      </div>
    );
  }

  return (
    <p
      className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}
      role="note"
    >
      <InfoIcon className="size-3 shrink-0" aria-hidden="true" />
      {text}
    </p>
  );
}
