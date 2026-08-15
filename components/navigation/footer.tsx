import Link from "next/link";
import { Logo } from "./logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "AI Tutor", href: "/tutor" },
      { label: "Case Library", href: "/cases" },
      { label: "Study Tools", href: "/study-tools" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Subjects", href: "/subjects" },
      { label: "Acts & Sections", href: "/acts" },
      { label: "Case Law", href: "/cases" },
      { label: "Study Guides", href: "/study-tools" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Understand the law. Remember it. Master it.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
                <ul className="mt-3 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-xs text-muted-foreground">
            StudyRex provides educational information and is not a substitute for professional
            legal advice.
          </p>
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} StudyRex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
