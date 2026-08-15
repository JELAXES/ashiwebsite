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

export async function listConversationSummaries(userId: string): Promise<ConversationSummary[]> {
  await connectToDatabase();
  const conversations = await Conversation.find({ userId }).sort({ updatedAt: -1 }).lean();

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
