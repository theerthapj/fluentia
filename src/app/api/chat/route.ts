// STEP 12: /src/app/api/chat/route.ts
// Fluvi-specific chat API route.
// The existing conversation API is at /api/conversation/ — this is a NEW, separate route.
// Server-side only — no API keys in client code.

import { NextResponse } from 'next/server';
import { buildFluviSystemPrompt } from '@/lib/ai/fluvi-system-prompt';

const CLAUDE_MODEL = 'claude-sonnet-4-20250514';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

interface FluviChatRequest {
  message: string;
  mode: 'formal' | 'casual';
  level: 'beginner' | 'intermediate' | 'advanced';
  scenario: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  requestFeedback?: boolean;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FluviChatRequest;

    const { message, mode, level, scenario, history = [], requestFeedback = false } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Graceful fallback: return a safe default rather than crashing
      return NextResponse.json({
        safe: true,
        reply: "I'm having a little trouble connecting right now. Please try again in a moment! 🦚",
        isFeedback: false,
      });
    }

    const systemPrompt = buildFluviSystemPrompt(mode ?? 'casual', level ?? 'beginner', scenario ?? 'General practice');

    // Build conversation history for Claude
    const messages: { role: 'user' | 'assistant'; content: string }[] = [
      ...history,
      {
        role: 'user',
        content: requestFeedback
          ? `Please analyze my response and return JSON feedback: "${message}"`
          : message,
      },
    ];

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: requestFeedback ? 1024 : 512,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      // Non-crashing fallback
      return NextResponse.json({
        safe: true,
        reply: "Fluvi is taking a short break. Let's continue in a moment! 🦚",
        isFeedback: false,
      });
    }

    const data = (await response.json()) as {
      content: { type: string; text: string }[];
    };

    const textContent = data.content.find((c) => c.type === 'text');
    if (!textContent) {
      return NextResponse.json({
        safe: true,
        reply: "Fluvi couldn't quite hear that. Try again!",
        isFeedback: false,
      });
    }

    const replyText = textContent.text.trim();

    // Detect if this is a JSON feedback response
    if (requestFeedback) {
      try {
        // Strip markdown code fences if present
        const cleaned = replyText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        const parsed = JSON.parse(cleaned);
        return NextResponse.json({ safe: true, feedback: parsed, isFeedback: true });
      } catch {
        // JSON parse failed — return as plain reply
        return NextResponse.json({ safe: true, reply: replyText, isFeedback: false });
      }
    }

    return NextResponse.json({ safe: true, reply: replyText, isFeedback: false });
  } catch {
    // Top-level error guard — never crash the UI
    return NextResponse.json({
      safe: true,
      reply: "Fluvi is thinking... please try again! 🦚",
      isFeedback: false,
    });
  }
}
