import type { ContentItemInput, ContentType } from "../types";
import { LEGAL_METHOD_DECK } from "./legal-method";

/**
 * Document-imported study content that ships with the app as structured data.
 *
 * This is the zero-infrastructure tier of the content pipeline: it needs no
 * database, so a subject's imported flashcards/questions render even on a fresh
 * clone. The `ContentItem` collection in MongoDB is the additive tier on top —
 * `lib/content/decks.ts` merges both, keyed on the exact subject slug.
 *
 * Client-safe: only imports shared types and plain data.
 */
export const BUNDLED_CONTENT: ContentItemInput[] = [...LEGAL_METHOD_DECK];

export function getBundledContent(subjectSlug: string, type: ContentType): ContentItemInput[] {
  return BUNDLED_CONTENT.filter(
    (c) => c.subjectSlug === subjectSlug && c.type === type && c.active !== false,
  ).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** Distinct subject slugs that have any bundled content. */
export function bundledSubjectSlugs(): string[] {
  return Array.from(new Set(BUNDLED_CONTENT.map((c) => c.subjectSlug)));
}
