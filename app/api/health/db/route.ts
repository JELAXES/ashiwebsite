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
    console.error("[/api/health/db]", error);
    return NextResponse.json(
      {
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 },
    );
  }
}
