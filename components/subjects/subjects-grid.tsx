"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SubjectCard } from "@/components/legal/subject-card";
import { EmptyState } from "@/components/ui/empty-state";
import { subjects as allSubjects } from "@/lib/legal/subjects";
import type { Subject } from "@/lib/legal/types";
import type { SubjectActivity } from "@/lib/chat/conversations";
import { Button } from "@/components/ui/button";

interface SubjectsGridProps {
  activity: Record<string, SubjectActivity>;
  /** The subjects to show by default — typically the user's curriculum for their track. */
  subjects: Subject[];
  /** When the default list is a filtered curriculum, allow expanding to the full catalog. */
  allowBrowseAll?: boolean;
}

export function SubjectsGrid({ activity, subjects, allowBrowseAll }: SubjectsGridProps) {
  const [query, setQuery] = useState("");
  const [browseAll, setBrowseAll] = useState(false);

  const baseList = browseAll ? allSubjects : subjects;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return baseList;
    return baseList.filter(
      (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
    );
  }, [baseList, query]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects..."
            aria-label="Search subjects"
            className="h-9 pl-8"
          />
        </div>
        {allowBrowseAll && (
          <Button type="button" variant="outline" size="sm" onClick={() => setBrowseAll((v) => !v)}>
            {browseAll ? "Show my curriculum" : "Browse all subjects"}
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No subjects found"
          description="Try a different search term."
          className="mt-8"
        />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((s) => (
            <SubjectCard key={s.slug} subject={s} activity={activity[s.slug]} />
          ))}
        </div>
      )}
    </div>
  );
}
