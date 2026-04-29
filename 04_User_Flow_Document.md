# Fluentia — User Flow Document

## 1. Primary App Workflow
1. Open app
2. See splash screen
3. New user completes assessment
4. System assigns level
5. User lands on home screen
6. User chooses formal or casual mode
7. User selects a speaking scenario
8. User enters text or simulated voice input
9. System checks safety
10. If safe, AI analyzes input
11. Loading screen appears
12. Feedback screen shows results
13. User tries again or starts a new scenario

## 2. First-Time User Journey
- User opens app for the first time
- App explains that it will assess speaking level
- User answers brief speaking prompts
- App evaluates grammar, vocabulary, fluency, and confidence
- User receives Beginner / Intermediate / Advanced badge
- App suggests a recommended scenario path

## 3. Returning User Journey
- User opens app
- Lands on home screen with saved level
- Sees recommended scenarios
- Starts speaking immediately
- Receives coaching feedback based on prior level

## 4. Scenario Practice Journey
- Choose mode
- Choose scenario
- Enter response
- Receive feedback
- Rewrite answer using suggestions
- Re-test with improved response

## 5. Safety Flow
### Safe Input
- Input passes moderation
- AI response continues normally

### Unsafe Input
- Input is blocked before AI generation
- User sees a calm warning:
  “Please use respectful and appropriate language. Try rephrasing your sentence.”
- App requests a respectful rewrite
- Conversation remains paused until corrected

### Repeated Misuse
- First violation: gentle warning
- Second violation: stronger warning
- Third violation: temporary restriction or cooldown state

## 6. Edge Cases
- Empty input: prompt user to enter a sentence
- Very short input: ask user to add more detail
- Unsupported language: ask user to try English
- Voice simulation unavailable: fallback to text input
- API failure: show retry state and safe fallback response
- Assessment incomplete: save progress and continue later
- User tries unsafe content in repeated loops: apply cooldown
- Mobile small-screen layout: collapse side details into accordions

## 7. Navigation Rules
- Top-level navigation should remain minimal
- Avoid repeating the same feature in multiple places
- Primary actions must always be visible
- Secondary actions should move into menus or contextual controls

## 8. State Transitions
- Unassessed -> Assessment
- Assessed -> Home
- Home -> Mode Selection
- Mode Selection -> Scenario Selection
- Scenario Selection -> Conversation
- Conversation -> Loading
- Loading -> Feedback
- Feedback -> Conversation or Home

## 9. Journey Outcomes
A successful journey ends with:
- Clear feedback
- Positive reinforcement
- A visible learning improvement
- A next action that feels obvious
