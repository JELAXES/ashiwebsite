import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles, ScrollText, TriangleAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { landmarkCases, getCaseById } from "@/lib/legal/cases";
import { subjects } from "@/lib/legal/subjects";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return landmarkCases.map((c) => ({ id: c.id }));
}

export async function generateMetadata(props: PageProps<"/cases/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const item = getCaseById(id);
  return { title: item ? item.name : "Case not found" };
}

export default async function CaseDetailPage(props: PageProps<"/cases/[id]">) {
  const { id } = await props.params;
  const item = getCaseById(id);
  if (!item) notFound();

  const subjectSlug = subjects.find((s) => s.name === item.subject)?.slug;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
          {item.subject}
        </span>
        <span className="text-xs font-medium text-muted-foreground">{item.year}</span>
      </div>

      <h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl">
        {item.name}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {item.court} · {item.citation}
      </p>

      <div className="mt-6 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3">
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">{item.principle}</p>
      </div>

      <div className="mt-6">
        <h2 className="font-heading text-base font-semibold text-foreground">Summary</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
      </div>

      {item.provisions.length > 0 && (
        <div className="mt-6">
          <h2 className="font-heading text-base font-semibold text-foreground">Provisions cited</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.provisions.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground"
              >
                <ScrollText className="size-3.5 text-muted-foreground" aria-hidden="true" />
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-start gap-2.5 rounded-md border border-border bg-muted/50 px-3.5 py-3 text-xs text-muted-foreground">
        <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <p>
          This is a study summary, not a substitute for the official judgment. Verify the citation and
          holding against SCC/AIR or the Supreme Court/High Court website before relying on it in an
          exam or filing.
        </p>
      </div>

      <div className="mt-8">
        <Link
          href={subjectSlug ? `/tutor?subject=${subjectSlug}` : "/tutor"}
          className={cn(buttonVariants({ size: "lg" }), "gap-2")}
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Ask the AI Tutor about this case
        </Link>
      </div>
    </div>
  );
}
