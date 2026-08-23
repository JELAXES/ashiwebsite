import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/user";
import { LAW_LEVELS } from "@/lib/auth/constants";
import { getSession } from "@/lib/auth/session";
import { toPublicUser } from "@/lib/auth/public-user";
import { getSubjectsForTrack } from "@/lib/legal/subjects";

function isValidEmail(value: string): boolean {
  return /^\S+@\S+\.\S+$/.test(value);
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: Partial<{ name: string; email: string; lawLevel: string; subjects: string[] }>;
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

  let lawLevelChanged = false;
  if (body.lawLevel !== undefined) {
    if (!LAW_LEVELS.includes(body.lawLevel as (typeof LAW_LEVELS)[number])) {
      return NextResponse.json({ error: "Choose a valid option." }, { status: 400 });
    }
    update.lawLevel = body.lawLevel;
    lawLevelChanged = true;
  }

  if (body.subjects !== undefined && !Array.isArray(body.subjects)) {
    return NextResponse.json({ error: "Invalid subjects." }, { status: 400 });
  }

  if (Object.keys(update).length === 0 && body.subjects === undefined) {
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

    if (body.subjects !== undefined) {
      // Subjects are always validated against the track being saved in this same request
      // (or, if lawLevel isn't part of this request, the user's current track).
      const trackForValidation =
        typeof update.lawLevel === "string"
          ? update.lawLevel
          : (await User.findById(session.userId).select("lawLevel").lean())?.lawLevel;
      const validSlugs = new Set(getSubjectsForTrack(trackForValidation ?? null).map((s) => s.slug));
      update.subjects = (body.subjects as unknown[]).filter(
        (slug): slug is string => typeof slug === "string" && validSlugs.has(slug),
      );
    } else if (lawLevelChanged) {
      // Previously selected subjects belonged to the old track's curriculum — clear them.
      update.subjects = [];
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
