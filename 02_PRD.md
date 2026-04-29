# Fluentia — Product Requirements Document

## 1. Overview
Fluentia is an AI-powered speaking coach that helps students practice English confidently through guided scenarios, context-aware coaching, and supportive feedback.

## 2. Problem Statement
Many learners understand English but struggle with speaking confidence, tone, and real-time sentence construction. Existing tools often correct grammar but do not teach how to speak appropriately in real situations.

## 3. Product Goals
- Build speaking confidence
- Teach situational communication
- Provide positive, actionable AI feedback
- Adapt to user proficiency levels
- Maintain a safe and student-friendly environment
- Deliver a premium, immersive interface

## 4. Target Users
- School and college students
- Early English learners
- Intermediate learners who need confidence practice
- Users preparing for interviews, presentations, and everyday conversations

## 5. Core Use Cases
- A user completes an assessment and gets assigned a level
- A user practices formal speaking for an interview
- A user practices casual speaking with friends
- A user receives tone and fluency feedback
- A user rephrases unsafe input after moderation warning

## 6. Functional Requirements

### 6.1 Onboarding and Level Assessment
- New users must see a short assessment before entering the main app
- Assessment should measure:
  - Grammar
  - Vocabulary
  - Fluency
  - Pronunciation confidence (simulated if voice unavailable)
- System assigns one of:
  - Beginner
  - Intermediate
  - Advanced
- The level should affect:
  - Scenario difficulty
  - Feedback depth
  - Vocabulary suggestions
  - Prompt complexity

### 6.2 Scenario-Based Speaking Practice
Supported scenarios should include:
- Job interview
- Classroom answer
- Daily communication
- Friends chat
- Ordering food
- Asking for help
- Self-introduction
- Presentation practice

### 6.3 Mode Selection
- Formal Mode: polite, structured, professional responses
- Casual Mode: natural, friendly, relaxed responses

### 6.4 Conversation Input
- Text input required
- Voice input simulated in prototype
- Input can be sent as one sentence or multiple turns

### 6.5 AI Feedback
For each completed response, the system should show:
- Fluency score out of 10
- Confidence meter
- Tone feedback
- Grammar correction
- Pronunciation feedback
- Vocabulary suggestion
- Sentence improvement
- Simple improved response
- Advanced improved response

### 6.6 Encouraging Feedback Style
The AI must:
- Start with strengths
- Frame corrections positively
- Avoid negative wording
- Use supportive coaching language

### 6.7 Safety and Moderation
- Detect offensive, abusive, sexual, violent, hateful, or unsafe language
- Stop processing unsafe input
- Show a polite rephrase warning
- Repeated misuse should trigger stronger warnings
- Temporary restriction may be applied after repeated violations

## 7. Non-Functional Requirements
- Premium visual quality
- Fast response time
- Responsive layout for desktop and mobile
- Accessible text contrast
- Smooth animations with low distraction
- Modular and testable codebase
- Scalable backend design

## 8. Success Metrics
- Assessment completion rate
- Practice session completion rate
- Feedback engagement rate
- Return sessions per user
- Low safety incident rate
- High user satisfaction with feedback clarity

## 9. Scope
### In Scope
- Web app
- React Native mobile app
- Simulated AI prototype
- Real AI integration path
- Level assessment
- Safety moderation
- Full UI system

### Out of Scope for Prototype
- Real-time speech recognition accuracy
- Full speech-to-speech latency optimization
- Full LMS integration
- Social/community features
- Payment/subscription flows

## 10. Assumptions
- Voice input can be simulated in prototype
- AI replies can be mocked when API keys are unavailable
- The interface should prioritize clarity and premium feel over feature density
