import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { LegalDisclaimer } from "@/components/legal/legal-disclaimer";

export const metadata: Metadata = {
  title: "About",
  description: "What StudyRex is and who it's built for.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">About StudyRex</h1>
          <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground">
            <p>
              StudyRex is an AI-powered study companion for law students, CLAT aspirants, and
              judiciary exam candidates. It pairs an AI Tutor with a structured library of
              subjects, landmark cases, and Acts &amp; Sections, so you can ask a question in plain language
              and get an exam-relevant, cited answer back.
            </p>
            <p>
              India&apos;s criminal law was recodified in 2023 — the IPC, CrPC, and Evidence Act were
              replaced by the BNS, BNSS, and BSA. A lot of study material still refers to the older regime.
              StudyRex&apos;s AI Tutor is built to always distinguish{" "}
              <span className="font-medium text-foreground">CURRENT</span> law from{" "}
              <span className="font-medium text-foreground">HISTORICAL</span> law, rather than blur the two.
            </p>
            <p>
              The AI Tutor, your account, and your conversation history are real, persisted features backed
              by MongoDB — not a static demo. Study tools like the quiz bank and flashcards are an honest
              starter set, clearly labeled as such rather than presented as exhaustive exam coverage.
            </p>
          </div>
          <LegalDisclaimer variant="block" className="mt-10" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
