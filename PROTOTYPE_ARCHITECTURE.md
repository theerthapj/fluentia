# Fluentia Prototype Architecture

## What Was Built
This workspace now includes a working web prototype plus shared contracts for a future React/Vite and React Native implementation.

- `prototype/index.html` is the runnable browser entry.
- `prototype/app.js` owns the simulated product logic, assessment, moderation, state transitions, and feedback generation.
- `prototype/styles.css` defines the premium dark 3D visual system.
- `shared/aiContracts.ts` defines API/provider response shapes for web, mobile, and backend.
- `shared/moderation.ts` provides a portable moderation helper.
- `mobile/FluentiaPrototype.tsx` is a React Native companion screen flow using the same product contracts.

## Product Flow
1. Splash
2. Home with Start Speaking
3. Level assessment for new users
4. Formal or Casual mode selection
5. Scenario selection
6. Conversation with text and simulated voice
7. Moderation pre-check
8. Analysis loading state
9. Detailed feedback screen

## AI Integration Path
The prototype runs in simulated mode. A production backend can replace the local generator with a provider abstraction:

```ts
interface AiProvider {
  analyzeTurn(request: ConversationRequest): Promise<ConversationResponse>;
}
```

Recommended production sequence:

1. Client validates basic length and input mode.
2. Backend normalizes and moderates input.
3. Unsafe content returns a blocked moderation result and no model call.
4. Safe content is sent to the selected AI provider.
5. Provider output is parsed into `FeedbackPayload`.
6. Client renders the structured coaching UI.

## Safety Behavior
Moderation runs before simulated AI analysis. Unsafe, offensive, sexual, violent, hateful, spam-like, empty, and too-short inputs are blocked. Repeated misuse escalates from a gentle warning to a cooldown state.

## React Native Handoff
The mobile file is intentionally compact and screen-focused. In a production app, split it into:

- `features/assessment`
- `features/scenarios`
- `features/chat`
- `features/feedback`
- `features/safety`
- `theme/tokens`
- `services/ai`
- `services/moderation`

Use React Navigation for screen routing and Reanimated for the same calm motion language used in the web prototype.

## Demo Notes
Open `prototype/index.html` in a browser. The app stores assessment level and warning count in `localStorage`; use Reset Demo on the home screen to restart the first-time flow.
