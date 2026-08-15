import Link from "next/link";
import { renderSubjectIcon } from "@/lib/legal/icon-map";
import type { Subject } from "@/lib/legal/types";
import { cn } from "@/lib/utils";

function relativeDay(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Studied today";
  if (days === 1) return "Studied yesterday";
  return `Studied ${days}d ago`;
}

interface SubjectCardProps {
  subject: Subject;
  className?: string;
  /** Real per-user activity for this subject, derived from their own AI Tutor conversations. Omit if unknown. */
  activity?: { questionsAsked: number; lastStudied: string | null } | null;
}

export function SubjectCard({ subject, className, activity }: SubjectCardProps) {
  return (
    <Link
      href={`/subjects/${subject.slug}`}
      className={cn(
        "group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex size-10 items-center justify-center rounded-md bg-secondary text-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
          {renderSubjectIcon(subject.icon, "size-5")}
        </div>
      </div>
      <h3 className="text-sm font-semibold text-foreground">{subject.name}</h3>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{subject.description}</p>
      <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{activity ? `${activity.questionsAsked} questions asked` : "Not studied yet"}</span>
        <span>{activity?.lastStudied ? relativeDay(activity.lastStudied) : "Not started"}</span>
      </div>
    </Link>
  );
}
