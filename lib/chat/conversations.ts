import "server-only";
import { Types, isValidObjectId } from "mongoose";
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

/** Per-conversation row computed in MongoDB so message bodies never leave the database. */
interface ConversationRow {
  _id: { toString(): string };
  title: string;
  subject?: string | null;
  updatedAt?: Date | null;
  messageCount: number;
  preview: string;
  /** createdAt of each *user* message in this conversation. */
  userMessageDates: (Date | null)[];
}

/**
 * Dashboard, profile, subject pages and notifications only need counts, the
 * last-message preview and the user-message timestamps — so project exactly that
 * instead of pulling every message of every conversation into Node.
 */
async function fetchUserConversations(userId: string): Promise<ConversationRow[]> {
  await connectToDatabase();
  return Conversation.aggregate<ConversationRow>([
    { $match: { userId: new Types.ObjectId(userId) } },
    { $sort: { updatedAt: -1 } },
    {
      $project: {
        title: 1,
        subject: 1,
        updatedAt: 1,
        messageCount: { $size: { $ifNull: ["$messages", []] } },
        preview: {
          $substrCP: [{ $ifNull: [{ $arrayElemAt: ["$messages.content", -1] }, ""] }, 0, 140],
        },
        userMessageDates: {
          $map: {
            input: {
              $filter: {
                input: { $ifNull: ["$messages", []] },
                as: "m",
                cond: { $eq: ["$$m.role", "user"] },
              },
            },
            as: "m",
            in: "$$m.createdAt",
          },
        },
      },
    },
  ]);
}

function summariesFromConversations(conversations: ConversationRow[]): ConversationSummary[] {
  return conversations.map((c) => ({
    id: c._id.toString(),
    title: c.title,
    subject: c.subject ?? "general",
    subjectLabel: subjectLabel(c.subject ?? "general"),
    preview: c.preview ?? "",
    updatedAt: (c.updatedAt ?? new Date()).toISOString(),
    messageCount: c.messageCount,
  }));
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
  /** Consecutive study days. Stays alive through today until the day ends. */
  studyStreakDays: number;
  /** Whether the student has asked at least one question today (IST). */
  studiedToday: boolean;
  conversationCount: number;
  /** Subject slug -> real activity, derived from the user's own conversations. */
  subjectActivity: Record<string, SubjectActivity>;
}

const DAY_MS = 24 * 60 * 60 * 1000;
/** StudyRex students are in India: bucket study days by IST (UTC+05:30, no DST), not UTC. */
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function dayKey(date: Date): string {
  return new Date(date.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/**
 * A streak is the run of consecutive study days ending today — or ending
 * yesterday if the student simply hasn't studied *yet* today, so it doesn't
 * reset to 0 every morning before they've had the chance to keep it alive.
 */
function computeStreak(dates: Date[]): { streak: number; studiedToday: boolean } {
  if (dates.length === 0) return { streak: 0, studiedToday: false };
  const days = new Set(dates.map(dayKey));
  const now = new Date();
  const studiedToday = days.has(dayKey(now));
  let cursor = studiedToday ? now : new Date(now.getTime() - DAY_MS);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - DAY_MS);
  }
  return { streak, studiedToday };
}

function statsFromConversations(conversations: ConversationRow[]): UserActivityStats {
  let questionsAsked = 0;
  const userMessageDates: Date[] = [];
  const subjectActivity: Record<string, SubjectActivity> = {};

  for (const c of conversations) {
    const slug = c.subject ?? "general";
    for (const raw of c.userMessageDates) {
      questionsAsked += 1;
      if (!raw) continue;
      const createdAt = new Date(raw);
      userMessageDates.push(createdAt);

      const existing = subjectActivity[slug];
      if (!existing) {
        subjectActivity[slug] = { lastStudied: createdAt.toISOString(), questionsAsked: 1 };
      } else {
        existing.questionsAsked += 1;
        if (createdAt > new Date(existing.lastStudied)) existing.lastStudied = createdAt.toISOString();
      }
    }
  }

  const { streak, studiedToday } = computeStreak(userMessageDates);
  return {
    questionsAsked,
    studyStreakDays: streak,
    studiedToday,
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
  // A malformed id can't match anything — treat it as "not found", not a cast error.
  if (!isValidObjectId(id)) return null;
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
