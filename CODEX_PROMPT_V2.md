# Fluentia v2 — Codex Build Prompt

## Context: What Already Exists

The following is fully implemented and working — **do not rewrite these unless instructed**:
- All 8 scenario conversations (`src/lib/constants.ts`)
- Assessment flow (`src/app/assessment/page.tsx`)
- Mode selection (`src/app/mode/page.tsx`)
- Scenario grid (`src/app/scenarios/page.tsx`)
- Chat screen (`src/app/chat/page.tsx`)
- Feedback screen (`src/app/feedback/page.tsx`)
- Simulated AI engine (`src/lib/ai/simulated.ts`)
- Moderation + escalation (`src/lib/moderation/`)
- Design system (`src/app/globals.css`) — dark theme, teal/blue accent
- All shared components: `Button`, `GlassCard`, `ScoreRing`, `ConfidenceMeter`, `SafetyBanner`, etc.
- `AppStateProvider` with localStorage persistence
- API routes: `/api/conversation`, `/api/assessment`, `/api/moderation`

## What Is Missing / Broken (Your Task)

The app currently has **no navigation, no logo, no landing page, no dashboard, and no clear workflow**. A first-time user landing on `/home` sees a single card with "Ready to Speak?" and no context. There is no persistent navigation, no header, no onboarding flow, no progress tracking, and no way to return to a previous state. This must be fully fixed and new features added.

---

## Phase 1: Global Shell (PRIORITY — do this first)

### 1.1 Header / Navigation Bar
Create `src/components/layout/Header.tsx` — a persistent top navigation bar rendered in `src/app/layout.tsx` that appears on every page **except** the splash (`/`) and full-screen chat (`/chat`).

**Specs**:
- Height: 64px, `position: sticky; top: 0; z-index: 50`
- Background: `rgba(15, 23, 42, 0.85)` with `backdrop-filter: blur(12px)` and a 1px bottom border using `var(--border)`
- **Left side**: Fluentia logo — the word "Fluentia" in `font-bold text-xl` with `.gradient-text` applied (teal→blue gradient). No image needed — wordmark only.
- **Right side (desktop)**: Nav links — "Home", "Dashboard", "Practice" (links to `/home`, `/dashboard`, `/scenarios`)
- **Right side (mobile)**: Hamburger menu (Lucide `Menu` icon) opens a slide-down drawer with the same links
- Active link is highlighted with `color: var(--accent-primary)` and a 2px bottom border
- Use Next.js `usePathname()` to detect active route

### 1.2 Footer
Create `src/components/layout/Footer.tsx` — minimal footer:
- Dark background matching body
- Center: "© 2025 Fluentia — AI Speaking Coach"
- Small links: "About", "Privacy", "Contact" (non-functional, just `href="#"`)
- Only show on `/` (landing), `/home`, `/dashboard`

### 1.3 Update Root Layout
In `src/app/layout.tsx`:
- Import and render `<Header />` above `{children}`
- Import and render `<Footer />` below `{children}`
- Use a layout wrapper: `<div className="flex flex-col min-h-screen">` with `<main className="flex-1">`
- Add `padding-top: 64px` to body to offset the sticky header (add a CSS var `--header-height: 64px`)

---

## Phase 2: Marketing Landing Page (`/`)

**IMPORTANT**: Currently `/` is a 2.5-second auto-redirect splash screen. Replace it entirely with a full marketing landing page. Remove the auto-redirect. The splash animation is removed.

Create `src/app/page.tsx` as a beautiful, full marketing landing page with these sections:

### Section 1: Hero
- Full-screen height (`min-h-screen`), `mesh-gradient` background, `AmbientBackground` Three.js particles
- **Headline**: "Speak English with Real Confidence" — large (56–64px desktop, 36px mobile), bold, `.gradient-text`
- **Subheadline**: "Fluentia is an AI speaking coach that listens, corrects, and guides you — one real conversation at a time."
- **Two CTAs**:
  - Primary (teal): "Start Practicing Free" → `/assessment` (if no level set) or `/dashboard` (if returning user)
  - Secondary (ghost): "See How It Works" → smooth scroll to the How It Works section
- Below the hero headline, show 3 small stat pills in a row: "8 Real Scenarios", "Instant AI Feedback", "Voice + Text Support"

