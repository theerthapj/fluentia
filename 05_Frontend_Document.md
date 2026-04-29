# Fluentia — Frontend Document

## 1. Platform Strategy
Build a shared product experience across:
- Web: premium 3D immersive app
- Mobile: React Native companion app

## 2. Recommended Tech Stack

### Web
- Next.js or Vite + React
- TypeScript
- Tailwind CSS
- Framer Motion for motion
- Three.js / React Three Fiber for 3D elements
- Zustand or Redux Toolkit for state
- React Query or TanStack Query for data fetching
- Zod for validation
- Socket or fetch-based chat updates

### Mobile
- React Native
- TypeScript
- React Navigation
- Reanimated for motion
- Shared design tokens with web
- Same API contracts as web

## 3. Component Architecture
Suggested structure:
- app/
- components/
- features/
  - assessment/
  - chat/
  - feedback/
  - safety/
  - scenarios/
  - onboarding/
- hooks/
- services/
- store/
- theme/
- utils/
- types/

## 4. UI Composition Strategy
- Build a reusable shell layout
- Use a shared card system
- Keep the chat experience consistent across web and mobile
- Separate feature-level components from generic UI primitives
- Use design tokens for color, spacing, radius, and shadow

## 5. State Management
Recommended state slices:
- auth/session
- onboarding
- userLevel
- scenario
- conversation
- analysisResult
- moderation
- uiPreferences
- loading/error

## 6. Rendering Strategy

### Web
- Use server-rendered shell or static route where possible
- Hydrate interactive components only where needed
- Use suspense boundaries for AI analysis states
- Lazy-load 3D modules

### Mobile
- Use native navigation and native-safe layouts
- Keep 3D effects minimal or simulated with gradients and motion
- Prioritize performance and battery-friendly animations

## 7. Key Frontend Modules

### 7.1 Assessment Module
- Displays prompts
- Collects answers
- Calculates level display state
- Sends assessment payload to backend

### 7.2 Chat Module
- Message list
- Input bar
- Voice simulation button
- Safety banner
- Scenario context header

### 7.3 Feedback Module
- Score summary
- Tone indicator
- Confidence meter
- Suggestions
- Rewrite cards

### 7.4 Moderation Module
- Pre-submit input check
- Block state UI
- Warning banners
- Escalation tracking

## 8. Design Token Strategy
Use a shared token layer for:
- colors
- spacing
- typography
- radii
- shadows
- animation timing

## 9. Performance Strategy
- Minimize heavy 3D assets on mobile
- Use code splitting for scenario and feedback features
- Cache recent scenario data
- Prefer lightweight UI surfaces over expensive effects
- Keep animation budget low on low-end devices

## 10. Accessibility
- Strong text contrast
- Keyboard navigation on web
- Screen reader labels for buttons and score meters
- Avoid color-only meaning
- Large tap targets on mobile

## 11. Recommended API Consumption Pattern
- Submit chat turn
- Receive moderation status
- Receive analysis payload
- Render response
- Keep one source of truth for conversation state
