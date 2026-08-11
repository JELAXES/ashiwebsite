"use client";

import { useMemo, useState } from "react";
import { Check, X, Lightbulb, RotateCcw, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { quizQuestions } from "@/lib/legal/quiz";
import { subjects } from "@/lib/legal/subjects";
import { cn } from "@/lib/utils";

const quizSubjectSlugs = Array.from(new Set(quizQuestions.map((q) => q.subject)));
const availableSubjects = subjects.filter((s) => quizSubjectSlugs.includes(s.slug));

interface QuizEngineProps {
  title: string;
  description: string;
}

export function QuizEngine({ title, description }: QuizEngineProps) {
  const [subject, setSubject] = useState("all");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const pool = useMemo(
    () => (subject === "all" ? quizQuestions : quizQuestions.filter((q) => q.subject === subject)),
    [subject],
  );

  const question = pool[index];

  function selectSubject(value: string) {
    setSubject(value);
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setCorrectCount(0);
    setFinished(false);
  }

  function checkAnswer() {
    if (!selected) return;
    setChecked(true);
    if (selected === question.correctOptionId) {
      setCorrectCount((c) => c + 1);
    }
  }

  function next() {
    if (index + 1 >= pool.length) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setChecked(false);
  }

  function retake() {
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setCorrectCount(0);
    setFinished(false);
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
        <Select value={subject} onValueChange={(v) => selectSubject(v ?? "all")}>
          <SelectTrigger className="h-9 w-full sm:w-56">
            <SelectValue placeholder="All subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects ({quizQuestions.length})</SelectItem>
            {availableSubjects.map((s) => (
              <SelectItem key={s.slug} value={s.slug}>
                {s.name} ({quizQuestions.filter((q) => q.subject === s.slug).length})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8 mx-auto max-w-2xl">
        {pool.length === 0 ? (
          <EmptyState
            icon={ScrollText}
            title="No questions yet for this subject"
            description="This subject's question bank is still being built — try another subject in the meantime."
          />
        ) : finished ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Your score</p>
            <p className="mt-2 font-heading text-4xl font-semibold text-primary">
              {correctCount}/{pool.length}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {Math.round((correctCount / pool.length) * 100)}% correct
            </p>
            <Button className="mt-6 gap-2" onClick={retake}>
              <RotateCcw className="size-4" />
              Retake quiz
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Question {index + 1} of {pool.length}
              </span>
              <Badge variant="outline" className="capitalize">
                {question.difficulty}
              </Badge>
            </div>

            <h2 className="mt-4 font-heading text-lg leading-snug font-semibold text-balance text-foreground">
              {question.question}
            </h2>

            <div className="mt-5 flex flex-col gap-2.5">
              {question.options.map((opt) => {
                const isSelected = selected === opt.id;
                const isCorrect = opt.id === question.correctOptionId;
                const showState = checked && (isSelected || isCorrect);

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={checked}
                    onClick={() => setSelected(opt.id)}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      !checked && isSelected && "border-primary/50 bg-accent/40",
                      !checked && !isSelected && "border-border bg-background hover:border-primary/30",
                      checked && isCorrect && "border-success/50 bg-success/10",
                      checked && isSelected && !isCorrect && "border-destructive/50 bg-destructive/10",
                      checked && !isSelected && !isCorrect && "border-border opacity-60",
                    )}
                  >
                    <span className="text-foreground">{opt.text}</span>
                    {showState && (isCorrect ? (
                      <Check className="size-4 shrink-0 text-success" aria-hidden="true" />
                    ) : (
                      <X className="size-4 shrink-0 text-destructive" aria-hidden="true" />
                    ))}
                  </button>
                );
              })}
            </div>

            {checked && (
              <div className="mt-5 space-y-3">
                <div className="rounded-md border border-border bg-muted/40 p-3.5 text-sm text-muted-foreground">
                  <p className="mb-1 text-xs font-semibold text-foreground">Explanation</p>
                  {question.explanation}
                  {question.provision && (
                    <p className="mt-2 text-xs text-muted-foreground">Provision: {question.provision}</p>
                  )}
                  {question.caseRef && (
                    <p className="mt-1 text-xs text-muted-foreground">Case: {question.caseRef}</p>
                  )}
                </div>
                {question.examTip && (
                  <div className="flex items-start gap-2 rounded-md border border-primary/25 bg-accent/50 px-3.5 py-2.5 text-xs text-accent-foreground">
                    <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
                    <p>
                      <span className="font-semibold">Exam tip: </span>
                      {question.examTip}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              {checked ? (
                <Button onClick={next}>{index + 1 >= pool.length ? "See results" : "Next question"}</Button>
              ) : (
                <Button onClick={checkAnswer} disabled={!selected}>
                  Check answer
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
