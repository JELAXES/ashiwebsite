import "server-only";
import { AdminSettings, type AdminSettingsDocument } from "@/lib/db/models/admin-settings";
import { hashPassword } from "@/lib/auth/password";
import type { HydratedDocument } from "mongoose";

/**
 * Fetches the singleton admin settings doc, creating it on first use from
 * ADMIN_DEFAULT_PASSWORD. Once created, the DB-stored hash is authoritative —
 * changing the password via the admin panel never touches the env var again.
 */
export async function getOrCreateAdminSettings(): Promise<HydratedDocument<AdminSettingsDocument>> {
  const existing = await AdminSettings.findOne();
  if (existing) return existing;

  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD;
  if (!defaultPassword) {
    throw new Error("ADMIN_DEFAULT_PASSWORD is not configured on the server.");
  }

  const passwordHash = await hashPassword(defaultPassword);
  return AdminSettings.create({ passwordHash });
}
