import type { Flashcard } from "./types";

export const flashcards: Flashcard[] = [
  {
    id: "fc-1",
    subject: "constitutional-law",
    front: "What is the 'Basic Structure Doctrine'?",
    back: "A judicial doctrine from Kesavananda Bharati v. State of Kerala (1973) holding that Parliament's amending power under Article 368 cannot be used to destroy the Constitution's basic features — such as judicial review, federalism, and fundamental rights.",
    provision: "Article 368, Constitution of India",
  },
  {
    id: "fc-2",
    subject: "constitutional-law",
    front: "What did Maneka Gandhi v. Union of India establish about Article 21?",
    back: "That the 'procedure established by law' depriving personal liberty must be fair, just, and reasonable — not arbitrary — effectively linking Articles 14, 19, and 21.",
    provision: "Article 21, Constitution of India",
  },
  {
    id: "fc-3",
    subject: "constitutional-law",
    front: "Which case declared privacy a fundamental right?",
    back: "Justice K.S. Puttaswamy (Retd.) v. Union of India (2017) — a 9-judge bench unanimously held privacy to be intrinsic to Article 21.",
    provision: "Article 21, Constitution of India",
  },
  {
    id: "fc-4",
    subject: "criminal-law",
    front: "What is the difference between culpable homicide and murder (historical IPC framework)?",
    back: "Culpable homicide (Section 299, IPC) is the genus; murder (Section 300, IPC) is a species of it, committed with a higher degree of intention or knowledge. Every murder is culpable homicide, but not every culpable homicide is murder.",
    provision: "HISTORICAL — Sections 299 & 300, IPC 1860",
  },
  {
    id: "fc-5",
    subject: "criminal-law",
    front: "Which current code governs murder and culpable homicide in India today?",
    back: "The Bharatiya Nyaya Sanhita, 2023 (BNS), in force since 1 July 2024, which replaced the IPC, 1860.",
    provision: "Bharatiya Nyaya Sanhita, 2023",
  },
  {
    id: "fc-6",
    subject: "contract-law",
    front: "Can a minor enter into a valid contract in India?",
    back: "No. Under Section 11 of the Indian Contract Act, 1872, a minor lacks capacity to contract, and any agreement by a minor is void ab initio — as held in Mohori Bibee v. Dharmodas Ghose (1903).",
    provision: "Section 11, Indian Contract Act, 1872",
  },
  {
    id: "fc-7",
    subject: "tort-law",
    front: "What is the rule in Rylands v. Fletcher?",
    back: "A person who brings a dangerous substance onto their land for non-natural use is strictly liable if it escapes and causes damage, irrespective of negligence.",
  },
  {
    id: "fc-8",
    subject: "tort-law",
    front: "How does 'absolute liability' differ from 'strict liability' in Indian law?",
    back: "Absolute liability (from M.C. Mehta v. Union of India, 1987) applies to hazardous enterprises with no exceptions — unlike strict liability under Rylands v. Fletcher, which allows defences like an act of a stranger or the plaintiff's own default.",
  },
  {
    id: "fc-9",
    subject: "jurisprudence",
    front: "What is Austin's 'command theory' of law?",
    back: "Law is the command of a sovereign, backed by a sanction for disobedience — a positivist theory that separates law from morality.",
  },
  {
    id: "fc-10",
    subject: "administrative-law",
    front: "What does 'audi alteram partem' mean?",
    back: "'Hear the other side' — a core principle of natural justice requiring that no person be condemned without a fair opportunity to be heard.",
  },
];

export function getFlashcardsBySubject(subjectSlug: string) {
  return flashcards.filter((f) => f.subject === subjectSlug);
}
