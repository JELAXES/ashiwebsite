import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/navigation/logo";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Set up your account",
};

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (user.onboarded) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <Link href="/" className="mb-8 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Logo />
      </Link>

      <div className="w-full max-w-xl rounded-xl border border-border bg-card p-6 sm:p-8">
        <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          Welcome, {user.name.split(" ")[0]}.
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          A couple of quick questions to personalize StudyRex for you.
        </p>
        <div className="mt-6">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
