import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Conversation } from "@/lib/db/models/conversation";
import { getSession } from "@/lib/auth/session";
import { getConversationDetail } from "@/lib/chat/conversations";

export async function GET(_request: Request, ctx: RouteContext<"/api/conversations/[id]">) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await ctx.params;

  try {
    const conversation = await getConversationDetail(session.userId, id);
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }
    return NextResponse.json({ conversation });
  } catch (error) {
    console.error("[/api/conversations/[id]] GET", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 502 });
  }
}

export async function PATCH(request: Request, ctx: RouteContext<"/api/conversations/[id]">) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await ctx.params;

  let body: Partial<{ title: string }>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ error: "Title can't be empty." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, userId: session.userId },
      { title },
      { new: true },
    );
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }
    return NextResponse.json({ id: conversation._id.toString(), title: conversation.title });
  } catch (error) {
    console.error("[/api/conversations/[id]] PATCH", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 502 });
  }
}

export async function DELETE(_request: Request, ctx: RouteContext<"/api/conversations/[id]">) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await ctx.params;

  try {
    await connectToDatabase();
    const result = await Conversation.deleteOne({ _id: id, userId: session.userId });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[/api/conversations/[id]] DELETE", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 502 });
  }
}
