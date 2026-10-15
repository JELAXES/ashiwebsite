import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";

export async function GET() {
  try {
    const instance = await connectToDatabase();
    const db = instance.connection.db;
    if (!db) {
      throw new Error("Database handle unavailable after connect.");
    }
    await db.admin().ping();
    return NextResponse.json({ connected: true });
  } catch (error) {
    // The detail stays in the server logs — this route is public, and driver
    // errors can include hostnames and connection-string fragments.
    console.error("[/api/health/db]", error);
    return NextResponse.json({ connected: false }, { status: 503 });
  }
}
