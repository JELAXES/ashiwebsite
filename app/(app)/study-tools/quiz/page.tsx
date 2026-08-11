import type { Metadata } from "next";
import { QuizEngine } from "@/components/study-tools/quiz-engine";

export const metadata: Metadata = {
  title: "AI Quiz",
};

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <QuizEngine
        title="AI Quiz"
        description="Test yourself against the vetted question bank. Each question comes with a full explanation and, where relevant, an exam tip."
      />
    </div>
  );
}
