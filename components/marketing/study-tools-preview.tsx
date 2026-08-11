import Link from "next/link";
import { ArrowRight, ListChecks, Layers, ScrollText, Search, GraduationCap, Gavel, CalendarClock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tools = [
  { icon: ListChecks, title: "AI Quiz", href: "/study-tools/quiz" },
  { icon: Layers, title: "Flashcards", href: "/study-tools/flashcards" },
  { icon: ScrollText, title: "Case Law Revision", href: "/study-tools/case-revision" },
  { icon: Search, title: "Section Finder", href: "/study-tools/section-finder" },
  { icon: GraduationCap, title: "CLAT Practice", href: "/study-tools/clat-practice" },
  { icon: Gavel, title: "Judiciary Practice", href: "/study-tools/judiciary-practice" },
  { icon: CalendarClock, title: "Study Planner", href: "/study-tools/planner" },
];

export function StudyToolsPreview() {
  return (
    <section className="border-b border-border bg-card/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              A complete revision toolkit.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Turn what you learn into exam-ready recall with tools designed for CLAT and
              judiciary preparation.
            </p>
          </div>
          <Link href="/study-tools" className={cn(buttonVariants({ variant: "outline" }), "shrink-0 gap-1.5")}>
            Explore Study Tools
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="group flex flex-col items-start gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex size-9 items-center justify-center rounded-md bg-secondary text-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                <tool.icon className="size-4.5" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-foreground">{tool.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
