import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import { LAW_LEVELS } from "@/lib/auth/constants";

export { LAW_LEVELS };

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    lawLevel: { type: String, enum: LAW_LEVELS },
    // Focus subjects the student picked from their own year's curriculum.
    subjects: { type: [String], default: [] },
    // Subject slugs the student has explicitly added from outside their year
    // (the "manually add extra subjects" feature). Stored as stable slugs so a
    // display-name change never breaks the association. Unioned with the track
    // curriculum wherever subjects are listed — see getSubjectsForUser().
    extraSubjects: { type: [String], default: [] },
    onboarded: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema>;

export const User = (models.User as Model<UserDocument>) ?? model<UserDocument>("User", userSchema);
