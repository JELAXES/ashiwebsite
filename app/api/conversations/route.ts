import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { listConversationSummaries } from "@/lib/chat/conversations";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const conversations = await listConversationSummaries(session.userId);
    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("[/api/conversations]", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 502 });
  }
}
