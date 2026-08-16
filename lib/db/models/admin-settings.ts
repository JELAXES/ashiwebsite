import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

// Singleton document — one row holds the current admin password hash.
const adminSettingsSchema = new Schema(
  {
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export type AdminSettingsDocument = InferSchemaType<typeof adminSettingsSchema>;

export const AdminSettings =
  (models.AdminSettings as Model<AdminSettingsDocument>) ??
  model<AdminSettingsDocument>("AdminSettings", adminSettingsSchema);
