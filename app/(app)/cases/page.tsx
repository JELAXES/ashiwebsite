import type { Metadata } from "next";
import { CasesBrowser } from "@/components/cases/cases-browser";

export const metadata: Metadata = {
  title: "Case Library",
};

export default function CasesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Case Library
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          A curated set of well-documented landmark judgments. Citations are illustrative study
          references — always verify against SCC/AIR or the official judgment before citing in exams.
        </p>
      </div>
      <div className="mt-6">
        <CasesBrowser />
      </div>
    </div>
  );
}
