import Link from "next/link";
import { renderSubjectIcon } from "@/lib/legal/icon-map";
import type { Subject } from "@/lib/legal/types";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface SubjectCardProps {
  subject: Subject;
  className?: string;
}

export function SubjectCard({ subject, className }: SubjectCardProps) {
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
        <span className="font-heading text-lg font-semibold text-primary">
          {subject.progress}%
        </span>
      </div>
      <h3 className="text-sm font-semibold text-foreground">{subject.name}</h3>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{subject.description}</p>
      <Progress value={subject.progress} className="mt-4 h-1.5" />
      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          {subject.topicsCompleted}/{subject.topicsTotal} topics
        </span>
        <span>{subject.lastStudied ? "Studied recently" : "Not started"}</span>
      </div>
    </Link>
  );
}
