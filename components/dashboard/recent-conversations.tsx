import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { listConversationSummaries } from "@/lib/chat/conversations";

function relativeTime(iso: string) {
  const hours = Math.round((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export async function RecentConversations() {
  const session = await getSession();
  let conversations: Awaited<ReturnType<typeof listConversationSummaries>> = [];
  if (session) {
    try {
      conversations = await listConversationSummaries(session.userId);
    } catch (error) {
      console.error("[RecentConversations]", error);
    }
  }
  const recent = conversations.slice(0, 5);

  if (recent.length === 0) {
    return (
      <div className="mt-4 rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        No conversations yet.{" "}
        <Link href="/tutor" className="font-medium text-primary hover:underline">
          Ask the AI Tutor
        </Link>{" "}
        to get started.
      </div>
    );
  }

  return (
    <div className="mt-4 divide-y divide-border rounded-lg border border-border bg-card">
      {recent.map((c) => (
        <Link
          key={c.id}
          href={`/tutor?conversation=${c.id}`}
          className="flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{c.title}</p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{c.preview}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <span className="text-xs text-muted-foreground">{relativeTime(c.updatedAt)}</span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
              {c.subjectLabel}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
