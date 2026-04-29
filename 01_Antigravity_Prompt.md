# Antigravity Prompt for Fluentia

## Goal
Build a premium, immersive, dark-theme 3D web and mobile app called **Fluentia** — an AI English speaking coach for students who understand English but lack confidence in speaking.

## Prompt
Design and generate a polished AI language-learning product called **Fluentia** for **web and React Native mobile**. The app must feel like a premium, futuristic learning experience with dark-mode visuals, teal and soft blue accents, subtle 3D depth, floating cards, layered shadows, smooth transitions, and a highly refined modern UI.

### Product Objective
Fluentia helps users improve English speaking confidence through real-life scenario practice, context-aware guidance, tone analysis, fluency scoring, and supportive AI feedback. It should not behave like a generic chatbot; it must feel like a smart speaking coach.

### Required Experience
- First-time users must complete a **level assessment** to determine **Beginner, Intermediate, or Advanced**
- Users should practice by scenario and mode:
  - Formal Mode
  - Casual Mode
- The app must support:
  - Text input
  - Simulated voice input
- The AI feedback must include:
  - Grammar correction
  - Pronunciation feedback (simulated)
  - Vocabulary improvement
  - Sentence improvement
  - Tone analysis
  - Confidence detection
  - Fluency score out of 10
  - Confidence meter
  - Simple and advanced improved responses
- Feedback must always be:
  - Encouraging
  - Constructive
  - Strength-first
  - Never harsh or discouraging

### Safety Requirements
Implement a moderation layer that detects offensive, unsafe, or inappropriate input. If unsafe content is detected:
- Stop the conversation
- Show a gentle warning
- Ask the user to rephrase respectfully
- Do not continue until the input is corrected
- Escalate warnings on repeated misuse

### Screen Flow
1. Splash screen
2. Home screen with “Start Speaking”
3. Level assessment for new users
4. Mode selection
5. Scenario selection
6. Chat-style conversation screen
7. Loading state: “Analyzing tone, fluency, and confidence…”
8. Detailed feedback screen

### Visual Direction
- Dark background: deep navy
- Primary accent: teal
- Secondary accent: soft blue
- Premium cards with depth
- Glass-like overlays used sparingly
- Minimal, clean typography
- Chat bubbles with strong visual hierarchy
- Elegant motion, not distracting animation
- 3D atmosphere through layered shadows, gradients, and subtle parallax

### Functional Direction
- Build the app as a working prototype with realistic AI responses
- Support a real AI integration path using Claude/OpenAI APIs
- Include a simulated AI mode for development and demo
- Use a modular architecture
- Keep navigation simple and intuitive
- Avoid duplicated features across top navigation and home screen

### Output Expectations
Generate a production-minded UI and architecture that is suitable for a student demo, a designer handoff, and developer implementation.
