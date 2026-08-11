"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CaseCard } from "@/components/legal/case-card";
import { EmptyState } from "@/components/ui/empty-state";
import { landmarkCases } from "@/lib/legal/cases";

const subjectOptions = Array.from(new Set(landmarkCases.map((c) => c.subject))).sort();
const courtOptions = Array.from(new Set(landmarkCases.map((c) => c.court))).sort();

export function CasesBrowser() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const [court, setCourt] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return landmarkCases
      .filter((c) => (subject === "all" ? true : c.subject === subject))
      .filter((c) => (court === "all" ? true : c.court === court))
      .filter((c) =>
        q
          ? c.name.toLowerCase().includes(q) ||
            c.principle.toLowerCase().includes(q) ||
            c.summary.toLowerCase().includes(q)
          : true,
      )
      .sort((a, b) => b.year - a.year);
  }, [query, subject, court]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases..."
            aria-label="Search cases"
            className="h-9 pl-8"
          />
        </div>

        <Select value={subject} onValueChange={(v) => setSubject(v ?? "all")}>
          <SelectTrigger className="h-9 w-full sm:w-48">
            <SelectValue placeholder="All subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {subjectOptions.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={court} onValueChange={(v) => setCourt(v ?? "all")}>
          <SelectTrigger className="h-9 w-full sm:w-56">
            <SelectValue placeholder="All courts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All courts</SelectItem>
            {courtOptions.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {filtered.length} of {landmarkCases.length} cases
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No cases found"
          description="Try a different search term or clear a filter."
          className="mt-4"
        />
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CaseCard key={c.id} item={c} onClick={() => router.push(`/cases/${c.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
