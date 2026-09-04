"use client";

import { useState } from "react";
import { Copy, Check, Share2, RefreshCw, ThumbsUp, ThumbsDown, BookmarkPlus, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Rating = "up" | "down" | null;

interface MessageActionsProps {
  /** The answer text these actions operate on. */
  content: string;
  /** Stable id for the message, used to persist the thumbs rating per device. */
  messageId: string;
  /** Re-run this turn. Omit to hide the regenerate control. */
  onRegenerate?: () => void;
  /** Whether a regenerate is in flight (disables the control). */
  regenerating?: boolean;
  /** Save this answer to the user's Notebook. Omit to hide the control. */
  onSaveToNotebook?: () => void;
  /** Whether this answer is already in the Notebook (shows a done state). */
  savedToNotebook?: boolean;
  className?: string;
}

const FEEDBACK_KEY = (id: string) => `studyrex:feedback:${id}`;

function readRating(id: string): Rating {
  try {
    const v = localStorage.getItem(FEEDBACK_KEY(id));
    return v === "up" || v === "down" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Subtle action row shown under every completed AI answer. Copy and Share are
 * always available; Regenerate appears when the tutor passes a handler; the
 * thumbs rating is a per-device signal persisted in localStorage.
 *
 * New actions (e.g. "save to notebook", "explain simpler") slot in as more
 * `ActionButton`s — keep them icon-only and muted so the row stays quiet.
 */
export function MessageActions({
  content,
  messageId,
  onRegenerate,
  regenerating,
  onSaveToNotebook,
  savedToNotebook,
  className,
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  // The chat transcript only ever renders client-side (messages load after mount),
  // so reading localStorage in the initializer can't cause a hydration mismatch.
  const [rating, setRating] = useState<Rating>(() =>
    typeof window === "undefined" ? null : readRating(messageId),
  );

  async function copyText(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      /* fall through to the legacy path */
    }
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }

  async function handleCopy() {
    const ok = await copyText(content);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Couldn't copy. Select the text and copy manually.");
    }
  }

  async function handleShare() {
    const shareData = { title: "StudyRex — AI Tutor answer", text: content };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User dismissed the sheet — not an error worth surfacing.
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    const ok = await copyText(content);
    toast[ok ? "success" : "error"](
      ok ? "Answer copied — paste it anywhere to share." : "Couldn't share on this device.",
    );
  }

  function setFeedback(next: Exclude<Rating, null>) {
    const resolved: Rating = rating === next ? null : next;
    setRating(resolved);
    try {
      if (resolved) localStorage.setItem(FEEDBACK_KEY(messageId), resolved);
      else localStorage.removeItem(FEEDBACK_KEY(messageId));
    } catch {
      /* private mode / storage disabled — the in-memory state still updates */
    }
    if (resolved === "up") toast.success("Thanks — glad that helped.");
    if (resolved === "down") toast("Thanks for the feedback.");
  }

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 text-muted-foreground",
        className,
      )}
    >
      <ActionButton onClick={handleCopy} label={copied ? "Copied" : "Copy answer"} active={copied}>
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied && <span className="ml-1 text-[11px] font-medium">Copied</span>}
      </ActionButton>

      <ActionButton onClick={handleShare} label="Share answer">
        <Share2 className="size-3.5" />
      </ActionButton>

      {onRegenerate && (
        <ActionButton onClick={onRegenerate} label="Regenerate answer" disabled={regenerating}>
          <RefreshCw className={cn("size-3.5", regenerating && "animate-spin")} />
        </ActionButton>
      )}

      {onSaveToNotebook && (
        <ActionButton
          onClick={onSaveToNotebook}
          label={savedToNotebook ? "Saved to notebook" : "Save to notebook"}
          active={savedToNotebook}
        >
          {savedToNotebook ? (
            <BookmarkCheck className="size-3.5" />
          ) : (
            <BookmarkPlus className="size-3.5" />
          )}
        </ActionButton>
      )}

      <span className="mx-1 h-3.5 w-px bg-border" aria-hidden="true" />

      <ActionButton onClick={() => setFeedback("up")} label="Good answer" active={rating === "up"}>
        <ThumbsUp className={cn("size-3.5", rating === "up" && "fill-current")} />
      </ActionButton>
      <ActionButton onClick={() => setFeedback("down")} label="Needs work" active={rating === "down"}>
        <ThumbsDown className={cn("size-3.5", rating === "down" && "fill-current")} />
      </ActionButton>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  label,
  active,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 transition-colors",
        "hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        active && "text-primary",
      )}
    >
      {children}
    </button>
  );
}
