// Fluvi-specific chat API route.
// Server-side only: no API keys in client code.

import { NextResponse } from 'next/server';
import { buildFluviSystemPrompt } from '@/lib/ai/fluvi-system-prompt';
import { API_GUARD_LIMITS, fetchWithTimeout } from '@/lib/server/request-guards';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

type ChatMessage = { role: 'user' | 'assistant'; content: string };
type OpenAIChatResult = { ok: true; text: string } | { ok: false; status: number; error: string };

interface FluviChatRequest {
  message: string;
  mode: 'formal' | 'casual';
  level: 'beginner' | 'intermediate' | 'advanced';
  scenario: string;
  history?: ChatMessage[];
  requestFeedback?: boolean;
}

function openAIError(error: string, status: number) {
  return NextResponse.json(
    {
      safe: false,
      reply: null,
      isFeedback: false,
      provider: 'openai',
      error,
    },
    { status },
  );
}

function missingKeyError() {
  return NextResponse.json({
    safe: false,
    reply: null,
    isFeedback: false,
    provider: 'openai',
    error: 'OPENAI_API_KEY is not configured.',
  }, { status: 503 });
}

function cleanJsonText(text: string) {
  return text.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
}

async function callOpenAI({
  apiKey,
  systemPrompt,
  messages,
  requestFeedback,
}: {
  apiKey: string;
  systemPrompt: string;
  messages: ChatMessage[];
  requestFeedback: boolean;
}): Promise<OpenAIChatResult> {
  let response: Response;
  try {
    response = await fetchWithTimeout(
      OPENAI_API_URL,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.OPENAI_CHAT_MODEL?.trim() || 'gpt-4o-mini',
          temperature: 0.7,
          max_tokens: requestFeedback ? 1024 : 512,
          ...(requestFeedback ? { response_format: { type: 'json_object' } } : {}),
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
        }),
      },
      API_GUARD_LIMITS.conversationTimeoutMs,
    );
  } catch {
    return { ok: false, status: 504, error: 'OpenAI chat provider timed out.' };
  }

  if (!response.ok) {
    return { ok: false, status: 502, error: `OpenAI chat failed with status ${response.status}.` };
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim();

  if (!text) return { ok: false, status: 502, error: 'OpenAI chat returned no content.' };
  return { ok: true, text };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FluviChatRequest;

    const { message, mode, level, scenario, history = [], requestFeedback = false } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const openAiKey = process.env.OPENAI_API_KEY?.trim();
    if (!openAiKey) return missingKeyError();

    const systemPrompt = buildFluviSystemPrompt(mode ?? 'casual', level ?? 'beginner', scenario ?? 'General practice');
    const messages: ChatMessage[] = [
      ...history,
      {
        role: 'user',
        content: requestFeedback ? `Please analyze my response and return JSON feedback: "${message}"` : message,
      },
    ];

    const result = await callOpenAI({ apiKey: openAiKey, systemPrompt, messages, requestFeedback });
    if (!result.ok) return openAIError(result.error, result.status);
    const replyText = result.text;

    if (requestFeedback) {
      try {
        const parsed = JSON.parse(cleanJsonText(replyText));
        return NextResponse.json({ safe: true, feedback: parsed, isFeedback: true, provider: 'openai' });
      } catch {
        return NextResponse.json({ safe: true, reply: replyText, isFeedback: false, provider: 'openai' });
      }
    }

    return NextResponse.json({ safe: true, reply: replyText, isFeedback: false, provider: 'openai' });
  } catch {
    return openAIError('OpenAI chat is unavailable.', 502);
  }
}
