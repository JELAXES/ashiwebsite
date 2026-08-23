"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";
import { MessageSquarePlus, PanelLeft, Info, Sparkles, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatComposer } from "@/components/chat/chat-composer";
import { FollowUpSuggestions } from "@/components/chat/follow-up-suggestions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { subjects } from "@/lib/legal/subjects";
import { renderSubjectIcon } from "@/lib/legal/icon-map";
import type { ChatApiRequest, ChatApiResponse, ChatMessageData } from "@/lib/chat/types";
import type { ConversationSummary } from "@/lib/chat/conversations";
import { cn } from "@/lib/utils";

const REQUEST_TIMEOUT_MS = 45_000;
const NETWORK_ERROR_MESSAGE = "Couldn't reach StudyRex. Check your connection and try again.";
const TIMEOUT_ERROR_MESSAGE = "That took too long to answer. Please try again.";
const GENERIC_ERROR_MESSAGE = "StudyRex AI is temporarily unavailable. Please try again.";

const STARTER_PROMPTS = [
  "What is the basic structure doctrine?",
  "Explain culpable homicide vs. murder",
  "What makes an agreement void ab initio?",
  "Difference between IPC and BNS provisions",
];

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function initialSubjectFromParams(searchParams: ReadonlyURLSearchParams): string {
  const subjectParam = searchParams.get("subject");
  if (subjectParam && subjects.some((s) => s.slug === subjectParam)) return subjectParam;
  return "all";
}

export function TutorView() {
  const searchParams = useSearchParams();
  // Remount when the query string changes so a fresh subject/conversation
  // (e.g. from an "Ask AI about this" link) starts a clean session, without
  // needing an effect to sync external URL state into local state.
  return <TutorViewInner key={searchParams.toString()} searchParams={searchParams} />;
}

