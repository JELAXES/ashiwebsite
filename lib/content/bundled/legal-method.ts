import type { ContentItemInput } from "../types";

/**
 * BBA LLB Year 1 — "Legal Methods & Legal Reasoning" flashcard deck.
 *
 * Imported from the course requirements document (Google Doc, Year 1 flashcards
 * section, Q1–Q28). Kept as structured data here — NOT pasted into a component —
 * so it flows through the same `ContentItem` pipeline as any future document.
 *
 * Keyed to the rich subject slug `legal-methods`; the BBA LLB subject
 * `bballb-legal-method` links to it and surfaces the same deck.
 */
const SOURCE = {
  title: "BBA LLB Year 1 — Legal Methods & Legal Reasoning (flashcard deck)",
  ref: "gdoc-bballb-y1-legal-methods",
  locator: "Requirements doc — Year 1 flashcards, Q1–Q28",
  importedAt: "2026-09-03T00:00:00.000Z",
};

function card(
  order: number,
  chapter: string,
  front: string,
  back: string,
): ContentItemInput {
  return {
    subjectSlug: "legal-methods",
    topic: "Precedent, Interpretation & Legal Reasoning",
    chapter,
    source: SOURCE,
    type: "flashcard",
    title: front,
    flashcard: { front, back },
    order,
  };
}

const PRECEDENT = "Doctrine of Precedent";
const INTERPRETATION = "Interpretation of Statutes";
const REASONING = "Legal Reasoning & Sources of Law";
const JURISPRUDENCE = "Jurisprudential Foundations";

