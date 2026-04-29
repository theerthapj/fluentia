# Codex Task: Build Fluentia — AI English Speaking Coach (Web App)

## Context & Current State

You are building **Fluentia**, a premium AI-powered English speaking coach web app. The repository currently contains **only documentation and a dead Vite scaffold — zero source code exists**. You are building everything from scratch.

### What exists in the repo:
- 9 product documents (`00_Project_Overview.md` through `08_Architecture_Testing_Deployment.md`) — these are your **source of truth** for product requirements
- `PROTOTYPE_ARCHITECTURE.md` and `README.md` — reference older plans, ignore their file paths
- Dead config files from a never-completed Vite setup (to be deleted)
- `.git/` and `.gitignore` (preserve these)

### What does NOT exist (you must build all of this):
- No `src/` directory — no React components, no pages, no styles
- No `shared/` directory — no moderation logic, no AI contracts
- No AI integration (simulated or real)
- No moderation/safety engine
- No UI components or design system
- No working app of any kind

---

## Your Mission

Build a **fully working, production-grade Next.js web application** from scratch. The app must be a premium dark-theme AI speaking coach with 8 screens, simulated AI feedback, content moderation, and voice input simulation.

---

## Tech Stack (MANDATORY — match exactly)

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js (App Router) | 16.x | Framework |
| TypeScript | ^5 | Language |
| React | 19.x | UI Library |
| Tailwind CSS 4 | ^4 | Styling (CSS-first, `@import "tailwindcss"`) |
| `@tailwindcss/postcss` | ^4 | PostCSS plugin |
| Framer Motion | ^12 | Animations |
| `@studio-freight/react-lenis` + `lenis` | ^0.0.47 / ^1.3 | Smooth scrolling |
| Three.js + `@react-three/fiber` + `@react-three/drei` | ^0.183 / ^9 / ^10 | 3D ambient background |
| Lucide React | ^0.563 | Icons |
| Sonner | ^2 | Toast notifications |
| Zod | ^4 | Runtime validation |
| `@supabase/supabase-js` + `@supabase/ssr` | ^2 / ^0.8 | Database/Auth (optional for prototype) |
| `@upstash/redis` + `@upstash/ratelimit` | ^1.36 / ^2 | Rate limiting (optional for prototype) |
| clsx + tailwind-merge | ^2 / ^3 | Class utilities |
| Vitest | ^4 | Unit testing |
| Playwright | ^1.58 | E2E testing |

---

## Step-by-Step Instructions

### Step 1: Clean Up Dead Files

Delete these files from the repo root. **Preserve**: all `*.md` docs, `.git/`, `.gitignore`.

```
rm index.html
rm vite.config.ts vite.config.js vite.config.d.ts
rm tsconfig.json tsconfig.app.json tsconfig.node.json
rm tsconfig.app.tsbuildinfo tsconfig.node.tsbuildinfo
rm package.json package-lock.json
rm playwright.config.ts playwright.config.js playwright.config.d.ts
rm vite-dev.log vite-dev.err.log
```

### Step 2: Initialize Next.js

```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Then install all dependencies:

```bash
npm install framer-motion @studio-freight/react-lenis lenis three @react-three/fiber @react-three/drei lucide-react sonner zod clsx tailwind-merge @supabase/supabase-js @supabase/ssr @upstash/redis @upstash/ratelimit

npm install -D @playwright/test vitest @vitejs/plugin-react @vitest/coverage-v8 @testing-library/react @testing-library/dom @testing-library/jest-dom jsdom @types/three
```

### Step 3: Configure PostCSS for Tailwind 4

**`postcss.config.mjs`**:
```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

### Step 4: Create `.env.local`

```env
NEXT_PUBLIC_AI_MODE=simulated
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

The app MUST work fully with `NEXT_PUBLIC_AI_MODE=simulated` and empty Supabase/Upstash keys. All state falls back to localStorage when external services are unavailable.

---

### Step 5: Build the Design System

#### `src/app/globals.css`

Create a **dark-theme** design system using Tailwind 4's CSS-first approach:

```css
@import "tailwindcss";

:root {
  --bg-primary: #0F172A;
  --bg-secondary: #111827;
  --surface: #172033;
  --surface-elevated: #1E293B;
  --accent-primary: #14B8A6;    /* Teal */
  --accent-secondary: #3B82F6;  /* Soft blue */
  --success: #22C55E;
  --warning: #F59E0B;
  --error: #EF4444;
  --text-primary: #F8FAFC;
  --text-secondary: #CBD5E1;
  --border: rgba(255,255,255,0.08);
}

