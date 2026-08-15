import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-b border-border py-24">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
          Your law degree is hard enough.
          <br />
          Studying shouldn&apos;t be.
        </h2>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 px-6 text-base")}>
            Start Learning Free
            <ArrowRight className="size-4" />
          </Link>
          <Link href="/#features" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-6 text-base")}>
            Explore StudyRex
          </Link>
        </div>
      </div>
    </section>
  );
}
