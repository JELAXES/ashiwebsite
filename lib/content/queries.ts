import "server-only";
import { connectToDatabase } from "@/lib/db/mongodb";
import { ContentItem } from "@/lib/db/models/content-item";
import { getSubjectBySlug, getPracticeSlug } from "@/lib/legal/subjects";
import { lawLevelToYear } from "@/lib/auth/constants";
import type { ContentItem as ContentItemType, ContentType, ContentItemInput } from "./types";

function serialize(doc: Record<string, unknown> & { _id: { toString(): string } }): ContentItemType {
  return {
    id: doc._id.toString(),
    subjectSlug: doc.subjectSlug as string,
    years: (doc.years as string[]) ?? [],
    topic: (doc.topic as string) || undefined,
    chapter: (doc.chapter as string) || undefined,
    source: {
      title: (doc.source as { title: string }).title,
      ref: (doc.source as { ref?: string }).ref,
      locator: (doc.source as { locator?: string }).locator,
      importedAt: new Date((doc.source as { importedAt?: Date }).importedAt ?? Date.now()).toISOString(),
    },
    type: doc.type as ContentType,
    title: doc.title as string,
    body: (doc.body as string) || undefined,
    flashcard: (doc.flashcard as ContentItemType["flashcard"]) || undefined,
    question: (doc.question as ContentItemType["question"]) || undefined,
    order: (doc.order as number) ?? 0,
    active: (doc.active as boolean) ?? true,
    createdAt: new Date((doc.createdAt as Date) ?? Date.now()).toISOString(),
    updatedAt: new Date((doc.updatedAt as Date) ?? Date.now()).toISOString(),
  };
}

/**
 * Active imported content of a given type for a subject.
 *
 * Resolution order:
 *   1. rows stored against the EXACT slug requested;
 *   2. only if there are none, rows stored against the subject's linked
 *      "practice" slug (so a subject with no bespoke content still shows the
 *      shared doctrinal deck).
 *
 * Step 1 is what keeps sibling subjects distinct: once "Constitutional Law II"
 * has its own imported rows, it stops inheriting "Constitutional Law I"'s.
 */
export async function getContentItems(
  subjectSlug: string,
  type: ContentType,
): Promise<ContentItemType[]> {
  await connectToDatabase();

  const exact = await ContentItem.find({ subjectSlug, type, active: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();
  if (exact.length > 0) {
    return exact.map((d) => serialize(d as Parameters<typeof serialize>[0]));
  }

  const subject = getSubjectBySlug(subjectSlug);
  const practice = subject ? getPracticeSlug(subject) : subjectSlug;
  if (practice === subjectSlug) return [];

  const linked = await ContentItem.find({ subjectSlug: practice, type, active: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();
  return linked.map((d) => serialize(d as Parameters<typeof serialize>[0]));
}

/**
 * Imported content for many subjects in one round-trip, grouped by the EXACT
 * subject slug it was stored against (no practice-slug collapsing here — the
 * caller decides on fallback per subject). Used by the study-tool deck builders.
 */
export async function getContentItemsForSubjects(
  subjectSlugs: string[],
  type: ContentType,
): Promise<Record<string, ContentItemType[]>> {
  const grouped: Record<string, ContentItemType[]> = {};
  if (subjectSlugs.length === 0) return grouped;

  await connectToDatabase();
  const docs = await ContentItem.find({
    subjectSlug: { $in: subjectSlugs },
    type,
    active: true,
  })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  for (const doc of docs) {
    const item = serialize(doc as Parameters<typeof serialize>[0]);
    (grouped[item.subjectSlug] ??= []).push(item);
  }
  return grouped;
}

/** Count of active imported items per type for a subject — for dashboards / badges. */
export async function getContentCounts(
  subjectSlug: string,
): Promise<Record<ContentType, number>> {
  const subject = getSubjectBySlug(subjectSlug);
  const slug = subject ? getPracticeSlug(subject) : subjectSlug;

  await connectToDatabase();
  const rows = await ContentItem.aggregate<{ _id: ContentType; n: number }>([
    { $match: { subjectSlug: slug, active: true } },
    { $group: { _id: "$type", n: { $sum: 1 } } },
  ]);
  const counts = {} as Record<ContentType, number>;
  for (const row of rows) counts[row._id] = row.n;
  return counts;
}

/**
 * Bulk-insert imported items for one subject/document.
 *
 * `subjectSlug` is validated against the registry and stored EXACTLY as given
 * (never rewritten to a practice slug) so a curriculum entry keeps its own
 * content. `years` is denormalised from the subject's tracks for fast
 * year-scoped queries. Re-importing a document should first delete its previous
 * rows: `ContentItem.deleteMany({ "source.ref": ref })`.
 */
export async function importContentItems(items: ContentItemInput[]): Promise<number> {
  if (items.length === 0) return 0;
  await connectToDatabase();

  const docs = items.map((item) => {
    const subject = getSubjectBySlug(item.subjectSlug);
    if (!subject) {
      throw new Error(
        `importContentItems: unknown subjectSlug "${item.subjectSlug}" — add it to lib/legal/subjects.ts first.`,
      );
    }
    const years = Array.from(
      new Set(
        subject.tracks
          .map((t) => lawLevelToYear(t))
          .filter((y): y is number => y != null)
          .map((y) => String(y)),
      ),
    );
    return {
      ...item,
      subjectSlug: subject.slug,
      years: years.length > 0 ? years : [...subject.tracks],
      active: item.active ?? true,
    };
  });

  const result = await ContentItem.insertMany(docs, { ordered: false });
  return result.length;
}

/** Remove every row imported from a given source document (for a clean re-import). */
export async function deleteContentBySourceRef(ref: string): Promise<number> {
  await connectToDatabase();
  const res = await ContentItem.deleteMany({ "source.ref": ref });
  return res.deletedCount ?? 0;
}
