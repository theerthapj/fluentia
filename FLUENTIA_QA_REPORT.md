# Fluentia Whole-System QA Report

Date/time: 2026-05-09 21:57 to 22:25 IST  
Repository: `C:\Users\goura\OneDrive\Desktop\Startup\fluentia`  
Commit: `21901218bb09af9a51ff9ad57e8be05d96b85199`  
Branch: `main`

## Post-Fix Addendum

Follow-up fixes were applied after this audit. The original findings remain below for traceability, but current source now includes:

| ID | Current Status |
|---|---|
| FLU-QA-001 | Resolved: README now documents the current Next.js app, scripts, ports, env variables, localStorage model, and AI/voice behavior. |
| FLU-QA-002 | Resolved for local/prototype scope: conversation and transcription routes now have content-length checks, in-memory rate limits, provider timeouts, and tighter schema bounds. Production should still move rate-limit state to durable infrastructure. |
| FLU-QA-003 | Resolved: feedback session IDs now include a stable hash of the actual conversation, avoiding same-score/same-length collisions while preventing duplicate reload saves. |
| FLU-QA-004 | Resolved: the blocked assessment CTA is hidden while the learning-plan modal is open, and the modal now has dialog semantics and focus handling. |
| FLU-QA-005 | Resolved for local/prototype scope: `/api/conversation` now enforces server-side cooldown per client key. Production should back this with user/IP/session storage. |
| FLU-QA-006 | Partially resolved: missing-key and invalid upload paths are tested and documented; live OpenAI transcription still requires a configured key and real microphone/provider validation. |
| FLU-QA-007 | Resolved: app state persistence is versioned, normalized, bounded, and guarded against corrupt storage. |
| FLU-QA-008 | Resolved: preferred voice input persists and changes the chat input affordance/placeholder. |
| FLU-QA-009 | Improved: new Vitest API/guard coverage and Playwright settings persistence coverage were added. Additional quiz/offline/reset/mobile-depth coverage is still recommended. |
| FLU-QA-010 | Still residual: Three/WebGL warnings remain a low-priority animation maintenance item. |

## 1. Executive Summary

Fluentia can complete the core onboarding, scenario chat, free chat, feedback, dashboard/progress, settings, moderation, and baseline Playwright journeys in the tested local environment. The production build also succeeds when Windows process spawning is allowed outside the sandbox.

Highest-risk findings:

| ID | Severity | Category | Title | Route/File | Status |
|---|---|---|---|---|---|
| FLU-QA-001 | High | Docs | README points to obsolete Vite/prototype setup and wrong commands/port | `README.md` | Confirmed |
| FLU-QA-002 | High | Security / Scalability | API provider calls have no timeout, rate limit, or request-size protection | `src/app/api/*`, `src/lib/ai/live.ts` | Confirmed |
| FLU-QA-003 | Medium | Data | Session IDs can collide and silently drop repeated completed sessions | `src/app/feedback/page.tsx`, `AppStateProvider.tsx` | Confirmed |
| FLU-QA-004 | Medium | UX / Accessibility | Assessment result shows a visible CTA blocked by the learning-plan modal | `/assessment` | Confirmed |
| FLU-QA-005 | Medium | Security / Functional | Moderation cooldown is client-only and not enforced by the API | `/chat`, `/api/conversation` | Confirmed |
| FLU-QA-006 | Medium | Voice / Environment | Voice transcription cannot run in current local env; missing-key behavior works but live path is unverified | `/chat`, `/api/transcribe` | Confirmed |
| FLU-QA-007 | Medium | Data / Scalability | Local app state is unversioned and writes whole state on every change | `AppStateProvider.tsx` | Confirmed |
| FLU-QA-008 | Medium | UX | Preferred input mode persists but does not visibly change chat behavior | `/settings`, `/chat` | Confirmed |
| FLU-QA-009 | Medium | Test Coverage | Automated e2e coverage is narrow relative to documented critical flows | `e2e/*` | Confirmed |
| FLU-QA-010 | Low | Performance | Three/WebGL warnings indicate animation/performance maintenance risk | `/home`, console | Confirmed |

