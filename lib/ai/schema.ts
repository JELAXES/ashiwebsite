import type Anthropic from "@anthropic-ai/sdk";
import { subjects } from "@/lib/legal/subjects";

const subjectSlugs = subjects.map((s) => s.slug);

/**
 * A single forced tool call is how we get a structured, parseable answer out of
 * Claude instead of free-form text (or fragile JSON-in-prose). The route pins
 * `tool_choice` to this tool, so the model must respond with one `tool_use`
 * block whose `input` follows this schema.
 */
export const ANSWER_TOOL_NAME = "provide_answer";

export const answerTool: Anthropic.Tool = {
  name: ANSWER_TOOL_NAME,
  description:
    "Return the structured StudyRex tutor answer for the student's question. Always call this tool exactly once.",
  input_schema: {
    type: "object",
    properties: {
      answer: {
        type: "string",
        description:
          "The full explanation as markdown-lite text (## headings, - bullets, 1. numbered lists, **bold**). Ends with 'Want me to quiz you on this topic?'",
      },
      subject: {
        type: "string",
        enum: subjectSlugs,
        description: "The single best-matching StudyRex subject slug for this question.",
      },
      citations: {
        type: "array",
        description: "Specific provisions referenced. Empty array if none apply.",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            label: { type: "string", description: "e.g. 'Section 103, BNS 2023'" },
            source: { type: "string", description: "e.g. 'Bharatiya Nyaya Sanhita, 2023'" },
            historical: {
              type: "boolean",
              description: "true if this provision has been superseded (e.g. IPC/CrPC/Evidence Act).",
            },
          },
          required: ["label", "source"],
        },
      },
      cases: {
        type: "array",
        description: "Landmark cases referenced. Empty array if none apply.",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: {
              type: "string",
              description: "e.g. 'Kesavananda Bharati v. State of Kerala (1973)'",
            },
            principle: {
              type: "string",
              description: "One-line statement of the case's core principle.",
            },
          },
          required: ["name", "principle"],
        },
      },
      followUps: {
        type: "array",
        description: "Exactly 3 short, specific follow-up questions about this exact topic.",
        items: { type: "string" },
        minItems: 3,
        maxItems: 3,
      },
      examTip: {
        type: "string",
        description:
          "One short, high-value CLAT/judiciary exam-prep tip, if genuinely useful. Omit otherwise.",
      },
    },
    required: ["answer", "subject", "citations", "cases", "followUps"],
  },
};
