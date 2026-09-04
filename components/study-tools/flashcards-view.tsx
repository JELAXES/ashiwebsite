"use client";

import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { FlashcardDeck, type FlashcardItem } from "./flashcard-deck";
import { Layers } from "lucide-react";

/** One subject's assembled deck — built server-side in lib/content/decks.ts. */
export interface FlashcardDeckData {
  slug: string;
  name: string;
  cards: FlashcardItem[];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface FlashcardsViewProps {
  /** Every subject deck available to this user (year-scoped on the server). */
  decks: FlashcardDeckData[];
  /** Subject slug to open on, from a `?subject=` deep link. */
  initialSubject?: string;
}

export function FlashcardsView({ decks, initialSubject }: FlashcardsViewProps) {
  const withCards = useMemo(() => decks.filter((d) => d.cards.length > 0), [decks]);
  const bySlug = useMemo(() => new Map(decks.map((d) => [d.slug, d])), [decks]);

  const [subject, setSubject] = useState(() =>
    initialSubject && bySlug.has(initialSubject) ? initialSubject : "all",
  );
  const [seed, setSeed] = useState(0);

  const totalCount = useMemo(
    () => withCards.reduce((n, d) => n + d.cards.length, 0),
    [withCards],
  );

  const pool = useMemo(() => {
    const base: FlashcardItem[] =
      subject === "all"
        ? withCards.flatMap((d) => d.cards)
        : (bySlug.get(subject)?.cards ?? []);
    return seed === 0 ? base : shuffle(base);
  }, [subject, seed, withCards, bySlug]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Flashcards
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            Active recall drills for key doctrines, provisions, and cases.
          </p>
        </div>
        <Select
          value={subject}
          onValueChange={(v) => {
            setSubject(v ?? "all");
            setSeed(0);
          }}
        >
          <SelectTrigger className="h-9 w-full sm:w-64">
            <SelectValue placeholder="All subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects ({totalCount})</SelectItem>
            {withCards.map((d) => (
              <SelectItem key={d.slug} value={d.slug}>
                {d.name} ({d.cards.length})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8">
        {pool.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No flashcards yet for this subject"
            description="This subject's flashcard set is still being built — pick another subject in the meantime, or ask the AI Tutor to quiz you."
          />
        ) : (
          <FlashcardDeck key={`${subject}:${seed}`} cards={pool} onShuffle={() => setSeed((s) => s + 1)} />
        )}
      </div>
    </div>
  );
}
