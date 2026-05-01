import { afterEach, describe, expect, it, vi } from "vitest";
import { getConversationProvider } from "@/lib/ai/provider";

describe("conversation provider selection", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses the simulated provider when no API key is configured", () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    expect(getConversationProvider().kind).toBe("simulated");
  });

  it("uses the live provider when an API key is configured", () => {
    vi.stubEnv("OPENAI_API_KEY", "test-key");
    expect(getConversationProvider().kind).toBe("live");
  });
});
