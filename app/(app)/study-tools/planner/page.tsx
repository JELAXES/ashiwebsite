import type { Metadata } from "next";
import { PlannerView } from "@/components/study-tools/planner-view";

export const metadata: Metadata = {
  title: "Study Planner",
};

export default function PlannerPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <PlannerView />
    </div>
  );
}
