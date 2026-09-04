"use client";

import { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sun, Moon, Monitor, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LAW_LEVEL_GROUPS } from "@/lib/auth/constants";
import { getSubjectsForTrack } from "@/lib/legal/subjects";
import { cn } from "@/lib/utils";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

interface SettingsViewProps {
  initialUser: {
    name: string;
    email: string;
    lawLevel: string | null;
    subjects: string[];
  };
}

const noopSubscribe = () => () => {};

/** True only after client hydration — avoids a server/client mismatch on the active theme button. */
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

const notificationDefaults = [
  { key: "revision", label: "Revision reminders", description: "Nudges when flashcards or quizzes are due for review." },
  { key: "digest", label: "Weekly progress digest", description: "A summary of what you studied and where you're weak." },
  { key: "product", label: "Product updates", description: "New subjects, tools, and features as they ship." },
];

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="font-heading text-base font-semibold text-foreground">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function SettingsView({ initialUser }: SettingsViewProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const [lawLevel, setLawLevel] = useState(initialUser.lawLevel ?? "");
  const [lawLevelSaving, setLawLevelSaving] = useState(false);
  const [focusSubjects, setFocusSubjects] = useState<string[]>(initialUser.subjects);
  const [focusSubjectsSaving, setFocusSubjectsSaving] = useState(false);
  const trackSubjects = lawLevel ? getSubjectsForTrack(lawLevel) : [];
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    revision: true,
    digest: true,
    product: false,
  });
  const [analytics, setAnalytics] = useState(true);
  const [name, setName] = useState(initialUser.name);
  const [email, setEmail] = useState(initialUser.email);
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountSaved, setAccountSaved] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function saveLawLevel(level: string) {
    const previous = lawLevel;
    const previousSubjects = focusSubjects;
    setLawLevel(level);
    // A new track has a different curriculum — the old focus-subject picks no longer apply.
    setFocusSubjects([]);
    setLawLevelSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lawLevel: level }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setLawLevel(previous);
      setFocusSubjects(previousSubjects);
      toast.error("We couldn't save your changes. Please try again.");
    } finally {
      setLawLevelSaving(false);
    }
  }

  function toggleFocusSubject(slug: string) {
    setFocusSubjects((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  async function saveFocusSubjects() {
    setFocusSubjectsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjects: focusSubjects }),
      });
      if (!res.ok) throw new Error();
      toast.success("Focus subjects updated.");
      router.refresh();
    } catch {
      toast.error("We couldn't save your changes. Please try again.");
    } finally {
      setFocusSubjectsSaving(false);
    }
  }

  async function saveAccount() {
    setAccountError(null);
    setAccountSaved(false);
    setAccountSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAccountError(data.error || "Something went wrong.");
        return;
      }
      setAccountSaved(true);
      router.refresh();
    } catch {
      setAccountError("Network error. Please try again.");
    } finally {
      setAccountSaving(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <SettingsSection title="Appearance" description="Choose how StudyRex looks on this device.">
        <div className="flex flex-wrap gap-2">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const active = mounted && theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTheme(opt.value)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "border-primary/50 bg-accent text-accent-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </SettingsSection>

      <SettingsSection
        title="What you're preparing for"
        description="Personalizes your dashboard, study suggestions, and exam tips. Switching your year re-scopes every subject list, flashcard deck, and quiz — your notebook and history are untouched."
      >
        <div className="space-y-3">
          {LAW_LEVEL_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                {group.label}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {group.levels.map((t) => (
                  <button
                    key={t}
                    type="button"
                    disabled={lawLevelSaving}
                    onClick={() => saveLawLevel(t)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-60",
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
          ))}
          {lawLevelSaving && <Loader2 className="size-3.5 animate-spin text-muted-foreground" aria-hidden="true" />}
        </div>
      </SettingsSection>

      {lawLevel && trackSubjects.length > 0 && (
        <SettingsSection
          title="Focus subjects"
          description={`Optional — pick subjects from your ${lawLevel} curriculum to highlight on your dashboard.`}
        >
          <div className="flex flex-wrap items-center gap-2">
            {trackSubjects.map((s) => (
              <button
                key={s.slug}
                type="button"
                disabled={focusSubjectsSaving}
                onClick={() => toggleFocusSubject(s.slug)}
                className={cn(
                  "rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-60",
                  focusSubjects.includes(s.slug)
                    ? "border-primary/40 bg-accent text-accent-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground",
                )}
              >
                {s.name}
              </button>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-4 gap-2"
            disabled={focusSubjectsSaving}
            onClick={saveFocusSubjects}
          >
            {focusSubjectsSaving && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Save focus subjects
          </Button>
        </SettingsSection>
      )}

      <SettingsSection title="Notifications">
        <div className="space-y-4">
          {notificationDefaults.map((n) => (
            <div key={n.key} className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor={`notif-${n.key}`}>{n.label}</Label>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.description}</p>
              </div>
              <Switch
                id={`notif-${n.key}`}
                checked={notifications[n.key]}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [n.key]: checked }))}
              />
            </div>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection
        title="Privacy"
        description="StudyRex stores your study data in MongoDB to power your dashboard, notebook, and conversations."
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label htmlFor="analytics-toggle">Share anonymous usage analytics</Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Helps us understand which subjects and tools are most useful.
            </p>
          </div>
          <Switch id="analytics-toggle" checked={analytics} onCheckedChange={setAnalytics} />
        </div>
      </SettingsSection>

      <SettingsSection title="Account">
        <div className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name-input">Name</Label>
            <Input id="name-input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email-input">Email</Label>
            <Input id="email-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          {accountError && (
            <p className="text-xs font-medium text-destructive" role="alert">
              {accountError}
            </p>
          )}
          {accountSaved && !accountError && (
            <p className="text-xs font-medium text-primary">Saved.</p>
          )}

          <Button
            type="button"
            variant="outline"
            className="gap-2"
            disabled={accountSaving}
            onClick={saveAccount}
          >
            {accountSaving && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Save changes
          </Button>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-sm font-medium text-foreground">Log out</p>
              <p className="text-xs text-muted-foreground">End this session and return to the homepage.</p>
            </div>
            <Button variant="destructive" className="gap-2" disabled={loggingOut} onClick={handleLogout}>
              {loggingOut ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <LogOut className="size-4" />}
              Log out
            </Button>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}
