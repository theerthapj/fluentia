import { afterEach, describe, expect, it, vi } from "vitest";
import { getConversationProvider } from "@/lib/ai/provider";

describe("conversation provider selection", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses the live OpenAI provider by default", () => {
    expect(getConversationProvider().kind).toBe("live");
  });

  it("uses the simulated provider when explicitly requested", () => {
    vi.stubEnv("FLUENTIA_AI_PROVIDER", "simulated");
    expect(getConversationProvider().kind).toBe("simulated");
  });
});
