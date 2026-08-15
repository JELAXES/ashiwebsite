import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What StudyRex stores, why, and how it's protected.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">Privacy Policy</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This describes what StudyRex actually stores and why — not boilerplate.
          </p>

          <Section title="What we store">
            <p>When you create an account, we store your name, email address, and a bcrypt hash of your password — never the password itself.</p>
            <p>
              During onboarding (and any time you update it in Settings) we store what you&apos;re preparing
              for — a law year, CLAT, or Judiciary — and any subjects you flag as focus areas.
            </p>
            <p>Every conversation you have with the AI Tutor, including your questions and the AI&apos;s answers, is stored so you can return to it later, rename it, or delete it.</p>
          </Section>

          <Section title="How your session works">
            <p>
              Signing in sets a signed, HTTP-only session cookie. It isn&apos;t readable by JavaScript in the
              browser and isn&apos;t shared with third parties.
            </p>
          </Section>

          <Section title="Where it's stored">
            <p>All account and conversation data lives in MongoDB Atlas. We don&apos;t hardcode or expose database credentials to the client — they stay server-side.</p>
          </Section>

          <Section title="Third-party processing">
            <p>
              When you ask the AI Tutor a question, the question text (and recent conversation history, to keep
              context) is sent to Google&apos;s Gemini API to generate an answer. Google processes that text
              under its own API terms. We don&apos;t send your name, email, or password to Gemini — only the
              content of your question and, if you&apos;ve set your study level or subjects, that context, so
              the answer can be tailored to you.
            </p>
          </Section>

          <Section title="What we don't do">
            <p>We don&apos;t sell your data. We don&apos;t use it for advertising. We don&apos;t share it with data brokers.</p>
          </Section>

          <Section title="Your control">
            <p>You can delete individual conversations at any time from your history. You can change your name, email, and preparation level from Settings.</p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
