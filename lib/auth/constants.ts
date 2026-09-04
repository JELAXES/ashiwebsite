/** Client-safe (no mongoose/server-only imports) so it can be shared with 'use client' forms. */
export const LAW_LEVELS = [
  "1st Year Law",
  "2nd Year Law",
  "3rd Year Law",
  "4th Year Law",
  "5th Year Law",
  "BBA LLB Year 1",
  "BBA LLB Year 2",
  "BBA LLB Year 3",
  "BBA LLB Year 4",
  "BBA LLB Year 5",
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
  "BBA LLB Year 1": "Foundations",
  "BBA LLB Year 2": "Core Law & Management",
  "BBA LLB Year 3": "Procedure & Corporate",
  "BBA LLB Year 4": "Specialisations",
  "BBA LLB Year 5": "Advanced & Clinical",
  CLAT: null,
  Judiciary: null,
};

/**
 * Numeric academic year for a track (1-5), or null for non-year tracks. This is
 * the single place that maps a stored `lawLevel` string to a year number, so
 * generic-LLB and BBA-LLB users are handled identically by year-aware code and
 * an older "1st Year Law" value keeps working unchanged.
 */
export const LAW_LEVEL_TO_YEAR: Record<LawLevel, number | null> = {
  "1st Year Law": 1,
  "2nd Year Law": 2,
  "3rd Year Law": 3,
  "4th Year Law": 4,
  "5th Year Law": 5,
  "BBA LLB Year 1": 1,
  "BBA LLB Year 2": 2,
  "BBA LLB Year 3": 3,
  "BBA LLB Year 4": 4,
  "BBA LLB Year 5": 5,
  CLAT: null,
  Judiciary: null,
};

export function lawLevelToYear(lawLevel: string | null | undefined): number | null {
  if (!lawLevel) return null;
  return LAW_LEVEL_TO_YEAR[lawLevel as LawLevel] ?? null;
}

/** The degree programme a track belongs to, or null for entrance/services tracks. */
export function lawLevelProgram(lawLevel: string | null | undefined): string | null {
  if (!lawLevel) return null;
  if (lawLevel.startsWith("BBA LLB")) return "BBA LLB";
  if (lawLevel.endsWith("Year Law")) return "LLB";
  return null;
}

/**
 * Programme grouping for the onboarding / settings picker so the ~12 tracks read
 * as a short, structured list instead of one long row of pills.
 */
export const LAW_LEVEL_GROUPS: { label: string; levels: LawLevel[] }[] = [
  {
    label: "BBA LLB (Hons.)",
    levels: [
      "BBA LLB Year 1",
      "BBA LLB Year 2",
      "BBA LLB Year 3",
      "BBA LLB Year 4",
      "BBA LLB Year 5",
    ],
  },
  {
    label: "LLB / BA LLB",
    levels: ["1st Year Law", "2nd Year Law", "3rd Year Law", "4th Year Law", "5th Year Law"],
  },
  {
    label: "Entrance & services",
    levels: ["CLAT", "Judiciary"],
  },
];
