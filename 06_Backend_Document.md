# Fluentia — Backend Document

## 1. Backend Goals
- Provide safe AI coaching
- Support both simulated and real AI modes
- Store user progress and level
- Return structured feedback responses
- Enforce moderation and rate limits

## 2. Recommended Backend Stack
- Node.js or Python backend
- TypeScript if using Node.js
- PostgreSQL for relational data
- Redis for caching, rate limiting, and short-lived session state
- Object storage only if media logs are needed
- Background jobs for analysis and logging
- API-first architecture

## 3. API Structure

### Authentication
- POST /auth/signup
- POST /auth/login
- POST /auth/logout
- GET /auth/me

### Assessment
- POST /assessment/start
- POST /assessment/submit
- GET /assessment/result

### Scenarios
- GET /scenarios
- GET /scenarios/:id

### Conversation
- POST /conversation/start
- POST /conversation/message
- GET /conversation/:id
- POST /conversation/:id/retry

### Feedback
- GET /feedback/:conversationId

### Moderation
- POST /moderation/check
- GET /moderation/history

### User Progress
- GET /user/progress
- PATCH /user/progress

## 4. Data Flow

### Normal Flow
1. Client sends message
2. Backend validates payload
3. Moderation runs first
4. If safe, analysis engine runs
5. AI response is generated
6. Response is normalized into structured feedback
7. Client renders chat and feedback panels

### Unsafe Flow
1. Client sends message
2. Moderation flags content
3. Backend returns block response
4. Client shows warning
5. No AI analysis is executed

## 5. AI Integration

### Simulated Mode
Use deterministic templates for:
- assessment scoring
- feedback generation
- tone labels
- confidence labels
- rewrite suggestions

This supports demos without API keys.

### Real AI Mode
Integrate Claude or OpenAI through a provider abstraction:
- Prompt builder
- Safety filter
- Response parser
- Fallback handler

Recommended behavior:
- System prompt enforces supportive coaching style
- Output should be structured JSON
- Temperature should remain moderate for consistency
- Separate moderation stage before generation

## 6. Structured AI Response Schema
Example output fields:
- fluencyScore
- confidenceLevel
- toneLabel
- strengths[]
- improvements[]
- grammarCorrections[]
- pronunciationNotes[]
- vocabularySuggestions[]
- simpleRewrite
- advancedRewrite
- encouragementMessage
- safetyStatus

## 7. Database Design

### Users
- id
- name
- email
- passwordHash
- createdAt
- currentLevel
- assessmentCompleted

### Assessments
- id
- userId
- grammarScore
- vocabularyScore
- fluencyScore
- pronunciationScore
- totalScore
- assignedLevel
- createdAt

### Scenarios
- id
- title
- category
- mode
- difficulty
- promptText

### Conversations
- id
- userId
- scenarioId
- mode
- status
- createdAt

### Messages
- id
- conversationId
- senderType
- content
- safetyStatus
- createdAt

### Feedback
- id
- conversationId
- fluencyScore
- confidenceLevel
- toneLabel
- structuredPayloadJson
- createdAt

### ModerationEvents
- id
- userId
- conversationId
- category
- severity
- actionTaken
- createdAt

## 8. Business Logic
- New users must complete assessment
- Level affects scenario suggestions
- Moderation always precedes AI generation
- Repeated misuse increases severity
- Feedback should prioritize encouragement
- Analysis should be stored for progress tracking

## 9. Error Handling
- API failure: return safe fallback message
- AI timeout: return “Try again” state
- Moderation service down: fail closed for safety
- Database failure: return minimal safe response and log incident

## 10. Logging and Observability
- Log moderation actions
- Log AI latency
- Log API failures
- Track repeated misuse
- Avoid storing sensitive raw content longer than necessary
