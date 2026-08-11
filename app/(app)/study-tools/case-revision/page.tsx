import type { Metadata } from "next";
import { CaseRevisionView } from "@/components/study-tools/case-revision-view";

export const metadata: Metadata = {
  title: "Case Law Revision",
};

export default function CaseRevisionPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <CaseRevisionView />
    </div>
  );
}
