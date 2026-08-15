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
import { LAW_LEVELS } from "@/lib/auth/constants";
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
    setLawLevel(level);
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
      toast.error("We couldn't save your changes. Please try again.");
    } finally {
      setLawLevelSaving(false);
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

      <SettingsSection title="What you're preparing for" description="Personalizes your dashboard, study suggestions, and exam tips.">
        <div className="flex flex-wrap items-center gap-2">
          {LAW_LEVELS.map((t) => (
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
          {lawLevelSaving && <Loader2 className="size-3.5 animate-spin text-muted-foreground" aria-hidden="true" />}
        </div>
      </SettingsSection>

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
        description="StudyRex stores your study data in MongoDB to power your dashboard, history, and conversations."
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
