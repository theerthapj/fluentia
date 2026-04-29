# Fluentia — UI/UX Design Document

## 1. Design Goals
Fluentia should feel:
- Premium
- Calming
- Intelligent
- Immersive
- Confidence-building
- Easy to navigate

## 2. Design System

### 2.1 Color Palette
- Background Primary: #0F172A
- Background Secondary: #111827
- Surface: #172033
- Surface Elevated: #1E293B
- Primary Accent: #14B8A6
- Secondary Accent: #3B82F6
- Success: #22C55E
- Warning: #F59E0B
- Error: #EF4444
- Text Primary: #F8FAFC
- Text Secondary: #CBD5E1
- Border/Divider: rgba(255,255,255,0.08)

### 2.2 Typography
Recommended stack:
- Headings: Inter / SF Pro / system-ui
- Body: Inter / SF Pro / system-ui

Type scale:
- H1: 40–48px, bold
- H2: 28–32px, semibold
- H3: 20–24px, semibold
- Body: 16px
- Small: 13–14px
- Caption: 12px

Typography rules:
- Use short, readable labels
- Keep line length compact
- Prefer strong hierarchy over decorative text

### 2.3 Spacing and Layout
- Base spacing unit: 8px
- Card padding: 20–28px
- Screen horizontal padding: 20px
- Section spacing: 24–40px
- Radius: 16px for cards, 999px for pills
- Shadows: soft layered shadows, never harsh

### 2.4 Motion
- Use subtle fade, lift, and scale animations
- Buttons should animate on press
- Cards may float slightly on hover
- Loading state should feel intelligent and calm
- Avoid overly playful motion

## 3. Component Design

### 3.1 Buttons
Primary button:
- Teal fill
- Bold label
- Soft glow on hover/focus
- Rounded full-width style for key actions

Secondary button:
- Outline or muted surface style
- Used for mode switching and back actions

Tertiary button:
- Text-only for low-priority actions

### 3.2 Cards
- Premium glass-like surface with controlled blur
- Layered borders and shadow depth
- Title, subtitle, and small supporting label
- Optional icon with gradient accent

### 3.3 Chat UI
User messages:
- Right aligned
- Teal or blue accent edge
- High readability

AI messages:
- Left aligned
- Slightly lighter surface
- Include structured sections when giving feedback

System messages:
- Centered or muted banner style

### 3.4 Feedback Panel
Include:
- Fluency score ring or meter
- Confidence meter
- Tone indicator
- Feedback summary
- Strengths
- Improvements
- Example rewrites

### 3.5 Assessment Component
- Single-question or step-based layout
- Progress indicator
- Clear prompt cards
- Friendly completion state

## 4. 3D Interaction Ideas
- Floating hero cards with parallax depth
- Slight camera tilt on desktop hero section
- Layered panels with different z-depths
- Soft ambient gradients behind main content
- Hover lift on cards and scenario tiles
- Animated score ring and confidence meter
- Subtle motion trail on primary CTA

## 5. Screen-by-Screen UI Description

### 5.1 Splash Screen
- Centered Fluentia logo
- Ambient gradient background
- Short tagline
- Soft loading motion

### 5.2 Home Screen
- Hero card with “Start Speaking”
- Level badge
- Quick access to recent scenarios
- Minimal navigation
- No duplicated buttons in header and content

### 5.3 Assessment Screen
- Progress stepper
- Friendly prompts
- Clean answer cards
- Final level result with explanation

### 5.4 Mode Selection Screen
- Two large cards:
  - Formal Mode
  - Casual Mode
- Each card shows use-case examples

### 5.5 Scenario Selection Screen
- Grid of scenario cards
- Icons, labels, and level tags
- Recommended scenarios highlighted

### 5.6 Conversation Screen
- Chat bubbles
- Input bar
- Voice button simulation
- Scenario context bar
- Safety banner when needed

### 5.7 Loading Screen
- Animated analysis state
- Copy such as “Analyzing tone, fluency, and confidence…”
- Skeleton or pulsing cards

### 5.8 Feedback Screen
- Score summary at top
- Strengths first
- Improvement suggestions next
- Two rewritten responses
- Action button: Try Another Response

## 6. UX Principles
- Every screen should answer one main question
- Reduce cognitive load
- Show only necessary options
- Guide the user step-by-step
- Keep feedback motivating and specific
- Make safety warnings calm and clear
