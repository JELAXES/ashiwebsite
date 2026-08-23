import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles, Flame, HelpCircle, MessageSquare } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { SubjectCard } from "@/components/legal/subject-card";
import { CaseCard } from "@/components/legal/case-card";
import { LegalDisclaimer } from "@/components/legal/legal-disclaimer";
import { RecentConversations } from "@/components/dashboard/recent-conversations";
import { subjects, getSubjectsForTrack } from "@/lib/legal/subjects";
import { landmarkCases } from "@/lib/legal/cases";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/chat/conversations";
import { LAW_LEVEL_CATEGORY, type LawLevel } from "@/lib/auth/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function prepLabel(lawLevel: string | null | undefined) {
  if (!lawLevel) return null;
  if (lawLevel === "CLAT") return "CLAT Preparation";
  if (lawLevel === "Judiciary") return "Judiciary Preparation";
  const category = LAW_LEVEL_CATEGORY[lawLevel as LawLevel];
  return category ? `${lawLevel} — ${category}` : lawLevel;
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  const firstName = user.name.split(" ")[0];
  const prep = prepLabel(user.lawLevel);
  const { stats, summaries } = await getDashboardData(user._id.toString());

  // "Continue studying" reflects the subjects this user has actually discussed with
  // the AI Tutor, most recent first — never a shared fake progress number. It's only
  // shown once there's real activity or an onboarding pick to reflect, so it never
  // duplicates the "popular subjects" fallback with a self-contradictory "not studied yet".
  const studiedSlugs = Object.entries(stats.subjectActivity)
    .sort(([, a], [, b]) => new Date(b.lastStudied).getTime() - new Date(a.lastStudied).getTime())
    .map(([slug]) => slug);
  // Personalize by the student's actual onboarding track — never the full global catalog.
  const trackSubjects = getSubjectsForTrack(user.lawLevel);
  const catalogForUser = trackSubjects.length > 0 ? trackSubjects : subjects;

  const bySlug = (slug: string) => catalogForUser.find((s) => s.slug === slug) ?? subjects.find((s) => s.slug === slug);
  const onboardingSubjects = catalogForUser.filter((s) => (user.subjects ?? []).includes(s.slug));

  const continueStudying = (
    studiedSlugs.length > 0
      ? studiedSlugs.map(bySlug).filter((s): s is (typeof subjects)[number] => !!s)
      : onboardingSubjects
  ).slice(0, 3);

  const recommendedTopics = catalogForUser.filter((s) => !studiedSlugs.includes(s.slug)).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          {stats.studyStreakDays > 0 && (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Flame className="size-4 text-primary" aria-hidden="true" />
              {stats.studyStreakDays}-day study streak
            </p>
          )}
          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl">
            {greeting()}, {firstName}.
          </h1>
          {prep && (
            <p className="mt-1 text-sm font-medium text-primary">{prep}</p>
          )}
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Pick up where you left off, or ask the AI tutor anything about Indian law.
          </p>
        </div>
        <Link href="/tutor" className={cn(buttonVariants({ size: "lg" }), "shrink-0 gap-2")}>
          <Sparkles className="size-4" aria-hidden="true" />
          Ask AI
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatCard label="Study streak" value={stats.studyStreakDays} suffix="days" icon={Flame} emphasize />
        <StatCard label="Questions asked" value={stats.questionsAsked} icon={HelpCircle} />
        <StatCard label="Conversations" value={stats.conversationCount} icon={MessageSquare} />
      </div>

      {continueStudying.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {studiedSlugs.length > 0 ? "Continue studying" : "Your focus subjects"}
            </h2>
            <Link href="/subjects" className="text-sm font-medium text-primary hover:underline">
              All subjects
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {continueStudying.map((s) => (
              <SubjectCard key={s.slug} subject={s} activity={stats.subjectActivity[s.slug]} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">Recent conversations</h2>
          <Link href="/history" className="text-sm font-medium text-primary hover:underline">
            View history
          </Link>
        </div>
        <RecentConversations conversations={summaries} />
      </section>

      {recommendedTopics.length > 0 && (
        <section className="mt-10">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            {studiedSlugs.length > 0 ? "Recommended next topics" : "Popular subjects to start with"}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedTopics.map((s) => (
              <SubjectCard key={s.slug} subject={s} activity={stats.subjectActivity[s.slug]} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">Recent landmark cases</h2>
          <Link href="/cases" className="text-sm font-medium text-primary hover:underline">
            Case library
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {landmarkCases.slice(0, 3).map((c) => (
            <CaseCard key={c.id} item={c} />
          ))}
        </div>
      </section>

      <div className="mt-10 flex flex-col items-start gap-4 rounded-xl border border-primary/20 bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">Have a question?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask the AI tutor and get a structured, cited explanation in seconds.
          </p>
        </div>
        <Link href="/tutor" className={cn(buttonVariants({ size: "lg" }), "shrink-0 gap-2")}>
          <Sparkles className="size-4" aria-hidden="true" />
          Ask AI
        </Link>
      </div>

      <LegalDisclaimer variant="block" className="mt-8" />
    </div>
  );
}
