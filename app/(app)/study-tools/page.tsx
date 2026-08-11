import type { Metadata } from "next";
import Link from "next/link";
import {
  ListChecks,
  Layers,
  ScrollText,
  Search,
  GraduationCap,
  Gavel,
  CalendarClock,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Study Tools",
};

const tools: { icon: LucideIcon; title: string; description: string; href: string }[] = [
  {
    icon: ListChecks,
    title: "AI Quiz",
    description: "Answer questions from the vetted question bank with instant explanations.",
    href: "/study-tools/quiz",
  },
  {
    icon: Layers,
    title: "Flashcards",
    description: "Flip through doctrines, provisions, and definitions for active recall.",
    href: "/study-tools/flashcards",
  },
  {
    icon: ScrollText,
    title: "Case Law Revision",
    description: "See a case name, recall the principle before you flip.",
    href: "/study-tools/case-revision",
  },
  {
    icon: Search,
    title: "Section Finder",
    description: "Search directly by section, article, or keyword across every Act.",
    href: "/study-tools/section-finder",
  },
  {
    icon: GraduationCap,
    title: "CLAT Practice",
    description: "Objective-style practice from the same vetted question bank.",
    href: "/study-tools/clat-practice",
  },
  {
    icon: Gavel,
    title: "Judiciary Practice",
    description: "Practice questions with exam tips geared toward judiciary services exams.",
    href: "/study-tools/judiciary-practice",
  },
  {
    icon: CalendarClock,
    title: "Study Planner",
    description: "A suggested plan from your revision queue, weak areas, and progress.",
    href: "/study-tools/planner",
  },
];

export default function StudyToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Study Tools
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          A complete revision toolkit for CLAT and judiciary exam preparation.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.title}
            href={tool.href}
            className="group flex flex-col items-start gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex size-9 items-center justify-center rounded-md bg-secondary text-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
              <tool.icon className="size-4.5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{tool.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
