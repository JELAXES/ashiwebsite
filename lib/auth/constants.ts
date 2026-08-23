/** Client-safe (no mongoose/server-only imports) so it can be shared with 'use client' forms. */
export const LAW_LEVELS = [
  "1st Year Law",
  "2nd Year Law",
  "3rd Year Law",
  "4th Year Law",
  "5th Year Law",
  "CLAT",
  "Judiciary",
] as const;
export type LawLevel = (typeof LAW_LEVELS)[number];

/** Curriculum category shown alongside a law-school year (e.g. "1st Year Law — Foundations"). Null for non-year tracks. */
export const LAW_LEVEL_CATEGORY: Record<LawLevel, string | null> = {
  "1st Year Law": "Foundations",
  "2nd Year Law": "Core Law",
  "3rd Year Law": "Procedure & Practice",
  "4th Year Law": "Specialisations",
  "5th Year Law": "Advanced & Clinical",
  CLAT: null,
  Judiciary: null,
};
