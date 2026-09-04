import type { Metadata } from "next";
import { NotebookView } from "@/components/notebook/notebook-view";
import { getSession } from "@/lib/auth/session";
import { listConversationSummaries } from "@/lib/chat/conversations";

export const metadata: Metadata = {
  title: "Notebook",
};

export default async function NotebookPage() {
  const session = await getSession();
  let initialConversations: Awaited<ReturnType<typeof listConversationSummaries>> = [];
  if (session) {
    try {
      initialConversations = await listConversationSummaries(session.userId);
    } catch (error) {
      console.error("[NotebookPage]", error);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Notebook
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Every conversation you&apos;ve had with the AI Tutor. Open one to pick up where you left
          off, or delete the ones you&apos;re done with.
        </p>
      </div>
      <NotebookView initialConversations={initialConversations} />
    </div>
  );
}
