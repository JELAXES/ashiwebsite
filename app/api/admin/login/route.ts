import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getOrCreateAdminSettings } from "@/lib/auth/admin-settings";
import { verifyPassword } from "@/lib/auth/password";
import { createAdminSessionCookie } from "@/lib/auth/admin-session";

export async function POST(request: Request) {
  let body: Partial<{ password: string }>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!password) {
    return NextResponse.json({ error: "Enter the admin password." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const settings = await getOrCreateAdminSettings();

    const valid = await verifyPassword(password, settings.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    await createAdminSessionCookie();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[/api/admin/login]", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }
}