### Section 2: Problem Statement
- Dark section with `var(--surface)` background
- Headline: "You studied English for years. But you still freeze when it's time to speak."
- 3 pain point cards (GlassCard layout):
  - 😰 "Grammar apps taught rules. Nobody taught you how to *sound* confident."
  - 🔇 "You understand everything. Speaking is where you go blank."
  - 📖 "Duolingo gave you streaks. It never gave you a real conversation."

### Section 3: How It Works
- Light-dark alternating layout (3 steps)
- Step 1: "Tell us your level" — take the 5-min assessment
- Step 2: "Pick a real scenario" — job interview, ordering food, meeting friends
- Step 3: "Practice, get coached, improve" — AI gives feedback on every response
- Each step has a Lucide icon, a step number badge, and a short description

### Section 4: Feature Highlights
- 4 feature cards in a 2×2 grid (stack to 1 col on mobile):
  - 🎙️ "Voice + Text Input" — speak or type, both work
  - 🧠 "Turn-by-turn AI Coaching" — instant tips after each message
  - 📊 "Your Progress Dashboard" — track fluency, errors, and growth
  - 🛡️ "Safe for All Ages" — content moderation built-in

### Section 5: CTA Banner
- Full-width teal gradient banner
- Headline: "Ready to stop hesitating and start speaking?"
- CTA button: "Start for Free" → `/assessment`

---

## Phase 3: User Dashboard (`/dashboard`)

Create `src/app/dashboard/page.tsx`.

If no assessment completed → redirect to `/assessment` with a message: "Complete your assessment first to see your dashboard."

### Dashboard Layout
Sticky sidebar on desktop (240px), full-width stacked on mobile.

**Sidebar** (`src/components/layout/Sidebar.tsx`):
- Fluentia wordmark at top
- Nav items with Lucide icons:
  - `Home` → `/home`
  - `LayoutDashboard` → `/dashboard` (active)
  - `MessageSquare` → `/scenarios` (labeled "Practice")
  - `BarChart2` → `/dashboard#progress` (labeled "Progress")
  - `Settings` → `/settings` (placeholder, not implemented)
- At bottom: "Reset Demo" button (red text, no background)

**Main Content Area** (4 sections):

#### Section A: Welcome Header
- "Welcome back, Learner" (H1)
- Show `LevelBadge` with the user's current level
- Show: "Last practiced: [relative time from localStorage]" or "No sessions yet"
- Primary CTA: "Start New Session" → `/mode`

#### Section B: Progress Stats (3 stat cards in a row)
Pull all data from `AppStateProvider` / localStorage:
- **Sessions Completed**: count of completed conversations stored in `fluentia_app_state`
- **Average Fluency Score**: mean of all `lastFeedback.fluencyScore` values stored
- **Scenarios Tried**: count of unique `selectedScenario` IDs from session history

Each stat card: GlassCard, large number (gradient text), label below, small trend arrow icon.

#### Section C: Recent Sessions List
Show up to 5 recent sessions from localStorage history. Each row:
- Scenario icon + name
- Mode badge (Formal/Casual)
- Fluency score out of 10
- Date/time (relative: "2 hours ago")
- "View Feedback" button → restores the feedback from that session

If no sessions: empty state illustration (just a Lucide `MessageSquare` icon at 48px + "No sessions yet. Start your first practice.")

#### Section D: Suggested Next Scenarios
Based on the user's level (read from state):
- **Beginner**: suggest "Daily Communication", "Friends Chat", "Ordering Food"
- **Intermediate**: suggest "Job Interview", "Self-Introduction", "Asking for Help"
- **Advanced**: suggest "Presentation Practice", "Classroom Answer", "Job Interview (Advanced)"
Show as 3 mini `ScenarioCard` components. Clicking one goes directly to `/chat?scenario=<id>`.

---

## Phase 4: Onboarding Flow

### 4.1 First-Time User Flow
When a brand new user (no `fluentia_app_state` in localStorage) arrives at `/` or `/home`:
- Show a dismissible **onboarding banner** at the top of the Home page (NOT the landing page):
  - "👋 New here? Take a quick 2-minute assessment to get your personalized practice plan."
  - CTA: "Take Assessment" button → `/assessment`
  - Dismiss button (X icon)

