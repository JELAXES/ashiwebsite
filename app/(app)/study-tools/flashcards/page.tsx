import type { Metadata } from "next";
import { FlashcardsView } from "@/components/study-tools/flashcards-view";

export const metadata: Metadata = {
  title: "Flashcards",
};

export default function FlashcardsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <FlashcardsView />
    </div>
  );
}
