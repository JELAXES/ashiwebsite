import { siteStats } from "@/lib/legal/mock-data";

export function StatsBar() {
  return (
    <section className="border-b border-border bg-card/40" aria-label="Platform statistics">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        {siteStats.map((stat) => (
          <div key={stat.label} className="text-center lg:text-left">
            <p className="font-heading text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
      <p className="mx-auto max-w-7xl px-4 pb-6 text-center text-xs text-muted-foreground/70 sm:px-6 lg:px-8 lg:text-left">
        Configurable figures — updated as platform usage and content coverage grow.
      </p>
    </section>
  );
}
