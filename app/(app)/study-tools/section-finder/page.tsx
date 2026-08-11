import type { Metadata } from "next";
import { SectionFinderView } from "@/components/study-tools/section-finder-view";

export const metadata: Metadata = {
  title: "Section Finder",
};

export default function SectionFinderPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionFinderView />
    </div>
  );
}
