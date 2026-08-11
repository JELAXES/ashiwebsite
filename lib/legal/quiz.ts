import type { QuizQuestion } from "./types";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q-const-1",
    subject: "constitutional-law",
    difficulty: "easy",
    question: "Which case established the 'Basic Structure Doctrine'?",
    options: [
      { id: "a", text: "Maneka Gandhi v. Union of India" },
      { id: "b", text: "Kesavananda Bharati v. State of Kerala" },
      { id: "c", text: "Indra Sawhney v. Union of India" },
      { id: "d", text: "Golaknath v. State of Punjab" },
    ],
    correctOptionId: "b",
    explanation:
      "In Kesavananda Bharati v. State of Kerala (1973), a 13-judge bench held that Parliament cannot use its amending power under Article 368 to alter the Constitution's basic structure.",
    provision: "Article 368, Constitution of India",
    caseRef: "Kesavananda Bharati v. State of Kerala, AIR 1973 SC 1461",
    examTip: "This is the single most-cited case in CLAT and judiciary constitutional law papers — know the bench strength (13 judges) and the year.",
  },
  {
    id: "q-const-2",
    subject: "constitutional-law",
    difficulty: "medium",
    question: "The requirement that a procedure depriving personal liberty under Article 21 must be 'fair, just and reasonable' was laid down in:",
    options: [
      { id: "a", text: "A.K. Gopalan v. State of Madras" },
      { id: "b", text: "Maneka Gandhi v. Union of India" },
      { id: "c", text: "Olga Tellis v. Bombay Municipal Corporation" },
      { id: "d", text: "Puttaswamy v. Union of India" },
    ],
    correctOptionId: "b",
    explanation:
      "Maneka Gandhi v. Union of India (1978) expanded Article 21 by holding that the 'procedure established by law' must itself be fair, just and reasonable, linking Articles 14, 19 and 21.",
    provision: "Article 21, Constitution of India",
    caseRef: "Maneka Gandhi v. Union of India, AIR 1978 SC 597",
    examTip: "Remember this case reversed the narrow 'procedure established by law' reading from A.K. Gopalan.",
  },
  {
    id: "q-const-3",
    subject: "constitutional-law",
    difficulty: "medium",
    question: "The right to privacy was declared a fundamental right under Article 21 in which case?",
    options: [
      { id: "a", text: "Shreya Singhal v. Union of India" },
      { id: "b", text: "Navtej Singh Johar v. Union of India" },
      { id: "c", text: "Justice K.S. Puttaswamy (Retd.) v. Union of India" },
      { id: "d", text: "Vishaka v. State of Rajasthan" },
    ],
    correctOptionId: "c",
    explanation:
      "A 9-judge bench in Puttaswamy (2017) unanimously held that privacy is a fundamental right protected under Article 21 and Part III of the Constitution.",
    provision: "Article 21, Constitution of India",
    caseRef: "Justice K.S. Puttaswamy (Retd.) v. Union of India, (2017) 10 SCC 1",
    examTip: "Note the bench size — 9 judges — a common trick in objective papers.",
  },
  {
    id: "q-const-4",
    subject: "constitutional-law",
    difficulty: "hard",
    question: "The Indra Sawhney judgment is most associated with which principle?",
    options: [
      { id: "a", text: "Basic structure doctrine" },
      { id: "b", text: "50% ceiling on reservations and exclusion of the creamy layer" },
      { id: "c", text: "Right to privacy" },
      { id: "d", text: "Doctrine of absolute liability" },
    ],
    correctOptionId: "b",
    explanation:
      "Indra Sawhney v. Union of India (1992) upheld OBC reservations but capped total reservations at 50% (subject to exceptions) and excluded the creamy layer from reservation benefits.",
    provision: "Article 16(4), Constitution of India",
    caseRef: "Indra Sawhney v. Union of India, AIR 1993 SC 477",
  },
  {
    id: "q-crim-1",
    subject: "criminal-law",
    difficulty: "easy",
    question: "Under the historical IPC framework, murder was defined in which section?",
    options: [
      { id: "a", text: "Section 299" },
      { id: "b", text: "Section 300" },
      { id: "c", text: "Section 302" },
      { id: "d", text: "Section 304" },
    ],
    correctOptionId: "b",
    explanation:
      "Section 300, IPC 1860 defined murder (with its exceptions), while Section 299 defined culpable homicide, and Section 302 prescribed the punishment for murder.",
    provision: "HISTORICAL — Section 300, IPC 1860",
    examTip: "Under the current BNS 2023, punishment for murder is addressed in Section 103 — always specify which framework you mean in an exam answer.",
  },
  {
    id: "q-crim-2",
    subject: "criminal-law",
    difficulty: "medium",
    question: "Which current code has replaced the Indian Penal Code, 1860?",
    options: [
      { id: "a", text: "Bharatiya Nagarik Suraksha Sanhita, 2023" },
      { id: "b", text: "Bharatiya Sakshya Adhiniyam, 2023" },
      { id: "c", text: "Bharatiya Nyaya Sanhita, 2023" },
      { id: "d", text: "Code of Criminal Procedure, 1973" },
    ],
    correctOptionId: "c",
    explanation:
      "The Bharatiya Nyaya Sanhita, 2023 (BNS) replaced the IPC, 1860 as India's substantive criminal code, in force since 1 July 2024.",
    provision: "Bharatiya Nyaya Sanhita, 2023",
  },
  {
    id: "q-crim-3",
    subject: "criminal-law",
    difficulty: "hard",
    question: "The 'rarest of rare' doctrine for imposing the death penalty was laid down in:",
    options: [
      { id: "a", text: "Bachan Singh v. State of Punjab" },
      { id: "b", text: "Maneka Gandhi v. Union of India" },
      { id: "c", text: "Nirbhaya case" },
      { id: "d", text: "Navtej Singh Johar v. Union of India" },
    ],
    correctOptionId: "a",
    explanation:
      "In Bachan Singh v. State of Punjab (1980), the Supreme Court upheld the death penalty's validity but restricted its use to the 'rarest of rare' cases.",
    caseRef: "Bachan Singh v. State of Punjab, AIR 1980 SC 898",
  },
  {
    id: "q-crim-4",
    subject: "criminal-law",
    difficulty: "medium",
    question: "Section 377, IPC (relating to consensual adult relations) was read down as unconstitutional in:",
    options: [
      { id: "a", text: "Shreya Singhal v. Union of India" },
      { id: "b", text: "Navtej Singh Johar v. Union of India" },
      { id: "c", text: "Vishaka v. State of Rajasthan" },
      { id: "d", text: "Indra Sawhney v. Union of India" },
    ],
    correctOptionId: "b",
    explanation:
      "In Navtej Singh Johar (2018), the Supreme Court decriminalised consensual homosexual acts between adults, holding that Section 377 violated the right to dignity, privacy, and equality.",
    provision: "HISTORICAL — Section 377, IPC 1860",
    caseRef: "Navtej Singh Johar v. Union of India, (2018) 10 SCC 1",
  },
  {
    id: "q-contract-1",
    subject: "contract-law",
    difficulty: "easy",
    question: "Under the Indian Contract Act, 1872, who is NOT competent to contract?",
    options: [
      { id: "a", text: "A person of sound mind" },
      { id: "b", text: "A minor" },
      { id: "c", text: "A person who has attained majority" },
      { id: "d", text: "A registered company" },
    ],
    correctOptionId: "b",
    explanation:
      "Section 11 of the Indian Contract Act, 1872 excludes minors, persons of unsound mind, and persons disqualified by law from competency to contract.",
    provision: "Section 11, Indian Contract Act, 1872",
    caseRef: "Mohori Bibee v. Dharmodas Ghose, (1903) 30 Cal 539 (PC)",
    examTip: "Remember: a minor's agreement is void ab initio, not merely voidable.",
  },
  {
    id: "q-contract-2",
    subject: "contract-law",
    difficulty: "medium",
    question: "Mohori Bibee v. Dharmodas Ghose is the leading authority for which proposition?",
    options: [
      { id: "a", text: "Free consent requires absence of undue influence" },
      { id: "b", text: "A minor's agreement is void ab initio" },
      { id: "c", text: "Consideration must move from the promisee" },
      { id: "d", text: "An agreement in restraint of trade is void" },
    ],
    correctOptionId: "b",
    explanation:
      "The Privy Council held that since a minor lacks contractual capacity under Section 11, any agreement by a minor is void from the outset, not merely voidable.",
    provision: "Section 11, Indian Contract Act, 1872",
    caseRef: "Mohori Bibee v. Dharmodas Ghose, (1903) 30 Cal 539 (PC)",
  },
  {
    id: "q-tort-1",
    subject: "tort-law",
    difficulty: "medium",
    question: "The rule in Rylands v. Fletcher established which principle?",
    options: [
      { id: "a", text: "Absolute liability" },
      { id: "b", text: "Strict liability for the escape of dangerous things" },
      { id: "c", text: "Vicarious liability of employers" },
      { id: "d", text: "Res ipsa loquitur" },
    ],
    correctOptionId: "b",
    explanation:
      "Rylands v. Fletcher (1868) held that a person who brings a dangerous substance onto their land is strictly liable if it escapes and causes damage, even without proof of negligence.",
    caseRef: "Rylands v. Fletcher, (1868) LR 3 HL 330",
    examTip: "Distinguish this from India's 'absolute liability' rule from M.C. Mehta, which removes the exceptions available under strict liability.",
  },
  {
    id: "q-tort-2",
    subject: "tort-law",
    difficulty: "hard",
    question: "The doctrine of 'absolute liability' in Indian law originated from which case?",
    options: [
      { id: "a", text: "Rylands v. Fletcher" },
      { id: "b", text: "M.C. Mehta v. Union of India (Oleum Gas Leak case)" },
      { id: "c", text: "Bachan Singh v. State of Punjab" },
      { id: "d", text: "Olga Tellis v. Bombay Municipal Corporation" },
    ],
    correctOptionId: "b",
    explanation:
      "In M.C. Mehta v. Union of India (1987), the Supreme Court evolved the doctrine of absolute liability for enterprises engaged in hazardous activities, without the exceptions available under strict liability.",
    caseRef: "M.C. Mehta v. Union of India, AIR 1987 SC 1086",
  },
  {
    id: "q-juris-1",
    subject: "jurisprudence",
    difficulty: "easy",
    question: "The Austinian theory of law defines law primarily as:",
    options: [
      { id: "a", text: "A command of the sovereign backed by a sanction" },
      { id: "b", text: "A rule derived from natural justice" },
      { id: "c", text: "The general will of the people" },
      { id: "d", text: "Customary practice recognised by courts" },
    ],
    correctOptionId: "a",
    explanation:
      "John Austin's command theory defines law as the command of a sovereign, backed by the threat of a sanction for disobedience — a foundational (though widely critiqued) theory in jurisprudence.",
    examTip: "Be ready to contrast this with H.L.A. Hart's 'rule of recognition' and natural law theory.",
  },
  {
    id: "q-admin-1",
    subject: "administrative-law",
    difficulty: "medium",
    question: "The principle of natural justice 'audi alteram partem' requires that:",
    options: [
      { id: "a", text: "No one should be a judge in their own cause" },
      { id: "b", text: "Both sides must be given a fair hearing" },
      { id: "c", text: "Delegated legislation must be published" },
      { id: "d", text: "Administrative orders must always be in writing" },
    ],
    correctOptionId: "b",
    explanation:
      "'Audi alteram partem' — 'hear the other side' — is a core principle of natural justice requiring that no person be condemned unheard.",
  },
];

export function getQuizBySubject(subjectSlug: string) {
  return quizQuestions.filter((q) => q.subject === subjectSlug);
}
