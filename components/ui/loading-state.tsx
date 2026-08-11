"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  messages?: string[];
  className?: string;
  intervalMs?: number;
}

const defaultMessages = [
  "Analyzing your question...",
  "Structuring the legal concepts...",
  "Preparing your explanation...",
];

/** Cycles through short status messages while an async operation is in flight. */
export function LoadingState({ messages = defaultMessages, className, intervalMs = 1400 }: LoadingStateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [messages.length, intervalMs]);

  return (
    <div className={cn("flex items-center gap-2.5 text-sm text-muted-foreground", className)} role="status" aria-live="polite">
      <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
      <span className="transition-opacity duration-300">{messages[index]}</span>
    </div>
  );
}

export function ChatSkeletonLine({ className }: { className?: string }) {
  return <div className={cn("h-3 animate-pulse rounded-full bg-muted", className)} />;
}
