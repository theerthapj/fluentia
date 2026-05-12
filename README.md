# Fluentia

Fluentia is an AI English speaking coach built with Next.js App Router, React, TypeScript, Tailwind CSS, Vitest, and Playwright. The current app focuses on assessment, scenario practice, free chat, voice capture, feedback, progress tracking, and local demo persistence.

## Requirements

- Node.js 22.x
- npm 10.x

## Local Setup

```powershell
npm install
npm run dev
```

The Next dev server defaults to `http://localhost:3000`. The Playwright e2e runner starts its own server at `http://127.0.0.1:3210`.

## Environment

Copy `.env.example` to `.env.local` and fill only the services you need.

| Variable | Required | Purpose |
|---|---:|---|
| `NEXT_PUBLIC_AI_MODE` | No | Optional client-visible mode label for deployments. |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Optional Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Optional Supabase browser anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Reserved for server-only Supabase workflows. Do not expose it client-side. |
| `UPSTASH_REDIS_REST_URL` | No | Reserved for production rate-limit storage. The app has an in-memory local fallback. |
| `UPSTASH_REDIS_REST_TOKEN` | No | Reserved for production rate-limit storage. |
| `OPENAI_API_KEY` | Yes for live use | Enables OpenAI chat responses and Whisper voice transcription. Without it, chat and transcription return clear unavailable states. |
| `OPENAI_CHAT_MODEL` | No | Chat model override. Defaults to `gpt-4o-mini`. |
| `OPENAI_TRANSCRIPTION_MODEL` | No | Transcription model override. Defaults to `whisper-1`. |

Never commit real secret values.

## Scripts

```powershell
npm run lint
npm run test
npm run build
npm run test:e2e
```

- `lint` runs ESLint.
- `test` runs Vitest unit/component tests.
- `build` creates a production Next.js build.
- `test:e2e` runs Playwright journeys through `scripts/run-e2e.mjs`.

## Project Shape

- `src/app` contains Next.js routes and API handlers.
- `src/components` contains UI, layout, chat, dashboard, settings, and onboarding components.
- `src/lib` contains scenario data, AI providers, validation, moderation, Supabase helpers, and server request guards.
- `src/__tests__` contains Vitest coverage.
- `e2e` contains Playwright journeys.
- `qa-evidence` and `FLUENTIA_QA_REPORT.md` are QA artifacts from the latest audit.

## Local Data Model

This prototype stores assessment results, selected level, preferences, conversation state, sessions, and moderation warning state in browser `localStorage`. The app restores saved level/progress on reopen and only starts a new assessment when the learner explicitly chooses to retake it. The persisted state is versioned and bounded for local use, but production accounts should move durable progress, server-side cooldowns, and analytics into a backend store.

Use **Reset Demo** from the sidebar to clear local app state and moderation warnings.

## AI And Voice Behavior

- Fluentia no longer returns simulated coaching responses from the app chat APIs.
- With `OPENAI_API_KEY`, `/api/conversation` and `/api/chat` call OpenAI chat completions and return a visible provider error if OpenAI is unavailable.
- Voice capture only sends audio to `/api/transcribe` after the user explicitly starts recording.
- `/api/transcribe` returns a non-blocking missing-key error when live transcription is not configured.

## Product Docs

- `00_Project_Overview.md`
- `02_PRD.md`
- `03_UI_UX_Design_Document.md`
- `04_User_Flow_Document.md`
- `05_Frontend_Document.md`
- `06_Backend_Document.md`
- `07_Security_Document.md`
- `08_Architecture_Testing_Deployment.md`
- `PROTOTYPE_ARCHITECTURE.md`

Some historical product documents still describe prototype-era decisions. Treat this README and the current source tree as the authoritative local development guide.
