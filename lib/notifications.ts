import "server-only";
import { getDashboardData } from "@/lib/chat/conversations";
import { subjects } from "@/lib/legal/subjects";
import { landmarkCases } from "@/lib/legal/cases";
import type { UserDocument } from "@/lib/db/models/user";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  /** In-app destination opened when the notification is clicked. */
  href: string;
  /** Relative time label, e.g. "2h ago". Empty when not time-bound. */
  time: string;
  /** Drives the unread dot — a notification the user can act on now. */
  actionable: boolean;
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Date.now() - then;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

/**
 * Notifications are derived entirely from the signed-in user's real activity —
 * their conversations, streak, and onboarding picks — never a hardcoded list.
 * A brand-new user with no data gets a single welcome nudge.
 */
export async function getNotificationsForUser(
  user: Pick<UserDocument, "subjects" | "lawLevel"> & { _id: { toString(): string } },
): Promise<AppNotification[]> {
  const { stats, summaries } = await getDashboardData(user._id.toString());
  const items: AppNotification[] = [];

  if (summaries.length > 0) {
    const latest = summaries[0];
    items.push({
      id: `resume-${latest.id}`,
      title: "Pick up where you left off",
      body: `${latest.title} · ${latest.subjectLabel}`,
      href: `/tutor?conversation=${latest.id}`,
      time: relativeTime(latest.updatedAt),
      actionable: true,
    });
  }

  if (stats.studyStreakDays === 0) {
    items.push({
      id: "streak-idle",
      title: "No study activity today",
      body: "Ask the AI Tutor one question to keep your streak alive.",
      href: "/tutor",
      time: "",
      actionable: true,
    });
  } else {
    items.push({
      id: "streak-active",
      title: `${stats.studyStreakDays}-day study streak`,
      body: "Nice work. Keep the momentum going.",
      href: "/dashboard",
      time: "",
      actionable: false,
    });
  }

  // A subject the student flagged at onboarding but hasn't asked about yet.
  const untouched = (user.subjects ?? []).find((slug) => !stats.subjectActivity[slug]);
  if (untouched) {
    const subject = subjects.find((s) => s.slug === untouched);
    if (subject) {
      items.push({
        id: `focus-${subject.slug}`,
        title: "A focus subject is waiting",
        body: `You picked ${subject.name} but haven't started it yet.`,
        href: `/subjects/${subject.slug}`,
        time: "",
        actionable: true,
      });
    }
  }

  if (items.length === 0) {
    items.push({
      id: "welcome",
      title: "Welcome to StudyRex",
      body: "Start with a question for the AI Tutor — your notebook fills in automatically.",
      href: "/tutor",
      time: "",
      actionable: true,
    });
  } else {
    // Round out the list with a real landmark case to revisit.
    const featured = landmarkCases[0];
    if (featured) {
      items.push({
        id: `case-${featured.id}`,
        title: "Landmark case to revisit",
        body: `${featured.name} — ${featured.principle}`,
        href: `/cases/${featured.id}`,
        time: "",
        actionable: false,
      });
    }
  }

  return items;
}
