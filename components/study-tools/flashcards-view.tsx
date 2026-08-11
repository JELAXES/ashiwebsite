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
import { flashcards } from "@/lib/legal/flashcards";
import { subjects } from "@/lib/legal/subjects";
import { Layers } from "lucide-react";

const flashcardSubjectSlugs = Array.from(new Set(flashcards.map((f) => f.subject)));
const availableSubjects = subjects.filter((s) => flashcardSubjectSlugs.includes(s.slug));

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function FlashcardsView() {
  const [subject, setSubject] = useState("all");
  const [seed, setSeed] = useState(0);

  const pool = useMemo(() => {
    const base = subject === "all" ? flashcards : flashcards.filter((f) => f.subject === subject);
    const items: FlashcardItem[] = base.map((f) => ({
      id: f.id,
      front: f.front,
      back: f.back,
      backMeta: f.provision,
    }));
    return seed === 0 ? items : shuffle(items);
  }, [subject, seed]);

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
          <SelectTrigger className="h-9 w-full sm:w-56">
            <SelectValue placeholder="All subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects ({flashcards.length})</SelectItem>
            {availableSubjects.map((s) => (
              <SelectItem key={s.slug} value={s.slug}>
                {s.name} ({flashcards.filter((f) => f.subject === s.slug).length})
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
            description="This subject's flashcard set is still being built — try another subject in the meantime."
          />
        ) : (
          <FlashcardDeck cards={pool} onShuffle={() => setSeed((s) => s + 1)} />
        )}
      </div>
    </div>
  );
}
