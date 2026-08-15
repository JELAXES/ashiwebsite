import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { signSessionToken, verifySessionToken, type SessionPayload } from "@/lib/auth/jwt";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/lib/db/models/user";

export const SESSION_COOKIE = "studyrex_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export async function createSessionCookie(payload: SessionPayload): Promise<void> {
  const token = signSessionToken(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Fetches the full user document for the current session. Returns null if unauthenticated.
 * Wrapped in React's `cache()` so the layout's auth check and a page's own call within the
 * same request share one MongoDB round-trip instead of two.
 */
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) return null;

  await connectToDatabase();
  const user = await User.findById(session.userId).lean();
  return user ?? null;
});
