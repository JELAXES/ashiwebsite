import "server-only";
import type { FlashcardItem } from "@/components/study-tools/flashcard-deck";
import type { QuizQuestion } from "@/lib/legal/types";
import { getSubjectBySlug, getPracticeSlug } from "@/lib/legal/subjects";
import { flashcards as seedFlashcards, getFlashcardsBySubject } from "@/lib/legal/flashcards";
import { quizQuestions as seedQuiz, getQuizBySubject } from "@/lib/legal/quiz";
import { getBundledContent, bundledSubjectSlugs } from "./bundled";
import { getContentItemsForSubjects } from "./queries";
import type { ContentItem, ContentItemInput } from "./types";

export interface FlashcardDeckData {
  slug: string;
  name: string;
  cards: FlashcardItem[];
}

export interface QuizDeckData {
  slug: string;
  name: string;
  questions: QuizQuestion[];
}

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

function bundledFlashcardToItem(c: ContentItemInput, i: number): FlashcardItem {
  return {
    id: `bundled:${c.subjectSlug}:flashcard:${c.order ?? i}`,
    front: c.flashcard?.front ?? c.title,
    back: c.flashcard?.back ?? c.body ?? "",
    backMeta: c.flashcard?.provision,
  };
}

function dbFlashcardToItem(c: ContentItem): FlashcardItem {
  return {
    id: c.id,
    front: c.flashcard?.front ?? c.title,
    back: c.flashcard?.back ?? c.body ?? "",
    backMeta: c.flashcard?.provision,
  };
}

/**
 * One flashcard deck per requested subject slug.
 *
 * For each subject: bundled + DB content stored against its EXACT slug wins.
 * Only if a subject has none of its own do we fall back to its linked practice
 * slug's bundled/DB content and, last, the legacy curated seed. That ordering is
 * the fix for "different subjects showing identical flashcards": siblings that
 * link to the same rich subject stay separate decks the moment either gets its
 * own imported rows.
 */
export async function getFlashcardDecks(subjectSlugs: string[]): Promise<FlashcardDeckData[]> {
  const slugs = Array.from(new Set(subjectSlugs));
  const practiceSlugs = Array.from(
    new Set(
      slugs.flatMap((s) => {
        const subj = getSubjectBySlug(s);
        return subj ? [s, getPracticeSlug(subj)] : [s];
      }),
    ),
  );

  let dbBySlug: Record<string, ContentItem[]> = {};
  try {
    dbBySlug = await getContentItemsForSubjects(practiceSlugs, "flashcard");
  } catch (error) {
    // DB unavailable — bundled + seed content still render.
    console.error("[content/decks] flashcard DB fetch failed", error);
  }

  return slugs.map((slug) => {
    const subject = getSubjectBySlug(slug);
    const name = subject?.name ?? slug;
    const practice = subject ? getPracticeSlug(subject) : slug;

    const exact = [
      ...getBundledContent(slug, "flashcard").map(bundledFlashcardToItem),
      ...(dbBySlug[slug] ?? []).map(dbFlashcardToItem),
    ];
    if (exact.length > 0) {
      return { slug, name, cards: dedupeById(exact) };
    }

    // Fallback: shared doctrinal content from the linked subject.
    const fallback = [
      ...getBundledContent(practice, "flashcard").map(bundledFlashcardToItem),
      ...(dbBySlug[practice] ?? []).map(dbFlashcardToItem),
      ...getFlashcardsBySubject(practice).map((f) => ({
        id: f.id,
        front: f.front,
        back: f.back,
        backMeta: f.provision,
      })),
    ];
    return { slug, name, cards: dedupeById(fallback) };
  });
}

/** Same contract as `getFlashcardDecks`, for the MCQ quiz bank. */
export async function getQuizDecks(subjectSlugs: string[]): Promise<QuizDeckData[]> {
  const slugs = Array.from(new Set(subjectSlugs));
  const practiceSlugs = Array.from(
    new Set(
      slugs.flatMap((s) => {
        const subj = getSubjectBySlug(s);
        return subj ? [s, getPracticeSlug(subj)] : [s];
      }),
    ),
  );

  let dbBySlug: Record<string, ContentItem[]> = {};
  try {
    dbBySlug = await getContentItemsForSubjects(practiceSlugs, "question");
  } catch (error) {
    console.error("[content/decks] quiz DB fetch failed", error);
  }

  const dbToQuestion = (c: ContentItem): QuizQuestion | null => {
    if (!c.question) return null;
    return {
      id: c.id,
      subject: c.subjectSlug as QuizQuestion["subject"],
      difficulty: "medium",
      question: c.question.prompt,
      options: c.question.options,
      correctOptionId: c.question.correctOptionId,
      explanation: c.question.explanation,
      provision: c.question.provision,
      caseRef: c.question.caseRef,
      examTip: c.question.examTip,
    };
  };

  return slugs.map((slug) => {
    const subject = getSubjectBySlug(slug);
    const name = subject?.name ?? slug;
    const practice = subject ? getPracticeSlug(subject) : slug;

    const exact = (dbBySlug[slug] ?? [])
      .map(dbToQuestion)
      .filter((q): q is QuizQuestion => !!q);
    if (exact.length > 0) return { slug, name, questions: exact };

    const fallback = [
      ...(dbBySlug[practice] ?? []).map(dbToQuestion).filter((q): q is QuizQuestion => !!q),
      ...getQuizBySubject(practice),
    ];
    return { slug, name, questions: dedupeById(fallback) };
  });
}

/**
 * Default subject set for a study tool when the user has no year selected:
 * every subject that has any content at all (seed or bundled), so the picker is
 * never empty.
 */
export function subjectsWithAnyFlashcards(): string[] {
  return Array.from(
    new Set([...seedFlashcards.map((f) => f.subject), ...bundledSubjectSlugs()]),
  );
}

export function subjectsWithAnyQuiz(): string[] {
  return Array.from(new Set(seedQuiz.map((q) => q.subject)));
}
