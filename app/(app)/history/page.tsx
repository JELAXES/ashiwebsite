import type { Metadata } from "next";
import { HistoryView } from "@/components/history/history-view";

export const metadata: Metadata = {
  title: "History",
};

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          History
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Your past conversations with the AI Tutor.
        </p>
      </div>
      <HistoryView />
    </div>
  );
}
