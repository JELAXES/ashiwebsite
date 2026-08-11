"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Landmark, BookText, BookMarked, MessageSquare, Scale } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { subjects } from "@/lib/legal/subjects";
import { landmarkCases } from "@/lib/legal/cases";
import { legalActs } from "@/lib/legal/acts";
import { recentConversations } from "@/lib/legal/mock-data";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search LexLearn"
      description="Search across acts, sections, cases, subjects, and conversations"
    >
      <CommandInput placeholder="Search acts, sections, cases, subjects, conversations..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Subjects">
          {subjects.slice(0, 6).map((s) => (
            <CommandItem key={s.slug} value={`subject ${s.name}`} onSelect={() => go(`/subjects/${s.slug}`)}>
              <BookMarked className="text-muted-foreground" />
              {s.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Case Library">
          {landmarkCases.slice(0, 6).map((c) => (
            <CommandItem key={c.id} value={`case ${c.name}`} onSelect={() => go(`/cases/${c.id}`)}>
              <Landmark className="text-muted-foreground" />
              {c.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Acts & Sections">
          {legalActs.slice(0, 6).map((a) => (
            <CommandItem key={a.id} value={`act ${a.name}`} onSelect={() => go(`/acts/${a.id}`)}>
              {a.category === "Constitution" ? (
                <Scale className="text-muted-foreground" />
              ) : (
                <BookText className="text-muted-foreground" />
              )}
              {a.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Recent conversations">
          {recentConversations.slice(0, 4).map((c) => (
            <CommandItem key={c.id} value={`conversation ${c.title}`} onSelect={() => go(`/tutor?conversation=${c.id}`)}>
              <MessageSquare className="text-muted-foreground" />
              {c.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
