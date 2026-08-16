import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/user";
import { isAdminSession } from "@/lib/auth/admin-session";

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  await connectToDatabase();
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    users: users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      lawLevel: u.lawLevel ?? null,
      subjects: u.subjects ?? [],
      onboarded: !!u.onboarded,
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
    })),
  });
}