function TutorViewInner({ searchParams }: { searchParams: ReadonlyURLSearchParams }) {
  const router = useRouter();
  const initialConversationId = searchParams.get("conversation") ?? undefined;
  const initialPrompt = searchParams.get("prompt") ?? undefined;
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [input, setInput] = useState("");
  const [subject, setSubject] = useState(() => initialSubjectFromParams(searchParams));
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  // Synchronous guard against a double-fire (e.g. a very fast double click/Enter)
  // landing before React has re-rendered the disabled composer — state alone
  // isn't enough since both events can read stale state in the same tick.
  const sendingRef = useRef(false);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function refreshConversationList() {
    fetch("/api/conversations")
      .then((res) => (res.ok ? res.json() : { conversations: [] }))
      .then((data) => setConversations(data.conversations ?? []))
      .catch(() => setConversations([]));
  }

  useEffect(() => {
    refreshConversationList();
  }, []);

  useEffect(() => {
    if (!initialConversationId) return;
    let cancelled = false;
    fetch(`/api/conversations/${initialConversationId}`)
      .then(async (res) => {
        if (!res.ok) {
          if (!cancelled) {
            toast.error("That conversation couldn't be found.");
            router.replace("/tutor");
          }
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled || !data?.conversation) return;
        setMessages(data.conversation.messages);
        setSubject(data.conversation.subject || "all");
      })
      .catch(() => {
        if (!cancelled) toast.error("Couldn't load that conversation. Please try again.");
      });
    return () => {
      cancelled = true;
    };
  }, [initialConversationId, router]);

  // Auto-send a starter question deep-linked from a subject page (e.g. "?prompt=..."),
  // once per mount — this component remounts on every distinct query string (see the
  // `key={searchParams.toString()}` wrapper above), so this never double-fires for one link.
  useEffect(() => {
    if (!initialPrompt || initialConversationId) return;
    sendQuestion(initialPrompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isBusy = messages.some((m) => m.pending);

  async function requestAnswer(
    pendingId: string,
    question: string,
    history: { role: "user" | "assistant"; content: string }[],
  ) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const payload: ChatApiRequest = {
        question,
        chatHistory: history,
        subject: subject === "all" ? undefined : subject,
        conversationId,
      };
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok) {
        let message = GENERIC_ERROR_MESSAGE;
        try {
          const errBody = await res.json();
          if (typeof errBody?.error === "string" && errBody.error) message = errBody.error;
        } catch {
          // Response wasn't JSON — keep the generic message rather than guessing.
        }
        throw new Error(message);
      }

      let data: ChatApiResponse;
      try {
        data = await res.json();
      } catch {
        throw new Error(GENERIC_ERROR_MESSAGE);
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId
            ? {
                ...m,
                pending: false,
                error: false,
                errorMessage: undefined,
                content: data.answer,
                citations: data.citations,
                cases: data.cases,
                followUps: data.followUps,
                examTip: data.examTip,
                subject: data.subject,
              }
            : m,
        ),
      );

      if (data.conversationId && data.conversationId !== conversationId) {
        setConversationId(data.conversationId);
        // Shallow URL update (no client-side navigation/remount) so a page
        // refresh reloads the right conversation without losing in-memory state now.
        window.history.replaceState(null, "", `/tutor?conversation=${data.conversationId}`);
        refreshConversationList();
      }
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === "AbortError"
          ? TIMEOUT_ERROR_MESSAGE
          : err instanceof Error && err.message
            ? err.message
            : NETWORK_ERROR_MESSAGE;
      setMessages((prev) =>
        prev.map((m) => (m.id === pendingId ? { ...m, pending: false, error: true, errorMessage: message } : m)),
      );
    } finally {
      clearTimeout(timeout);
      sendingRef.current = false;
    }
  }

  function sendQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isBusy || sendingRef.current) return;
    sendingRef.current = true;

    const history = messages
      .filter((m) => !m.pending && !m.error)
      .map((m) => ({ role: m.role, content: m.content }));

    const userMsg: ChatMessageData = {
      id: newId(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    const pendingId = newId();
    const pendingMsg: ChatMessageData = {
      id: pendingId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
      pending: true,
    };

    setMessages((prev) => [...prev, userMsg, pendingMsg]);
    setInput("");
    void requestAnswer(pendingId, trimmed, history);
  }

  function retryMessage(assistantId: string) {
    if (sendingRef.current) return;
    const idx = messages.findIndex((m) => m.id === assistantId);
    if (idx <= 0) return;
    const question = messages[idx - 1]?.content;
    if (!question) return;
    sendingRef.current = true;
    const history = messages
      .slice(0, idx - 1)
      .filter((m) => !m.pending && !m.error)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) =>
      prev.map((m) => (m.id === assistantId ? { ...m, pending: true, error: false, errorMessage: undefined } : m)),
    );
    void requestAnswer(assistantId, question, history);
  }

  function startNewChat() {
    setHistoryOpen(false);
    router.push("/tutor");
  }

  function resumeConversation(id: string) {
    setHistoryOpen(false);
    router.push(`/tutor?conversation=${id}`);
  }

  async function renameConversation(id: string, title: string) {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error("We couldn't save your changes. Please try again.");
      refreshConversationList();
    }
  }

  async function deleteConversation(id: string) {
    const wasCurrent = id === conversationId;
    setConversations((prev) => prev.filter((c) => c.id !== id));
    try {
      const res = await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      if (wasCurrent) startNewChat();
    } catch {
      toast.error("We couldn't delete that conversation. Please try again.");
      refreshConversationList();
    }
  }

  const lastMessage = messages[messages.length - 1];
  const showFollowUps =
    lastMessage &&
    lastMessage.role === "assistant" &&
    !lastMessage.pending &&
    !lastMessage.error &&
    (lastMessage.followUps?.length ?? 0) > 0;

  return (
    <div className="flex h-[calc(100vh-4rem)] min-h-0">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border lg:flex">
        <HistoryPanel
          conversations={conversations}
          onNewChat={startNewChat}
          onSelect={resumeConversation}
          onRename={renameConversation}
          onDelete={deleteConversation}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 lg:hidden">
          <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="sm" className="gap-1.5" aria-label="Open conversation history" />}
            >
              <PanelLeft className="size-4" />
              History
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="border-b border-border">
                <SheetTitle>Conversations</SheetTitle>
              </SheetHeader>
              <HistoryPanel
                conversations={conversations}
                onNewChat={startNewChat}
                onSelect={resumeConversation}
                onRename={renameConversation}
                onDelete={deleteConversation}
              />
            </SheetContent>
          </Sheet>

          <Sheet open={contextOpen} onOpenChange={setContextOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="sm" className="ml-auto gap-1.5" aria-label="Open study context" />}
            >
              <Info className="size-4" />
              Context
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[75vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Study context</SheetTitle>
              </SheetHeader>
              <ContextPanel subject={subject} onSelectSubject={setSubject} onSendPrompt={sendQuestion} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {messages.length === 0 ? (
            <EmptyTutorState onSelectPrompt={sendQuestion} />
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} onRetry={m.error ? () => retryMessage(m.id) : undefined} />
              ))}
              {showFollowUps && (
                <FollowUpSuggestions
                  suggestions={lastMessage.followUps ?? []}
                  onSelect={sendQuestion}
                  className="ml-11"
                />
              )}
              <div ref={scrollAnchorRef} />
            </div>
          )}
        </div>

        <div className="border-t border-border bg-background px-4 py-4 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <ChatComposer
              value={input}
              onChange={setInput}
              onSubmit={() => sendQuestion(input)}
              subject={subject}
              onSubjectChange={setSubject}
              disabled={isBusy}
            />
          </div>
        </div>
      </div>

      <aside className="hidden w-72 shrink-0 flex-col overflow-y-auto border-l border-border xl:flex">
        <ContextPanel subject={subject} onSelectSubject={setSubject} onSendPrompt={sendQuestion} />
      </aside>
    </div>
  );
}

