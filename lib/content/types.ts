/**
 * Shared types for imported study content.
 *
 * Study material supplied as documents (per subject) is normalized into
 * `ContentItem` records — one row per flashcard, question, note, summary, or
 * explainer — rather than being pasted into React components. Every item keeps
 * enough metadata to trace it back to its subject, topic/chapter, and source
 * document, and to filter it by content type.
 *
 * The Mongoose model lives in `lib/db/models/content-item.ts`; this file is the
 * client-safe type surface (no `server-only` import) so UI code can share it.
 */

export const CONTENT_TYPES = [
  "note",
  "summary",
  "flashcard",
  "question",
  "case-brief",
  "section-explainer",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

/** Where an imported item came from — the document and location within it. */
export interface ContentSource {
  /** Human-readable document title, e.g. "Criminal Law — Module 3 handout". */
  title: string;
  /** Optional stable reference/slug for the document (for re-import / dedupe). */
  ref?: string;
  /** Optional page / section / paragraph pointer within the document. */
  locator?: string;
  /** When this batch was imported. */
  importedAt: string;
}

export interface FlashcardPayload {
  front: string;
  back: string;
  provision?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface QuestionPayload {
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  provision?: string;
  caseRef?: string;
  examTip?: string;
}

export interface ContentItem {
  id: string;
  /** Stable subject id (slug from `lib/legal/subjects.ts`) — never a display name. */
  subjectSlug: string;
  /** Denormalized from the subject's tracks so year filters don't need a join. */
  years: string[];
  topic?: string;
  chapter?: string;
  source: ContentSource;
  type: ContentType;
  title: string;
  /** Markdown-lite body for `note` / `summary` / `section-explainer` / `case-brief`. */
  body?: string;
  /** Present when `type === "flashcard"`. */
  flashcard?: FlashcardPayload;
  /** Present when `type === "question"`. */
  question?: QuestionPayload;
  /** Sort order within a subject/topic. */
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Shape accepted by the importer (ids/timestamps are assigned on write). */
export type ContentItemInput = Omit<
  ContentItem,
  "id" | "years" | "createdAt" | "updatedAt" | "active"
> & { active?: boolean };
