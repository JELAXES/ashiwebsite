import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  href: string;
  ctaLabel: string;
  highlighted?: boolean;
  className?: string;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  href,
  ctaLabel,
  highlighted = false,
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-lg border p-6",
        highlighted
          ? "border-primary/50 bg-card shadow-[0_0_0_1px_rgba(217,164,65,0.15)]"
          : "border-border bg-card",
        className,
      )}
    >
      {highlighted && (
        <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold tracking-wide text-primary-foreground uppercase">
          Recommended
        </span>
      )}
      <h3 className="font-heading text-lg font-semibold text-foreground">{name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 flex items-baseline gap-1">
        <span className="font-heading text-4xl font-semibold tracking-tight text-foreground">{price}</span>
        {period && <span className="text-sm text-muted-foreground">{period}</span>}
      </div>

      <Link
        href={href}
        className={cn(
          buttonVariants({ variant: highlighted ? "default" : "outline" }),
          "mt-6 w-full",
        )}
      >
        {ctaLabel}
      </Link>

      <ul className="mt-6 space-y-3 border-t border-border pt-6">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground/90">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