No Critical issue was confirmed in this pass. The main production risks are operational: stale onboarding docs, unbounded provider calls, missing rate limits, client-only moderation cooldown, and localStorage state fragility.

## 2. Test Environment

| Item | Value |
|---|---|
| OS | Windows NT 10.0, Win64 x64 from Chromium UA. PowerShell OS CIM query was access denied. |
| Browser | Playwright Chromium, `HeadlessChrome/147.0.7727.15` |
| Node | `v22.17.1` |
| npm | `10.9.2` |
| Package manager | npm |
| App mode | Next dev server on `http://127.0.0.1:3211`; production build also tested |
| Env file | `.env.local` present, but only `NEXT_PUBLIC_AI_MODE` is non-empty |
| Dependencies | `node_modules` present; `npm install` skipped |

Environment variables checked without printing secret values:

| Variable | `.env.example` | `.env.local` |
|---|---|---|
| `NEXT_PUBLIC_AI_MODE` | documented | non-empty |
| `NEXT_PUBLIC_SUPABASE_URL` | documented | empty |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | documented | empty |
| `SUPABASE_SERVICE_ROLE_KEY` | documented | empty |
| `UPSTASH_REDIS_REST_URL` | documented | empty |
| `UPSTASH_REDIS_REST_TOKEN` | documented | empty |
| `OPENAI_API_KEY` | documented | empty |
| `OPENAI_TRANSCRIPTION_MODEL` | documented | not present in `.env.local` |

## 3. Commands Run

| Command | Result | Notes |
|---|---|---|
| `git rev-parse HEAD` | Pass | `21901218bb09af9a51ff9ad57e8be05d96b85199` |
| `git branch --show-current` | Pass | `main` |
| `node -v` | Pass | `v22.17.1` |
| `npm -v` | Pass | `10.9.2` |
| `npm run lint` | Pass | ESLint completed with exit 0 |
| `npm run test` | Pass after sandbox escalation | First run failed with `spawn EPERM`; unrestricted run passed 9 files, 26 tests |
| `npm run build` | Pass after sandbox escalation | First run failed with `spawn EPERM`; unrestricted Next build completed all routes |
| `npm run test:e2e` | Pass after sandbox escalation | First run failed starting Next with `spawn EPERM`; unrestricted run passed 6 tests |

Baseline e2e result: 6 passed across desktop Chromium and Pixel 5 mobile projects. Console warning observed during e2e: `THREE.THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.`

## 4. Scenario Coverage Matrix

| Scenario | Coverage | Evidence |
|---|---|---|
| New user onboarding happy path | Passed with UX issue | `qa-evidence/02-assessment-result-modal.png`, `03-scenarios-formal.png`, `04-chat-professional.png` |
| Chat coaching happy path | Passed | `05-chat-after-first-turn.png`, `06-chat-feedback-cta.png`, `07-feedback.png` |
| Voice input and transcription | Graceful missing/live-unavailable state checked; live OpenAI not tested | `17-voice-ready.png`, `18-voice-denied-or-unavailable.png`, API 503 missing key |
| Free Chat | Passed | `08-free-chat.png`, `09-free-chat-turn.png` |
| Moderation and cooldown | Passed in UI; API cooldown gap found | `16-moderation-cooldown.png` |
| Brain Boost quiz | Route rendered; full answer-cycle not manually completed | `10-brain-boost.png`, `11-brain-boost-quiz.png` |
| Dashboard and progress | Passed populated state after saved session | `12-dashboard-populated.png`, `13-progress-populated.png` |
| Settings and preferences | Persistence passed | `14-settings.png`, `15-settings-after-reload.png` |
| Responsive layout/navigation | Spot checked mobile/tablet/desktop | `19-mobile-chat.png`, `20-tablet-dashboard.png`, `21-desktop-home.png` |
| Error and offline behavior | Source/API review only | See FLU-QA-002 and FLU-QA-006 |
| Persistence and reset | Source review; reset exists | `Sidebar.tsx:126`, `AppStateProvider.tsx:150` |
| Accessibility | Spot/source review | FLU-QA-004 |
| Security/privacy | Source/env review | FLU-QA-002, FLU-QA-005, privacy page checked |
| Performance/scaling | Source/console review | FLU-QA-002, FLU-QA-007, FLU-QA-010 |
| Code documentation | Docs review | FLU-QA-001 |

