import { Sparkles, User, Lightbulb, AlertTriangle, RefreshCcw } from "lucide-react";
import { MarkdownLite } from "./markdown-lite";
import { CitationCard } from "@/components/legal/citation-card";
import { LegalDisclaimer } from "@/components/legal/legal-disclaimer";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import type { ChatMessageData } from "@/lib/chat/types";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageData;
  onRetry?: () => void;
  className?: string;
}

export function ChatMessage({ message, onRetry, className }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse", className)}>
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-secondary text-secondary-foreground" : "bg-primary/15 text-primary",
        )}
        aria-hidden="true"
      >
        {isUser ? <User className="size-4" /> : <Sparkles className="size-4" />}
      </div>

      <div className={cn("flex min-w-0 max-w-[85%] flex-col gap-3", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-xl px-4 py-3",
            isUser
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card",
          )}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{message.content}</p>
          ) : message.pending ? (
            <LoadingState />
          ) : message.error ? (
            <div className="flex flex-col gap-3">
              <p className="flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
                Something went wrong while generating your answer.
              </p>
              {onRetry && (
                <Button size="sm" variant="outline" onClick={onRetry} className="w-fit gap-1.5">
                  <RefreshCcw className="size-3.5" />
                  Retry
                </Button>
              )}
            </div>
          ) : (
            <MarkdownLite content={message.content} />
          )}
        </div>

        {!isUser && !message.pending && !message.error && (
          <>
            {message.citations && message.citations.length > 0 && (
              <div className="grid w-full gap-2 sm:grid-cols-2">
                {message.citations.map((c, i) => (
                  <CitationCard key={i} label={c.label} source={c.source} historical={c.historical} />
                ))}
              </div>
            )}

            {message.cases && message.cases.length > 0 && (
              <div className="w-full space-y-1.5">
                {message.cases.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-md bg-secondary/60 px-3.5 py-2 text-xs"
                  >
                    <span className="font-semibold text-foreground">{c.name}</span>
                    <span className="text-muted-foreground"> — {c.principle}</span>
                  </div>
                ))}
              </div>
            )}

            {message.examTip && (
              <div className="flex w-full items-start gap-2 rounded-md border border-primary/25 bg-accent/50 px-3.5 py-2.5 text-xs text-accent-foreground">
                <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
                <p>
                  <span className="font-semibold">Exam tip: </span>
                  {message.examTip}
                </p>
              </div>
            )}

            <LegalDisclaimer />
          </>
        )}
      </div>
    </div>
  );
}
