import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getOrCreateAdminSettings } from "@/lib/auth/admin-settings";
import { verifyPassword } from "@/lib/auth/password";
import { createAdminSessionCookie } from "@/lib/auth/admin-session";
import { checkRateLimit } from "@/lib/ai/rate-limit";

const LOGIN_WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS_PER_IP = 8;
// A second, global ceiling so rotating the (spoofable) forwarded IP doesn't lift the limit entirely.
const MAX_ATTEMPTS_GLOBAL = 40;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (
    !checkRateLimit(`admin-login:${ip}`, MAX_ATTEMPTS_PER_IP, LOGIN_WINDOW_MS) ||
    !checkRateLimit("admin-login:global", MAX_ATTEMPTS_GLOBAL, LOGIN_WINDOW_MS)
  ) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

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
