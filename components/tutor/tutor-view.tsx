"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";
import { MessageSquarePlus, PanelLeft, Info, Sparkles } from "lucide-react";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatComposer } from "@/components/chat/chat-composer";
import { FollowUpSuggestions } from "@/components/chat/follow-up-suggestions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { subjects } from "@/lib/legal/subjects";
import { renderSubjectIcon } from "@/lib/legal/icon-map";
import type { ChatApiRequest, ChatApiResponse, ChatMessageData } from "@/lib/chat/types";
import type { ConversationSummary } from "@/lib/chat/conversations";
import { cn } from "@/lib/utils";

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
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [input, setInput] = useState("");
  const [subject, setSubject] = useState(() => initialSubjectFromParams(searchParams));
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    fetch("/api/conversations")
      .then((res) => (res.ok ? res.json() : { conversations: [] }))
      .then((data) => setConversations(data.conversations ?? []))
      .catch(() => setConversations([]));
  }, []);

  useEffect(() => {
    if (!initialConversationId) return;
    let cancelled = false;
    fetch(`/api/conversations/${initialConversationId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.conversation) return;
        setMessages(data.conversation.messages);
        setSubject(data.conversation.subject || "all");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [initialConversationId]);

  const isBusy = messages.some((m) => m.pending);

  async function requestAnswer(
    pendingId: string,
    question: string,
    history: { role: "user" | "assistant"; content: string }[],
  ) {
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
      });

      if (!res.ok) throw new Error(`Request failed with ${res.status}`);
      const data: ChatApiResponse = await res.json();

      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId
            ? {
                ...m,
                pending: false,
                error: false,
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
        fetch("/api/conversations")
          .then((res) => (res.ok ? res.json() : { conversations: [] }))
          .then((refreshed) => setConversations(refreshed.conversations ?? []))
          .catch(() => {});
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === pendingId ? { ...m, pending: false, error: true } : m)),
      );
    }
  }

  function sendQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isBusy) return;

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
    const idx = messages.findIndex((m) => m.id === assistantId);
    if (idx <= 0) return;
    const question = messages[idx - 1]?.content;
    if (!question) return;
    const history = messages
      .slice(0, idx - 1)
      .filter((m) => !m.pending && !m.error)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) =>
      prev.map((m) => (m.id === assistantId ? { ...m, pending: true, error: false } : m)),
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
        <HistoryPanel conversations={conversations} onNewChat={startNewChat} onSelect={resumeConversation} />
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
              <HistoryPanel conversations={conversations} onNewChat={startNewChat} onSelect={resumeConversation} />
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
}: {
  conversations: ConversationSummary[];
  onNewChat: () => void;
  onSelect: (conversationId: string) => void;
}) {
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
          <div className="flex flex-col gap-1">
            {conversations.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelect(c.id)}
                className="flex flex-col items-start gap-0.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="line-clamp-1 text-sm font-medium text-foreground">{c.title}</span>
                <span className="line-clamp-1 text-xs text-muted-foreground">{c.subjectLabel}</span>
              </button>
            ))}
          </div>
        )}
      </div>
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
            <Progress value={activeSubject.progress} className="mt-3 h-1.5" />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {activeSubject.topicsCompleted}/{activeSubject.topicsTotal} topics · {activeSubject.progress}%
            </p>
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
