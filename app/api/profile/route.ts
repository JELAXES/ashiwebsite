import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/user";
import { LAW_LEVELS } from "@/lib/auth/constants";
import { getSession } from "@/lib/auth/session";
import { toPublicUser } from "@/lib/auth/public-user";

function isValidEmail(value: string): boolean {
  return /^\S+@\S+\.\S+$/.test(value);
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: Partial<{ name: string; email: string; lawLevel: string }>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const update: Record<string, unknown> = {};

  if (body.name !== undefined) {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) return NextResponse.json({ error: "Name can't be empty." }, { status: 400 });
    update.name = name;
  }

  if (body.email !== undefined) {
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    update.email = email;
  }

  if (body.lawLevel !== undefined) {
    if (!LAW_LEVELS.includes(body.lawLevel as (typeof LAW_LEVELS)[number])) {
      return NextResponse.json({ error: "Choose a valid option." }, { status: 400 });
    }
    update.lawLevel = body.lawLevel;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    await connectToDatabase();

    if (typeof update.email === "string") {
      const existing = await User.findOne({ email: update.email, _id: { $ne: session.userId } }).lean();
      if (existing) {
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
      }
    }

    const user = await User.findByIdAndUpdate(session.userId, update, { new: true });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    console.error("[/api/profile]", error);
    return NextResponse.json({ error: "We couldn't save your changes. Please try again." }, { status: 502 });
  }
}