export const LEGAL_METHOD_DECK: ContentItemInput[] = [
  card(
    1,
    PRECEDENT,
    "What does the doctrine of stare decisis literally mean, and what does it require?",
    "\"To stand by things decided.\" Courts must follow the principles of law laid down in prior decisions of higher courts, and generally of their own court. Full maxim: stare decisis et non quieta movere — stand by decisions and do not disturb settled points. Rationale: certainty, predictability, equality of treatment, judicial efficiency. Do not confuse with res judicata, which bars the same parties from relitigating the same cause of action; stare decisis binds courts to legal principles across different cases.",
  ),
  card(
    2,
    PRECEDENT,
    "Define ratio decidendi.",
    "The rule or principle of law upon which the decision is based, read against the material facts of the case. This alone is binding under stare decisis. Distinguish from the decretal order (the operative outcome — \"appeal dismissed with costs\"), which binds only the parties, and from obiter dicta. A judgment may contain more than one ratio where the decision rests on independent grounds.",
  ),
  card(
    3,
    PRECEDENT,
    "What is the authority of obiter dicta?",
    "Persuasive only — not binding. An obiter dictum is a statement not necessary to the decision: an observation on hypothetical facts, a point not argued, or a wider proposition than the case required. Indian nuance: considered obiter of the Supreme Court is treated by High Courts as highly authoritative and is ordinarily followed, but it does not bind under Article 141 the way a ratio does.",
  ),
  card(
    4,
    PRECEDENT,
    "What does Article 141 of the Constitution of India provide?",
    "\"The law declared by the Supreme Court shall be binding on all courts within the territory of India.\" Two riders: (1) \"all courts\" does not include the Supreme Court itself — it may depart from its own earlier decisions (Bengal Immunity Co. v. State of Bihar, AIR 1955 SC 661); (2) do not confuse it with Article 142 (power to pass any order necessary for doing complete justice). A High Court's decision binds all courts subordinate to it within its territorial jurisdiction and is only persuasive before another High Court.",
  ),
  card(
    5,
    PRECEDENT,
    "When is a decision per incuriam, and what follows?",
    "\"Through lack of care.\" A decision rendered in ignorance or forgetfulness of a binding statutory provision or an inconsistent binding authority, where the omission demonstrably affected the outcome. Such a decision loses its binding force — a recognised exception to stare decisis. Distinguish sub silentio: a point that passed unnoticed and was never argued, so was never consciously decided, and has no precedential value on that point.",
  ),
  card(
    6,
    PRECEDENT,
    "Explain Wambaugh's Inversion Test for locating the ratio.",
    "Frame the proposition of law, insert its reverse into the judgment, and ask whether the court would still have reached the same conclusion. If the outcome would change, the proposition is ratio (it was necessary); if the outcome stays the same, it is obiter. Limitation: the test fails where a decision rests on two or more independent grounds, since reversing any one alone leaves the result intact — and it would wrongly classify both as obiter.",
  ),
  card(
    7,
    PRECEDENT,
    "State Goodhart's test for determining the ratio decidendi.",
    "Ratio = the facts treated as material by the judge + the decision reached on those facts. The judge's own selection of what is material is decisive. Facts normally immaterial (name, date, place, amount, identity of parties) count only if the judgment treats them as significant. Advantage over Wambaugh: it handles multi-ground decisions. Criticism: judges do not always state which facts they consider material.",
  ),
  card(
    8,
    PRECEDENT,
    "Distinguish overruling, reversing, and distinguishing.",
    "Overruling — a higher court (or the same court) declares that a principle laid down in an earlier, separate case is wrong; it destroys that precedent's authority and is generally retrospective. Reversing — an appellate court sets aside the decision of the court below in the same case; it is vertical and affects only those parties. Distinguishing — a court holds a precedent inapplicable because the material facts differ; the precedent survives but its scope is confined. Distinguishing is the principal engine of common-law development.",
  ),
  card(
    9,
    PRECEDENT,
    "What is the doctrine of prospective overruling, and which Indian case introduced it?",
    "A newly declared rule applies only to future cases and transactions, leaving past transactions undisturbed. Introduced in I.C. Golaknath v. State of Punjab, AIR 1967 SC 1643, by Subba Rao CJ, borrowed from American jurisprudence — Parliament was held unable to abridge Fundamental Rights, but the ruling applied prospectively so amendments already made were not invalidated. It is an equitable departure from Blackstone's declaratory theory (that judges only discover, never make, law); in India the power is reserved to the Supreme Court.",
  ),
  card(
    10,
    INTERPRETATION,
    "State the Literal (Grammatical) Rule and its guiding maxim.",
    "Words are given their plain, ordinary, grammatical meaning; where the language is clear and unambiguous the court applies it even if the result seems harsh or inconvenient. Maxim: absoluta sententia expositore non indiget — a plain proposition needs no expositor. Rationale: the legislature's intention is best found in the words it actually enacted; it respects separation of powers. Criticism: it can defeat legislative purpose and produce absurdity — which the Golden Rule corrects.",
  ),
  card(
    11,
    INTERPRETATION,
    "State the Golden Rule and the case classically associated with it.",
    "The ordinary grammatical sense is adhered to unless it leads to absurdity, repugnance, or inconsistency with the rest of the instrument — in which case the meaning may be modified just enough to avoid that result, and no further. Grey v. Pearson (1857) 6 HL Cas 61, per Lord Wensleydale. It is a limited corrective on the literal rule, not a licence to rewrite the statute.",
  ),
  card(
    12,
    INTERPRETATION,
    "State the four questions laid down in Heydon's Case (1584) for the Mischief Rule.",
    "Heydon's Case (1584) 3 Co Rep 7a. The judge must discern: (1) what was the common law before the Act; (2) what was the mischief and defect for which the common law did not provide; (3) what remedy Parliament has resolved and appointed to cure it; (4) the true reason of the remedy. The court then construes so as to suppress the mischief and advance the remedy. It is the ancestor of the modern purposive approach and is used chiefly for remedial, welfare and social legislation.",
  ),
  card(
    13,
    INTERPRETATION,
    "Explain the rule of ejusdem generis and its conditions.",
    "\"Of the same kind or species.\" Where general words follow an enumeration of specific words that form a distinct genus, the general words are confined to that genus — e.g. \"cars, motorcycles, buses and other vehicles\" means motorised road vehicles, not aircraft. The rule does NOT apply where the specific words are heterogeneous and form no identifiable genus, where the specific words exhaust the whole genus, or where the statute discloses a contrary, wider intention.",
  ),
  card(
    14,
    INTERPRETATION,
    "What does noscitur a sociis mean?",
    "\"It is known by its associates.\" The meaning of a doubtful or ambiguous word is gathered from the words linked with it in the same context. Ejusdem generis is a specific application of this broader maxim.",
  ),
  card(
    15,
    INTERPRETATION,
    "What does expressio unius est exclusio alterius mean, and what caution attaches?",
    "The express mention of one thing implies the exclusion of others not mentioned — e.g. a provision referring to \"land and buildings\" arguably excludes machinery. Caution: it is a weak aid — \"a servant, not a master.\" Silence may reflect inadvertence rather than deliberate exclusion; it yields where the enumeration is merely illustrative or where applying it would defeat the statutory purpose.",
  ),
  card(
    16,
    INTERPRETATION,
    "What is the Rule of Harmonious Construction?",
    "Where two provisions of a statute appear to conflict, they must be construed so that both are given effect and neither is rendered redundant; only where reconciliation is genuinely impossible does one prevail. It rests on the presumption that the legislature intended a consistent whole, and is applied to reconcile Fundamental Rights with Directive Principles and entries across the Union, State and Concurrent Lists. Fallback rules if harmony is impossible: generalia specialibus non derogant (the special prevails over the general); the later provision prevails over the earlier.",
  ),
  card(
    17,
    INTERPRETATION,
    "Distinguish internal aids from external aids to interpretation.",
    "Internal aids lie within the four corners of the statute: long and short title, preamble, headings, marginal notes, definition clauses, provisos, explanations, illustrations, schedules, punctuation. External aids lie outside it: legislative history, the Statement of Objects and Reasons, dictionaries, contemporanea expositio, textbooks and juristic writing, foreign decisions, committee and commission reports, subsequent social conditions. Marks points: marginal notes are a weak aid and cannot control the section; the preamble may be used only where the enacting words are ambiguous; the Statement of Objects and Reasons may show the mischief but cannot control clear statutory language.",
  ),
  card(
    18,
    INTERPRETATION,
    "What does ut res magis valeat quam pereat require?",
    "\"It is better for a thing to have effect than to be made void.\" The construction that makes a statute effective and workable is preferred over one that renders it futile, otiose or void. It underlies the presumption of constitutionality and the doctrine of reading down. Do not confuse it with the separate principle of strict construction of penal and taxing statutes in favour of the subject.",
  ),
  card(
    19,
    REASONING,
    "How does deductive reasoning operate in law? Give the structure of the legal syllogism.",
    "Major premise — the rule of law; minor premise — the facts of the case; conclusion — the legal result. Example: whoever commits theft is punishable under s. 379 IPC (major); A committed theft (minor); therefore A is punishable (conclusion). It moves from the general to the particular and is validity-preserving: if both premises are true, the conclusion must follow. Limitation: it presupposes both the rule and the characterisation of the facts — which is where the real legal argument usually lies.",
  ),
  card(
    20,
    REASONING,
    "What is inductive reasoning in law, and how does it differ from deduction?",
    "Reasoning from particular instances — a line of decided cases — to a general principle; this is how a lawyer extracts a doctrine (e.g. duty of care) from a series of negligence judgments. It moves from the particular to the general and is ampliative: the conclusion goes beyond the premises, so it is only probable, never certain, and a single contrary decision can unsettle it. Deduction guarantees its conclusion; induction only supports it.",
  ),
  card(
    21,
    REASONING,
    "Set out Edward Levi's three-step account of legal reasoning by analogy.",
    "From An Introduction to Legal Reasoning (\"reasoning by example\"): (1) a similarity is observed between the present case and a prior case; (2) the rule of law inherent in the prior case is announced; (3) that rule is applied to the present case. Levi called it a \"moving classification system\": the rule is restated at each step as new fact-patterns are absorbed. The contestable step is the first — deciding which shared features are legally relevant — and that is where advocacy operates.",
  ),
  card(
    22,
    REASONING,
    "What does IRAC stand for, and what belongs in each part?",
    "Issue — the precise legal question, framed narrowly. Rule — the applicable law: statute, ratio of binding cases, tests. Application/Analysis — the rule applied to these facts element by element, including the counter-argument and why it fails. Conclusion — a direct answer to the issue. The Application carries the most marks: it must connect each element of the rule to specific facts, not restate the law. Variants: CREAC and MIRAT (Material facts–Issue–Rule–Application–Tentative conclusion).",
  ),
  card(
    23,
    REASONING,
    "Classify the sources of law as formal and material (Salmond).",
    "Formal source — that from which a rule derives its force and validity: the will of the State expressed through law. Material sources — that from which a rule derives its content, subdivided into legal sources recognised by law (legislation, precedent, custom, conventional/agreement) and historical sources that influence development but have no legal recognition until adopted (juristic writing, foreign decisions, religious texts, expert opinion).",
  ),
  card(
    24,
    REASONING,
    "What are the essentials of a valid custom?",
    "Antiquity (immemorial usage); continuity (uninterrupted observance); peaceable enjoyment — nec vi, nec clam, nec precario; reasonableness; certainty as to extent and content; obligatory force (observed as of right — opinio necessitatis); consistency with statute law (a custom contrary to statute always fails); and conformity with morality and public policy. Indian courts have struck down customs failing the morality/public-policy test even where antiquity was proved.",
  ),
  card(
    25,
    JURISPRUDENCE,
    "State Austin's Command Theory and two standard criticisms.",
    "Analytical positivism: law is the command of the sovereign backed by a sanction, addressed to political inferiors in a habit of obedience. Four elements: sovereign, command, duty, sanction. Criticisms (largely Hart's): (1) many laws confer powers rather than impose duties (wills, contracts, procedural rules) and are not commands; (2) customary, constitutional and international law fit the model poorly; \"habitual obedience\" cannot explain continuity of authority across a change of sovereign; and the \"gunman writ large\" model cannot distinguish being obliged (coerced) from being obligated (under a duty).",
  ),
  card(
    26,
    JURISPRUDENCE,
    "Explain Hart's primary and secondary rules, and the rule of recognition.",
    "Primary rules impose duties (do not kill, do not steal). Secondary rules confer powers and are about primary rules: the rule of recognition (criteria of legal validity), rules of change (how rules are enacted, amended, repealed) and rules of adjudication (who decides breaches and how). A regime of primary rules alone suffers uncertainty, static character and inefficiency — cured respectively by recognition, change and adjudication. The rule of recognition is not itself valid or invalid: it exists as a social fact in the convergent practice of officials, accepted from the internal point of view.",
  ),
  card(
    27,
    JURISPRUDENCE,
    "What is Kelsen's Grundnorm?",
    "The basic norm — a presupposed, non-positive foundational norm from which every other norm derives its validity, giving the system its unity. Part of the Pure Theory of Law, which strips law of morality, politics, sociology and psychology. Norms are validated hierarchically, each by a higher norm, terminating in the Grundnorm, which is presupposed, not derived. Efficacy matters: if a revolution establishes a new order that is by and large obeyed, the Grundnorm changes.",
  ),
  card(
    28,
    JURISPRUDENCE,
    "Match each jurist to their central idea: Savigny, Roscoe Pound, Holmes.",
    "Savigny (Historical School) — Volksgeist: law is the organic expression of the spirit and consciousness of the people, growing like language; he opposed premature codification. Roscoe Pound (Sociological School) — law as social engineering: the legal order balances competing individual, public and social interests with minimum friction and waste. Oliver Wendell Holmes (American Realism) — law is \"the prophecies of what the courts will do in fact\"; the \"bad man\" perspective; \"the life of the law has not been logic; it has been experience.\"",
  ),
];
