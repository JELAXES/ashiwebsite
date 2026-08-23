"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSubjectsForTrack } from "@/lib/legal/subjects";
import { LAW_LEVELS } from "@/lib/auth/constants";
import { cn } from "@/lib/utils";

export function OnboardingForm() {
  const router = useRouter();
  const [lawLevel, setLawLevel] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const trackSubjects = lawLevel ? getSubjectsForTrack(lawLevel) : [];

  function selectLawLevel(level: string) {
    setLawLevel(level);
    // Previously picked subjects belonged to a different track's curriculum — clear them.
    setSelectedSubjects([]);
  }

  function toggleSubject(slug: string) {
    setSelectedSubjects((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  async function handleSubmit() {
    setError(null);
    if (!lawLevel) {
      setError("Choose what you're preparing for.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lawLevel, subjects: selectedSubjects }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-sm font-semibold text-foreground">What are you preparing for?</h2>
        <p className="mt-1 text-xs text-muted-foreground">Personalizes your dashboard, exam tips, and study suggestions.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {LAW_LEVELS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => selectLawLevel(t)}
              aria-pressed={lawLevel === t}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                lawLevel === t
                  ? "border-primary/40 bg-accent text-accent-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {lawLevel && (
      <div>
        <h2 className="text-sm font-semibold text-foreground">Subjects you want to focus on</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Optional — pick as many as you like from your {lawLevel} curriculum, or skip and choose later in Settings.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {trackSubjects.map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => toggleSubject(s.slug)}
              className={cn(
                "rounded-md border px-2.5 py-2 text-left text-xs font-medium transition-colors",
                selectedSubjects.includes(s.slug)
                  ? "border-primary/40 bg-accent text-accent-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
      )}

      {error && (
        <p className="text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button type="button" className="w-full gap-2" disabled={loading} onClick={handleSubmit}>
        {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {loading ? "Saving..." : "Continue to dashboard"}
      </Button>
    </div>
  );
}
