"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ScrollText, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { legalActs } from "@/lib/legal/acts";
import { cn } from "@/lib/utils";

interface ProvisionResult {
  actId: string;
  actName: string;
  actStatus: "current" | "historical";
  label: string;
  description: string;
}

const allProvisions: ProvisionResult[] = legalActs.flatMap((act) =>
  act.provisions.map((p) => ({
    actId: act.id,
    actName: act.name,
    actStatus: act.status,
    label: p.label,
    description: p.description,
  })),
);

export function SectionFinderView() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allProvisions;
    return allProvisions.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.actName.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div>
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Section Finder
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          Search directly by section, article, or keyword across every Act and Code in the library.
        </p>
      </div>

      <div className="relative mt-6 max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. 'Section 103', 'murder', 'Article 21'..."
          aria-label="Search sections and articles"
          className="h-9 pl-8"
          autoFocus
        />
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {results.length} of {allProvisions.length} provisions
      </p>

      {results.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching provisions"
          description="Try a different keyword, or browse Acts & Sections directly."
          className="mt-4"
        />
      ) : (
        <div className="mt-4 space-y-2">
          {results.map((p, i) => {
            const isHistorical = p.actStatus === "historical";
            return (
              <Link
                key={`${p.actId}-${p.label}-${i}`}
                href={`/acts/${p.actId}`}
                className={cn(
                  "flex items-start gap-3 rounded-md border-l-2 bg-secondary/60 px-4 py-3 transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isHistorical ? "border-l-muted-foreground/40" : "border-l-primary",
                )}
              >
                {isHistorical ? (
                  <History className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <ScrollText className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                  <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                    {p.actName} {isHistorical && "· HISTORICAL"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