## 5. Confirmed Issues

### FLU-QA-001

- ID: FLU-QA-001
- Title: README points to obsolete Vite/prototype setup and wrong commands/port
- Severity: High
- Category: Docs
- Status: Confirmed
- Environment: Windows, Node `22.17.1`, npm `10.9.2`
- Route / Component / File: `README.md`
- Preconditions: Fresh maintainer trying to run the app from repo docs.
- Reproduction Steps:
  1. Open `README.md`.
  2. Compare local preview, project shape, and quality commands against `package.json` and actual `src/app` structure.
- Expected Behavior: README documents Next.js App Router, default dev port, `npm run lint`, `npm run test`, `npm run build`, `npm run test:e2e`, and current env setup.
- Actual Behavior: README references `127.0.0.1:4173`, Vite + React, `shared/`, `mobile/`, `prototype/`, and `npm run smoke`.
- User Impact: New developer handoff is unsafe; a maintainer can waste time following non-existent or obsolete paths and commands.
- Technical Risk: Incorrect setup docs make CI/debugging and production configuration more error-prone.
- Evidence: `README.md:8`, `README.md:11`, `README.md:12`, `README.md:13`, `README.md:14`, `README.md:18`.
- Suggested Fix: Rewrite README around the current Next 16 app, scripts, env variables, localStorage behavior, OpenAI transcription, Supabase/Upstash optional status, and Playwright workflow.
- Regression Test Recommendation: Add a lightweight docs check or release checklist item that validates documented scripts exist in `package.json`.

### FLU-QA-002

- ID: FLU-QA-002
- Title: API provider calls have no timeout, rate limit, or request-size protection
- Severity: High
- Category: Security / Scalability
- Status: Confirmed
- Environment: Dev and production build source review.
- Route / Component / File: `src/app/api/conversation/route.ts`, `src/app/api/transcribe/route.ts`, `src/lib/ai/live.ts`
- Preconditions: App deployed with live OpenAI enabled, or public API routes reachable.
- Reproduction Steps:
  1. Inspect `/api/conversation` and `/api/transcribe`.
  2. Submit repeated or large requests, or simulate a slow provider.
- Expected Behavior: API routes enforce rate limits, input/body size limits, provider timeouts, and safe retry behavior.
- Actual Behavior: Conversation and transcription calls use plain `fetch` without `AbortController` timeout. Transcribe forwards arbitrary blob size. No Upstash or other rate limiting is applied despite dependencies/env placeholders.
- User Impact: A slow provider can hang requests and leave chat disabled until the client fetch fails. Abuse can create avoidable provider cost and server pressure.
- Technical Risk: Production scale can degrade quietly through long-running requests, oversized uploads, and API spamming.
- Evidence: `src/lib/ai/live.ts:34`, `src/app/api/transcribe/route.ts:16`, `src/app/api/transcribe/route.ts:26`, `src/app/api/conversation/route.ts:7`.
- Suggested Fix: Add server-side request validation, max audio size/duration, Upstash or platform rate limiting by IP/session, and `AbortController` timeouts around OpenAI calls.
- Regression Test Recommendation: Add API tests for timeout fallback, invalid/oversized audio, rapid repeated chat requests, and provider 429/5xx behavior.

