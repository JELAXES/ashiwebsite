import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CaseCard } from "@/components/legal/case-card";
import { landmarkCases } from "@/lib/legal/cases";

const preview = landmarkCases.slice(0, 3);

export function CaseLibraryPreview() {
  return (
    <section className="border-b border-border bg-card/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
              Learn from the cases that shaped Indian law.
            </h2>
            <p className="mt-3 text-muted-foreground">
              A growing library of landmark judgments — with the principle, provisions,
              and context you need for exams.
            </p>
          </div>
          <Link
            href="/cases"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Explore Case Library
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((c) => (
            <CaseCard key={c.id} item={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
