import type { Metadata } from "next";
import { SubjectsGrid } from "@/components/subjects/subjects-grid";

export const metadata: Metadata = {
  title: "Subjects",
};

export default function SubjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Subjects</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          16 subjects across constitutional, criminal, civil, and commercial law — track your progress
          as you study.
        </p>
      </div>
      <div className="mt-6">
        <SubjectsGrid />
      </div>
    </div>
  );
}
