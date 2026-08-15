import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SubjectsGrid } from "@/components/subjects/subjects-grid";
import { getCurrentUser } from "@/lib/auth/session";
import { getUserActivityStats } from "@/lib/chat/conversations";

export const metadata: Metadata = {
  title: "Subjects",
};

export default async function SubjectsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  const stats = await getUserActivityStats(user._id.toString());

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Subjects</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          16 subjects across constitutional, criminal, civil, and commercial law — ask the AI Tutor about
          any of them to start building activity here.
        </p>
      </div>
      <div className="mt-6">
        <SubjectsGrid activity={stats.subjectActivity} />
      </div>
    </div>
  );
}
