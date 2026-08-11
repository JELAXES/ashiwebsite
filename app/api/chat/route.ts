import { NextResponse } from "next/server";
import { getGeminiClient, GEMINI_MODEL } from "@/lib/gemini/client";
import { buildSystemPrompt } from "@/lib/gemini/system-prompt";
import { answerSchema } from "@/lib/gemini/schema";
import { checkRateLimit } from "@/lib/gemini/rate-limit";
import type { ChatApiRequest, ChatApiResponse, ChatRole } from "@/lib/chat/types";

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
        systemInstruction: buildSystemPrompt(subject),
        responseMimeType: "application/json",
        responseSchema: answerSchema,
        maxOutputTokens: 3072,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Model returned an empty response.");
    }

    const raw = JSON.parse(text) as Partial<ChatApiResponse>;

    if (!raw.answer || typeof raw.answer !== "string") {
      throw new Error("Model returned an empty answer.");
    }

    const result: ChatApiResponse = {
      answer: raw.answer,
      subject: typeof raw.subject === "string" && raw.subject ? raw.subject : subject || "constitutional-law",
      citations: Array.isArray(raw.citations) ? raw.citations : [],
      cases: Array.isArray(raw.cases) ? raw.cases : [],
      followUps: Array.isArray(raw.followUps) ? raw.followUps.slice(0, 3) : [],
      ...(typeof raw.examTip === "string" && raw.examTip ? { examTip: raw.examTip } : {}),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("[/api/chat]", error);
    return NextResponse.json(
      { error: "Something went wrong while generating your answer. Please try again." },
      { status: 502 },
    );
  }
}
