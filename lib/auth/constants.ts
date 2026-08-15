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
