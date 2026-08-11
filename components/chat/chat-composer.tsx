"use client";

import { useRef, type KeyboardEvent } from "react";
import { ArrowUp, Paperclip, Mic } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { subjects } from "@/lib/legal/subjects";
import { cn } from "@/lib/utils";

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  subject: string;
  onSubjectChange: (subject: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  subject,
  onSubjectChange,
  disabled,
  className,
  placeholder = "Ask anything about Indian law...",
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) onSubmit();
    }
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-3 shadow-sm focus-within:border-primary/50",
        className,
      )}
    >
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={2}
        aria-label="Ask a legal question"
        className="min-h-[44px] resize-none border-0 bg-transparent p-1 shadow-none focus-visible:ring-0 dark:bg-transparent"
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Select value={subject} onValueChange={(v) => onSubjectChange(v ?? "all")}>
            <SelectTrigger size="sm" className="h-8 max-w-[160px] border-0 bg-secondary text-xs">
              <SelectValue placeholder="All subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subjects</SelectItem>
              {subjects.map((s) => (
                <SelectItem key={s.slug} value={s.slug}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground"
                  disabled
                  aria-label="Attach a file (coming soon)"
                />
              }
            >
              <Paperclip className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Attachments — coming soon</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground"
                  disabled
                  aria-label="Voice input (coming soon)"
                />
              }
            >
              <Mic className="size-4" />
            </TooltipTrigger>
            <TooltipContent>Voice input — coming soon</TooltipContent>
          </Tooltip>
        </div>

        <Button
          type="button"
          size="icon"
          className="size-8 rounded-full"
          disabled={disabled || !value.trim()}
          onClick={onSubmit}
          aria-label="Send question"
        >
          <ArrowUp className="size-4" />
        </Button>
      </div>
    </div>
  );
}
