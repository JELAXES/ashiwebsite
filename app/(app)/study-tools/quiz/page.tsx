import type { Metadata } from "next";
import { QuizEngine } from "@/components/study-tools/quiz-engine";
import { getCurrentUser } from "@/lib/auth/session";
import { getSubjectBySlug, getCurriculumSlugsForTrack } from "@/lib/legal/subjects";
import { getQuizDecks, subjectsWithAnyQuiz } from "@/lib/content/decks";

export const metadata: Metadata = {
  title: "AI Quiz",
};

export default async function QuizPage(props: PageProps<"/study-tools/quiz">) {
  const { subject } = await props.searchParams;
  const user = await getCurrentUser();

  const subjectParam = Array.isArray(subject) ? subject[0] : subject;
  const wanted = subjectParam && getSubjectBySlug(subjectParam) ? subjectParam : undefined;

  const trackSlugs = getCurriculumSlugsForTrack(user?.lawLevel);
  const baseSlugs = trackSlugs.length > 0 ? trackSlugs : subjectsWithAnyQuiz();
  const slugs = wanted && !baseSlugs.includes(wanted) ? [wanted, ...baseSlugs] : baseSlugs;

  const decks = await getQuizDecks(slugs);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <QuizEngine
        title="AI Quiz"
        description="Test yourself against the vetted question bank. Each question comes with a full explanation and, where relevant, an exam tip."
        decks={decks}
        initialSubject={wanted}
      />
    </div>
  );
}
