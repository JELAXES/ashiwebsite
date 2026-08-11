import type { Metadata } from "next";
import { BookmarksView } from "@/components/bookmarks/bookmarks-view";

export const metadata: Metadata = {
  title: "Bookmarks",
};

export default function BookmarksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Bookmarks
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Answers, sections, cases, and quiz questions you&apos;ve saved for later.
        </p>
      </div>
      <div className="mt-6">
        <BookmarksView />
      </div>
    </div>
  );
}
