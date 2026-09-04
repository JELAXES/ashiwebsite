"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  BookMarked,
  Landmark,
  BookText,
  GraduationCap,
  Bookmark,
  NotebookPen,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const primaryNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tutor", label: "AI Tutor", icon: Sparkles },
  { href: "/subjects", label: "Subjects", icon: BookMarked },
  { href: "/cases", label: "Case Library", icon: Landmark },
  { href: "/acts", label: "Acts & Sections", icon: BookText },
  { href: "/study-tools", label: "Study Tools", icon: GraduationCap },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/notebook", label: "Notebook", icon: NotebookPen },
];

const secondaryNav: NavItem[] = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: User },
];

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      <Icon className={cn("size-4 shrink-0", isActive && "text-primary")} aria-hidden="true" />
      {item.label}
    </Link>
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex h-full flex-col justify-between" aria-label="Main navigation">
      <div className="flex flex-col gap-1">
        {primaryNav.map((item) => (
          <NavLink key={item.href} item={item} onNavigate={onNavigate} />
        ))}
      </div>
      <div className="flex flex-col gap-1 border-t border-border pt-3">
        {secondaryNav.map((item) => (
          <NavLink key={item.href} item={item} onNavigate={onNavigate} />
        ))}
      </div>
    </nav>
  );
}
