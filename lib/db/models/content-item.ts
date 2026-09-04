import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";
import { CONTENT_TYPES } from "@/lib/content/types";

/**
 * Normalized store for imported study material. One document = one flashcard,
 * question, note, summary, case brief, or section explainer, tagged with the
 * subject / topic / chapter / source it came from.
 *
 * Relationships are by stable id: `subjectSlug` points at an entry in
 * `lib/legal/subjects.ts`, never a display string. Nothing in the app reads
 * this collection yet — subjects with no imported content show a clean empty
 * state — but the importer has a single, well-typed target.
 */

const sourceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    ref: { type: String, trim: true },
    locator: { type: String, trim: true },
    importedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const flashcardSchema = new Schema(
  {
    front: { type: String, required: true },
    back: { type: String, required: true },
    provision: String,
  },
  { _id: false },
);

const questionOptionSchema = new Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false },
);

const questionSchema = new Schema(
  {
    prompt: { type: String, required: true },
    options: { type: [questionOptionSchema], default: [] },
    correctOptionId: { type: String, required: true },
    explanation: { type: String, required: true },
    provision: String,
    caseRef: String,
    examTip: String,
  },
  { _id: false },
);

const contentItemSchema = new Schema(
  {
    subjectSlug: { type: String, required: true, index: true },
    // Denormalized year tags (from the subject's `tracks`) for fast filtering.
    years: { type: [String], default: [] },
    topic: { type: String, trim: true },
    chapter: { type: String, trim: true },
    source: { type: sourceSchema, required: true },
    type: { type: String, enum: CONTENT_TYPES, required: true },
    title: { type: String, required: true, trim: true },
    body: String,
    flashcard: { type: flashcardSchema, default: undefined },
    question: { type: questionSchema, default: undefined },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Primary read pattern: "active <type> items for a subject, in order".
contentItemSchema.index({ subjectSlug: 1, type: 1, active: 1, order: 1 });

export type ContentItemDocument = InferSchemaType<typeof contentItemSchema>;

export const ContentItem =
  (models.ContentItem as Model<ContentItemDocument>) ??
  model<ContentItemDocument>("ContentItem", contentItemSchema);
