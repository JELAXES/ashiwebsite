import { PricingCard } from "./pricing-card";

const plans = [
  {
    name: "Free",
    price: "₹0",
    description: "Get started and explore the basics.",
    href: "/signup",
    ctaLabel: "Start Free",
    features: [
      "Limited AI questions per day",
      "Basic case library access",
      "Basic quizzes",
      "Basic study tracking",
    ],
  },
  {
    name: "Pro",
    price: "₹199",
    period: "/month",
    description: "For focused, regular exam preparation.",
    href: "/signup?plan=pro",
    ctaLabel: "Get Pro",
    highlighted: true,
    features: [
      "More AI questions per day",
      "Full case library",
      "Advanced quizzes",
      "Flashcards",
      "Study analytics",
    ],
  },
  {
    name: "Premium",
    price: "₹349",
    period: "/month",
    description: "Maximum support for CLAT & judiciary aspirants.",
    href: "/signup?plan=premium",
    ctaLabel: "Get Premium",
    features: [
      "Highest AI question limits",
      "Advanced exam preparation tools",
      "Personalized study plans",
      "Advanced analytics",
      "Priority access to new features",
    ],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="border-b border-border py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent pricing.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Start free. Upgrade when you&apos;re ready for full exam preparation.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Prices shown in INR and are configurable. Usage limits apply per plan — see plan details after sign-up.
        </p>
      </div>
    </section>
  );
}
