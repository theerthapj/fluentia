# Fluentia

Fluentia is a premium AI English speaking coach prototype focused on helping students build real speaking confidence through scenario practice, tone-aware coaching, and supportive feedback.

## Local Preview
- Install dependencies with `npm install`.
- Start the web app with `npm run dev`.
- The default preview target is `http://127.0.0.1:4173`.

## Project Shape
- `src/` contains the Vite + React web app.
- `shared/` contains reusable moderation logic and AI-facing TypeScript contracts.
- `mobile/FluentiaPrototype.tsx` remains the React Native handoff sketch.
- `prototype/` keeps the original static reference implementation and earlier smoke assets.

## Quality Checks
- `npm run build` verifies the TypeScript + Vite bundle.
- `npm run smoke` runs the Playwright journey and moderation checks once dependencies are installed.

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
