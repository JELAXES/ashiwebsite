import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getNotificationsForUser } from "@/lib/notifications";

export async function GET() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const notifications = await getNotificationsForUser(user);
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("[/api/notifications]", error);
    // A notifications failure must never block the app shell — return an empty list.
    return NextResponse.json({ notifications: [] });
  }
}
