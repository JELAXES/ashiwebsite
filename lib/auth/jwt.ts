import "server-only";
import jwt from "jsonwebtoken";

export interface SessionPayload {
  userId: string;
  email: string;
}

const SESSION_TTL = "7d";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured on the server.");
  }
  return secret;
}

export function signSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: SESSION_TTL });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, getSecret());
    if (typeof decoded === "string") return null;
    const { userId, email } = decoded as Partial<SessionPayload>;
    if (typeof userId !== "string" || typeof email !== "string") return null;
    return { userId, email };
  } catch {
    return null;
  }
}

const ADMIN_SESSION_TTL = "12h";

export function signAdminToken(): string {
  return jwt.sign({ admin: true }, getSecret(), { expiresIn: ADMIN_SESSION_TTL });
}

export function verifyAdminToken(token: string): boolean {
  try {
    const decoded = jwt.verify(token, getSecret());
    if (typeof decoded === "string") return false;
    return (decoded as { admin?: boolean }).admin === true;
  } catch {
    return false;
  }
}
