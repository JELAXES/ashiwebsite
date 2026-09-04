"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ChatMessage } from "@/components/chat/chat-message";
import { FollowUpSuggestions } from "@/components/chat/follow-up-suggestions";
import { buttonVariants } from "@/components/ui/button";
import type { ChatMessageData } from "@/lib/chat/types";
import { cn } from "@/lib/utils";

const demoMessages: ChatMessageData[] = [
  {
    id: "demo-user",
    role: "user",
    content: "What is the difference between culpable homicide and murder?",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-assistant",
    role: "assistant",
    subject: "Criminal Law",
    createdAt: new Date().toISOString(),
    content:
      "## Definition\nCulpable homicide is causing death with the intention or knowledge that the act is likely to cause death. Murder is a graver species of culpable homicide, committed with a higher degree of intention or knowledge.\n\n## Essential elements\n- **Culpable homicide**: intention or knowledge of causing death, without the aggravating conditions required for murder.\n- **Murder**: intention to cause death, or to cause a bodily injury the offender knows is likely to cause death, or is sufficient in the ordinary course of nature to cause death.\n\n## Example\nIf A causes B's death in a sudden fight, without premeditation and without taking undue advantage, it may amount to culpable homicide not amounting to murder — not murder.",
    citations: [
      { label: "Section 299, IPC 1860", source: "Definition of culpable homicide", historical: true },
      { label: "Section 300, IPC 1860", source: "Definition of murder and exceptions", historical: true },
      { label: "Section 105, BNS 2023", source: "Culpable homicide not amounting to murder" },
      { label: "Section 103, BNS 2023", source: "Punishment for murder" },
    ],
    cases: [
      { name: "Bachan Singh v. State of Punjab (1980)", principle: "'Rarest of rare' doctrine for the death penalty in murder convictions" },
    ],
    examTip:
      "Always state which framework you're citing — IPC, 1860 (historical, applies to pre-1 July 2024 conduct) or BNS, 2023 (current). Examiners specifically test this transition.",
    followUps: ["Explain the exceptions to murder", "Compare BNS provisions with IPC in detail", "Quiz me on this topic"],
  },
];

export function ChatDemo() {
  const assistantMessage = demoMessages[1];

  return (
    <section id="ai-demo" className="border-b border-border py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            Ask. Understand. Remember.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Get clear explanations backed by relevant legal provisions and landmark cases.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-black/10">
          <div className="flex items-center gap-2.5 border-b border-border bg-secondary/30 px-5 py-3.5">
            <div className="flex size-7 items-center justify-center rounded-full bg-primary/15">
              <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">StudyRex AI Tutor</p>
              <p className="text-[11px] text-muted-foreground">Indian Law Study Mode · Criminal Law</p>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-7">
            {demoMessages.map((m) => (
              <ChatMessage key={m.id} message={m} hideActions />
            ))}

            <div className="pl-11">
              <FollowUpSuggestions
                suggestions={assistantMessage.followUps ?? []}
                onSelect={() => {}}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 border-t border-border bg-secondary/20 px-5 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-sm text-muted-foreground">
              Sign up to continue this conversation and ask your own questions.
            </p>
            <Link href="/signup" className={cn(buttonVariants(), "shrink-0")}>
              Try the AI Tutor free
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
