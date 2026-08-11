# LexLearn — Build Progress

Status: **feature-complete**. `npm run build` and `npm run lint` both pass clean across all 63 routes. This file is a working log — update it if the app changes further.

## Stack

- **Next.js 16.3.0** (App Router, Turbopack) — this version has breaking changes vs. training-data Next.js (typed `LayoutProps<'/'>` / `PageProps<'/route'>` helpers, async `params`/`searchParams`, `RouteContext<'/route'>` for route handlers). Docs live in `node_modules/next/dist/docs/`.
- **TypeScript**, strict mode. **Tailwind CSS v4** (CSS-first `@theme`, no `tailwind.config`).
- **shadcn/ui** on **Base UI** (`@base-ui/react`), not Radix. Composition uses **`render={<Element />}`**, not `asChild`. Grep for `asChild` before reusing a Radix-era pattern from memory.
- **lucide-react**, **next-themes** (dark/light/system), **@google/genai** (Gemini, wired into `/api/chat`), **cmdk** (via shadcn `command`) for the ⌘K palette.
- Git: the repo root is the user's home directory (`C:\Users\vishn`), *not* this project folder — all git operations have been avoided here for the whole build.

## What's built

**Design system** — charcoal+amber dark-first theme (`.dark` default via `next-themes`), genuine light theme at `:root`, Geist Sans/Mono + Source Serif 4 (`font-heading`), custom scrollbar/noise/text-balance utilities, amber "L" logo mark + SVG favicon.

**Data layer — `lib/legal/`** — 16 subjects, 12 real landmark cases, 12 Acts/Codes (current BNS/BNSS/BSA 2023 vs. historical IPC/CrPC/Evidence Act, explicitly labeled), 14 quiz questions, 10 flashcards, dashboard/bookmarks/history mock data. Sourcing discipline: only well-documented cases/provisions included; BNS/BNSS/BSA section numbers flagged in-code as "widely reported — verify against Bare Act."

**Component library** — navigation (Navbar, Sidebar, Topbar, SearchCommand, Footer), chat (ChatMessage, ChatComposer, FollowUpSuggestions, MarkdownLite), legal (CitationCard, CaseCard, ActCard, SubjectCard, LegalDisclaimer), dashboard (StatCard), marketing (Hero, StatsBar, FeatureCard, PricingCard, ChatDemo, etc.), study-tools (QuizEngine, FlashcardDeck), auth (AuthShell, LoginForm, SignupForm), UI utilities (LoadingState, EmptyState).

**Marketing homepage** (`app/page.tsx`) — all 11 spec'd sections: Navbar → Hero → StatsBar → Features → CaseLibraryPreview → ChatDemo (static, chrome-accurate) → HowItWorks → StudyToolsPreview → PricingSection (₹0/₹199/₹349) → FinalCta → Footer.

**App shell** (`app/(app)/layout.tsx`) — Sidebar + Topbar wrapping every authenticated route below.

**Dashboard** (`/dashboard`) — greeting hero, stats, continue studying, recent conversations, recommended topics, weak areas, upcoming revision, recent landmark cases, prominent "Ask AI" CTA.

**AI Tutor** (`/tutor`) + **`POST /api/chat`** — the core feature, now running on **Gemini**:
- 3-pane layout (history sidebar, chat, context panel), collapsible to bottom sheets on mobile.
- Route handler (`app/api/chat/route.ts`) validates input, rate-limits per IP (`lib/gemini/rate-limit.ts` — in-memory, documented as a placeholder for a shared store in real multi-instance prod), calls Gemini via `responseMimeType: "application/json"` + a **forced `responseSchema`** (`lib/gemini/schema.ts`) so the model must return structured `{answer, subject, citations, cases, followUps, examTip}` — no fragile JSON-in-prose parsing.
- System prompt (`lib/gemini/system-prompt.ts`) enforces: education-not-advice framing, exact-provision citation, explicit CURRENT/HISTORICAL labeling for the IPC→BNS/CrPC→BNSS/Evidence Act→BSA transition, a hard "never fabricate — say verification required" rule, and the "Want me to quiz you on this topic?" closer.
- Model defaults to `gemini-flash-latest`, overridable via `GEMINI_MODEL`. Key is read server-only from `GEMINI_API_KEY` (see `.env.example`) — verified absent from client bundles (`grep .next/static` after build).
- **Model-name gotcha discovered live**: this account's API key returns `404 ... no longer available to new users` for pinned model IDs like `gemini-2.5-flash`, `gemini-2.5-pro`, and `gemini-2.0-flash` — only rolling aliases (`gemini-flash-latest`) worked; `gemini-pro-latest` hit a `429` quota error on this key's plan. Verified by testing 5 model names directly against the live API before picking a default — don't assume a specific pinned Gemini model ID is available without checking.
- Errors fail closed with a generic message; retry re-sends the original question.
- **Live-tested end-to-end** against the real Gemini API (not just build-verified): a real question returned correctly structured JSON with accurate CURRENT/HISTORICAL citation splits (BNS vs. IPC), real case names, 3 follow-ups, an exam tip, and the required closing line.

