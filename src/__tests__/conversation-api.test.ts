import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/conversation/route";
import { resetRequestGuardsForTests } from "@/lib/server/request-guards";

function conversationRequest(message: string, userAgent = "vitest-agent") {
  return new Request("http://test.local/api/conversation", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": userAgent,
    },
    body: JSON.stringify({
      message,
      kind: "scenario",
      scenarioId: "casual-beginner-favorite-food",
      exerciseId: null,
      mode: "casual",
      level: "beginner",
      history: [],
    }),
  });
}

describe("/api/conversation", () => {
  beforeEach(() => {
    vi.stubEnv("OPENAI_API_KEY", "");
    resetRequestGuardsForTests();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("enforces server-side cooldown after repeated unsafe requests", async () => {
    expect((await POST(conversationRequest("you are stupid today"))).status).toBe(200);
    expect((await POST(conversationRequest("you are stupid today"))).status).toBe(200);

    const third = await POST(conversationRequest("you are stupid today"));
    expect(third.status).toBe(429);
    await expect(third.json()).resolves.toMatchObject({ safe: false, category: "abusive" });

    const duringCooldown = await POST(conversationRequest("I would like to practice politely."));
    expect(duringCooldown.status).toBe(429);
    await expect(duringCooldown.json()).resolves.toMatchObject({ safe: false, category: "cooldown" });
  });

  it("rejects oversized declared request bodies before provider work", async () => {
    const request = new Request("http://test.local/api/conversation", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "content-length": String(65 * 1024),
        "user-agent": "oversized-test",
      },
      body: JSON.stringify({ message: "I would like to practice politely." }),
    });

    const response = await POST(request);
    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toMatchObject({ safe: false, category: "validation" });
  });

  it("does not fall back to simulated feedback when OpenAI fails", async () => {
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ error: { code: "insufficient_quota" } }, { status: 429 })));

    const response = await POST(conversationRequest("I would like to practice politely.", "openai-failure"));
    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      safe: false,
      category: "provider",
      provider: "live",
    });
  });
});
