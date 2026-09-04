import type { Metadata } from "next";
import { QuizEngine } from "@/components/study-tools/quiz-engine";
import { getQuizDecks, subjectsWithAnyQuiz } from "@/lib/content/decks";

export const metadata: Metadata = {
  title: "Judiciary Practice",
};

export default async function JudiciaryPracticePage() {
  const decks = await getQuizDecks(subjectsWithAnyQuiz());
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <QuizEngine
        title="Judiciary Practice"
        description="Practice questions with provision references and exam tips geared toward judiciary services exams. This is a starter set drawn from the shared question bank, not a full mock test."
        decks={decks}
      />
    </div>
  );
}
