import type { Metadata } from "next";
import { FlashcardsView } from "@/components/study-tools/flashcards-view";
import { getCurrentUser } from "@/lib/auth/session";
import { getSubjectBySlug, getCurriculumSlugsForTrack } from "@/lib/legal/subjects";
import { getFlashcardDecks, subjectsWithAnyFlashcards } from "@/lib/content/decks";

export const metadata: Metadata = {
  title: "Flashcards",
};

export default async function FlashcardsPage(props: PageProps<"/study-tools/flashcards">) {
  const { subject } = await props.searchParams;
  const user = await getCurrentUser();

  const subjectParam = Array.isArray(subject) ? subject[0] : subject;
  const wanted =
    subjectParam && getSubjectBySlug(subjectParam) ? subjectParam : undefined;

  // Year-scoped: the exact curriculum slugs for the user's track, so every
  // subject is its own selectable deck. Falls back to "everything with content"
  // for a user who hasn't picked a year yet.
  const trackSlugs = getCurriculumSlugsForTrack(user?.lawLevel);
  const baseSlugs = trackSlugs.length > 0 ? trackSlugs : subjectsWithAnyFlashcards();
  const slugs =
    wanted && !baseSlugs.includes(wanted) ? [wanted, ...baseSlugs] : baseSlugs;

  const decks = await getFlashcardDecks(slugs);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <FlashcardsView decks={decks} initialSubject={wanted} />
    </div>
  );
}
