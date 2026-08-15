import { NextResponse } from "next/server";
import { getGeminiClient, GEMINI_MODEL } from "@/lib/gemini/client";
import { buildSystemPrompt, type StudentContext } from "@/lib/gemini/system-prompt";
import { answerSchema } from "@/lib/gemini/schema";
import { checkRateLimit } from "@/lib/gemini/rate-limit";
import type { ChatApiRequest, ChatApiResponse, ChatRole } from "@/lib/chat/types";
import { getCurrentUser } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Conversation } from "@/lib/db/models/conversation";
import { subjects } from "@/lib/legal/subjects";

const AI_UNAVAILABLE_MESSAGE = "StudyRex AI is temporarily unavailable. Please try again.";

/**
 * Persists a chat turn for the signed-in user. Best-effort: a persistence
 * failure (e.g. MongoDB unreachable) must never break the Gemini answer
 * that's already been generated, so failures are logged and swallowed.
 */
async function persistTurn(
  userId: string,
  conversationId: string | undefined,
  question: string,
  subjectHint: string | undefined,
  result: ChatApiResponse,
): Promise<string | undefined> {
  try {
    await connectToDatabase();

    const userMessage = { id: crypto.randomUUID(), role: "user" as const, content: question, createdAt: new Date() };
    const assistantMessage = {
      id: crypto.randomUUID(),
      role: "assistant" as const,
      content: result.answer,
      citations: result.citations,
      cases: result.cases,
      followUps: result.followUps,
      examTip: result.examTip,
      subject: result.subject,
      createdAt: new Date(),
    };

    if (conversationId) {
      const updated = await Conversation.findOneAndUpdate(
        { _id: conversationId, userId },
        { $push: { messages: { $each: [userMessage, assistantMessage] } } },
        { new: true },
      );
      if (updated) return updated._id.toString();
    }

    const created = await Conversation.create({
      userId,
      title: question.slice(0, 60),
      subject: subjectHint || result.subject,
      messages: [userMessage, assistantMessage],
    });
    return created._id.toString();
  } catch (error) {
    console.error("[/api/chat] persistTurn failed", error);
    return undefined;
  }
}

const MAX_QUESTION_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 10;

function isChatRole(value: unknown): value is ChatRole {
  return value === "user" || value === "assistant";
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "You're asking questions faster than we can answer. Please wait a moment and try again." },
      { status: 429 },
    );
  }

  let body: Partial<ChatApiRequest>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question) {
    return NextResponse.json({ error: "A question is required." }, { status: 400 });
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json(
      { error: `Please keep your question under ${MAX_QUESTION_LENGTH} characters.` },
      { status: 400 },
    );
  }

  const chatHistory = Array.isArray(body.chatHistory)
    ? body.chatHistory
        .filter(
          (m): m is { role: ChatRole; content: string } =>
            !!m && isChatRole(m.role) && typeof m.content === "string" && m.content.trim().length > 0,
        )
        .slice(-MAX_HISTORY_MESSAGES)
    : [];

  const subject = typeof body.subject === "string" ? body.subject : undefined;
  const conversationId = typeof body.conversationId === "string" ? body.conversationId : undefined;

  const user = await getCurrentUser().catch(() => null);
  const studentContext: StudentContext | undefined = user
    ? {
        firstName: user.name?.split(" ")[0],
        lawLevel: user.lawLevel ?? undefined,
        subjectNames: (user.subjects ?? [])
          .map((slug) => subjects.find((s) => s.slug === slug)?.name)
          .filter((name): name is string => !!name),
      }
    : undefined;

  let raw: Partial<ChatApiResponse>;
  try {
    const client = getGeminiClient();

    const contents = [
      ...chatHistory.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: question }] },
    ];

    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: buildSystemPrompt(subject, studentContext),
        responseMimeType: "application/json",
        responseSchema: answerSchema,
        maxOutputTokens: 3072,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Model returned an empty response.");
    }

    try {
      raw = JSON.parse(text) as Partial<ChatApiResponse>;
    } catch (parseError) {
      console.error("[/api/chat] malformed JSON from model", parseError, text.slice(0, 500));
      throw new Error("Model returned a malformed response.");
    }

    if (!raw.answer || typeof raw.answer !== "string") {
      throw new Error("Model returned an empty answer.");
    }
  } catch (error) {
    console.error("[/api/chat]", error);
    return NextResponse.json({ error: AI_UNAVAILABLE_MESSAGE }, { status: 502 });
  }

  const result: ChatApiResponse = {
    answer: raw.answer as string,
    subject: typeof raw.subject === "string" && raw.subject ? raw.subject : subject || "constitutional-law",
    citations: Array.isArray(raw.citations) ? raw.citations : [],
    cases: Array.isArray(raw.cases) ? raw.cases : [],
    followUps: Array.isArray(raw.followUps) ? raw.followUps.slice(0, 3) : [],
    ...(typeof raw.examTip === "string" && raw.examTip ? { examTip: raw.examTip } : {}),
  };

  const persistedConversationId = user
    ? await persistTurn(user._id.toString(), conversationId, question, subject, result)
    : undefined;

  return NextResponse.json({
    ...result,
    ...(persistedConversationId ? { conversationId: persistedConversationId } : {}),
  });
}
