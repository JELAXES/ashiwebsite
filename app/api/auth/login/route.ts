import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/user";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionCookie } from "@/lib/auth/session";
import { toPublicUser } from "@/lib/auth/public-user";

export async function POST(request: Request) {
  let body: Partial<{ email: string; password: string }>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    await createSessionCookie({ userId: user._id.toString(), email: user.email });

    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    console.error("[/api/auth/login]", error);
    return NextResponse.json(
      { error: "Something went wrong signing you in. Please try again." },
      { status: 502 },
    );
  }
}
