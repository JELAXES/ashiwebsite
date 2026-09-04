"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell, LogOut, Settings, User as UserIcon } from "lucide-react";
import { Logo } from "./logo";
import { SidebarNav } from "./sidebar-nav";
import { SearchCommand } from "./search-command";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppNotification {
  id: string;
  title: string;
  body: string;
  href: string;
  time: string;
  actionable: boolean;
}

interface TopbarProps {
  contextLabel?: string;
  user: { name: string; email: string };
}

export function Topbar({ contextLabel, user }: TopbarProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notificationsSeen, setNotificationsSeen] = useState(true);
  const initials = user.name.slice(0, 2).toUpperCase();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/notifications")
      .then((res) => (res.ok ? res.json() : { notifications: [] }))
      .then((data: { notifications?: AppNotification[] }) => {
        if (cancelled) return;
        const list = data.notifications ?? [];
        setNotifications(list);
        setNotificationsSeen(!list.some((n) => n.actionable));
      })
      .catch(() => {
        if (!cancelled) setNotifications([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-md sm:px-6">
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation" />}>
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-sidebar p-0">
          <SheetHeader className="border-b border-border">
            <SheetTitle>
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {contextLabel && (
        <span className="hidden truncate text-sm font-medium text-muted-foreground sm:block">
          {contextLabel}
        </span>
      )}

      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="ml-auto flex w-full max-w-xs items-center gap-2 rounded-md border border-border bg-secondary/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:max-w-sm"
      >
        <Search className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Search StudyRex...</span>
        <span className="sm:hidden">Search...</span>
        <kbd className="ml-auto hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
          ⌘K
        </kbd>
      </button>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />

      <DropdownMenu onOpenChange={(open) => open && setNotificationsSeen(true)}>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="relative shrink-0" aria-label="Notifications" />
          }
        >
          <Bell className="size-4.5" />
          {!notificationsSeen && (
            <span
              className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary"
              aria-label="You have new notifications"
            />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <p className="px-2 py-3 text-xs text-muted-foreground">You&apos;re all caught up.</p>
            ) : (
              notifications.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className="flex-col items-start gap-0.5 whitespace-normal"
                  render={<Link href={n.href} />}
                >
                  <span className="text-sm font-medium text-foreground">{n.title}</span>
                  <span className="text-xs text-muted-foreground">{n.body}</span>
                  {n.time && <span className="text-[11px] text-muted-foreground/70">{n.time}</span>}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" className="shrink-0 gap-2 px-1.5" aria-label="Account menu" />}
        >
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/profile" />}>
              <UserIcon /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/settings" />}>
              <Settings /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut /> Log out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
