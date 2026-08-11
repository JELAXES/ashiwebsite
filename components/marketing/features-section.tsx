import { Sparkles, Landmark, BookText, ListChecks, Layers, LineChart } from "lucide-react";
import { FeatureCard } from "./feature-card";

const features = [
  {
    icon: Sparkles,
    title: "AI Legal Tutor",
    description: "Ask questions and understand complex legal concepts in simple language.",
    href: "/tutor",
  },
  {
    icon: Landmark,
    title: "Case Law Intelligence",
    description: "Discover landmark Supreme Court and High Court decisions.",
    href: "/cases",
  },
  {
    icon: BookText,
    title: "Acts & Sections",
    description: "Find relevant sections and provisions quickly.",
    href: "/acts",
  },
  {
    icon: ListChecks,
    title: "Smart Quizzes",
    description: "Test your understanding with AI-generated questions.",
    href: "/study-tools/quiz",
  },
  {
    icon: Layers,
    title: "Flashcards",
    description: "Turn difficult concepts into revision cards.",
    href: "/study-tools/flashcards",
  },
  {
    icon: LineChart,
    title: "Study Analytics",
    description: "Track your progress and identify weak areas.",
    href: "/dashboard",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-b border-border py-20 sm:py-24" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            Everything you need to study Indian law.
          </h2>
          <p className="mt-3 text-muted-foreground">
            A complete toolkit for law students, CLAT aspirants, and judiciary candidates —
            built around how legal concepts are actually taught and examined.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
