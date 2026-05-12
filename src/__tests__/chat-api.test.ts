import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/chat/route';

function chatRequest(body: Record<string, unknown>) {
  return new Request('http://test.local/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      message: 'I would like to practice ordering coffee.',
      mode: 'casual',
      level: 'beginner',
      scenario: 'Coffee shop',
      ...body,
    }),
  });
}

describe('/api/chat', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('uses OpenAI when OPENAI_API_KEY is configured', async () => {
    vi.stubEnv('OPENAI_API_KEY', 'test-openai-key');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          choices: [{ message: { content: 'Great start. What would you like to order?' } }],
        }),
      ),
    );

    const response = await POST(chatRequest({}));
    await expect(response.json()).resolves.toMatchObject({
      safe: true,
      provider: 'openai',
      reply: 'Great start. What would you like to order?',
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-openai-key' }),
      }),
    );
  });

  it('keeps feedback JSON responses structured', async () => {
    vi.stubEnv('OPENAI_API_KEY', 'test-openai-key');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          choices: [{ message: { content: '{"fluency_score":7,"confidence_level":"Medium"}' } }],
        }),
      ),
    );

    const response = await POST(chatRequest({ requestFeedback: true }));
    await expect(response.json()).resolves.toMatchObject({
      safe: true,
      provider: 'openai',
      isFeedback: true,
      feedback: { fluency_score: 7, confidence_level: 'Medium' },
    });
  });

  it('returns a clear error when OpenAI is not configured', async () => {
    vi.stubEnv('OPENAI_API_KEY', '');

    const response = await POST(chatRequest({}));
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      safe: false,
      provider: 'openai',
      isFeedback: false,
      error: 'OPENAI_API_KEY is not configured.',
    });
  });

  it('does not return simulated content when OpenAI fails', async () => {
    vi.stubEnv('OPENAI_API_KEY', 'test-openai-key');
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ error: { code: 'insufficient_quota' } }, { status: 429 })));

    const response = await POST(chatRequest({}));
    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      safe: false,
      provider: 'openai',
      error: 'OpenAI chat failed with status 429.',
    });
  });
});
