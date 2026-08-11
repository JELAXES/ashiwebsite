import type { Metadata } from "next";
import { Suspense } from "react";
import { TutorView } from "@/components/tutor/tutor-view";

export const metadata: Metadata = {
  title: "AI Tutor",
};

export default function TutorPage() {
  return (
    <Suspense fallback={null}>
      <TutorView />
    </Suspense>
  );
}
