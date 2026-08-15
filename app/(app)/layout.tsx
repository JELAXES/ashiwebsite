import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/navigation/sidebar";
import { Topbar } from "@/components/navigation/topbar";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AppLayout({ children }: { children: ReactNode }) {
  // proxy.ts already gates these routes optimistically (cookie present); this
  // fetches the real user and enforces onboarding, per the Next.js DAL pattern.
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (!user.onboarded) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar user={{ name: user.name, email: user.email }} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
