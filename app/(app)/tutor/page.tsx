import type { Metadata } from "next";
import { Suspense } from "react";
import { TutorView } from "@/components/tutor/tutor-view";
import { getCurrentUser } from "@/lib/auth/session";
import { subjects as allSubjects, getSubjectsForTrack } from "@/lib/legal/subjects";

export const metadata: Metadata = {
  title: "AI Tutor",
};

export default async function TutorPage() {
  const user = await getCurrentUser();
  const trackSubjects = getSubjectsForTrack(user?.lawLevel);
  const subjectOptions = (trackSubjects.length > 0 ? trackSubjects : allSubjects).map((s) => ({
    slug: s.slug,
    name: s.name,
    description: s.description,
    icon: s.icon,
  }));

  return (
    <Suspense fallback={null}>
      <TutorView subjectOptions={subjectOptions} />
    </Suspense>
  );
}
