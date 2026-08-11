"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FlashcardItem {
  id: string;
  front: string;
  frontMeta?: string;
  back: string;
  backMeta?: string;
}

interface FlashcardDeckProps {
  cards: FlashcardItem[];
  onShuffle?: () => void;
}

export function FlashcardDeck({ cards, onShuffle }: FlashcardDeckProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];

  function go(delta: number) {
    setFlipped(false);
    setIndex((i) => Math.min(Math.max(i + delta, 0), cards.length - 1));
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Card {index + 1} of {cards.length}
        </span>
        {onShuffle && (
          <button
            type="button"
            onClick={() => {
              onShuffle();
              setIndex(0);
              setFlipped(false);
            }}
            className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary"
          >
            <Shuffle className="size-3.5" aria-hidden="true" />
            Shuffle
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={flipped ? "Show front of card" : "Show back of card"}
        className="mt-3 flex min-h-64 w-full flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          <RotateCw className="size-3" aria-hidden="true" />
          {flipped ? "Answer — tap to flip back" : "Question — tap to reveal"}
        </span>
        <p className={cn("text-balance", flipped ? "text-sm text-foreground" : "font-heading text-lg font-semibold text-foreground")}>
          {flipped ? card.back : card.front}
        </p>
        {(flipped ? card.backMeta : card.frontMeta) && (
          <p className="mt-3 text-xs text-muted-foreground">{flipped ? card.backMeta : card.frontMeta}</p>
        )}
      </button>

      <div className="mt-4 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => go(-1)} disabled={index === 0} className="gap-1">
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <Button size="sm" onClick={() => go(1)} disabled={index === cards.length - 1} className="gap-1">
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
