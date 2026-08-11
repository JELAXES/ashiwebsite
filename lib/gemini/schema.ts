import { Type, type Schema } from "@google/genai";
import { subjects } from "@/lib/legal/subjects";

const subjectSlugs = subjects.map((s) => s.slug);

/** Forces Gemini to return a structured, parseable answer instead of free-form text. */
export const answerSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    answer: {
      type: Type.STRING,
      description:
        "The full explanation as markdown-lite text (## headings, - bullets, 1. numbered lists, **bold**). Ends with 'Want me to quiz you on this topic?'",
    },
    subject: {
      type: Type.STRING,
      enum: subjectSlugs,
      description: "The single best-matching LexLearn subject slug for this question.",
    },
    citations: {
      type: Type.ARRAY,
      description: "Specific provisions referenced. Empty array if none apply.",
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: "e.g. 'Section 103, BNS 2023'" },
          source: { type: Type.STRING, description: "e.g. 'Bharatiya Nyaya Sanhita, 2023'" },
          historical: {
            type: Type.BOOLEAN,
            description: "true if this provision has been superseded (e.g. IPC/CrPC/Evidence Act).",
          },
        },
        required: ["label", "source"],
      },
    },
    cases: {
      type: Type.ARRAY,
      description: "Landmark cases referenced. Empty array if none apply.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "e.g. 'Kesavananda Bharati v. State of Kerala (1973)'" },
          principle: { type: Type.STRING, description: "One-line statement of the case's core principle." },
        },
        required: ["name", "principle"],
      },
    },
    followUps: {
      type: Type.ARRAY,
      description: "Exactly 3 short, specific follow-up questions about this exact topic.",
      items: { type: Type.STRING },
      minItems: "3",
      maxItems: "3",
    },
    examTip: {
      type: Type.STRING,
      description: "One short, high-value CLAT/judiciary exam-prep tip, if genuinely useful. Omit otherwise.",
    },
  },
  required: ["answer", "subject", "citations", "cases", "followUps"],
};
