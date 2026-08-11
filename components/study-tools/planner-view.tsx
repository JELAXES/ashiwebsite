"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, CalendarClock, AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { buttonVariants } from "@/components/ui/button";
import { upcomingRevision, weakAreas } from "@/lib/legal/mock-data";
import { subjects } from "@/lib/legal/subjects";
import { cn } from "@/lib/utils";

const leastStudied = [...subjects].sort((a, b) => a.progress - b.progress).slice(0, 4);

export function PlannerView() {
  const [done, setDone] = useState<Record<string, boolean>>({});

  return (
    <div>
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Study Planner
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          A suggested plan based on your revision queue, weak areas, and least-studied subjects.
          Check items off as you go — this list resets when you leave the page.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
            <CalendarClock className="size-4.5 text-primary" aria-hidden="true" />
            This week&apos;s revision
          </h2>
          <div className="mt-4 space-y-2">
            {upcomingRevision.map((r) => (
              <label
                key={r.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30"
              >
                <Checkbox
                  className="mt-0.5"
                  checked={!!done[r.id]}
                  onCheckedChange={(checked) => setDone((d) => ({ ...d, [r.id]: checked }))}
                />
                <div className={cn(done[r.id] && "opacity-50 line-through")}>
                  <p className="text-sm font-medium text-foreground">{r.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{r.subject}</span>
                    <span>·</span>
                    <span className="font-medium text-primary">{r.dueLabel}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
            <AlertTriangle className="size-4.5 text-destructive" aria-hidden="true" />
            Recommended focus
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Topics with the lowest quiz accuracy — worth another pass before an exam.
          </p>
          <div className="mt-4 space-y-2">
            {weakAreas.map((w) => (
              <div key={w.topic} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{w.subjectLabel}</span>
                  <span className="text-xs font-semibold text-destructive">{w.accuracy}% accuracy</span>
                </div>
                <p className="mt-1.5 text-sm text-foreground">{w.topic}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="font-heading text-lg font-semibold text-foreground">Least-studied subjects</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {leastStudied.map((s) => (
            <Link
              key={s.slug}
              href={`/subjects/${s.slug}`}
              className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <p className="text-sm font-medium text-foreground">{s.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.progress}% complete</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-10 flex flex-col items-start gap-4 rounded-xl border border-primary/20 bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">Not sure where to start?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask the AI Tutor to suggest a revision order based on what you find hardest.
          </p>
        </div>
        <Link href="/tutor" className={cn(buttonVariants({ size: "lg" }), "shrink-0 gap-2")}>
          <Sparkles className="size-4" aria-hidden="true" />
          Ask AI
        </Link>
      </div>
    </div>
  );
}
