import type { Types } from "mongoose";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  lawLevel: string | null;
  subjects: string[];
  onboarded: boolean;
  createdAt: string;
}

interface UserLike {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  lawLevel?: string | null;
  subjects?: string[];
  onboarded?: boolean;
  createdAt?: Date | string;
}

/** Strips passwordHash and normalizes a Mongoose user doc for API responses. */
export function toPublicUser(user: UserLike): PublicUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    lawLevel: user.lawLevel ?? null,
    subjects: user.subjects ?? [],
    onboarded: !!user.onboarded,
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
  };
}