**Subjects** (`/subjects`, `/subjects/[slug]`) — searchable grid + detail pages (progress, related cases, quiz/flashcard counts, "Ask AI about this subject" deep link). All 16 statically generated.

**Case Library** (`/cases`, `/cases/[id]`) — search + subject/court filters, detail page with citation-verification disclaimer. All 12 statically generated.

**Acts & Sections** (`/acts`, `/acts/[id]`) — search + category/status filters, current↔historical cross-links, provisions/amendments detail. All 12 statically generated.

**Study Tools** (`/study-tools` hub + 7 tools) — AI Quiz (scored, subject-filterable, explanations + exam tips), Flashcards (flip deck, shuffle), Case Law Revision (flip deck over the case library), Section Finder (full-text search across every Act's provisions), CLAT Practice & Judiciary Practice (same vetted question bank, honestly framed as a starter set, not a full mock), Study Planner (revision queue, weak areas, least-studied subjects — local-only checkbox state).

**Bookmarks** (`/bookmarks`) — filter by type, delete with `AlertDialog` confirmation, empty states.

**History** (`/history`) — rename (`Dialog`) and delete (`AlertDialog`) with confirmation, empty state.

**Settings** (`/settings`) — theme (light/dark/system via `next-themes`, hydration-safe using `useSyncExternalStore`), exam target, notification toggles, privacy (honest copy: session-only storage, no backend yet), account fields, log out.

**Profile** (`/profile`) — read-only summary + stats, links to Settings for edits.

**Auth-lite** (`/login`, `/signup`) — real-feeling forms (client validation, loading state) that redirect to `/dashboard`; no backend, by design. `/signup?plan=pro|premium` shows the selected plan.

**Global search** (⌘K) — wired into `Topbar`, indexes subjects/cases/acts/recent conversations.

## Known gaps / honesty notes

- **No backend/auth/persistence** — everything reads from static `lib/legal` data or session-local React state. Settings/bookmarks/history changes reset on reload.
- **BNS/BNSS/BSA section numbers** are widely-reported mappings, not verified against the Bare Act — flagged in-code and in the Acts & Sections / Section Finder UI.
- Voice input and file attachment in the chat composer are disabled with a "coming soon" tooltip rather than faked.
- CLAT Practice / Judiciary Practice reuse the same 14-question bank as AI Quiz — explicitly labeled a starter set, not a full mock test, to avoid implying more content than exists.
- Rate limiting on `/api/chat` is in-memory and per-instance — fine for a single dev/demo server, not for multi-instance production.

## QA performed

- `npm run build` — clean (TypeScript + all 63 routes, static/SSG where applicable).
- `npm run lint` — clean (0 errors, 0 warnings), including fixes for the newer `react-hooks` React Compiler rules (`static-components`, `set-state-in-effect`) that flagged the icon-by-name pattern and URL-param-sync effects.
- Runtime smoke test of all top-level routes (200s) plus a 404 check; `/api/chat` validation paths (empty question, malformed JSON, oversized question) all return the right generic errors.
- Confirmed `GEMINI_API_KEY` never appears in `.next/static` (client bundles) — only in server chunks.
- `/api/chat` live-tested against the real Gemini API with a real key (see AI Tutor section above) — this is the one part of the app verified against a live upstream service, not just mocked/static data.