### 4.2 Post-Assessment Onboarding Card
After assessment completes, before navigating to `/mode`:
- Show a **"Your Learning Plan" modal** (not a new page — overlay on assessment page):
  - Show their assigned level with LevelBadge
  - 3 bullets explaining what to expect: "Scenario-based conversation practice", "AI feedback on every response", "Track your progress over time"
  - "Let's Begin" CTA → `/mode`

### 4.3 In-App Step Guidance
On the Mode, Scenarios, and Chat pages, add a **persistent breadcrumb trail** at the top:
```
Assessment ✓ → Choose Mode ✓ → Pick Scenario → Chat → Feedback
```
Use a horizontal `ProgressStepper`-style component showing where the user is in the flow. Already completed steps show a checkmark. Current step is highlighted in teal.

---

## Phase 5: Real Voice Input (Whisper API)

### 5.1 Update `VoiceSimButton`
Replace the "insert pre-written text" logic with real audio recording. The component already exists at `src/components/chat/VoiceSimButton.tsx`.

**New behavior**:
1. **First click**: Start recording via browser `MediaRecorder` API. Button turns red with a pulsing animation. Show a "Recording… tap to stop" label.
2. **Second click (or after 30s timeout)**: Stop recording. Show "Analyzing…" spinner.
3. **Behind the scenes**: Convert audio blob to `FormData`, POST to `/api/transcribe`.
4. **On success**: Inject the returned transcript text into the chat input field. Show a Sonner toast: "Voice captured ✓"
5. **On error or if `NEXT_PUBLIC_AI_MODE=simulated`**: Fall back to the pre-written voice sample (current behavior). Show toast: "Voice simulation used."

### 5.2 Create `/api/transcribe` Route
`src/app/api/transcribe/route.ts`:
```typescript
// POST handler
// 1. Accept multipart/form-data with an audio blob
// 2. If OPENAI_API_KEY is set:
//    - POST to OpenAI Whisper API (model: whisper-1)
//    - Return { transcript: string }
// 3. If OPENAI_API_KEY is not set:
//    - Return { transcript: null, fallback: true }
//    - Client uses the pre-written voice sample
```

### 5.3 Add `OPENAI_API_KEY` to `.env.local`
```env
OPENAI_API_KEY=        # Leave blank for simulated fallback
```

---

## Phase 6: Turn-by-Turn Inline Coaching

### 6.1 Add `quickTip` to FeedbackPayload
In `src/types/index.ts`, add `quickTip: string` to `FeedbackPayload`.

In `src/lib/ai/simulated.ts`, generate `quickTip` as a single concise sentence summarizing the most important coaching point from this turn. Example: *"Tip: Replace 'I want' with 'I would like' for a more polished tone."*

### 6.2 Show Inline Coaching Bubble in Chat
In `src/app/chat/page.tsx`, after each AI response is received:
- Render a **coaching tip card** between the AI message bubble and the next input:
  - Small lightbulb icon (Lucide `Lightbulb`, 14px, teal)
  - The `quickTip` text in small font (`text-sm`, `text-text-secondary`)
  - GlassCard with teal left-border accent: `border-l-2 border-accent-primary`
  - Dismissible with an X button
  - Framer Motion: slide in from left, 0.3s ease

---

## Phase 7: Session History Persistence

### 7.1 Update AppState to Track Sessions
In `src/components/providers/AppStateProvider.tsx`, add a `sessions` array to the state:
```typescript
sessions: SessionRecord[];
```

Where `SessionRecord` is:
```typescript
interface SessionRecord {
  id: string;               // uuid or timestamp
  scenarioId: string;
  mode: Mode;
  level: Level;
  fluencyScore: number;
  feedback: FeedbackPayload;
  messages: Message[];
  completedAt: string;      // ISO date string
}
```

### 7.2 Save Session on Feedback View
In `src/app/feedback/page.tsx`, when the page loads with valid feedback data, call `addSession(sessionRecord)` to save it to `AppStateProvider`.

### 7.3 Compute Dashboard Stats from Sessions
The dashboard stats (Sessions Completed, Average Fluency, Scenarios Tried) should be derived from `state.sessions`.

---

## Phase 8: Difficulty Progression

In `src/lib/constants.ts`, add a second set of opening prompts for each scenario at a higher difficulty:

```typescript
openingPromptAdvanced: string;  // add to each ScenarioWithIcon
```

In the chat page, if `state.sessions` already contains a completed session for this scenario, use `openingPromptAdvanced` instead of `openingPrompt`. Show a small badge: "Advanced Mode 🔥" in the ScenarioHeader.