### FLU-QA-003

- ID: FLU-QA-003
- Title: Session IDs can collide and silently drop repeated completed sessions
- Severity: Medium
- Category: Data
- Status: Confirmed
- Environment: Source review after manual feedback flow.
- Route / Component / File: `src/app/feedback/page.tsx`, `src/components/providers/AppStateProvider.tsx`
- Preconditions: User completes multiple sessions with the same conversation kind, scenario/exercise/free-chat key, feedback score, and conversation length.
- Reproduction Steps:
  1. Complete a session and open `/feedback`.
  2. Complete another session with the same scenario, same score, and same message count.
  3. Return to dashboard/progress.
- Expected Behavior: Each completed session is recorded uniquely.
- Actual Behavior: `sessionId` is deterministic from kind, scenario/exercise/free key, score, and conversation length. `addSession` ignores any session with an existing ID.
- User Impact: Repeated practice can be silently missing from progress history.
- Technical Risk: Progress analytics become misleading and trust in dashboard data drops.
- Evidence: `src/app/feedback/page.tsx:37`, `src/components/providers/AppStateProvider.tsx:133`.
- Suggested Fix: Include a timestamp or `uid()` in the session ID and keep duplicate detection based on a stronger event identity.
- Regression Test Recommendation: Unit test `addSession` and feedback save flow with two same-score sessions to confirm both are retained.

### FLU-QA-004

- ID: FLU-QA-004
- Title: Assessment result shows a visible CTA blocked by the learning-plan modal
- Severity: Medium
- Category: UX / Accessibility
- Status: Confirmed
- Environment: Playwright Chromium desktop.
- Route / Component / File: `/assessment`, `src/app/assessment/page.tsx`, `LearningPlanModal.tsx`
- Preconditions: Complete assessment.
- Reproduction Steps:
  1. Start from `/`.
  2. Complete all five assessment questions.
  3. On result screen, try clicking visible `Continue to Practice`.
- Expected Behavior: Only one clear primary action is presented, or the modal is a semantic dialog with focus inside it and no blocked duplicate CTA behind it.
- Actual Behavior: The result card renders `assessment-continue`, then a fixed modal overlays it. Playwright timed out because the modal intercepted pointer events.
- User Impact: Sighted users can see a primary button that cannot be clicked. Keyboard/screen reader users may encounter confusing duplicate actions.
- Technical Risk: Fragile onboarding tests and poor accessibility semantics.
- Evidence: `qa-evidence/02-assessment-result-modal.png`; `src/app/assessment/page.tsx:192`, `src/app/assessment/page.tsx:194`, `src/components/onboarding/LearningPlanModal.tsx:10`.
- Suggested Fix: Remove the behind-modal CTA while the modal is open, or make the plan card replace the result CTA. Add `role="dialog"`, accessible name, focus management, and Escape/close behavior if it remains modal.
- Regression Test Recommendation: E2E assertion that the only actionable primary CTA after assessment is `learning-plan-begin`, plus axe/accessibility check for dialog semantics.

### FLU-QA-005

- ID: FLU-QA-005
- Title: Moderation cooldown is client-only and not enforced by the API
- Severity: Medium
- Category: Security / Functional
- Status: Confirmed
- Environment: UI and API source review.
- Route / Component / File: `/chat`, `/api/conversation`, `src/lib/moderation/escalation.ts`
- Preconditions: User submits repeated unsafe input.
- Reproduction Steps:
  1. Submit three unsafe messages in chat.
  2. Observe UI cooldown.
  3. POST unsafe text directly to `/api/conversation`.
