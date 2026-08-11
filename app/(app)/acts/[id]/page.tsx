import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles, History, ScrollText } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { legalActs, getActById } from "@/lib/legal/acts";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return legalActs.map((a) => ({ id: a.id }));
}

export async function generateMetadata(props: PageProps<"/acts/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const item = getActById(id);
  return { title: item ? item.name : "Act not found" };
}

export default async function ActDetailPage(props: PageProps<"/acts/[id]">) {
  const { id } = await props.params;
  const item = getActById(id);
  if (!item) notFound();

  const isHistorical = item.status === "historical";
  const relatedName = item.supersededBy ?? item.supersedes;
  const related = relatedName ? legalActs.find((a) => a.name === relatedName) : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
          {item.category}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase",
            isHistorical ? "text-muted-foreground" : "text-primary",
          )}
        >
          {isHistorical && <History className="size-3" aria-hidden="true" />}
          {isHistorical ? "Historical" : "Current"}
        </span>
      </div>

      <h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl">
        {item.name}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{item.inForceNote}</p>

      {related && (
        <div className="mt-4 rounded-md border border-border bg-muted/40 px-3.5 py-2.5 text-xs text-muted-foreground">
          {item.supersededBy ? "Superseded by " : "Supersedes "}
          <Link href={`/acts/${related.id}`} className="font-medium text-primary hover:underline">
            {related.name}
          </Link>
        </div>
      )}

      <div className="mt-6">
        <h2 className="font-heading text-base font-semibold text-foreground">Overview</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
      </div>

      {item.provisions.length > 0 && (
        <div className="mt-6">
          <h2 className="font-heading text-base font-semibold text-foreground">Key provisions</h2>
          <div className="mt-2 space-y-2">
            {item.provisions.map((p) => (
              <div
                key={p.label}
                className={cn(
                  "flex items-start gap-3 rounded-md border-l-2 bg-secondary/60 px-3.5 py-2.5",
                  isHistorical ? "border-l-muted-foreground/40" : "border-l-primary",
                )}
              >
                <ScrollText
                  className={cn("mt-0.5 size-4 shrink-0", isHistorical ? "text-muted-foreground" : "text-primary")}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {item.amendments.length > 0 && (
        <div className="mt-6">
          <h2 className="font-heading text-base font-semibold text-foreground">Notable amendments</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            {item.amendments.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 rounded-md border border-border bg-muted/50 px-3.5 py-3 text-xs text-muted-foreground">
        Section numbers reflect widely reported references for study purposes — always cross-check
        against the official Bare Act before citing in exams or filings.
      </div>

      <div className="mt-8">
        <Link href="/tutor" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
          <Sparkles className="size-4" aria-hidden="true" />
          Ask the AI Tutor about this Act
        </Link>
      </div>
    </div>
  );
}
