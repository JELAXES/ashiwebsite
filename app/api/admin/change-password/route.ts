import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getOrCreateAdminSettings } from "@/lib/auth/admin-settings";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { isAdminSession } from "@/lib/auth/admin-session";

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  let body: Partial<{ currentPassword: string; newPassword: string }>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

  if (newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const settings = await getOrCreateAdminSettings();

    const valid = await verifyPassword(currentPassword, settings.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    settings.passwordHash = await hashPassword(newPassword);
    await settings.save();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[/api/admin/change-password]", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }
}
