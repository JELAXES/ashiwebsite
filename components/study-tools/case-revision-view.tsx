"use client";

import { useMemo, useState } from "react";
import { Landmark } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { FlashcardDeck, type FlashcardItem } from "./flashcard-deck";
import { landmarkCases } from "@/lib/legal/cases";

const subjectOptions = Array.from(new Set(landmarkCases.map((c) => c.subject))).sort();

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function CaseRevisionView() {
  const [subject, setSubject] = useState("all");
  const [seed, setSeed] = useState(0);

  const pool = useMemo(() => {
    const base = subject === "all" ? landmarkCases : landmarkCases.filter((c) => c.subject === subject);
    const items: FlashcardItem[] = base.map((c) => ({
      id: c.id,
      front: `${c.name} (${c.year})`,
      frontMeta: "What is the core principle? — tap to reveal",
      back: `${c.principle} — ${c.summary}`,
      backMeta: c.provisions.join(" · ") || c.citation,
    }));
    return seed === 0 ? items : shuffle(items);
  }, [subject, seed]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Case Law Revision
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
            See the case name, recall the principle before you flip. Great for last-mile revision
            before an exam.
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
            <SelectItem value="all">All subjects ({landmarkCases.length})</SelectItem>
            {subjectOptions.map((s) => (
              <SelectItem key={s} value={s}>
                {s} ({landmarkCases.filter((c) => c.subject === s).length})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8">
        {pool.length === 0 ? (
          <EmptyState
            icon={Landmark}
            title="No cases yet for this subject"
            description="Try another subject, or browse the full Case Library."
          />
        ) : (
          <FlashcardDeck cards={pool} onShuffle={() => setSeed((s) => s + 1)} />
        )}
      </div>
    </div>
  );
}
