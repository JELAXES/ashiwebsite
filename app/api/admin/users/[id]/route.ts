import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/user";
import { Conversation } from "@/lib/db/models/conversation";
import { isAdminSession } from "@/lib/auth/admin-session";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;

  await connectToDatabase();
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  await Conversation.deleteMany({ userId: id });

  return NextResponse.json({ ok: true });
}
