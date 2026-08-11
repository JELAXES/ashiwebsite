import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/navigation/logo";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <Link href="/" className="mb-8 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Logo />
      </Link>

      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 sm:p-8">
        <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>

      {footer && <div className="mt-6 text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}
