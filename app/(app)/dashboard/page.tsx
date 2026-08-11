import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Flame, HelpCircle, BookCheck, Target } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { SubjectCard } from "@/components/legal/subject-card";
import { CaseCard } from "@/components/legal/case-card";
import { LegalDisclaimer } from "@/components/legal/legal-disclaimer";
import { subjects } from "@/lib/legal/subjects";
import { landmarkCases } from "@/lib/legal/cases";
import {
  dashboardStats,
  recentConversations,
  weakAreas,
  upcomingRevision,
  studentName,
} from "@/lib/legal/mock-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function relativeTime(iso: string) {
  const hours = Math.round((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

const continueStudying = subjects
  .filter((s) => s.lastStudied)
  .sort((a, b) => (b.lastStudied ?? "").localeCompare(a.lastStudied ?? ""))
  .slice(0, 3);

const recommendedTopics = subjects
  .filter((s) => s.progress < 60)
  .sort((a, b) => a.progress - b.progress)
  .slice(0, 3);

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Flame className="size-4 text-primary" aria-hidden="true" />
            {dashboardStats.studyStreak}-day study streak
          </p>
          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl">
            {greeting()}, {studentName}.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Pick up where you left off, or ask the AI tutor anything about Indian law.
          </p>
        </div>
        <Link href="/tutor" className={cn(buttonVariants({ size: "lg" }), "shrink-0 gap-2")}>
          <Sparkles className="size-4" aria-hidden="true" />
          Ask AI
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Study streak" value={dashboardStats.studyStreak} suffix="days" icon={Flame} emphasize />
        <StatCard label="Questions asked" value={dashboardStats.questionsAsked} icon={HelpCircle} />
        <StatCard label="Topics completed" value={dashboardStats.topicsCompleted} icon={BookCheck} />
        <StatCard label="Quiz accuracy" value={dashboardStats.quizAccuracy} suffix="%" icon={Target} />
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">Continue studying</h2>
          <Link href="/subjects" className="text-sm font-medium text-primary hover:underline">
            All subjects
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {continueStudying.map((s) => (
            <SubjectCard key={s.slug} subject={s} />
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-foreground">Recent conversations</h2>
            <Link href="/history" className="text-sm font-medium text-primary hover:underline">
              View history
            </Link>
          </div>
          <div className="mt-4 divide-y divide-border rounded-lg border border-border bg-card">
            {recentConversations.map((c) => (
              <Link
                key={c.id}
                href={`/tutor?conversation=${c.id}`}
                className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{c.title}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.preview}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-xs text-muted-foreground">{relativeTime(c.updatedAt)}</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                    {c.subjectLabel}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">Weak areas</h2>
          <div className="mt-4 space-y-3">
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

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="font-heading text-lg font-semibold text-foreground">Recommended next topics</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedTopics.map((s) => (
              <SubjectCard key={s.slug} subject={s} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-foreground">Upcoming revision</h2>
          <div className="mt-4 space-y-3">
            {upcomingRevision.map((r) => (
              <div key={r.id} className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm font-medium text-foreground">{r.title}</p>
                <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{r.subject}</span>
                  <span className="font-medium text-primary">{r.dueLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">Recent landmark cases</h2>
          <Link href="/cases" className="text-sm font-medium text-primary hover:underline">
            Case library
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {landmarkCases.slice(0, 3).map((c) => (
            <CaseCard key={c.id} item={c} />
          ))}
        </div>
      </section>

      <div className="mt-10 flex flex-col items-start gap-4 rounded-xl border border-primary/20 bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">Have a question?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask the AI tutor and get a structured, cited explanation in seconds.
          </p>
        </div>
        <Link href="/tutor" className={cn(buttonVariants({ size: "lg" }), "shrink-0 gap-2")}>
          <Sparkles className="size-4" aria-hidden="true" />
          Ask AI
        </Link>
      </div>

      <LegalDisclaimer variant="block" className="mt-8" />
    </div>
  );
}
