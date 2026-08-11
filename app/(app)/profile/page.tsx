import type { Metadata } from "next";
import Link from "next/link";
import { Settings, Flame, HelpCircle, BookCheck, Target } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatCard } from "@/components/dashboard/stat-card";
import { dashboardStats, studentName } from "@/lib/legal/mock-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  const initials = studentName.slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarFallback className="bg-primary/15 text-lg font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            {studentName}
          </h1>
          <p className="text-sm text-muted-foreground">Studying for CLAT &amp; judiciary exams</p>
        </div>
        <Link href="/settings" className={cn(buttonVariants({ variant: "outline" }), "ml-auto gap-2")}>
          <Settings className="size-4" />
          Edit
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Study streak" value={dashboardStats.studyStreak} suffix="days" icon={Flame} emphasize />
        <StatCard label="Questions asked" value={dashboardStats.questionsAsked} icon={HelpCircle} />
        <StatCard label="Topics completed" value={dashboardStats.topicsCompleted} icon={BookCheck} />
        <StatCard label="Quiz accuracy" value={dashboardStats.quizAccuracy} suffix="%" icon={Target} />
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        Profile details, exam target, and notification preferences can be changed anytime from{" "}
        <Link href="/settings" className="font-medium text-primary hover:underline">
          Settings
        </Link>
        .
      </div>
    </div>
  );
}