function HistoryPanel({
  conversations,
  onNewChat,
  onSelect,
  onRename,
  onDelete,
}: {
  conversations: ConversationSummary[];
  onNewChat: () => void;
  onSelect: (conversationId: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}) {
  const [renameTarget, setRenameTarget] = useState<ConversationSummary | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ConversationSummary | null>(null);

  function openRename(c: ConversationSummary) {
    setRenameTarget(c);
    setRenameValue(c.title);
  }

  function confirmRename() {
    if (!renameTarget || !renameValue.trim()) return;
    onRename(renameTarget.id, renameValue.trim());
    setRenameTarget(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    onDelete(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <Button variant="outline" className="w-full justify-start gap-2" onClick={onNewChat}>
          <MessageSquarePlus className="size-4" />
          New chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="px-1 pb-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Recent
        </p>
        {conversations.length === 0 ? (
          <p className="px-1 text-xs text-muted-foreground">No conversations yet.</p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {conversations.map((c) => (
              <div
                key={c.id}
                className="group flex items-start gap-1 rounded-md pr-1 transition-colors hover:bg-secondary"
              >
                <button
                  type="button"
                  onClick={() => onSelect(c.id)}
                  className="flex min-w-0 flex-1 flex-col items-start gap-0.5 rounded-md px-2.5 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="line-clamp-1 text-sm font-medium text-foreground">{c.title}</span>
                  <span className="line-clamp-1 text-xs text-muted-foreground">{c.subjectLabel}</span>
                </button>
                <div className="flex shrink-0 items-center gap-0.5 pt-1.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="size-6 text-muted-foreground hover:text-foreground"
                    aria-label={`Rename conversation: ${c.title}`}
                    onClick={() => openRename(c)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="size-6 text-muted-foreground hover:text-destructive"
                    aria-label={`Delete conversation: ${c.title}`}
                    onClick={() => setDeleteTarget(c)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!renameTarget} onOpenChange={(open) => !open && setRenameTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename conversation</DialogTitle>
            <DialogDescription>Give this conversation a title you&apos;ll recognize later.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-1.5">
            <Label htmlFor="tutor-rename-input">Title</Label>
            <Input
              id="tutor-rename-input"
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

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; and its messages will be permanently deleted. This can&apos;t be
              undone.
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

function ContextPanel({
  subject,
  onSelectSubject,
  onSendPrompt,
}: {
  subject: string;
  onSelectSubject: (slug: string) => void;
  onSendPrompt: (prompt: string) => void;
}) {
  const activeSubject = subjects.find((s) => s.slug === subject);

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <p className="mb-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Focus subject
        </p>
        {activeSubject ? (
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/15 text-primary">
                {renderSubjectIcon(activeSubject.icon, "size-4")}
              </div>
              <span className="text-sm font-semibold text-foreground">{activeSubject.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">{activeSubject.description}</p>
            <Button variant="ghost" size="sm" className="mt-2 -ml-2" onClick={() => onSelectSubject("all")}>
              Clear focus
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {subjects.slice(0, 6).map((s) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => onSelectSubject(s.slug)}
                className="rounded-md border border-border bg-card px-2.5 py-2 text-left text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          Try asking
        </p>
        <div className="flex flex-col gap-1.5">
          {STARTER_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onSendPrompt(p)}
              className="rounded-md border border-border bg-card px-3 py-2 text-left text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Current vs. historical law</p>
        <p className="mt-1">
          BNS, BNSS, and BSA (2023) are the current criminal law framework. Older material referencing
          IPC, CrPC, or the Evidence Act is labeled HISTORICAL wherever it appears in an answer.
        </p>
      </div>
    </div>
  );
}

function EmptyTutorState({ onSelectPrompt }: { onSelectPrompt: (prompt: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Sparkles className="size-5" aria-hidden="true" />
      </div>
      <h1 className="mt-4 font-heading text-xl font-semibold text-foreground">
        Ask anything about Indian law.
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Constitutional provisions, landmark cases, criminal law, or the exact section you need for an
        exam — the AI Tutor cites its sources and flags historical vs. current law.
      </p>
      <div className={cn("mt-6 grid w-full max-w-lg gap-2 sm:grid-cols-2")}>
        {STARTER_PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onSelectPrompt(p)}
            className="rounded-lg border border-border bg-card px-4 py-3 text-left text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
