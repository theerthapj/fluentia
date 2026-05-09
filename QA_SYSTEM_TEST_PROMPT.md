# Fluentia Whole-System QA Prompt

Use this prompt to run a complete QA audit of Fluentia and produce a documented issue report.

```text
You are a senior QA engineer, product-minded test analyst, accessibility reviewer, security reviewer, and code documentation auditor. Your target system is the Fluentia web app in this repository.

Your job is to test the entire app like a real user and like a maintainer inheriting the codebase. Produce a documented report of the system behavior, confirmed issues, unexpected behavior, missing tests, documentation gaps, scalability risks, and quiet failure modes that could slowly kill the app as usage grows.

Do not only run automated tests. Combine automated checks, manual exploratory testing, source review, documentation review, and risk analysis. Be precise, reproducible, and evidence driven.

Project context:
- App: Fluentia, an AI English speaking coach.
- Stack: Next.js App Router, React 19, TypeScript, Tailwind CSS, Playwright, Vitest, localStorage state, optional OpenAI API, optional Supabase/Upstash config.
- Key user journeys:
  - Landing page -> assessment -> mode selection -> scenario selection -> chat -> feedback.
  - Free Chat.
  - Brain Boost quiz.
  - Progress/dashboard review.
  - Settings, especially listening, playback speed, preferred input mode, and level preference.
  - Voice input transcription into the chat text box.
  - Moderation cooldown for unsafe input.
- Main routes to inspect:
  - `/`
  - `/home`
  - `/assessment`
  - `/mode`
  - `/scenarios`
  - `/chat?kind=scenario&scenario=formal-advanced-professional-meeting`
  - `/chat?kind=scenario&scenario=casual-beginner-favorite-food`
  - `/free-chat`
  - `/brain-boost`
  - `/brain-boost/quiz`
  - `/dashboard`
  - `/progress`
  - `/feedback`
  - `/settings`
  - `/privacy`
  - `/about`
  - `/contact`

Before testing:
1. Record the commit hash, branch, OS, browser versions, Node version, package manager version, date/time, and environment mode.
2. Run `npm install` only if dependencies are missing.
3. Inspect `.env.example` and `.env.local` without exposing secrets. Report whether required variables are present or missing. Never print secret values.
4. Run these baseline commands and capture pass/fail output:
   - `npm run lint`
   - `npm run test`
   - `npm run build`
   - `npm run test:e2e`
5. If a command fails, do not stop. Capture the exact failure and continue with manual testing where possible.

Report format:
Create a Markdown report named `FLUENTIA_QA_REPORT.md` with these sections:
1. Executive Summary
2. Test Environment
3. Commands Run
4. Scenario Coverage Matrix
5. Confirmed Issues
6. Unexpected Behaviors
7. UX and Accessibility Findings
8. Voice/AI/Environment Findings
9. Data Persistence and State Findings
10. Performance and Scaling Risks
11. Security and Privacy Risks
12. Documentation and Code Comment Audit
13. Test Coverage Gaps
14. Recommended Fix Priority
15. Appendix: Reproduction Steps and Evidence

For each issue, use this format:
- ID: FLU-QA-###
- Title:
- Severity: Critical | High | Medium | Low
- Category: Functional | UX | Accessibility | Performance | Security | Data | Docs | Test Coverage | Scalability
- Status: Confirmed | Intermittent | Suspected | Needs Product Decision
- Environment:
- Route / Component / File:
- Preconditions:
- Reproduction Steps:
- Expected Behavior:
- Actual Behavior:
- User Impact:
- Technical Risk:
- Evidence: screenshot path, trace path, console log, network log, or code reference
- Suggested Fix:
- Regression Test Recommendation:

Severity guide:
- Critical: Blocks core practice flow, loses user data, exposes secrets, causes crash loops, or prevents app startup/build.
- High: Breaks major user journey, voice transcription, feedback, dashboard/progress, moderation, or mobile layout.
- Medium: Confusing UX, flaky behavior, incomplete state sync, accessibility blocker for some users, missing docs for important setup.
- Low: Cosmetic, copy issue, minor docs mismatch, non-blocking polish.

Core functional scenarios:

Scenario 1: New user onboarding happy path
Goal: Verify a new learner can start from scratch and reach a coaching session.
Preconditions: Clear localStorage. No prior sessions.
Flow:
1. Open `/`.
2. Click primary start CTA.
3. Complete assessment with valid answers.
4. Confirm level result.
5. Continue to mode selection.
6. Choose Formal mode.
7. Pick an advanced professional meeting scenario.
8. Confirm chat opens with the correct scenario title, breadcrumb, prompt, cultural note, and input controls.
Expected optimal behavior:
- No blank screens, stuck loading, hydration errors, or console crashes.
- User choices persist across route changes.
- Scenario title and mode/level metadata match selected scenario.
- Primary buttons are clear and usable on desktop and mobile.
Faulty behavior to look for:
- Assessment progress resets unexpectedly.
- Wrong level, mode, or scenario selected.
- CTAs are invisible, overlapped, or unclickable.
- Back/side navigation breaks the flow.
Report:
- Include screenshots at assessment result, scenario card, and chat page.

Scenario 2: Chat coaching happy path
Goal: Verify a learner can send multiple turns and receive feedback.
Preconditions: Open a valid scenario chat route.
Flow:
1. Type a respectful response.
2. Send it.
3. Wait for AI/simulated response and quick tip.
4. Send a second response.
5. Confirm detailed feedback CTA appears.
6. Open feedback page.
Expected optimal behavior:
- Input clears after send.
- Loading state is visible but not stuck.
- Conversation history preserves order.
- Feedback includes tone, strengths, improvements, rewrites, and encouragement.
- Provider fallback banner appears only when live AI is unavailable.
Faulty behavior:
- Message duplicates.
- Input remains disabled.
- Feedback CTA appears too early/late.
- AI response silently fails.
- Conversation state is lost after navigation.

Scenario 3: Voice input and transcription
Goal: Verify voice input is visible, editable, and graceful when services are unavailable.
Preconditions:
- Test once with no `OPENAI_API_KEY`.
- Test once with a valid `OPENAI_API_KEY` if available.
- Test in a browser with microphone permissions.
Flow:
1. Open scenario chat.
2. Click microphone.
3. Speak a short sentence.
4. Confirm interim text appears in the textarea while recording where browser speech recognition is supported.
5. Stop recording.
6. Confirm final transcript appears in the text box and remains editable.
7. Edit transcript manually.
8. Send.
Expected optimal behavior:
- User sees captured/transcribed text in the text box before sending.
- No fake instructional message is inserted as user text.
- Missing API key shows a clear non-blocking error.
- Denied microphone permission shows a clear fallback message.
- Text remains editable after capture.
Faulty behavior:
- Toast says “Voice captured” but input is empty.
- Text box contains “This is a simulated response…” as user text.
- Button gets stuck in recording/analyzing.
- Microphone stream is not released.
- API key missing state is unclear.
Evidence:
- Capture console logs, network request to `/api/transcribe`, and screenshots before/after stop.

Scenario 4: Free Chat
Goal: Verify non-scenario chat works.
Flow:
1. Open `/free-chat`.
2. Confirm route forwards or presents a free-chat conversation.
3. Send a general English-practice question.
4. Confirm response and feedback behavior.
Expected optimal behavior:
- Free chat does not require a selected scenario.
- Conversation kind is `free-chat`.
Faulty behavior:
- Scenario-specific metadata appears incorrectly.
- Feedback crashes because scenario is null.

Scenario 5: Moderation and cooldown
Goal: Verify unsafe input is blocked without killing the session.
Flow:
1. Open chat.
2. Submit unsafe/disrespectful input repeatedly.
3. Confirm warning appears.
4. Confirm cooldown starts after repeated violations.
5. Try to send during cooldown.
6. Wait for cooldown and send a respectful message.
Expected optimal behavior:
- Unsafe text is not sent to AI provider.
- Cooldown timer is clear.
- User can recover after cooldown.
Faulty behavior:
- Unsafe text appears in chat history.
- Cooldown never ends.
- Cooldown bypass via refresh or route change is possible unless intentionally allowed.

Scenario 6: Brain Boost quiz
Goal: Verify quiz flow and result behavior.
Flow:
1. Open `/brain-boost`.
2. Start quiz.
3. Answer questions, including correct and incorrect choices.
4. Verify score, explanation, next question, and completion state.
Expected optimal behavior:
- Question index, answer selection, feedback, and completion states are stable.
- Buttons do not resize or overlap on mobile.
Faulty behavior:
- User can double-submit.
- Score is wrong.
- Completion route or state breaks.

Scenario 7: Dashboard and progress
Goal: Verify user progress displays correctly from stored sessions.
Flow:
1. Create at least two sessions.
2. Open `/dashboard`.
3. Open `/progress`.
4. Verify score cards, recent sessions, suggested scenarios, and progress charts/sections.
Expected optimal behavior:
- Empty state is clear when no sessions exist.
- Populated state reflects real localStorage sessions.
Faulty behavior:
- NaN values, broken charts, stale session data, or misleading progress.

Scenario 8: Settings and preferences
Goal: Verify preferences persist and affect behavior.
Flow:
1. Open `/settings`.
2. Toggle read-aloud/listening.
3. Change playback speed.
4. Change preferred input mode.
5. Change level preference if available.
6. Navigate away and back.
7. Reload.
Expected optimal behavior:
- Preferences persist in localStorage.
- Header controls match settings page.
- Level preference changes route suggestions and dashboard where expected.
Faulty behavior:
- Header and settings disagree.
- Reload loses settings.
- Controls are decorative and do not change behavior.

Scenario 9: Responsive layout/navigation
Goal: Verify desktop, tablet, and mobile navigation.
Viewports:
- 390x844 mobile
- 768x1024 tablet
- 1280x800 desktop
- 1440x900 desktop
Flow:
1. Test sidebar expanded/collapsed desktop.
2. Test mobile dock links.
3. Test header back button and chat button.
4. Test all primary routes.
Expected optimal behavior:
- No horizontal overflow.
- Fixed dock does not cover inputs or CTAs.
- Active nav item is correct.
- Collapsed sidebar remains accessible via labels/tooltips.
Faulty behavior:
- Button text clipped.
- Dock overlaps Send button.
- Progress link goes to wrong route/hash.

Scenario 10: Error and offline behavior
Goal: Verify graceful handling of API failures.
Flow:
1. Block `/api/conversation`.
2. Block `/api/transcribe`.
3. Simulate slow responses.
4. Submit chat and voice input.
Expected optimal behavior:
- Loading states timeout or recover.
- Clear user-facing error appears.
- Input is re-enabled.
Faulty behavior:
- Infinite spinner.
- Silent failure.
- Duplicate retries flood APIs.

Scenario 11: Persistence and reset
Goal: Verify localStorage state model.
Flow:
1. Complete assessment and chat.
2. Reload.
3. Open dashboard/progress.
4. Use Reset Demo.
5. Confirm all local state is cleared.
Expected optimal behavior:
- Stored state is consistent.
- Reset removes assessment, sessions, preferences only as intended.
Faulty behavior:
- Partial reset leaves broken state.
- Reset button navigates incorrectly.

Scenario 12: Accessibility
Goal: Check keyboard, screen reader labels, focus order, and reduced motion.
Flow:
1. Navigate core flows using only keyboard.
2. Inspect accessible names for icon buttons.
3. Test focus visible states.
4. Enable reduced motion.
5. Check color contrast for text/buttons.
Expected optimal behavior:
- All controls reachable and named.
- Focus order follows visual order.
- Motion-heavy components respect reduced motion.
Faulty behavior:
- Icon-only buttons without labels.
- Focus trapped or lost after route changes.
- Text contrast fails.

Scenario 13: Security/privacy
Goal: Identify client exposure and unsafe data handling.
Checks:
1. Search for secrets in client code and committed files.
2. Confirm server-only env vars are not exposed with `NEXT_PUBLIC_`.
3. Confirm voice recordings are only sent on explicit capture.
4. Check moderation endpoints and provider errors do not leak implementation details.
5. Check localStorage data sensitivity and privacy page claims.
Expected optimal behavior:
- No secrets committed.
- Clear disclosure of local storage and voice provider behavior.
- API failures return safe errors.
Faulty behavior:
- Secret-like values in repo.
- API key exposed client-side.
- Voice capture starts without user action.

Scenario 14: Performance and scaling risks
Goal: Find quiet degradation risks.
Checks:
1. Inspect bundle size and heavy Three.js/framer-motion usage.
2. Test long chat histories, many sessions, and large localStorage payloads.
3. Submit rapid messages and rapid voice button toggles.
4. Review API routes for rate limiting, retries, timeouts, and request size limits.
5. Review generated scenario catalog size and client bundle impact.
6. Watch memory usage during long sessions.
Expected optimal behavior:
- UI remains responsive.
- API calls cannot be spammed easily.
- Long histories are trimmed or handled intentionally.
Faulty behavior:
- Growing localStorage slows dashboard.
- Unbounded session/message arrays.
- No provider timeout.
- Multiple voice streams remain active.

Scenario 15: Code documentation and maintainability audit
Goal: Check whether a new developer can understand and run the project.
Review these files:
- `README.md`
- `.env.example`
- `package.json`
- `playwright.config.ts`
- `scripts/run-e2e.mjs`
- `00_Project_Overview.md`
- `02_PRD.md`
- `03_UI_UX_Design_Document.md`
- `04_User_Flow_Document.md`
- `05_Frontend_Document.md`
- `06_Backend_Document.md`
- `07_Security_Document.md`
- `08_Architecture_Testing_Deployment.md`
- `PROTOTYPE_ARCHITECTURE.md`
Checks:
1. Do setup instructions match the actual Next.js app and scripts?
2. Are ports accurate?
3. Are env vars documented without leaking secrets?
4. Are testing commands accurate?
5. Are architecture docs still true after recent route/component changes?
6. Are comments helpful or stale?
7. Are important decisions documented, such as simulated fallback vs live OpenAI provider?
Expected optimal behavior:
- README lets a new dev run, test, and configure the app in under 15 minutes.
- Docs describe the current Next.js structure, not an old Vite/prototype layout.
- Known limitations are explicit.
Faulty behavior:
- README references obsolete folders or commands.
- Docs contradict current source.
- No instructions for live voice transcription.
- No handoff notes for Supabase/Upstash/OpenAI setup.

Automated test expansion recommendations:
After exploratory testing, propose concrete tests to add:
- Unit tests for transcript API missing-key and invalid-audio responses.
- Component tests for chat textarea receiving interim speech text.
- E2E test for settings preference persistence.
- E2E test for sidebar/mobile dock navigation.
- E2E test for progress page with seeded localStorage sessions.
- API/provider tests for live provider failure and timeout handling.

Manual evidence requirements:
- Save screenshots for every High/Critical issue.
- Save Playwright traces for failing e2e flows.
- Include console errors and network status codes.
- Include file/line references for code/documentation issues.

Final output:
Write the report in plain Markdown. Lead with the highest-risk issues. Do not bury blockers in prose. Include an issue table:

| ID | Severity | Category | Title | Route/File | Status |

Then include full details for each issue. If no issue is found in a category, state “No confirmed issue found” and list residual risk.

Be strict. The goal is not to praise the app; the goal is to make the handoff safe for another developer and prevent quiet failures in production.
```

## Known Documentation Issue To Verify First

The current `README.md` appears stale: it references a Vite + React shape, port `4173`, `shared/`, `mobile/`, `prototype/`, and `npm run smoke`, while the current project is a Next.js app with scripts such as `npm run dev`, `npm run build`, `npm run test`, and `npm run test:e2e`. Treat this as a likely documentation finding unless the repo has been intentionally preserving old prototype notes.