- Expected Behavior: Cooldown state is enforced server-side for API calls as well as client UI, or product explicitly documents it as local demo-only.
- Actual Behavior: UI stores cooldown in localStorage. API only checks whether the current message is safe and returns a warning; it does not track or enforce repeated violation cooldown.
- User Impact: Normal users see a cooldown, but API abuse is not throttled by the same policy.
- Technical Risk: Safety controls are easy to bypass outside the UI and cannot protect provider spend or moderation quality in production.
- Evidence: `qa-evidence/16-moderation-cooldown.png`; `src/lib/moderation/escalation.ts:29`, `src/app/api/conversation/route.ts:13`.
- Suggested Fix: Move cooldown/rate policy to an API-enforced store keyed by session/user/IP, while keeping client UI as a reflection of server state.
- Regression Test Recommendation: API integration test that three unsafe requests trigger a cooldown response and block further sends until expiry.

### FLU-QA-006

- ID: FLU-QA-006
- Title: Voice transcription cannot run in current local env; missing-key behavior works but live path is unverified
- Severity: Medium
- Category: Voice / Environment
- Status: Confirmed
- Environment: `.env.local` has empty `OPENAI_API_KEY`.
- Route / Component / File: `/chat`, `/api/transcribe`
- Preconditions: Current `.env.local` from this workspace.
- Reproduction Steps:
  1. Inspect `.env.local` without printing secrets.
  2. POST to `/api/transcribe` without configured key.
  3. Open chat and click mic in headless browser environment.
- Expected Behavior: Missing key is disclosed clearly, and live key path is documented/testable when configured.
- Actual Behavior: API correctly returns 503 with `configured: false`. Manual live transcription could not be tested because no key was configured and no real mic permission was available in the headless run.
- User Impact: Local voice practice is unavailable unless a developer knows to configure OpenAI and restart.
- Technical Risk: The live transcription path has no confirmed test in this environment; regressions can hide behind the simulated/browser speech e2e.
- Evidence: `.env.local` check showed `OPENAI_API_KEY=empty`; `/api/transcribe` returned `{"transcript":null,"configured":false,"error":"OPENAI_API_KEY is not configured."}`; `qa-evidence/17-voice-ready.png`, `qa-evidence/18-voice-denied-or-unavailable.png`.
- Suggested Fix: Document live voice setup in README, add a fake provider mode for deterministic local tests, and add API tests for missing key, missing audio, invalid audio, and provider failure.
- Regression Test Recommendation: Unit/API tests for `/api/transcribe`, plus one browser test with mocked `MediaRecorder` and one with mocked browser speech recognition.

### FLU-QA-007

- ID: FLU-QA-007
- Title: Local app state is unversioned and writes whole state on every change
- Severity: Medium
- Category: Data / Scalability
- Status: Confirmed
- Environment: Source review.
- Route / Component / File: `src/components/providers/AppStateProvider.tsx`
- Preconditions: Long chat history, corrupted storage, or future schema changes.
- Reproduction Steps:
  1. Use chat for a long session.
  2. Inspect localStorage writes and state shape.
  3. Introduce stale/corrupted stored state or future schema mismatch.
- Expected Behavior: Storage has schema versioning, migration/validation, quota handling, and bounded message history.
- Actual Behavior: Entire state is serialized on every state change. Sessions are capped to 30, but `conversationHistory` is not capped. Storage parse/write failures are mostly silent.
- User Impact: Long sessions can slow the UI or fail to persist without user feedback.
- Technical Risk: Future app changes can break old stored state; quota errors can create silent data loss.
- Evidence: `src/components/providers/AppStateProvider.tsx:84`, `src/components/providers/AppStateProvider.tsx:129`, `src/components/providers/AppStateProvider.tsx:136`.
- Suggested Fix: Add a versioned persisted schema, zod validation/migration, bounded conversation history, and user-visible recovery for storage quota/corruption.
- Regression Test Recommendation: Tests for loading old/corrupt storage, long histories, quota write failure, and reset behavior.

### FLU-QA-008

