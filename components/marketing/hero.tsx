import Link from "next/link";
import { ArrowRight, Sparkles, ScrollText, Landmark } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-noise" aria-hidden="true" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
            Built for the way law students study
          </div>

          <h1 className="font-heading text-4xl leading-[1.08] font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            Master the law.
            <br />
            With <span className="text-primary">AI</span> on your side.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Understand sections, cases, constitutional principles and legal concepts faster
            with an AI study companion built around your syllabus.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 px-6 text-base")}>
              Start Learning Free
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="#ai-demo"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-6 text-base")}
            >
              Explore the AI Tutor
            </Link>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Built for law students, CLAT aspirants &amp; judiciary candidates.
          </p>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative rounded-xl border border-border bg-card p-5 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <div className="flex size-7 items-center justify-center rounded-full bg-primary/15">
                <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">StudyRex AI Tutor</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="ml-auto w-fit max-w-[80%] rounded-lg bg-primary px-3.5 py-2 text-sm text-primary-foreground">
                Explain the Basic Structure Doctrine.
              </div>
              <div className="w-fit max-w-[85%] space-y-2 rounded-lg border border-border bg-secondary/40 px-3.5 py-2.5">
                <p className="text-sm text-foreground/90">
                  Parliament&apos;s power to amend the Constitution is not unlimited...
                </p>
                <div className="flex items-center gap-1.5 rounded-md bg-background/60 px-2 py-1 text-[11px] font-medium text-primary">
                  <ScrollText className="size-3" /> Article 368, Constitution of India
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5 border-t border-border pt-4">
              <div className="rounded-md bg-secondary/50 p-3">
                <Landmark className="mb-1.5 size-3.5 text-primary" aria-hidden="true" />
                <p className="text-[11px] font-semibold text-foreground">Kesavananda Bharati</p>
                <p className="text-[10px] text-muted-foreground">SC · 1973</p>
              </div>
              <div className="rounded-md bg-secondary/50 p-3">
                <ScrollText className="mb-1.5 size-3.5 text-primary" aria-hidden="true" />
                <p className="text-[11px] font-semibold text-foreground">Section 103, BNS</p>
                <p className="text-[10px] text-muted-foreground">Current framework</p>
              </div>
            </div>
          </div>

          <div className="absolute -right-6 -bottom-6 -z-10 size-40 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
