"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, MessageSquare, ScrollText, Landmark, HelpCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { bookmarks as initialBookmarks, type BookmarkItem } from "@/lib/legal/mock-data";
import { cn } from "@/lib/utils";

const typeIcons: Record<BookmarkItem["type"], typeof MessageSquare> = {
  answer: MessageSquare,
  section: ScrollText,
  case: Landmark,
  question: HelpCircle,
};

const typeLabels: Record<BookmarkItem["type"], string> = {
  answer: "AI answer",
  section: "Section",
  case: "Case",
  question: "Quiz question",
};

const filters: { value: "all" | BookmarkItem["type"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "answer", label: "Answers" },
  { value: "section", label: "Sections" },
  { value: "case", label: "Cases" },
  { value: "question", label: "Questions" },
];

export function BookmarksView() {
  const [items, setItems] = useState<BookmarkItem[]>(initialBookmarks);
  const [filter, setFilter] = useState<"all" | BookmarkItem["type"]>("all");
  const [deleteTarget, setDeleteTarget] = useState<BookmarkItem | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((b) => b.type === filter)),
    [items, filter],
  );

  function confirmDelete() {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              filter === f.value
                ? "border-primary/40 bg-accent text-accent-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title={items.length === 0 ? "No bookmarks yet" : "No bookmarks in this category"}
          description={
            items.length === 0
              ? "Save AI answers, sections, cases, and quiz questions from anywhere in LexLearn to find them here."
              : "Try a different filter."
          }
          action={
            items.length === 0 ? (
              <Link href="/tutor" className="text-sm font-medium text-primary hover:underline">
                Ask the AI Tutor
              </Link>
            ) : undefined
          }
          className="mt-6"
        />
      ) : (
        <div className="mt-6 space-y-2">
          {filtered.map((b) => {
            const Icon = typeIcons[b.type];
            return (
              <div
                key={b.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{b.title}</p>
                    <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                      {typeLabels[b.type]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{b.description}</p>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">{b.subject}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label={`Remove bookmark: ${b.title}`}
                  onClick={() => setDeleteTarget(b)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove bookmark?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; will be removed from your bookmarks. This can&apos;t
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
