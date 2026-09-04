# Importing subject study material

Study material supplied as documents is normalized into **one `ContentItem`
row per flashcard / question / note / summary / case brief / section explainer**
— never pasted into React components. Every row carries the metadata needed to
trace it back to its origin and to filter it.

## Data model

`lib/db/models/content-item.ts` (Mongoose) / `lib/content/types.ts` (shared types).

| Field | Purpose |
|---|---|
| `subjectSlug` | Stable subject id from `lib/legal/subjects.ts` (**slug, never a display name**). Resolved through `getPracticeSlug` on write, so curriculum entries like `constitutional-law-i` store against the rich subject `constitutional-law`. |
| `years` | Denormalized from the subject's `tracks` on import, for year-scoped queries. |
| `topic`, `chapter` | Where in the syllabus the item sits. |
| `source` | `{ title, ref?, locator?, importedAt }` — the document it came from and where within it. |
| `type` | `note \| summary \| flashcard \| question \| case-brief \| section-explainer`. |
| `title`, `body` | Title always; `body` is markdown-lite for prose types. |
| `flashcard` | `{ front, back, provision? }` when `type === "flashcard"`. |
| `question` | `{ prompt, options[], correctOptionId, explanation, provision?, caseRef?, examTip? }` when `type === "question"`. |
| `order`, `active` | Sort order within a subject; `active: false` hides an item without deleting it. |

## Importing

```ts
import { importContentItems } from "@/lib/content/queries";

await importContentItems([
  {
    subjectSlug: "criminal-law",
    topic: "Culpable homicide & murder",
    chapter: "BNS 2023 — Ch. VI",
    source: { title: "Criminal Law handout — Module 3", ref: "crimlaw-mod-3", locator: "pp. 4–7" },
    type: "flashcard",
    title: "Culpable homicide vs murder — degree of probability test",
    flashcard: {
      front: "What single factor most often distinguishes murder from culpable homicide?",
      back: "The degree of probability of death: 'likely to cause death' → culpable homicide; 'sufficient in the ordinary course of nature to cause death' → murder.",
      provision: "CURRENT — Sections 100–101, BNS 2023",
    },
    order: 1,
  },
]);
```

`years` and id/timestamps are assigned automatically. `subjectSlug` is validated
against the subject registry and rewritten to the practice slug.

## Reading

- `getContentItems(subjectSlug, type)` — active items of one type, ordered.
- `getContentCounts(subjectSlug)` — `{ [type]: count }` for badges / dashboards.

Both resolve the practice slug, so `constitutional-law-i` and
`constitutional-law` return the same imported set.

## Rules

- **Never invent content to fill a screen.** A subject with no imported rows
  shows the existing empty state — that's correct, not a bug.
- Curated seed content in `lib/legal/` (the original 10 flashcards, 14 quiz
  questions, 12 cases) stays where it is. Imported content is additive; a later
  change can have the study-tool views merge both sources behind
  `getContentItems`.
- One document → one `source.ref`. Re-importing the same document should first
  delete its previous rows (`ContentItem.deleteMany({ "source.ref": ref })`).
