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
import { ActCard } from "@/components/legal/act-card";
import { EmptyState } from "@/components/ui/empty-state";
import { legalActs } from "@/lib/legal/acts";
import type { ActCategory } from "@/lib/legal/types";

const categoryOptions = Array.from(new Set(legalActs.map((a) => a.category))) as ActCategory[];

export function ActsBrowser() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return legalActs
      .filter((a) => (category === "all" ? true : a.category === category))
      .filter((a) => (status === "all" ? true : a.status === status))
      .filter((a) =>
        q
          ? a.name.toLowerCase().includes(q) ||
            a.shortName.toLowerCase().includes(q) ||
            a.provisions.some((p) => p.label.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
          : true,
      )
      .sort((a, b) => (a.status === b.status ? a.name.localeCompare(b.name) : a.status === "current" ? -1 : 1));
  }, [query, category, status]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Acts and sections..."
            aria-label="Search Acts and sections"
            className="h-9 pl-8"
          />
        </div>

        <Select value={category} onValueChange={(v) => setCategory(v ?? "all")}>
          <SelectTrigger className="h-9 w-full sm:w-52">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categoryOptions.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
          <SelectTrigger className="h-9 w-full sm:w-44">
            <SelectValue placeholder="Any status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            <SelectItem value="current">Current only</SelectItem>
            <SelectItem value="historical">Historical only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {filtered.length} of {legalActs.length} Acts &amp; Codes
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching Acts found"
          description="Try a different search term or clear a filter."
          className="mt-4"
        />
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <ActCard key={a.id} item={a} onClick={() => router.push(`/acts/${a.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
