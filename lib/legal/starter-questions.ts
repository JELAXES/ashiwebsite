import type { Subject } from "./types";
import { getPracticeSlug } from "./subjects";

/**
 * Curated beginner-friendly starter prompts, keyed by the "practice slug" (see
 * getPracticeSlug) so every curriculum variant of a subject (e.g. "Constitutional
 * Law I" and "Constitutional Law II") shares the same well-chosen starters.
 * These are prompts to send to the AI Tutor, not stored answers.
 */
const CURATED_STARTERS: Record<string, string[]> = {
  "constitutional-law": [
    "What is the Constitution of India?",
    "What are Fundamental Rights?",
    "What is Article 21?",
    "What is judicial review?",
    "What is the basic structure doctrine?",
  ],
  "contract-law": [
    "What is a contract?",
    "What are the essentials of a valid contract?",
    "What is an offer?",
    "What is acceptance?",
    "What is consideration?",
  ],
  "criminal-law": [
    "What is the difference between an offence and a civil wrong?",
    "What is mens rea?",
    "What is actus reus?",
    "What is culpable homicide?",
    "How does the BNS relate to the older IPC framework?",
  ],
  "evidence-bsa": [
    "What is evidence?",
    "What is relevance?",
    "What is admissibility?",
    "What is the burden of proof?",
    "What is hearsay?",
  ],
  cpc: [
    "What is the purpose of the CPC?",
    "What is a plaint?",
    "What is jurisdiction?",
    "What is a decree?",
    "What is res judicata?",
  ],
  "tort-law": [
    "What is a tort?",
    "What is negligence?",
    "What is vicarious liability?",
    "What is defamation?",
    "What are the main remedies for tortious wrongs?",
  ],
};

/** Generic, non-fabricated starter prompts for a subject with no curated set. */
function genericStarters(name: string): string[] {
  return [
    `What is ${name}?`,
    `What are the key topics covered under ${name}?`,
    `Why does ${name} matter for exam preparation?`,
    `What are common mistakes students make when studying ${name}?`,
    `How should I start studying ${name}?`,
  ];
}

/** Beginner-friendly prompts to seed an AI Tutor conversation about this subject. */
export function getStarterQuestions(subject: Subject): string[] {
  const practiceSlug = getPracticeSlug(subject);
  return CURATED_STARTERS[practiceSlug] ?? genericStarters(subject.name);
}