- ID: FLU-QA-008
- Title: Preferred input mode persists but does not visibly change chat behavior
- Severity: Medium
- Category: UX
- Status: Confirmed
- Environment: Settings route and chat route.
- Route / Component / File: `/settings`, `/chat`
- Preconditions: User selects preferred input mode `voice`.
- Reproduction Steps:
  1. Open `/settings`.
  2. Select voice as preferred input mode.
  3. Reload settings and confirm selection persists.
  4. Open chat.
- Expected Behavior: Preferred input mode affects chat behavior, such as defaulting focus/controls to voice or surfacing voice-first affordances.
- Actual Behavior: The setting persists, but chat still renders the same text area plus mic button with no visible difference.
- User Impact: Users may believe they customized the app when the preference is decorative.
- Technical Risk: Settings surface can drift from implemented behavior.
- Evidence: `qa-evidence/14-settings.png`, `qa-evidence/15-settings-after-reload.png`; `src/app/settings/page.tsx:56`, `src/components/ui/fluentia-animated-chat.tsx:388`.
- Suggested Fix: Either implement voice-first behavior or relabel the preference as planned/experimental and hide it until wired.
- Regression Test Recommendation: E2E test that setting voice mode changes chat default state or visible affordance.

### FLU-QA-009

- ID: FLU-QA-009
- Title: Automated e2e coverage is narrow relative to documented critical flows
- Severity: Medium
- Category: Test Coverage
- Status: Confirmed
- Environment: Playwright e2e suite.
- Route / Component / File: `e2e/journey.spec.ts`, `e2e/moderation.spec.ts`, `e2e/voice-sim.spec.ts`
- Preconditions: Run `npm run test:e2e`.
- Reproduction Steps:
  1. Inspect `e2e` directory.
  2. Compare against required flows in the QA prompt.
- Expected Behavior: E2E coverage includes settings persistence, dashboard/progress seeded state, free chat, feedback navigation, mobile dock/sidebar navigation, quiz scoring, offline/API failure, and reset.
- Actual Behavior: Current suite covers full journey to feedback CTA, cooldown appearance, and mocked speech-recognition draft text only.
- User Impact: Regressions in key app areas can ship unnoticed.
- Technical Risk: Build confidence is overstated by passing e2e suite.
- Evidence: `e2e/journey.spec.ts`, `e2e/moderation.spec.ts`, `e2e/voice-sim.spec.ts`.
- Suggested Fix: Add the missing e2e scenarios listed in section 13.
- Regression Test Recommendation: Expand Playwright with seeded localStorage helpers and route/API interception for failure states.

### FLU-QA-010

- ID: FLU-QA-010
- Title: Three/WebGL warnings indicate animation/performance maintenance risk
- Severity: Low
- Category: Performance
- Status: Confirmed
- Environment: Playwright Chromium.
- Route / Component / File: `/home`, animated Fluvi/Three components.
- Preconditions: Load animated home/chat experiences in Chromium.
- Reproduction Steps:
  1. Run e2e or manual browser pass.
  2. Capture console output.
- Expected Behavior: No dependency deprecation or GPU stall warnings in normal rendering.
- Actual Behavior: Console logs include `THREE.THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.` and WebGL `GPU stall due to ReadPixels` warnings.
- User Impact: No immediate visible user break observed.
- Technical Risk: Animation components may become brittle with Three upgrades and may cost performance on lower-end devices.
- Evidence: `qa-evidence/voice-console-network.log`.
- Suggested Fix: Locate `THREE.Clock` usage in Fluvi/Three dependencies or wrappers, update where possible, and profile home/chat on low-end mobile.
- Regression Test Recommendation: Add smoke/performance budget checks for animated routes and periodically review browser console warnings.

## 6. Unexpected Behaviors

- The initial sandboxed `npm run test`, `npm run build`, and `npm run test:e2e` failed with Windows `spawn EPERM`, but the same commands passed outside sandbox. This is an environment/tooling issue, not an app failure.
- Assessment completion renders both `assessment-continue` and `learning-plan-begin`; only the modal button is clickable.
- Voice click in headless Chromium produced no `/api/transcribe` network request in the fresh pass, consistent with unavailable mic/browser media behavior.
- `/api/conversation` returns `200` for unsafe input with `{ safe: false }`, which is acceptable for UI flow but should be considered carefully for API clients.

