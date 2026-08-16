import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Conversation } from "@/lib/db/models/conversation";
import { isAdminSession } from "@/lib/auth/admin-session";

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  await connectToDatabase();
  const conversations = await Conversation.find()
    .select("-messages.content")
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    conversations: conversations.map((c) => {
      const user = c.userId as unknown as { _id: unknown; name?: string; email?: string } | null;
      return {
        id: c._id.toString(),
        title: c.title,
        subject: c.subject,
        messageCount: c.messages?.length ?? 0,
        userName: user?.name ?? "Unknown",
        userEmail: user?.email ?? "Unknown",
        createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : null,
      };
    }),
  });
}
