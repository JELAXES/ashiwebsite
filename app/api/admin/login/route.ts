import { NextResponse } from "next/server";
import { timingSafeEqual, createHash } from "node:crypto";
import { createAdminSessionCookie } from "@/lib/auth/admin-session";
import { checkRateLimit } from "@/lib/ai/rate-limit";

// Hash both sides so the comparison is constant-time regardless of length.
function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

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

  let body: Partial<{ username: string; password: string }>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!username || !password) {
    return NextResponse.json({ error: "Enter the admin username and password." }, { status: 400 });
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminUsername || !adminPassword) {
    console.error("[/api/admin/login] ADMIN_USERNAME / ADMIN_PASSWORD are not configured.");
    return NextResponse.json({ error: "Admin login is not configured on the server." }, { status: 500 });
  }

  try {
    const valid = safeEqual(username, adminUsername) && safeEqual(password, adminPassword);
    if (!valid) {
      return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
    }

    await createAdminSessionCookie();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[/api/admin/login]", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }
}