## 7. UX and Accessibility Findings

- FLU-QA-004 is the main UX/accessibility issue: blocked CTA and missing semantic dialog behavior.
- Icon buttons mostly have accessible labels in header/sidebar/chat. Spot checked source includes labels for free chat, back, mic, command palette, dismiss buttons, and sidebar collapse.
- Reduced motion is partially addressed in global CSS and Fluvi uses `useReducedMotion`, but motion-heavy pages use many `motion.*` components. Residual risk remains until tested with OS/browser reduced motion in a real browser.
- Mobile chat rendered without a crash at 390x844: `qa-evidence/19-mobile-chat.png`. Residual risk: manual touch testing on a physical device was not performed.

## 8. Voice/AI/Environment Findings

- `.env.local` has no live OpenAI key, so live AI/transcription could not be validated.
- Conversation fallback works: chat turns returned simulated provider data and showed the fallback banner when appropriate.
- `/api/transcribe` missing-key behavior is clear and non-secret. It returns 503 with `configured:false`.
- Provider model is hard-coded to `gpt-4o-mini` in `src/lib/ai/live.ts:41`; README should document this or make it configurable.
- Voice code releases media tracks on `MediaRecorder.onstop` (`fluentia-animated-chat.tsx:277`), which is good. Residual risk remains for rapid toggle and provider timeout cases.

## 9. Data Persistence and State Findings

- Settings persisted after reload: `qa-evidence/14-settings.png`, `qa-evidence/15-settings-after-reload.png`.
- Dashboard/progress populated after feedback save: `qa-evidence/12-dashboard-populated.png`, `qa-evidence/13-progress-populated.png`.
- Reset Demo exists in sidebar and clears app state plus moderation warnings (`Sidebar.tsx:126`, `AppStateProvider.tsx:150`).
- Confirmed data risks: FLU-QA-003 and FLU-QA-007.

## 10. Performance and Scaling Risks

- No rate limiting, timeout, body-size cap, or provider timeout was found on AI/voice API paths.
- Scenario catalogs are static client-side data. This is fine at current size, but should be watched if content grows substantially.
- localStorage writes the full state object after changes. This is acceptable for prototype data but risky for long histories.
- Three/WebGL warnings are low severity today, but animation-heavy routes need profiling before production.

## 11. Security and Privacy Risks

- No committed secret-like values were found by pattern search for `sk-`, JWT-like strings, or service-role tokens outside ignored build/dependency folders.
- Server-only variables are not exposed through `NEXT_PUBLIC_` names except the expected Supabase public values.
- Privacy page accurately states local browser storage and provider voice sending behavior.
- Major security gaps are operational: no server-side rate limiting/cooldown and no API body/time protections.

## 12. Documentation and Code Comment Audit

- README is stale and should be treated as a release blocker for developer handoff.
- `.env.example` is useful and does not expose values, but README does not explain which variables are optional, required for live voice, or unused in local prototype mode.
- Product docs still include prototype-era references. `PROTOTYPE_ARCHITECTURE.md` explicitly describes `prototype/`, `shared/`, and `mobile/` that are no longer part of the main current shape.
- Comments are generally sparse and not noisy. The bigger maintainability problem is stale docs rather than stale inline comments.

## 13. Test Coverage Gaps

Add these concrete tests:

