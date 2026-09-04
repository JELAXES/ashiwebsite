import type { LawLevel } from "@/lib/auth/constants";

export type LegalStatus = "current" | "historical";

export type SubjectSlug =
  | "constitutional-law"
  | "criminal-law"
  | "contract-law"
  | "tort-law"
  | "property-law"
  | "family-law"
  | "company-law"
  | "administrative-law"
  | "cpc"
  | "bnss"
  | "evidence-bsa"
  | "jurisprudence"
  | "international-law"
  | "environmental-law"
  | "labour-law"
  | "intellectual-property";

/** Broad grouping used to badge and colour a subject in curriculum views. */
export type SubjectCategory =
  | "Law"
  | "Management"
  | "Skills"
  | "Seminar"
  | "Research";

export interface Subject {
  /** Stable identifier. Same value as `slug` — exposed as `id` for callers that
   *  prefer that name. Never a display string; renaming a subject never changes it. */
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  /** Which preparation tracks (onboarding selections) this subject belongs to. */
  tracks: LawLevel[];
  /**
   * If set, this subject shares its quiz/flashcard/landmark-case content with
   * another (richer) subject entry — e.g. "Constitutional Law I" links to the
   * "constitutional-law" entry that actually has curated practice content.
   */
  linkedSubjectSlug?: string;
  /** Ids into lib/legal/acts.ts that are directly relevant to this subject. */
  relatedActIds?: string[];

  // --- Structured-curriculum fields (populated for degree-program subjects such
  //     as BBA LLB; left undefined for the generic catalogue and entrance tracks). ---
  /** Degree programme this entry belongs to, e.g. "BBA LLB". */
  program?: string;
  /** Academic year 1-5 within `program`. */
  year?: number;
  /** Semester 1-10 within `program`. */
  semester?: number;
  /** Broad subject category, for badges/grouping. */
  category?: SubjectCategory;
  /** `false` hides the subject everywhere without deleting it. Defaults to true. */
  active?: boolean;
}

/** `id` is an alias of `slug` — kept as a helper so callers can read either. */
export function subjectId(subject: Pick<Subject, "slug">): string {
  return subject.slug;
}

export type CaseSubjectTag =
  | "constitutional"
  | "criminal"
  | "civil"
  | "contract"
  | "property"
  | "commercial"
  | "environmental";

export interface LandmarkCase {
  id: string;
  name: string;
  citation: string;
  court: string;
  year: number;
  subject: string;
  subjectTags: CaseSubjectTag[];
  principle: string;
  summary: string;
  provisions: string[];
}

export type ActCategory =
  | "Constitution"
  | "Criminal Law"
  | "Civil Law"
  | "Commercial Law"
  | "Procedural Law"
  | "Other Central Acts";

export interface ActProvision {
  label: string;
  description: string;
}

export interface LegalAct {
  id: string;
  name: string;
  shortName: string;
  year: number;
  category: ActCategory;
  status: LegalStatus;
  supersededBy?: string;
  supersedes?: string;
  inForceNote: string;
  summary: string;
  provisions: ActProvision[];
  amendments: string[];
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  subject: SubjectSlug;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  provision?: string;
  caseRef?: string;
  examTip?: string;
}

export interface Flashcard {
  id: string;
  subject: SubjectSlug;
  front: string;
  back: string;
  provision?: string;
}
