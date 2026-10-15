import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/user";
import { Conversation } from "@/lib/db/models/conversation";
import { isAdminSession } from "@/lib/auth/admin-session";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  // A malformed id can't match a user — report "not found" rather than crashing on the cast.
  if (!isValidObjectId(id)) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  try {
    await connectToDatabase();
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    await Conversation.deleteMany({ userId: id });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[/api/admin/users/[id]] DELETE", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }
}