- Unit/API: `/api/transcribe` missing key, missing audio, oversized audio, invalid provider response, provider timeout.
- Unit/API: `/api/conversation` provider timeout, live provider 429/5xx fallback, invalid payload, rate-limit behavior once implemented.
- Component: chat textarea receives interim browser speech text and remains editable.
- E2E: settings preference persistence changes chat behavior.
- E2E: free chat start, turn, feedback, and scenario-null handling.
- E2E: dashboard/progress with seeded sessions, including duplicate session prevention/regression.
- E2E: sidebar/mobile dock navigation at 390x844 and 768x1024.
- E2E: quiz answer selection, score correctness, completion state, and double-submit prevention.
- E2E: reset demo clears assessment, sessions, preferences, and moderation state as intended.
- E2E: route/API interception for slow and failed `/api/conversation` and `/api/transcribe`.

## 14. Recommended Fix Priority

1. Fix README and environment docs before handoff.
2. Add API rate limits, request size caps, and provider timeouts.
3. Make session IDs unique and add regression coverage for repeated sessions.
4. Fix assessment result/modal UX and accessibility semantics.
5. Move moderation cooldown enforcement server-side for production.
6. Add versioned localStorage persistence with bounded histories.
7. Wire or remove preferred input mode until it changes chat behavior.
8. Expand Playwright coverage for settings, free chat, progress, quiz, reset, and offline/API failures.
9. Profile animation routes and address Three/WebGL warnings.

## 15. Appendix: Reproduction Steps and Evidence

Manual screenshots saved:

- `qa-evidence/01-landing.png`
- `qa-evidence/02-assessment-result-modal.png`
- `qa-evidence/03-scenarios-formal.png`
- `qa-evidence/04-chat-professional.png`
- `qa-evidence/05-chat-after-first-turn.png`
- `qa-evidence/06-chat-feedback-cta.png`
- `qa-evidence/07-feedback.png`
- `qa-evidence/08-free-chat.png`
- `qa-evidence/09-free-chat-turn.png`
- `qa-evidence/10-brain-boost.png`
- `qa-evidence/11-brain-boost-quiz.png`
- `qa-evidence/12-dashboard-populated.png`
- `qa-evidence/13-progress-populated.png`
- `qa-evidence/14-settings.png`
- `qa-evidence/15-settings-after-reload.png`
- `qa-evidence/16-moderation-cooldown.png`
- `qa-evidence/17-voice-ready.png`
- `qa-evidence/18-voice-denied-or-unavailable.png`
- `qa-evidence/19-mobile-chat.png`
- `qa-evidence/20-tablet-dashboard.png`
- `qa-evidence/21-desktop-home.png`
- `qa-evidence/voice-console-network.log`

Core manual onboarding reproduction:

1. Clear localStorage.
2. Open `/`.
3. Click `Start Practicing Free`.
4. Complete grammar and vocabulary MCQs.
5. Fill fluency text.
6. Complete pronunciation confidence MCQ.
7. Fill composition text.
8. Observe assessment result and learning-plan modal.
9. Click `Let's Begin`.
10. Choose Formal.
11. Select `Handling a Professional Meeting`.
12. Send two chat messages.
13. Open feedback.

Moderation reproduction:

1. Open `/chat?kind=scenario&scenario=casual-beginner-favorite-food`.
2. Submit `I hate you`.
3. Submit `you are stupid`.
4. Submit `shut up`.
5. Observe cooldown banner and disabled input controls.

API evidence:

- `/api/transcribe` with empty local key returned status 503 and `configured:false`.
- `/api/conversation` unsafe direct POST returned status 200 and `{ safe:false, category:"abusive" }`.
- `/api/conversation` respectful free-chat POST returned status 200 with `safe:true` and feedback payload.

No confirmed issue found in these areas during this pass:

- Core app startup/build after sandbox process restrictions were removed.
- Secret exposure in committed source by simple pattern search.
- Basic local settings persistence.
- Basic dashboard/progress rendering after a saved session.

Residual risks:

- Live OpenAI transcription and live chat provider behavior were not verified because `OPENAI_API_KEY` is empty.
- Physical microphone permissions and real mobile touch behavior were not tested.
- Full keyboard-only and screen-reader testing was not completed.
- Long-history memory profiling was not completed.
