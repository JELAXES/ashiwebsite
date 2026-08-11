import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
  size?: number;
}

/** Abstract "L" monogram — column + page-rule detail, amber on charcoal. */
export function LogoMark({ className, size = 28 }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <rect x="12" y="6" width="8" height="28" rx="2" className="fill-primary" />
      <rect x="12" y="27" width="22" height="7" rx="2" className="fill-primary" />
      <rect
        x="14.5"
        y="14"
        width="3"
        height="1.4"
        rx="0.7"
        className="fill-background/70"
      />
      <rect
        x="14.5"
        y="19"
        width="3"
        height="1.4"
        rx="0.7"
        className="fill-background/70"
      />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  markSize?: number;
  wordmarkClassName?: string;
}

export function Logo({ className, markSize = 28, wordmarkClassName }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={markSize} />
      <span
        className={cn(
          "font-heading text-lg font-semibold tracking-tight text-foreground",
          wordmarkClassName,
        )}
      >
        LexLearn
      </span>
    </span>
  );
}