---

## Phase 9: Cultural Context Layer

In `src/lib/constants.ts`, add a `culturalNote` field to each scenario:
```typescript
culturalNote: string;
```

Example notes:
- Job Interview: "In most professional English interviews, saying 'I am passionate about' is overused. Try 'I find this work genuinely engaging.'"
- Ordering Food: "In the UK and US, 'Could I have...' is preferred over 'Give me...' — it sounds more natural and polite."
- Friends Chat: "English native speakers often use softeners like 'kind of', 'sort of', 'I guess' to sound relaxed and informal."

In the Chat screen, show this as a **dismissible tip card** above the first AI message:
- Amber/yellow left-border accent (use `--warning` color)
- Globe icon (Lucide `Globe`, 14px)
- The cultural note text
- "Got it" dismiss button

---

## File Changes Summary

### New Files to Create:
- `src/app/page.tsx` — REPLACE existing splash with full landing page
- `src/app/dashboard/page.tsx` — new dashboard
- `src/app/api/transcribe/route.ts` — Whisper transcription
- `src/components/layout/Header.tsx` — sticky nav with logo + links
- `src/components/layout/Sidebar.tsx` — dashboard sidebar
- `src/components/layout/Footer.tsx` — minimal footer
- `src/components/layout/Breadcrumb.tsx` — flow progress indicator
- `src/components/dashboard/StatCard.tsx` — metric display card
- `src/components/dashboard/SessionRow.tsx` — recent session list item
- `src/components/dashboard/SuggestedScenarios.tsx`
- `src/components/chat/InlineCoachingTip.tsx` — turn-by-turn tip bubble
- `src/components/chat/CulturalNote.tsx` — cultural context card
- `src/components/onboarding/OnboardingBanner.tsx`
- `src/components/onboarding/LearningPlanModal.tsx`

### Files to Modify:
- `src/app/layout.tsx` — add Header, Footer, layout wrapper
- `src/app/home/page.tsx` — add OnboardingBanner for new users
- `src/app/assessment/page.tsx` — add LearningPlanModal after result
- `src/app/mode/page.tsx` — add Breadcrumb
- `src/app/scenarios/page.tsx` — add Breadcrumb
- `src/app/chat/page.tsx` — add Breadcrumb, InlineCoachingTip, CulturalNote, real voice input
- `src/app/feedback/page.tsx` — add session saving on load
- `src/components/chat/VoiceSimButton.tsx` — real recording logic
- `src/components/providers/AppStateProvider.tsx` — add sessions array, addSession action
- `src/lib/constants.ts` — add culturalNote, openingPromptAdvanced to scenarios
- `src/lib/ai/simulated.ts` — add quickTip to FeedbackPayload generation
- `src/types/index.ts` — add SessionRecord, quickTip to FeedbackPayload
- `.env.local` — add OPENAI_API_KEY blank

---

## Design Rules (Do Not Break)

1. **Dark theme only** — no light backgrounds anywhere, ever
2. **Header** must use the wordmark "Fluentia" in gradient text — not an image
3. **Landing page** must feel premium — use the Three.js AmbientBackground, large headlines, smooth Framer Motion entrance animations
4. **Dashboard** must feel clean and data-forward — not gamified, no streaks, no points
5. **All new interactive elements** must have unique `id` attributes
6. **All new pages** must have proper Next.js `metadata` exports
7. **Mobile-first** — test all new pages at 375px width
8. **The app must still fully work offline** — no Supabase or OpenAI key required; all features gracefully degrade to simulated mode

---

## Verification

After implementation:
```bash
npm run build     # Must pass with 0 TypeScript errors
npm run test      # Existing 12 Vitest tests must still pass
```

Manual checks:
1. Visit `/` — full landing page loads, no auto-redirect
2. Header appears on all pages with Fluentia logo and nav links
3. Header does NOT appear on `/chat` (full-screen conversation mode)
4. Dashboard at `/dashboard` shows stats, recent sessions, suggested scenarios
5. Onboarding banner shows for first-time users on `/home`
6. Breadcrumb shows correctly on Mode → Scenarios → Chat → Feedback
7. Voice button records audio (or falls back gracefully if no API key)
8. After each chat turn, an inline coaching tip appears
9. Cultural note shows at top of first chat
10. Session history saves after feedback is viewed and shows on dashboard
