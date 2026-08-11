import type { Metadata } from "next";
import { QuizEngine } from "@/components/study-tools/quiz-engine";

export const metadata: Metadata = {
  title: "CLAT Practice",
};

export default function ClatPracticePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <QuizEngine
        title="CLAT Practice"
        description="Objective-style questions drawn from the same vetted question bank as the AI Quiz. This is a starter practice set, not a full-length mock — pair it with timed mocks closer to your exam."
      />
    </div>
  );
}
