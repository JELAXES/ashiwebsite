import type { Metadata } from "next";
import { ActsBrowser } from "@/components/acts/acts-browser";

export const metadata: Metadata = {
  title: "Acts & Sections",
};

export default function ActsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Acts &amp; Sections
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          A reference explorer for central Acts and Codes. Current law (BNS, BNSS, BSA, and others in
          force) is marked separately from historical law (IPC, CrPC, Evidence Act) that has been
          repealed or superseded.
        </p>
      </div>
      <div className="mt-6">
        <ActsBrowser />
      </div>
    </div>
  );
}
