import { MessageCircleQuestion, BookOpenCheck, Trophy } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageCircleQuestion,
    title: "Ask",
    description: "Ask any Indian law question, in your own words.",
  },
  {
    number: "02",
    icon: BookOpenCheck,
    title: "Understand",
    description: "Get a structured explanation with relevant legal provisions and cases.",
  },
  {
    number: "03",
    icon: Trophy,
    title: "Master",
    description: "Test yourself with quizzes, flashcards and revision tools.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b border-border py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            How StudyRex works.
          </h2>
        </div>

        <div className="relative mt-14 grid gap-8 sm:grid-cols-3">
          <div
            className="absolute top-8 right-0 left-0 hidden h-px bg-border sm:block"
            aria-hidden="true"
          />
          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="relative z-10 flex size-16 items-center justify-center rounded-full border border-border bg-card">
                <step.icon className="size-6 text-primary" aria-hidden="true" />
              </div>
              <span className="mt-4 font-heading text-sm font-semibold text-muted-foreground">
                {step.number}
              </span>
              <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
