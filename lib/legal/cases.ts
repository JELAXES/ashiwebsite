import type { LandmarkCase } from "./types";

/**
 * Landmark case summaries are limited to well-documented, widely reported
 * decisions. Citations are illustrative study references — always verify
 * against SCC/AIR or the official judgment before citing in exams or filings.
 */
export const landmarkCases: LandmarkCase[] = [
  {
    id: "kesavananda-bharati",
    name: "Kesavananda Bharati v. State of Kerala",
    citation: "AIR 1973 SC 1461",
    court: "Supreme Court of India",
    year: 1973,
    subject: "Constitutional Law",
    subjectTags: ["constitutional"],
    principle: "Basic Structure Doctrine",
    summary:
      "A 13-judge bench held that Parliament's power to amend the Constitution under Article 368 does not extend to altering its 'basic structure' — such as judicial review, federalism, and separation of powers.",
    provisions: ["Article 368, Constitution of India"],
  },
  {
    id: "maneka-gandhi",
    name: "Maneka Gandhi v. Union of India",
    citation: "AIR 1978 SC 597",
    court: "Supreme Court of India",
    year: 1978,
    subject: "Constitutional Law",
    subjectTags: ["constitutional"],
    principle: "Article 21 and procedural fairness",
    summary:
      "The Court held that the 'procedure established by law' under Article 21 must be fair, just, and reasonable, effectively reading due process protections into Article 21 and linking it with Articles 14 and 19.",
    provisions: ["Article 21, Constitution of India", "Article 14, Constitution of India"],
  },
  {
    id: "vishaka",
    name: "Vishaka v. State of Rajasthan",
    citation: "AIR 1997 SC 3011",
    court: "Supreme Court of India",
    year: 1997,
    subject: "Constitutional Law",
    subjectTags: ["constitutional"],
    principle: "Guidelines against workplace sexual harassment",
    summary:
      "In the absence of specific legislation, the Court laid down binding guidelines ('Vishaka Guidelines') to protect women from sexual harassment at the workplace, later codified by the POSH Act, 2013.",
    provisions: ["Article 14, Constitution of India", "Article 21, Constitution of India"],
  },
  {
    id: "puttaswamy",
    name: "Justice K.S. Puttaswamy (Retd.) v. Union of India",
    citation: "(2017) 10 SCC 1",
    court: "Supreme Court of India",
    year: 2017,
    subject: "Constitutional Law",
    subjectTags: ["constitutional"],
    principle: "Right to privacy as a fundamental right",
    summary:
      "A 9-judge bench unanimously held that the right to privacy is a fundamental right protected under Article 21 and Part III of the Constitution.",
    provisions: ["Article 21, Constitution of India"],
  },
  {
    id: "shreya-singhal",
    name: "Shreya Singhal v. Union of India",
    citation: "AIR 2015 SC 1523",
    court: "Supreme Court of India",
    year: 2015,
    subject: "Constitutional Law",
    subjectTags: ["constitutional"],
    principle: "Free speech and Section 66A, IT Act",
    summary:
      "The Court struck down Section 66A of the Information Technology Act, 2000 as unconstitutional for being vague and having a chilling effect on free speech under Article 19(1)(a).",
    provisions: ["Article 19(1)(a), Constitution of India", "Section 66A, Information Technology Act, 2000 (struck down)"],
  },
  {
    id: "indra-sawhney",
    name: "Indra Sawhney v. Union of India",
    citation: "AIR 1993 SC 477",
    court: "Supreme Court of India",
    year: 1992,
    subject: "Constitutional Law",
    subjectTags: ["constitutional"],
    principle: "OBC reservation and the 50% ceiling rule",
    summary:
      "The Court upheld reservation for socially and educationally backward classes in public employment, while capping total reservations at 50% save in exceptional circumstances, and excluded the 'creamy layer'.",
    provisions: ["Article 16(4), Constitution of India"],
  },
  {
    id: "navtej-singh-johar",
    name: "Navtej Singh Johar v. Union of India",
    citation: "(2018) 10 SCC 1",
    court: "Supreme Court of India",
    year: 2018,
    subject: "Constitutional Law",
    subjectTags: ["constitutional", "criminal"],
    principle: "Reading down Section 377, IPC",
    summary:
      "The Court read down Section 377 of the IPC to decriminalise consensual sexual acts between adults, holding that criminalising private consensual conduct violated the right to dignity, privacy, and equality.",
    provisions: ["Section 377, Indian Penal Code, 1860 — historical", "Article 21, Constitution of India"],
  },
  {
    id: "olga-tellis",
    name: "Olga Tellis v. Bombay Municipal Corporation",
    citation: "AIR 1986 SC 180",
    court: "Supreme Court of India",
    year: 1985,
    subject: "Constitutional Law",
    subjectTags: ["constitutional"],
    principle: "Right to livelihood under Article 21",
    summary:
      "The Court held that the right to life under Article 21 includes the right to livelihood, though eviction of pavement dwellers could still proceed if backed by a fair and reasonable procedure.",
    provisions: ["Article 21, Constitution of India"],
  },
  {
    id: "bachan-singh",
    name: "Bachan Singh v. State of Punjab",
    citation: "AIR 1980 SC 898",
    court: "Supreme Court of India",
    year: 1980,
    subject: "Criminal Law",
    subjectTags: ["criminal", "constitutional"],
    principle: "'Rarest of rare' doctrine for the death penalty",
    summary:
      "The Court upheld the constitutional validity of the death penalty for murder, but confined its use to the 'rarest of rare' cases, requiring courts to weigh aggravating and mitigating circumstances.",
    provisions: ["Section 302, Indian Penal Code, 1860 — historical", "Section 103, Bharatiya Nyaya Sanhita, 2023"],
  },
  {
    id: "mc-mehta-oleum",
    name: "M.C. Mehta v. Union of India (Oleum Gas Leak case)",
    citation: "AIR 1987 SC 1086",
    court: "Supreme Court of India",
    year: 1987,
    subject: "Environmental Law",
    subjectTags: ["environmental", "civil"],
    principle: "Absolute liability principle",
    summary:
      "Following a gas leak from a factory, the Court evolved the doctrine of 'absolute liability' for enterprises engaged in hazardous activities, going beyond the exceptions available under strict liability.",
    provisions: ["Article 21, Constitution of India"],
  },
  {
    id: "mohori-bibee",
    name: "Mohori Bibee v. Dharmodas Ghose",
    citation: "(1903) 30 Cal 539 (PC)",
    court: "Privy Council",
    year: 1903,
    subject: "Contract Law",
    subjectTags: ["contract", "civil"],
    principle: "A minor's agreement is void ab initio",
    summary:
      "The Privy Council held that an agreement by a minor is void from its inception, since a minor lacks the capacity to contract under Section 11 of the Indian Contract Act, 1872.",
    provisions: ["Section 11, Indian Contract Act, 1872"],
  },
  {
    id: "rylands-fletcher",
    name: "Rylands v. Fletcher",
    citation: "(1868) LR 3 HL 330",
    court: "House of Lords, England",
    year: 1868,
    subject: "Tort Law",
    subjectTags: ["civil"],
    principle: "Strict liability for escape of dangerous substances",
    summary:
      "An English case foundational to Indian tort law: a person who brings a dangerous substance onto their land is strictly liable if it escapes and causes damage, regardless of fault — later refined in India by absolute liability.",
    provisions: [],
  },
];

export function getCaseById(id: string) {
  return landmarkCases.find((c) => c.id === id);
}
