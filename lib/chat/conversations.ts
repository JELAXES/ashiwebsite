import "server-only";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Conversation } from "@/lib/db/models/conversation";
import { subjects } from "@/lib/legal/subjects";
import type { ChatMessageData } from "@/lib/chat/types";

export interface ConversationSummary {
  id: string;
  title: string;
  subject: string;
  subjectLabel: string;
  preview: string;
  updatedAt: string;
  messageCount: number;
}

function subjectLabel(slug: string): string {
  return subjects.find((s) => s.slug === slug)?.name ?? slug;
}

type LeanConversation = Awaited<ReturnType<typeof fetchUserConversations>>[number];

async function fetchUserConversations(userId: string) {
  await connectToDatabase();
  return Conversation.find({ userId }).sort({ updatedAt: -1 }).lean();
}

function summariesFromConversations(conversations: LeanConversation[]): ConversationSummary[] {
  return conversations.map((c) => {
    const lastMessage = c.messages[c.messages.length - 1];
    return {
      id: c._id.toString(),
      title: c.title,
      subject: c.subject ?? "general",
      subjectLabel: subjectLabel(c.subject ?? "general"),
      preview: lastMessage?.content.slice(0, 140) ?? "",
      updatedAt: (c.updatedAt ?? new Date()).toISOString(),
      messageCount: c.messages.length,
    };
  });
}

export async function listConversationSummaries(userId: string): Promise<ConversationSummary[]> {
  const conversations = await fetchUserConversations(userId);
  return summariesFromConversations(conversations);
}

export interface SubjectActivity {
  lastStudied: string;
  questionsAsked: number;
}

export interface UserActivityStats {
  questionsAsked: number;
  studyStreakDays: number;
  conversationCount: number;
  /** Subject slug -> real activity, derived from the user's own conversations. */
  subjectActivity: Record<string, SubjectActivity>;
}

/** Calendar-day (UTC) key for streak bucketing — good enough for a gamification stat, not a legal timestamp. */
function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function computeStreakDays(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const days = new Set(dates.map(dayKey));
  let streak = 0;
  const cursor = new Date();
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

function statsFromConversations(conversations: LeanConversation[]): UserActivityStats {
  let questionsAsked = 0;
  const userMessageDates: Date[] = [];
  const subjectActivity: Record<string, SubjectActivity> = {};

  for (const c of conversations) {
    const slug = c.subject ?? "general";
    for (const m of c.messages) {
      if (m.role !== "user") continue;
      questionsAsked += 1;
      const createdAt = m.createdAt ? new Date(m.createdAt) : null;
      if (!createdAt) continue;
      userMessageDates.push(createdAt);

      const existing = subjectActivity[slug];
      if (!existing || createdAt > new Date(existing.lastStudied)) {
        subjectActivity[slug] = {
          lastStudied: createdAt.toISOString(),
          questionsAsked: (existing?.questionsAsked ?? 0) + 1,
        };
      } else {
        existing.questionsAsked += 1;
      }
    }
  }

  return {
    questionsAsked,
    studyStreakDays: computeStreakDays(userMessageDates),
    conversationCount: conversations.length,
    subjectActivity,
  };
}

/** Real, per-user usage stats computed from their actual conversation history — never mock data. */
export async function getUserActivityStats(userId: string): Promise<UserActivityStats> {
  const conversations = await fetchUserConversations(userId);
  return statsFromConversations(conversations);
}

/** One MongoDB round-trip for both the dashboard's activity stats and its recent-conversations list. */
export async function getDashboardData(
  userId: string,
): Promise<{ stats: UserActivityStats; summaries: ConversationSummary[] }> {
  const conversations = await fetchUserConversations(userId);
  return {
    stats: statsFromConversations(conversations),
    summaries: summariesFromConversations(conversations),
  };
}

export interface ConversationDetail {
  id: string;
  title: string;
  subject: string;
  messages: ChatMessageData[];
}

export async function getConversationDetail(userId: string, id: string): Promise<ConversationDetail | null> {
  await connectToDatabase();
  const conversation = await Conversation.findOne({ _id: id, userId }).lean();
  if (!conversation) return null;

  return {
    id: conversation._id.toString(),
    title: conversation.title,
    subject: conversation.subject ?? "general",
    messages: conversation.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      citations: m.citations?.map((c) => ({
        label: c.label,
        source: c.source,
        historical: c.historical ?? undefined,
      })),
      cases: m.cases?.map((c) => ({ name: c.name, principle: c.principle })),
      followUps: m.followUps ?? undefined,
      examTip: m.examTip ?? undefined,
      subject: m.subject ?? undefined,
      createdAt: (m.createdAt ?? new Date()).toISOString(),
    })),
  };
}
