# Fluentia — Security Document

## 1. Security Objectives
- Protect user data
- Prevent harmful or abusive interactions
- Secure AI and API access
- Limit misuse and spam
- Maintain a safe environment for younger users

## 2. User Data Handling
- Collect only necessary profile and learning data
- Avoid storing unnecessary voice artifacts
- Minimize retention of raw input where possible
- Store progress data separately from sensitive logs
- Allow account deletion and data export workflows if implemented later

## 3. Input Validation
- Validate all text before processing
- Enforce maximum length
- Reject empty and malformed payloads
- Normalize Unicode and strip dangerous control characters
- Detect repeated spam and unusual patterns
- Sanitize all rendered content to prevent injection

## 4. Moderation and Safety
- Apply moderation before AI generation
- Block offensive, sexual, hateful, violent, or unsafe language
- Use warning escalation for repeat misuse
- Keep moderation responses calm and respectful
- Never let unsafe input continue into normal coaching flow

## 5. API Protection
- Authenticate requests where required
- Use short-lived tokens
- Rate limit chat and assessment endpoints
- Protect API keys on the server only
- Never expose Claude/OpenAI keys in client code
- Validate origin and referer for public routes if needed
- Use CSRF protection where applicable

## 6. Privacy Considerations
- Clearly explain what is collected and why
- Keep learning analytics separate from identity data
- Avoid unnecessary profiling
- Provide privacy-friendly defaults
- Do not display raw unsafe content publicly in logs or UI

## 7. Content Safety Rules
The system should:
- Respond politely
- Refuse unsafe requests
- Redirect to educational phrasing
- Stay neutral and age-appropriate
- Avoid engaging in harmful or explicit topics

## 8. Abuse Handling
- First violation: gentle warning
- Second violation: stronger warning
- Third violation: temporary lockout or cooldown
- Severe content: immediate block and log event

## 9. Secure Engineering Practices
- Use environment variables for secrets
- Rotate keys regularly
- Keep dependencies updated
- Perform dependency scanning
- Use least-privilege service accounts
- Review logs for abuse patterns

## 10. Data Retention
- Keep only what is needed for learning and progress
- Define retention windows for moderation logs
- Allow deletion of inactive records when appropriate
