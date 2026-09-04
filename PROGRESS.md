# LexLearn — Build Progress

Status: **feature-complete**. `npm run build` and `npm run lint` both pass clean across all 67 routes. This file is a working log — update it if the app changes further.

## Stack

- **Next.js 16.3.0** (App Router, Turbopack) — this version has breaking changes vs. training-data Next.js (typed `LayoutProps<'/'>` / `PageProps<'/route'>` helpers, async `params`/`searchParams`, `RouteContext<'/route'>` for route handlers). Docs live in `node_modules/next/dist/docs/`.
- **TypeScript**, strict mode. **Tailwind CSS v4** (CSS-first `@theme`, no `tailwind.config`).
- **shadcn/ui** on **Base UI** (`@base-ui/react`), not Radix. Composition uses **`render={<Element />}`**, not `asChild`. Grep for `asChild` before reusing a Radix-era pattern from memory.
- **lucide-react**, **next-themes** (dark/light/system), **@anthropic-ai/sdk** (Claude, wired into `/api/chat`), **cmdk** (via shadcn `command`) for the ⌘K palette.
- Git: the repo root is the user's home directory (`C:\Users\vishn`), *not* this project folder — all git operations have been avoided here for the whole build.

## What's built

**Design system** — charcoal+amber dark-first theme (`.dark` default via `next-themes`), genuine light theme at `:root`, Geist Sans/Mono + Source Serif 4 (`font-heading`), custom scrollbar/noise/text-balance utilities, amber "L" logo mark + SVG favicon.

**Data layer — `lib/legal/`** — 16 subjects, 12 real landmark cases, 12 Acts/Codes (current BNS/BNSS/BSA 2023 vs. historical IPC/CrPC/Evidence Act, explicitly labeled), 14 quiz questions, 10 flashcards, dashboard/bookmarks/history mock data. Sourcing discipline: only well-documented cases/provisions included; BNS/BNSS/BSA section numbers flagged in-code as "widely reported — verify against Bare Act."

**Component library** — navigation (Navbar, Sidebar, Topbar, SearchCommand, Footer), chat (ChatMessage, ChatComposer, FollowUpSuggestions, MarkdownLite), legal (CitationCard, CaseCard, ActCard, SubjectCard, LegalDisclaimer), dashboard (StatCard), marketing (Hero, StatsBar, FeatureCard, PricingCard, ChatDemo, etc.), study-tools (QuizEngine, FlashcardDeck), auth (AuthShell, LoginForm, SignupForm), UI utilities (LoadingState, EmptyState).

**Marketing homepage** (`app/page.tsx`) — all 11 spec'd sections: Navbar → Hero → StatsBar → Features → CaseLibraryPreview → ChatDemo (static, chrome-accurate) → HowItWorks → StudyToolsPreview → PricingSection (₹0/₹199/₹349) → FinalCta → Footer.

**App shell** (`app/(app)/layout.tsx`) — Sidebar + Topbar wrapping every authenticated route below.

**Dashboard** (`/dashboard`) — greeting hero, stats, continue studying, recent conversations, recommended topics, weak areas, upcoming revision, recent landmark cases, prominent "Ask AI" CTA.

