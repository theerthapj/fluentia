# Fluentia — System Architecture, Testing, and Deployment

## 1. System Architecture
Fluentia should follow a modular, service-oriented architecture:

### Client Layer
- Web app
- React Native app

### API Layer
- Auth service
- Assessment service
- Conversation service
- Moderation service
- Feedback service
- Progress service

### AI Layer
- Prompt builder
- Safety pre-check
- Real model provider adapter
- Simulated response provider
- Response post-processor

### Data Layer
- PostgreSQL
- Redis
- Optional analytics store

## 2. Request Lifecycle
1. User submits text or voice transcript
2. Client validates basic constraints
3. Backend moderates the input
4. If safe, AI analysis runs
5. Structured feedback is returned
6. Client updates chat and feedback UI
7. Progress is saved

## 3. Testing Strategy

### Unit Tests
- Validation utilities
- Score mapping
- Moderation rule helpers
- Prompt builders
- Response parsers

### Integration Tests
- Assessment submission flow
- Conversation message flow
- Safety block flow
- AI fallback flow
- Progress persistence flow

### UI Tests
- Home to assessment navigation
- Mode and scenario selection
- Chat input and feedback rendering
- Warning states
- Loading states

### E2E Tests
- New user onboarding
- Safe input conversation
- Unsafe input rejection
- Level assignment journey
- Mobile responsiveness

### Security Tests
- Rate-limit behavior
- Invalid token handling
- Injection attempts
- Unsafe content bypass attempts

## 4. Deployment Plan

### Web
- Deploy frontend on a modern hosting platform
- Use CDN for static assets
- Enable image and script optimization
- Separate preview and production environments

### Backend
- Deploy API to a container or serverless environment
- Use environment-based configuration
- Enable health checks and structured logs

### Mobile
- Ship with the same API contracts as web
- Use staged rollout for releases
- Keep remote config for feature toggles if needed

## 5. Environments
- Local development
- Preview/staging
- Production

## 6. Release Strategy
- Phase 1: Simulated AI prototype
- Phase 2: Real AI integration behind a toggle
- Phase 3: Safety refinement and performance improvements
- Phase 4: Mobile parity and polish

## 7. Monitoring
- API latency
- Moderation block rate
- AI failure rate
- User drop-off points
- Assessment completion rate
- Feedback usage rate

## 8. Operational Safeguards
- Fail closed on moderation issues
- Use fallback responses when AI is unavailable
- Keep a manual kill switch for real AI provider outages
- Track abnormal content spikes
