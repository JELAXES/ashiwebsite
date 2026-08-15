import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { toPublicUser } from "@/lib/auth/public-user";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }
    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    console.error("[/api/auth/me]", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 502 });
  }
}