**AI Tutor** (`/tutor`) + **`POST /api/chat`** — the core feature, running on the **Claude API (Anthropic)**:
- 3-pane layout (Notebook sidebar, chat, context panel), collapsible to bottom sheets on mobile.
- Route handler (`app/api/chat/route.ts`) validates input, rate-limits per IP (`lib/ai/rate-limit.ts` — in-memory, documented as a placeholder for a shared store in real multi-instance prod), calls `client.messages.create` with a single **forced tool** (`tool_choice: {type: "tool", name: "provide_answer"}`, schema in `lib/ai/schema.ts`) so the model must return structured `{answer, subject, citations, cases, followUps, examTip}` via `tool_use.input` — no fragile JSON-in-prose parsing.
- **`thinking: {type: "disabled"}` is set deliberately.** On Sonnet 5, a forced `tool_choice` with adaptive thinking left on makes the model answer in plain prose and skip the tool (`stop_reason: end_turn`, no `tool_use` block) — verified live. With thinking off it returns a clean `tool_use` block every time, and faster (~19–24s vs ~37s).
- System prompt (`lib/ai/system-prompt.ts`) enforces: education-not-advice framing, exact-provision citation, explicit CURRENT/HISTORICAL labeling for the IPC→BNS/CrPC→BNSS/Evidence Act→BSA transition, a hard "never fabricate — say verification required" rule, and the "Want me to quiz you on this topic?" closer.
- Model defaults to `claude-sonnet-5`, overridable via `ANTHROPIC_MODEL`. Key is read server-only from `ANTHROPIC_API_KEY` (see `.env.example`) via `lib/ai/client.ts` — never import that module from a Client Component.
- Errors fail closed with a generic message (Anthropic API errors are logged with status via the SDK's typed `Anthropic.APIError`); retry re-sends the original question. The route also does **one automatic retry** when the forced tool call comes back unstructured, before surfacing an error.
- **Subject scope picker is year-aware.** `/tutor` (server) passes the user's `getSubjectsForTrack(lawLevel)` list into `TutorView` → `ChatComposer` + context panel, so the dropdown shows only the student's curriculum (full catalog when no track is set).
- **Answer action row** (`components/chat/message-actions.tsx`) under every completed answer: Copy (clipboard + "Copied" state, `execCommand` fallback), Share (Web Share API, falls back to clipboard + toast), Regenerate (re-runs the turn), thumbs up/down (per-device, `localStorage`). Reusable — new actions slot in as more `ActionButton`s. Suppressed on the static marketing demo via `hideActions`.
- General chat wording is jurisdiction-neutral: "Ask anything about **law**" (empty state, composer placeholder, dashboard). The system prompt still defaults answers to the Indian legal position and keeps every IPC→BNS accuracy rule.

**Notebook** (`/notebook`, formerly `/history`) — the user's saved AI Tutor conversations.
- Renamed from "History" across the product: sidebar nav (`NotebookPen` icon), page, tutor mobile drawer, dashboard link, privacy/settings copy. `/history` → `/notebook` is a permanent redirect in `next.config.ts` so old links keep working.
- Each conversation can be **renamed** (PATCH) or **deleted** (DELETE) from either the Notebook page or the tutor sidebar; deletes are optimistic with rollback on failure.
- Clicking a conversation opens `/tutor?conversation=<id>`, which loads its full message history so the student can **pick up where they left off**.

**Subjects** (`/subjects`, `/subjects/[slug]`) — searchable grid + detail pages (progress, related cases, quiz/flashcard counts, "Ask AI about this subject" deep link). ~90-subject registry in `lib/legal/subjects.ts` (Year 1-5 + CLAT + Judiciary), single source of truth. `/subjects` and the dashboard show only the user's track via `getSubjectsForTrack(user.lawLevel)`; year can be switched in Settings. `getSubjectsForUser()` unions the track with a user's `extraSubjects` (storage field added for the future "add subjects outside my year" feature — no migration needed later).

**Year-aware study tools** — `/study-tools/flashcards` and `/study-tools/quiz` now honor the `?subject=` deep link (previously ignored, so every subject's "Flashcards"/"Quiz" link opened the identical full deck) and scope the subject picker to the user's curriculum. `resolvePracticeSlug()` maps a curriculum slug (`constitutional-law-i`) to the rich subject that carries the curated content. Empty state stays honest when a subject has no cards/questions yet.

**Content import** — `lib/db/models/content-item.ts` + `lib/content/` + `CONTENT_IMPORT.md`. Normalized store for study material imported from documents: one row per flashcard/question/note/summary/case-brief/explainer, tagged `subjectSlug` (stable id) + topic + chapter + `source` + `type`. `importContentItems()` / `getContentItems()` / `getContentCounts()`. Nothing reads it yet — subjects with no imported rows show the existing empty state, by design.

**Case Library** (`/cases`, `/cases/[id]`) — search + subject/court filters, detail page with citation-verification disclaimer. All 12 statically generated.

**Acts & Sections** (`/acts`, `/acts/[id]`) — search + category/status filters, current↔historical cross-links, provisions/amendments detail. All 12 statically generated.

**Study Tools** (`/study-tools` hub + 7 tools) — AI Quiz (scored, subject-filterable, explanations + exam tips), Flashcards (flip deck, shuffle), Case Law Revision (flip deck over the case library), Section Finder (full-text search across every Act's provisions), CLAT Practice & Judiciary Practice (same vetted question bank, honestly framed as a starter set, not a full mock), Study Planner (revision queue, weak areas, least-studied subjects — local-only checkbox state).

**Bookmarks** (`/bookmarks`) — filter by type, delete with `AlertDialog` confirmation, empty states.

**Notebook** (`/notebook`) — rename (`Dialog`) and delete (`AlertDialog`) with confirmation, empty state, click-through to resume a conversation in the tutor. (Detailed under AI Tutor above.)

**Settings** (`/settings`) — theme (light/dark/system via `next-themes`, hydration-safe using `useSyncExternalStore`), exam target, notification toggles, privacy (honest copy: session-only storage, no backend yet), account fields, log out.

**Profile** (`/profile`) — read-only summary + stats, links to Settings for edits.

**Auth-lite** (`/login`, `/signup`) — real-feeling forms (client validation, loading state) that redirect to `/dashboard`; no backend, by design. `/signup?plan=pro|premium` shows the selected plan.

**Global search** (⌘K) — wired into `Topbar`, indexes subjects/cases/acts/recent conversations.

**Notifications** (`Topbar` bell + `GET /api/notifications` + `lib/notifications.ts`) — derived entirely from the signed-in user's real activity (last conversation to resume, streak state, an untouched onboarding subject, a landmark case to revisit). Each item is a real in-app link; the unread dot clears on open. Was hardcoded demo data with no click targets. Fixed a latent `Base UI: MenuGroupContext is missing` crash — `DropdownMenuLabel` (renders `Menu.GroupLabel`) must sit inside a `DropdownMenuGroup`; both the notification and account menus threw on open.

**Auth redirects** — `proxy.ts` sends unauthenticated users to `/login?next=<path>`; `LoginForm` now reads `next` (validated same-origin) and returns there after sign-in instead of always `/dashboard`.

## Known gaps / honesty notes

- **Backend is live** (MongoDB + JWT-cookie auth): users, onboarding, conversations/notebook, profile, notifications, and the year selection all persist. Still session-local / not yet persisted: **bookmarks**, **study-planner checkboxes**, and the notification "settings" toggles (`components/settings/settings-view.tsx`), plus the per-message thumbs rating (`localStorage`, per device).
- **BNS/BNSS/BSA section numbers** are widely-reported mappings, not verified against the Bare Act — flagged in-code and in the Acts & Sections / Section Finder UI.
- **Imported content store** (`ContentItem`) exists and is documented (`CONTENT_IMPORT.md`) but nothing reads it yet — study-tool views still use the curated `lib/legal/` seed data. Wiring the two together behind `getContentItems` is the next step once real documents land.
- Flashcards/quiz curated banks only cover ~6 of the ~90 subjects — most subjects correctly show an empty state until content is imported.
- Voice input and file attachment in the chat composer are disabled with a "coming soon" tooltip rather than faked.
- CLAT Practice / Judiciary Practice reuse the same 14-question bank as AI Quiz — explicitly labeled a starter set, not a full mock test, to avoid implying more content than exists.
- Rate limiting on `/api/chat` is in-memory and per-instance — fine for a single dev/demo server, not for multi-instance production.

## QA performed

- `npm run build` — clean (TypeScript + all 67 routes, static/SSG where applicable). `/tutor`, `/study-tools/flashcards`, `/study-tools/quiz` are now dynamic (`ƒ`) — they read the user + `searchParams` for year-aware scoping.
- `npm run lint` — clean (0 errors, 0 warnings). `components/admin/admin-dashboard.tsx` was re-flagged by `react-hooks/set-state-in-effect` (a bare `async` loader called from a mount effect); reworked its `loadData` into a promise-chain form so setState only runs in `.then`/`.finally` callbacks.
- Runtime smoke test of all top-level routes (200s) plus a 404 check; `/api/chat` validation paths (empty question, malformed JSON, oversized question) all return the right generic errors.
- `ANTHROPIC_API_KEY` is read only from `lib/ai/client.ts` (server-only) — keep it out of Client Components so it never lands in `.next/static`.
- **`/api/chat` live-tested end-to-end against the real Claude API** (`claude-sonnet-5`): single legal question and a multi-turn follow-up both returned a well-formed `provide_answer` tool call — correct subject slug, CURRENT/HISTORICAL citation split (BNS `historical:false` vs IPC `historical:true`), real landmark cases (Kesavananda Bharati, Reg. v. Govinda, …), 3 follow-ups, exam tip, and the required closing line.
- **Notebook data path live-tested** against real MongoDB: signup → `/api/chat` persists a conversation → `GET /api/conversations` lists it → `GET /api/conversations/:id` returns full messages (revisit) → `DELETE /api/conversations/:id` removes it → second DELETE returns 404. Test user cleaned up afterward.
- `/history` → `/notebook` redirect verified (308), and `/notebook` is gated by `proxy.ts` (307 → `/login?next=/notebook` when unauthenticated).
- **Round 2 (this session) — live-verified against real API + MongoDB + headless Chromium:**
  - `/api/chat` single-turn, multi-turn context (model correctly reads chat history), and persistence path (2 turns → conversation with 4 alternating messages) all pass after the route refactor.
  - Full new-user flow: signup → onboarding (`1st Year Law`) → dashboard shows only Year-1 subjects → `/study-tools/flashcards?subject=contract-law` opens the contract deck, `?subject=constitutional-law` opens the constitution deck, `?subject=tort-law` the tort deck (previously all three showed the identical full deck).
  - Login `?next` redirect: unauth `/notebook` → `/login?next=%2Fnotebook` → sign in → lands on `/notebook`. Refresh keeps the session.
  - Answer action row renders on every assistant message; Copy flips to "Copied". Notification dropdown opens without the `MenuGroupContext` crash and every item is a real link (`/tutor?conversation=…`, `/subjects/…`, `/cases/…`). Account menu also fixed.
  - QA users (`studyrex-qa-*`, `login-qa-*`) and their conversations deleted afterward.

## Round 3 — BBA LLB programme + content pipeline wiring

- **BBA LLB (Hons.) added as a new programme alongside** the existing LLB / CLAT / Judiciary tracks (no existing subjects overwritten). `lib/legal/bba-llb.ts` is the single source of truth: 46 subjects, `{ slug, name, year, semester, category, active, linkedSubjectSlug }`, slugs namespaced `bballb-` so they never collide. Year distribution 10/10/10/10/6 per the supplied map. **"Comprehensive Viva" deliberately excluded.** Spread into the one `subjects` array in `lib/legal/subjects.ts`.
- `LAW_LEVELS` gains `BBA LLB Year 1-5`. `lawLevelToYear()` / `LAW_LEVEL_TO_YEAR` map both "1st Year Law" and "BBA LLB Year 1" → year 1, so year-aware code treats old and new values identically and **existing users are untouched** (`/api/onboarding` + `/api/profile` still validate against `LAW_LEVELS`). `LAW_LEVEL_GROUPS` groups the ~12 tracks for the onboarding + settings pickers.
- **Content pipeline is now wired to the views.** `lib/content/decks.ts` builds one flashcard/quiz deck per *exact* curriculum slug, merging (in order) bundled content → DB `ContentItem` rows → legacy `lib/legal` seed, with a linked-practice-slug fallback only when a subject has none of its own. This is the fix for "sibling subjects show identical flashcards": the moment `constitutional-law-ii` gets its own imported rows it stops inheriting `constitutional-law-i`'s. `getContentItems` is exact-slug-first; `importContentItems` stores the exact slug (no more collapsing to the practice slug).
- **First real document imported.** `lib/content/bundled/legal-method.ts` — the 28-card "Legal Methods & Legal Reasoning" flashcard deck from the requirements doc, as structured `ContentItemInput[]` (topic + 4 chapters + source metadata), keyed to `legal-methods`; `bballb-legal-method` surfaces it via `linkedSubjectSlug`. Renders with zero DB dependency.
- `/study-tools/flashcards`, `/study-tools/quiz`, `/study-tools/clat-practice`, `/study-tools/judiciary-practice` and `/subjects/[slug]` now build decks server-side from `lib/content/decks.ts`; the views (`flashcards-view`, `quiz-engine`) are presentational and take `decks` as a prop.
- **`MessageActions`** gains a reusable `onSaveToNotebook` / `savedToNotebook` slot (wired in the tutor; answers already auto-persist, so it confirms + points at the Notebook rather than faking a second save).
- **Wording** — marketing hero, `how-it-works`, `features-section`, root + home metadata, about and signup de-India-centred ("Master the law", "Ask any law question", "study law"); jurisdiction-specific copy (case library, BNS rules, system-prompt Indian-law default) left intact. **Stale vendor copy fixed:** privacy + terms said answers go to "Google's Gemini" — corrected to Anthropic's Claude (matches the actual `@anthropic-ai/sdk` integration); about page "Gemini-powered" → "AI Tutor".
- System prompt `lawLevelGuidance` now has a BBA LLB branch (year-appropriate depth + law/business boundary note).
- `SubjectCard` shows a `Sem N · <category>` badge when the structured fields are present.
- **QA:** `npm run build` clean (67 routes), `npm run lint` clean. Standalone check of the BBA LLB map (46 subjects, 0 malformed, 0 duplicate slugs, 0 "Viva", year split 10/10/10/10/6) and the Legal Method deck (28 flashcards, front+back, distinct from the Constitutional Law deck). **Not run this session:** live `/api/chat` (no key available in this environment) and a full browser walk of the new decks.