@theme inline {
  --color-bg-primary: var(--bg-primary);
  --color-bg-secondary: var(--bg-secondary);
  --color-surface: var(--surface);
  --color-surface-elevated: var(--surface-elevated);
  --color-accent-primary: var(--accent-primary);
  --color-accent-secondary: var(--accent-secondary);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-border: var(--border);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-error: var(--error);
  --font-sans: "Inter", system-ui, sans-serif;
}
```

Also create these CSS utility classes:
- `.glass-card` — `backdrop-filter: blur(16px); background: rgba(23,32,51,0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; box-shadow: layered soft shadows`
- `.gradient-text` — `background: linear-gradient(135deg, #14B8A6, #3B82F6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
- `.mesh-gradient` — radial gradient background with teal/blue accents
- `.pulse-teal` — keyframe pulse animation for voice button
- `.shimmer` — loading skeleton shimmer animation
- Scrollbar styling (thin, dark themed)
- `@media (prefers-reduced-motion: reduce)` — disable animations

Typography: Inter via `next/font/google`. H1: 40-48px bold, H2: 28-32px semibold, H3: 20-24px semibold, Body: 16px.
Spacing: 8px base unit. Card padding: 20-28px. Border radius: 16px cards, 999px pills.

---

### Step 6: Build Root Layout

**`src/app/layout.tsx`**:
- Import Inter from `next/font/google`
- Wrap children in: `SmoothScrollProvider` (Lenis) → `AppStateProvider` (React Context)
- Add Sonner `<Toaster />` with dark theme
- Set metadata: title "Fluentia | AI Speaking Coach", description, etc.
- `<html lang="en" className="dark">`

---

### Step 7: Build All Screens

#### Screen 1: Splash (`src/app/page.tsx`)
- Full-screen dark mesh gradient background
- Centered "Fluentia" text with `.gradient-text` class, large (48px bold)
- Tagline below: "Your AI Speaking Coach" in `--text-secondary`
- Framer Motion: fade-in (0.5s) + subtle scale (0.95 → 1.0)
- `useEffect` with `setTimeout` → `router.push("/home")` after 2.5 seconds

#### Screen 2: Home (`src/app/home/page.tsx`)
- **AmbientBackground**: Three.js canvas (`@react-three/fiber`) with ~50 floating translucent teal/blue particles slowly drifting. Use `@react-three/drei` for simple sphere geometry. Position behind content with `position: fixed; z-index: 0`.
- **Hero Section**: Large GlassCard with:
  - "Ready to Speak?" heading (H1, gradient text)
  - Subtext about practicing with AI coach
  - **"Start Speaking" button** — teal fill, full width, rounded, glow on hover
  - If assessment completed: show LevelBadge (Beginner/Intermediate/Advanced) with colored background
- **"Reset Demo" link** — small, bottom of page, clears localStorage
- Framer Motion: stagger entrance for all elements (0.1s delay between)
- Read assessment state from localStorage on mount

#### Screen 3: Assessment (`src/app/assessment/page.tsx`)
- **ProgressStepper** at top: 5 dots/steps, current step highlighted in teal
- 5 assessment questions displayed one at a time:
  1. **Grammar** (MCQ): "Choose the correct sentence" with 4 options
  2. **Vocabulary** (MCQ): "Which word best fits?" with 4 options  
  3. **Fluency** (text input): "Describe your morning routine in 2-3 sentences"
  4. **Pronunciation Confidence** (self-rate): "How confident are you speaking English aloud?" — 3 options (Not very / Somewhat / Very confident)
  5. **Composition** (text input): "Introduce yourself as if meeting a new colleague"
- Each question in a GlassCard with Framer Motion slide-left transition
- **Scoring logic**: Each correct MCQ = 2 points, text inputs scored by word count/complexity heuristic (>20 words = 2, >10 = 1, else 0). Max 10 points.
  - 0-3 → Beginner, 4-6 → Intermediate, 7-10 → Advanced
- **Result screen**: LevelBadge with animation, encouragement message, "Continue to Practice" button → `/mode`
- Save to localStorage: `{ level, scores, completedAt }`

#### Screen 4: Mode Selection (`src/app/mode/page.tsx`)
- If no assessment completed → redirect to `/assessment`
- Two large GlassCards (side by side on desktop, stacked on mobile):
  - **Formal Mode**: Briefcase icon (Lucide), title "Formal", examples: "Job interview • Presentation • Professional email"
  - **Casual Mode**: Coffee icon (Lucide), title "Casual", examples: "Friends chat • Ordering food • Daily conversation"
- Each card: hover lift (translateY -4px) + border glow animation via Framer Motion
- On click: save mode to state, navigate to `/scenarios`

#### Screen 5: Scenario Selection (`src/app/scenarios/page.tsx`)
- If no mode selected → redirect to `/mode`
- Page title: "Choose a Scenario" (H2)
- **Grid of 8 ScenarioCards** (responsive: 1 col mobile, 2 tablet, 3 desktop):

| Scenario | Icon (Lucide) | Difficulty | Modes |
|----------|--------------|------------|-------|
| Job Interview | Briefcase | Intermediate | Formal |
| Classroom Answer | GraduationCap | Beginner | Formal |
| Daily Communication | MessageCircle | Beginner | Both |
| Friends Chat | Users | Beginner | Casual |
| Ordering Food | UtensilsCrossed | Beginner | Casual |
| Asking for Help | HelpCircle | Beginner | Both |
| Self-Introduction | UserPlus | Intermediate | Both |
| Presentation Practice | Presentation | Advanced | Formal |

- Filter cards by selected mode (show cards matching mode or "Both")
- Each ScenarioCard: glass surface, icon with teal gradient background circle, title, difficulty badge, hover lift
- On click: navigate to `/chat?scenario=<id>`

#### Screen 6: Chat/Conversation (`src/app/chat/page.tsx`)
- **ScenarioHeader** bar at top: scenario name + mode badge + back button
- **Message list** (scrollable, flex-col):
  - AI opening message based on scenario (e.g., "Welcome! I'm your interviewer today. Tell me about yourself.")
  - ChatBubble components: user messages right-aligned (teal accent left border), AI messages left-aligned (lighter surface)
  - System messages centered (muted)
- **ChatInput bar** fixed at bottom:
  - Text input field (dark surface, white text, teal focus ring)
  - **VoiceSimButton**: microphone icon (Lucide `Mic`), circular teal button. On click:
    - Button pulses with `.pulse-teal` animation for 2 seconds
    - Inserts a pre-written response appropriate to the scenario into the input field
    - Shows toast: "Voice captured (simulated)"
  - Send button (Lucide `Send`, teal)
- **On send**:
  1. Add user message to chat
  2. Run moderation check (call `/api/moderation` or client-side)
  3. If unsafe → show SafetyBanner: "Please use respectful language. Try rephrasing." — block sending
  4. If safe → show loading state (shimmer bubble) → call `/api/conversation` → add AI response
  5. After 2+ turns, show "Get Detailed Feedback" button → navigate to `/feedback` with conversation data

#### Screen 7: Loading (inline, not separate page)
- Shown as a ChatBubble with shimmer animation
- Text: "Analyzing tone, fluency, and confidence…"
- 1.5-2.5s simulated delay before response appears

#### Screen 8: Feedback (`src/app/feedback/page.tsx`)
- **Score Section** (top):
  - **ScoreRing**: SVG circle, animated stroke-dashoffset counting up to fluency score /10. Teal color. Large centered number.
  - **ConfidenceMeter**: horizontal progress bar filling to confidence %. Label: "Low/Medium/High"
  - **ToneIndicator**: badge with tone label (e.g., "Polite and Professional")
- **Strengths Section**: green checkmark icons + bullet list of strengths. Header: "What You Did Well"
- **Improvements Section**: amber arrow-up icons + bullet list. Header: "Areas to Improve"  
- **Grammar Corrections**: cards showing original → corrected with explanation
- **Pronunciation Notes**: list with tips
- **Vocabulary Suggestions**: cards with word → better alternative + context
- **Rewrite Section**: two RewriteCards side by side:
  - "Simple Rewrite" — easier, cleaner version
  - "Advanced Rewrite" — sophisticated, impressive version
- **Encouragement**: motivational closing message in a highlighted card
- **CTAs**: "Try Another Response" → `/chat`, "New Scenario" → `/scenarios`, "Home" → `/home`
- All sections animated with Framer Motion stagger entrance

---

### Step 8: Build API Routes

#### `src/app/api/conversation/route.ts`
```typescript
// POST handler
// 1. Parse & validate body with Zod
// 2. Check NEXT_PUBLIC_AI_MODE
// 3. Run moderation
// 4. If safe → generate feedback (simulated or real)
// 5. Return FeedbackPayload JSON
```

#### `src/app/api/assessment/route.ts`
```typescript
// POST handler
// 1. Receive answers array
// 2. Score each answer
// 3. Calculate level
// 4. Return { level, scores }
```

#### `src/app/api/moderation/route.ts`
```typescript
// POST handler  
// 1. Receive { text }
// 2. Run against blocklist + patterns
// 3. Return { safe, category?, warning? }
```

---

### Step 9: Build Simulated AI Engine

**`src/lib/ai/simulated.ts`** — Must return realistic, varied responses.

Create a `generateFeedback(input, scenario, mode, level)` function that returns a full `FeedbackPayload`:

- **fluencyScore**: based on word count (>30 words = 7-9, 15-30 = 5-7, <15 = 3-5) + slight randomization
- **confidenceLevel**: based on sentence structure heuristics
- **toneLabel**: varies by mode ("Polite and Professional" for formal, "Friendly and Natural" for casual)
- **strengths**: pick 2-3 from a pool of ~15 positive observations, contextualized to scenario
- **improvements**: pick 2-3 from a pool of ~15 suggestions
- **grammarCorrections**: detect basic patterns (missing articles, subject-verb agreement) or return pre-written examples
- **pronunciationNotes**: scenario-relevant tips
- **vocabularySuggestions**: 2-3 word upgrades relevant to the scenario
- **simpleRewrite**: a cleaner version of the user's input
- **advancedRewrite**: a sophisticated version with better vocabulary
- **encouragementMessage**: rotate from a pool of 10+ positive messages

**`src/lib/ai/schemas.ts`** — Zod schemas for all request/response types.

**`src/lib/ai/provider.ts`** — Provider interface:
```typescript
interface AiProvider {
  analyzeTurn(request: ConversationRequest): Promise<FeedbackPayload>;
}
```

---

### Step 10: Build Moderation Engine

**`src/lib/moderation/checker.ts`**:
- Blocklist of ~50 offensive/unsafe terms (categorized: sexual, violent, hateful, abusive)
- Pattern detection: all-caps spam, repeated characters (aaa, !!!)
- Length validation: empty → "Please enter a sentence", <3 words → "Please add more detail"
- Returns `{ safe: boolean, category?: string, warning?: string }`

**`src/lib/moderation/escalation.ts`**:
- Track warning count in localStorage key `fluentia_warnings`
- Level 1 (1st violation): gentle warning "Please use respectful language. Try rephrasing."
- Level 2 (2nd violation): stronger warning "Repeated inappropriate language detected. Please keep this a safe space."
- Level 3 (3rd violation): 60-second cooldown. Show countdown timer. Block all input until timer expires.

---

### Step 11: Build Shared Components

Create these as polished, reusable components with Framer Motion animations:

- **`Button.tsx`**: variants (primary/secondary/tertiary), sizes (sm/md/lg), loading state, glow hover effect
- **`GlassCard.tsx`**: glass-morphism surface, optional hover lift, accepts children
- **`ScoreRing.tsx`**: animated SVG ring, props: score (0-10), size, color
- **`ConfidenceMeter.tsx`**: horizontal bar, animated fill, label
- **`ToneIndicator.tsx`**: colored badge with label
- **`ProgressStepper.tsx`**: dot stepper for assessment, current/completed states
- **`LevelBadge.tsx`**: Beginner (green) / Intermediate (blue) / Advanced (purple) badge
- **`SafetyBanner.tsx`**: warning banner with amber background, icon, dismiss
- **`ChatBubble.tsx`**: user/ai/system variants, appropriate alignment and styling
- **`ChatInput.tsx`**: input + voice button + send button
- **`VoiceSimButton.tsx`**: circular mic button with pulse animation
- **`ScenarioCard.tsx`**: icon + title + difficulty + hover lift
- **`RewriteCard.tsx`**: labeled card showing rewritten text
- **`SmoothScrollProvider.tsx`**: Lenis wrapper
- **`AppStateProvider.tsx`**: React Context for app-wide state (level, mode, scenario, warnings)

---

### Step 12: App State Management

Use React Context (`AppStateProvider`) with localStorage persistence:

```typescript
interface AppState {
  level: "beginner" | "intermediate" | "advanced" | null;
  assessmentCompleted: boolean;
  assessmentScores: AssessmentScores | null;
  selectedMode: "formal" | "casual" | null;
  selectedScenario: Scenario | null;
  conversationHistory: Message[];
  lastFeedback: FeedbackPayload | null;
  warningCount: number;
  cooldownUntil: number | null;
}
```

Persist to localStorage on every state change. Hydrate from localStorage on mount. "Reset Demo" clears all state.

---

### Step 13: Testing

#### Vitest Unit Tests (`src/__tests__/`)
- `moderation.test.ts`: test blocklist, patterns, empty input, short input, safe input, escalation
- `simulated-ai.test.ts`: test feedback generation returns valid schema, score ranges, all fields populated
- `schemas.test.ts`: test Zod validation for all request/response types
- `scoring.test.ts`: test assessment scoring logic, level assignment boundaries

#### Playwright E2E (`e2e/`)
- `journey.spec.ts`: full flow — splash → home → assessment → mode → scenario → chat → feedback → home
- `moderation.spec.ts`: submit unsafe input → verify warning appears, submit 3x → verify cooldown
- `voice-sim.spec.ts`: click voice button → verify text appears in input

---

## Critical Quality Requirements

1. **`npm run build` MUST pass with zero TypeScript errors**
2. **Every interactive element must have a unique `id` attribute**
3. **The app must be fully responsive** (375px mobile to 1440px desktop)
4. **The dark theme must be consistent** — no white/light backgrounds leaking anywhere
5. **All animations must respect `prefers-reduced-motion`**
6. **The simulated AI must return realistic, varied responses** — not identical every time
7. **The app must work fully offline** — no dependency on Supabase/Upstash for the prototype (localStorage fallback)
8. **Keyboard navigation must work** for all interactive elements
9. **All score meters must have appropriate `aria-` attributes**
10. **Every page must have proper `<title>` and meta description**

---

## File Tree Summary

```
fluentia/
├── .env.local
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── vitest.config.mts
├── playwright.config.ts
├── 00_Project_Overview.md ... 08_*.md (preserved docs)
├── CODEX_PROMPT.md
├── README.md
├── e2e/
│   ├── journey.spec.ts
│   └── moderation.spec.ts
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── page.tsx (splash)
    │   ├── loading.tsx
    │   ├── error.tsx
    │   ├── template.tsx (page transitions)
    │   ├── home/page.tsx
    │   ├── assessment/page.tsx
    │   ├── mode/page.tsx
    │   ├── scenarios/page.tsx
    │   ├── chat/page.tsx
    │   ├── feedback/page.tsx
    │   └── api/
    │       ├── conversation/route.ts
    │       ├── assessment/route.ts
    │       └── moderation/route.ts
    ├── components/
    │   ├── providers/ (SmoothScrollProvider, AppStateProvider)
    │   ├── shared/ (Button, GlassCard, ScoreRing, ConfidenceMeter, etc.)
    │   ├── chat/ (ChatBubble, ChatInput, VoiceSimButton, ScenarioHeader)
    │   ├── feedback/ (FeedbackPanel, RewriteCard, ToneIndicator, StrengthsList)
    │   ├── assessment/ (AssessmentPrompt, LevelBadge)
    │   ├── scenarios/ (ScenarioCard)
    │   ├── home/ (HeroSection, AmbientBackground)
    │   └── splash/ (SplashScreen)
    ├── lib/
    │   ├── ai/ (provider.ts, simulated.ts, schemas.ts)
    │   ├── moderation/ (checker.ts, escalation.ts)
    │   ├── supabase/ (client.ts, server.ts)
    │   ├── store.ts
    │   └── constants.ts
    ├── hooks/ (useAssessment, useConversation, useModeration)
    ├── types/index.ts
    └── __tests__/ (moderation.test.ts, simulated-ai.test.ts, schemas.test.ts)
```

## Final Verification

After building everything, run:
```bash
npm run build     # Must pass with 0 errors
npm run test      # Vitest unit tests must pass
```

Then manually verify:
1. Open `http://localhost:3000` — splash screen appears, auto-redirects to home
2. Click "Start Speaking" → assessment flow works, assigns level
3. Select mode → scenario grid loads filtered correctly
4. Chat works — AI responds, voice sim button inserts text
5. Submit unsafe input → warning appears, 3rd time → cooldown
6. Feedback screen shows all sections with animated metrics
7. "Reset Demo" clears everything and returns to first-time state
8. All pages look correct at 375px mobile width
