import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/user";
import { LAW_LEVELS } from "@/lib/auth/constants";
import { getSession } from "@/lib/auth/session";
import { toPublicUser } from "@/lib/auth/public-user";
import { subjects } from "@/lib/legal/subjects";

const VALID_SLUGS = new Set(subjects.map((s) => s.slug));

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: Partial<{ lawLevel: string; subjects: string[] }>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const lawLevel = typeof body.lawLevel === "string" ? body.lawLevel : "";
  if (!LAW_LEVELS.includes(lawLevel as (typeof LAW_LEVELS)[number])) {
    return NextResponse.json({ error: "Choose what you're preparing for." }, { status: 400 });
  }

  const requestedSubjects = Array.isArray(body.subjects) ? body.subjects : [];
  const selectedSubjects = requestedSubjects.filter(
    (slug): slug is string => typeof slug === "string" && VALID_SLUGS.has(slug as never),
  );

  try {
    await connectToDatabase();
    const user = await User.findByIdAndUpdate(
      session.userId,
      { lawLevel, subjects: selectedSubjects, onboarded: true },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    console.error("[/api/onboarding]", error);
    return NextResponse.json({ error: "We couldn't save your changes. Please try again." }, { status: 502 });
  }
}
