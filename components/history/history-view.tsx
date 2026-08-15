"use client";

import { useState } from "react";
import Link from "next/link";
import { History, Pencil, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import type { ConversationSummary } from "@/lib/chat/conversations";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

interface HistoryViewProps {
  initialConversations: ConversationSummary[];
}

export function HistoryView({ initialConversations }: HistoryViewProps) {
  const [items, setItems] = useState<ConversationSummary[]>(initialConversations);
  const [renameTarget, setRenameTarget] = useState<ConversationSummary | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ConversationSummary | null>(null);

  function openRename(c: ConversationSummary) {
    setRenameTarget(c);
    setRenameValue(c.title);
  }

  async function confirmRename() {
    if (!renameTarget || !renameValue.trim()) return;
    const title = renameValue.trim();
    const target = renameTarget;
    setItems((prev) => prev.map((c) => (c.id === target.id ? { ...c, title } : c)));
    setRenameTarget(null);
    try {
      await fetch(`/api/conversations/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
    } catch (error) {
      console.error("[HistoryView] rename failed", error);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setItems((prev) => prev.filter((c) => c.id !== target.id));
    setDeleteTarget(null);
    try {
      await fetch(`/api/conversations/${target.id}`, { method: "DELETE" });
    } catch (error) {
      console.error("[HistoryView] delete failed", error);
    }
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="No conversation history yet"
        description="Conversations with the AI Tutor will show up here."
        action={
          <Link href="/tutor" className="text-sm font-medium text-primary hover:underline">
            Ask the AI Tutor
          </Link>
        }
        className="mt-6"
      />
    );
  }

  return (
    <div className="mt-6 space-y-2">
      {items.map((c) => (
        <div key={c.id} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
            <MessageSquare className="size-4" aria-hidden="true" />
          </div>
          <Link href={`/tutor?conversation=${c.id}`} className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-medium text-foreground">{c.title}</p>
              <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                {c.subjectLabel}
              </span>
            </div>
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{c.preview}</p>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {formatDate(c.updatedAt)} · {c.messageCount} messages
            </p>
          </Link>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground"
              aria-label={`Rename conversation: ${c.title}`}
              onClick={() => openRename(c)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive"
              aria-label={`Delete conversation: ${c.title}`}
              onClick={() => setDeleteTarget(c)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}

      <Dialog
        open={!!renameTarget}
        onOpenChange={(open) => {
          if (!open) setRenameTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename conversation</DialogTitle>
            <DialogDescription>Give this conversation a title you&apos;ll recognize later.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-1.5">
            <Label htmlFor="rename-input">Title</Label>
            <Input
              id="rename-input"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmRename()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameTarget(null)}>
              Cancel
            </Button>
            <Button onClick={confirmRename} disabled={!renameValue.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; and its messages will be permanently deleted. This
              can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
