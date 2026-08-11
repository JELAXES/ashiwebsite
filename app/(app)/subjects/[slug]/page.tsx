import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles, GraduationCap, Landmark } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CaseCard } from "@/components/legal/case-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getSubjectBySlug, subjects } from "@/lib/legal/subjects";
import { landmarkCases } from "@/lib/legal/cases";
import { getQuizBySubject } from "@/lib/legal/quiz";
import { getFlashcardsBySubject } from "@/lib/legal/flashcards";
import { renderSubjectIcon } from "@/lib/legal/icon-map";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return subjects.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/subjects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const subject = getSubjectBySlug(slug);
  return { title: subject ? subject.name : "Subject not found" };
}

export default async function SubjectDetailPage(props: PageProps<"/subjects/[slug]">) {
  const { slug } = await props.params;
  const subject = getSubjectBySlug(slug);
  if (!subject) notFound();

  const relatedCases = landmarkCases.filter((c) => c.subject === subject.name).slice(0, 3);
  const quizCount = getQuizBySubject(subject.slug).length;
  const flashcardCount = getFlashcardsBySubject(subject.slug).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            {renderSubjectIcon(subject.icon, "size-6")}
          </div>
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              {subject.name}
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{subject.description}</p>
          </div>
        </div>
        <Link
          href={`/tutor?subject=${subject.slug}`}
          className={cn(buttonVariants({ size: "lg" }), "shrink-0 gap-2")}
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Ask AI about this subject
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground">Progress</p>
          <p className="mt-2 font-heading text-2xl font-semibold text-primary">{subject.progress}%</p>
          <Progress value={subject.progress} className="mt-3 h-1.5" />
          <p className="mt-2 text-xs text-muted-foreground">
            {subject.topicsCompleted}/{subject.topicsTotal} topics completed
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground">Questions asked</p>
          <p className="mt-2 font-heading text-2xl font-semibold text-foreground">
            {subject.questionsAsked}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">via the AI Tutor</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground">Last studied</p>
          <p className="mt-2 font-heading text-2xl font-semibold text-foreground">
            {subject.lastStudied ?? "—"}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {subject.lastStudied ? "Keep the streak going" : "Not started yet"}
          </p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-heading text-lg font-semibold text-foreground">Practice this subject</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link
            href={`/study-tools/quiz?subject=${subject.slug}`}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary">
              <GraduationCap className="size-4.5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">AI Quiz</p>
              <p className="text-xs text-muted-foreground">{quizCount} questions available</p>
            </div>
          </Link>
          <Link
            href={`/study-tools/flashcards?subject=${subject.slug}`}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary">
              <Landmark className="size-4.5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Flashcards</p>
              <p className="text-xs text-muted-foreground">{flashcardCount} cards available</p>
            </div>
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">Related landmark cases</h2>
          <Link href="/cases" className="text-sm font-medium text-primary hover:underline">
            Case library
          </Link>
        </div>
        {relatedCases.length === 0 ? (
          <EmptyState
            icon={Landmark}
            title="No cases tagged yet"
            description="This subject doesn't have curated case references yet — check the full case library instead."
            className="mt-4"
          />
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCases.map((c) => (
              <CaseCard key={c.id} item={c} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
