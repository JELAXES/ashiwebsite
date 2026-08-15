import type { SubjectSlug } from "./types";

/** Configurable marketing stats — update as real usage numbers become available. */
export const siteStats = [
  { value: "10,000+", label: "Legal concepts", note: "configurable" },
  { value: "5,000+", label: "Case references", note: "configurable" },
  { value: "20+", label: "Subjects", note: "configurable" },
  { value: "24/7", label: "AI study companion", note: "always available" },
] as const;

export interface Conversation {
  id: string;
  title: string;
  subject: SubjectSlug;
  subjectLabel: string;
  preview: string;
  updatedAt: string;
  messageCount: number;
}

export const recentConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Culpable homicide vs. murder",
    subject: "criminal-law",
    subjectLabel: "Criminal Law",
    preview: "What is the difference between culpable homicide and murder?",
    updatedAt: "2026-08-09T18:22:00+05:30",
    messageCount: 8,
  },
  {
    id: "conv-2",
    title: "Basic Structure Doctrine deep dive",
    subject: "constitutional-law",
    subjectLabel: "Constitutional Law",
    preview: "Explain the basic structure doctrine with case references.",
    updatedAt: "2026-08-09T09:05:00+05:30",
    messageCount: 14,
  },
  {
    id: "conv-3",
    title: "Capacity to contract — minors",
    subject: "contract-law",
    subjectLabel: "Contract Law",
    preview: "Why is a minor's agreement void ab initio?",
    updatedAt: "2026-08-08T21:40:00+05:30",
    messageCount: 6,
  },
  {
    id: "conv-4",
    title: "Absolute vs. strict liability",
    subject: "tort-law",
    subjectLabel: "Tort Law",
    preview: "Compare Rylands v. Fletcher with M.C. Mehta's absolute liability rule.",
    updatedAt: "2026-08-06T14:10:00+05:30",
    messageCount: 10,
  },
  {
    id: "conv-5",
    title: "Natural justice principles",
    subject: "administrative-law",
    subjectLabel: "Administrative Law",
    preview: "Explain audi alteram partem and nemo judex in causa sua.",
    updatedAt: "2026-08-02T11:00:00+05:30",
    messageCount: 5,
  },
];

export interface BookmarkItem {
  id: string;
  type: "answer" | "section" | "case" | "question";
  title: string;
  description: string;
  subject: string;
  savedAt: string;
}

export const bookmarks: BookmarkItem[] = [
  {
    id: "bm-1",
    type: "case",
    title: "Kesavananda Bharati v. State of Kerala",
    description: "Basic Structure Doctrine — Article 368 limits.",
    subject: "Constitutional Law",
    savedAt: "2026-08-09T10:00:00+05:30",
  },
  {
    id: "bm-2",
    type: "section",
    title: "Section 103, BNS 2023",
    description: "Punishment for murder — current criminal law framework.",
    subject: "Criminal Law",
    savedAt: "2026-08-08T19:30:00+05:30",
  },
  {
    id: "bm-3",
    type: "answer",
    title: "Culpable homicide vs. murder",
    description: "AI explanation with IPC and BNS provisions compared.",
    subject: "Criminal Law",
    savedAt: "2026-08-09T18:25:00+05:30",
  },
  {
    id: "bm-4",
    type: "question",
    title: "Quiz: Basic Structure Doctrine",
    description: "Which case established the Basic Structure Doctrine?",
    subject: "Constitutional Law",
    savedAt: "2026-08-05T08:00:00+05:30",
  },
];

export interface WeakArea {
  subject: SubjectSlug;
  subjectLabel: string;
  accuracy: number;
  topic: string;
}

export const weakAreas: WeakArea[] = [
  { subject: "property-law", subjectLabel: "Property Law", accuracy: 42, topic: "Doctrine of lis pendens" },
  { subject: "family-law", subjectLabel: "Family Law", accuracy: 38, topic: "Restitution of conjugal rights" },
  { subject: "company-law", subjectLabel: "Company Law", accuracy: 45, topic: "Doctrine of indoor management" },
];

export interface RevisionItem {
  id: string;
  title: string;
  subject: string;
  dueLabel: string;
  type: "flashcards" | "quiz" | "case";
}

export const upcomingRevision: RevisionItem[] = [
  { id: "rev-1", title: "Fundamental Rights — flashcard set", subject: "Constitutional Law", dueLabel: "Due today", type: "flashcards" },
  { id: "rev-2", title: "IPC → BNS transition quiz", subject: "Criminal Law", dueLabel: "Due tomorrow", type: "quiz" },
  { id: "rev-3", title: "Landmark torts cases", subject: "Tort Law", dueLabel: "Due in 3 days", type: "case" },
];

export const dashboardStats = {
  studyStreak: 12,
  questionsAsked: 486,
  topicsCompleted: 72,
  quizAccuracy: 78,
};
